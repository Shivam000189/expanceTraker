import { useState, useEffect, useRef } from "react";
import API from "../api";
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

  if (loading)
    return (
      <LoadingSpinner
        message="Fetching your expenses..."
        bgColor="bg-quill-gray-400"
      ></LoadingSpinner>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-quill-gray-300 via-white to-quill-gray-400 p-6">
      <Sidebar />
      <div className="flex flex-col gap-2 justify-center items-center mb-12">
        <p className="text-sm uppercase tracking-[0.4em] text-quill-gray-600">
          Dashboard
        </p>
        <h2 className="text-5xl font-bold istok-web-bold text-center bg-gradient-to-r from-quill-gray-950 to-quill-gray-600 bg-clip-text text-transparent drop-shadow">
          My Expenses
        </h2>
      </div>

      <div className="grid gap-8 max-w-5xl mx-auto lg:grid-cols-[minmax(0,340px)_1fr]">
        <form
          ref={formRef}
          onSubmit={handleSubmit}
          className={`bg-gradient-to-b from-quill-gray-950 to-quill-gray-900 border border-white/10 p-6 rounded-2xl shadow-2xl shadow-quill-gray-900/40 w-full space-y-4 
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
            className="w-full bg-gradient-to-r from-quill-gray-500 to-quill-gray-300 text-quill-gray-950 font-semibold py-2 rounded-lg shadow-lg shadow-quill-gray-500/30 hover:shadow-quill-gray-500/50"
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
        <div className="relative w-full bg-white/70 backdrop-blur shadow-2xl shadow-quill-gray-700/20 rounded-3xl p-4 sm:p-6 border border-white/40 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-quill-gray-100/60 via-transparent to-quill-gray-200/80 pointer-events-none" />
          <div className="relative">
            {expenses.length === 0 ? (
              <p className="istok-web-bold text-center">No expenses yet.</p>
            ) : (
              <ul className="divide-y divide-quill-gray-300">
                {expenses.map((exp) => (
                  <li
                    key={exp._id}
                    className={`py-4 px-2 sm:px-3 rounded-2xl transition cursor-pointer border border-transparent ${
                      selectedExpense?._id === exp._id
                        ? "bg-gradient-to-r from-blue-100 to-quill-gray-100 ring-2 ring-blue-500/60 scale-[1.01] shadow-lg"
                        : "hover:bg-quill-gray-100/80 hover:border-quill-gray-300"
                    } shadow-sm`}
                    onClick={() => setSelectedExpense(exp)}
                  >
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <span className="font-semibold text-lg text-quill-gray-950 block">
                          {exp.title}
                        </span>
                        <div className="text-sm text-quill-gray-600">
                          {exp.category} • {new Date(exp.date).toLocaleDateString()}
                        </div>
                      </div>

                      <div className="flex items-center flex-wrap gap-3">
                        <span className="text-quill-gray-950 font-medium">
                          ₹{exp.amount}
                        </span>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            startEdit(exp);
                          }}
                          className="text-green-600 hover:text-green-950 font-bold text-xl drop-shadow-sm"
                          title="Edit"
                        >
                          ✏️
                        </button>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(exp._id);
                          }}
                          className="text-red-500 hover:text-red-700 font-bold text-xl drop-shadow-sm"
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
        </div>
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
