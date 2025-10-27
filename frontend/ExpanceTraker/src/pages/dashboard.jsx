import { useState, useEffect, useRef } from "react";
import API from "../api";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import ExpenseModal from "../components/ExpenseModal";
import LoadingSpinner from "../components/LoadingSpinner";
import ExpenseStats from "../components/ExpenseStats";
import Sidebar from "../components/Sidebar";

export default function Dashboard() {
  const [fadeIn, setFadeIn] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);
  const [expenses, setExpenses] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    amount: "",
    category: "",
    date: "",
  });
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const navigate = useNavigate();
  const formRef = useRef(null);
  const [selectedExpense, setSelectedExpense] = useState(null);

  
  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await API.get("/expenses", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setExpenses(res.data);
      
    } catch (err) {
      console.error("Error fetching expenses:", err);
      toast.error("Failed to load expenses.");
    } finally {
      setLoading(false);
    }
  };

  

  
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");

      if (editingId) {
        await API.put(`/expenses/${editingId}`, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("Expense updated successfully!");
      } else {
        await API.post("/expenses", formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("Expense added successfully!");
      }

      setFormData({ title: "", amount: "", category: "", date: "" });
      setEditingId(null);
      fetchExpenses();
    } catch (err) {
      console.error("Error saving expense:", err);
      toast.error("Failed to save expense.");
    }
  };

  
  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await API.delete(`/expenses/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Expense deleted successfully!");
      fetchExpenses();
    } catch (err) {
      console.error("Error deleting expense:", err);
      toast.error("Failed to delete expense.");
    }
  };

  
  const startEdit = (exp) => {
    setEditingId(exp._id);
    setFormData({
      title: exp.title,
      amount: exp.amount,
      category: exp.category,
      date: exp.date.slice(0, 10),
    });
    setFadeIn(true);
    setTimeout(() => setFadeIn(false), 300);
  };

  
  const cancelEdit = () => {
    setEditingId(null);
    setFormData({ title: "", amount: "", category: "", date: "" });
    toast("Edit cancelled.", { icon: "✖️" });
  };

  
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (formRef.current && !formRef.current.contains(event.target) && editingId) {
        setFadeOut(true);
        setTimeout(() => {
          cancelEdit();
          setFadeOut(false);
        }, 300);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [editingId]);

  
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
    toast.success("Logged out successfully!");
  };

  if (loading) return <LoadingSpinner message="Fetching your expenses..." bgColor="bg-quill-gray-400"></LoadingSpinner>

  return (
    <div className="min-h-screen bg-quill-gray-400 p-6">
      <Sidebar />
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl text-quill-gray-950 font-bold istok-web-bold ">
          My Expenses
        </h2>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 shadow-md"
        >
          Logout
        </button>
      </div>

      
      <form
        ref={formRef}
        onSubmit={handleSubmit}
        className={`bg-quill-gray-900 p-6 rounded-lg shadow-md max-w-md mx-auto space-y-4 mb-8 
          transition-all duration-300 ease-in-out 
          ${fadeOut ? "opacity-0 -translate-y-4" : fadeIn ? "opacity-0 translate-y-4" : "opacity-100 translate-y-0"}`}
      >
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={formData.title}
          onChange={handleChange}
          className="w-full border-2 px-3 py-2 rounded"
        />
        <input
          type="number"
          name="amount"
          placeholder="Amount"
          value={formData.amount}
          onChange={handleChange}
          className="w-full border-2 px-3 py-2 rounded"
        />
        <input
          type="text"
          name="category"
          placeholder="Category"
          value={formData.category}
          onChange={handleChange}
          className="w-full border-2 px-3 py-2 rounded"
        />
        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          className="w-full border-2 px-3 py-2 rounded"
        />

        <button
          type="submit"
          className="w-full bg-quill-gray-600 text-white py-2 rounded hover:shadow-md hover:bg-quill-gray-700"
        >
          {editingId ? "Update Expense" : "Add Expense"}
        </button>
        {editingId && (
          <button
            type="button"
            onClick={cancelEdit}
            className="w-full bg-gray-300 text-gray-800 py-2 rounded hover:bg-gray-400"
          >
            Cancel Edit
          </button>
        )}
      </form>

      {/* 🔹 Expense list */}
      <div className="max-w-2xl mx-auto bg-quill-gray-200 shadow-md rounded-lg p-6">
        {expenses.length === 0 ? (
          <p className="istok-web-bold text-center">No expenses yet.</p>
        ) : (
          <ul className=" divide-quill-gray-400">
            {expenses.map((exp) => (
              <li key={exp._id}   
              className={`py-3 px-3 rounded-lg transition cursor-pointer ${selectedExpense?._id === exp._id 
                ? "bg-quill-gray-300  ring-2 ring-blue-500 scale-[1.02]"
                : "hover:bg-gray-100"
              }`}
              onClick={() => setSelectedExpense(exp)}>
                <div className="flex justify-between items-center">
                  <div>
                    <span className="font-semibold text-lg text-quill-gray-950">
                      {exp.title}
                    </span>
                    <div className="text-sm text-quill-gray-600">
                      {exp.category} •{" "}
                      {new Date(exp.date).toLocaleDateString()}
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <span className="text-quill-gray-950 font-medium">
                      ₹{exp.amount}
                    </span>

                    <button
                        onClick={(e) => {
                          e.stopPropagation(); 
                          startEdit(exp);
                        }}
                        className="text-green-600 hover:text-green-950 font-bold text-xl"
                        title="Edit"
                      >
                        ✏️
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation(); 
                          handleDelete(exp._id);
                        }}
                        className="text-red-500 hover:text-red-700 font-bold text-xl"
                        title="Delete"
                      >
                        ✕
                    </button>
                  </div>
                </div>
              </li>
              
            ))}
          </ul>
        )}
        
      </div>
      {selectedExpense && (
          <ExpenseModal                 
            expense={selectedExpense}
            onClose={() => setSelectedExpense(null)}   
          />
        )}
        <ExpenseStats expenses={expenses} />
    </div>
  );
}
