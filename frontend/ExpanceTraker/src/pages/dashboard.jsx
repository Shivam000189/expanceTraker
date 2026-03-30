import { useState, useEffect, useRef } from "react";
import API from "../api";
import toast from "react-hot-toast";
import ExpenseModal from "../components/ExpenseModal";
import LoadingSpinner from "../components/LoadingSpinner";
import ExpenseStats from "../components/ExpenseStats";
import Sidebar from "../components/Sidebar";

export default function Dashboard() {
  const [expenses, setExpenses] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    amount: "",
    category: "",
    date: "",
  });
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [selectedExpense, setSelectedExpense] = useState(null);

  const formRef = useRef(null);

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
        toast.success("Expense updated!");
      } else {
        await API.post("/expenses", formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("Expense added!");
      }

      setFormData({ title: "", amount: "", category: "", date: "" });
      setEditingId(null);
      fetchExpenses();
    } catch {
      toast.error("Failed to save expense.");
    }
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await API.delete(`/expenses/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Deleted!");
      fetchExpenses();
    } catch {
      toast.error("Delete failed.");
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
  };

  const cancelEdit = () => {
    setEditingId(null);
    setFormData({ title: "", amount: "", category: "", date: "" });
  };

  if (loading) return <LoadingSpinner message="Loading..." />;

  const total = expenses.reduce((acc, e) => acc + Number(e.amount), 0);

  return (
    <div className="flex min-h-screen bg-[#FDFDFF] text-[#1A1A1A]">
      
      {/* Sidebar */}
      <Sidebar />

      {/* Main */}
      <main className="ml-64 flex-1 p-8 overflow-y-auto">

        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-[#4B2C85]">
            Welcome back 👋
          </h1>
          <p className="text-gray-400">Track your expenses easily</p>
        </div>

        {/* Balance Card */}
        <div className="bg-[#D9D9E3] rounded-3xl p-8 mb-10">
          <p className="text-gray-500 text-sm mb-2">Total Expenses</p>
          <h2 className="text-3xl font-bold text-[#4B2C85]">
            ₹ {total}
          </h2>
        </div>

        {/* Grid */}
        <div className="grid lg:grid-cols-2 gap-8">

          {/* Form */}
          <form
            ref={formRef}
            onSubmit={handleSubmit}
            className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 space-y-4"
          >
            <h3 className="text-xl font-semibold text-[#4B2C85]">
              {editingId ? "Edit Expense" : "Add Expense"}
            </h3>

            <input
              type="text"
              name="title"
              placeholder="Title"
              value={formData.title}
              onChange={handleChange}
              className="w-full border border-gray-200 px-3 py-2 rounded-lg focus:ring-2 focus:ring-[#7C3AED]"
            />

            <input
              type="number"
              name="amount"
              placeholder="Amount"
              value={formData.amount}
              onChange={handleChange}
              className="w-full border border-gray-200 px-3 py-2 rounded-lg focus:ring-2 focus:ring-[#7C3AED]"
            />

            <input
              type="text"
              name="category"
              placeholder="Category"
              value={formData.category}
              onChange={handleChange}
              className="w-full border border-gray-200 px-3 py-2 rounded-lg focus:ring-2 focus:ring-[#7C3AED]"
            />

            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="w-full border border-gray-200 px-3 py-2 rounded-lg focus:ring-2 focus:ring-[#7C3AED]"
            />

            <button className="w-full bg-[#7C3AED] text-white py-2 rounded-lg hover:opacity-90">
              {editingId ? "Update Expense" : "Add Expense"}
            </button>

            {editingId && (
              <button
                type="button"
                onClick={cancelEdit}
                className="w-full text-gray-500 hover:text-red-500"
              >
                Cancel
              </button>
            )}
          </form>

          {/* Expense List */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-xl font-semibold text-[#4B2C85] mb-4">
              Recent Expenses
            </h3>

            {expenses.length === 0 ? (
              <p className="text-gray-400">No expenses yet</p>
            ) : (
              <ul>
                {expenses.map((exp) => (
                  <li
                    key={exp._id}
                    className="flex justify-between items-center py-4 border-b last:border-none hover:bg-gray-50 px-2 rounded-xl"
                    onClick={() => setSelectedExpense(exp)}
                  >
                    <div>
                      <p className="font-semibold">{exp.title}</p>
                      <p className="text-sm text-gray-400">
                        {exp.category} •{" "}
                        {new Date(exp.date).toLocaleDateString()}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="font-semibold">
                        ₹{exp.amount}
                      </span>

                      <button onClick={() => startEdit(exp)}>✏️</button>
                      <button onClick={() => handleDelete(exp._id)}>✕</button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Modal */}
        {selectedExpense && (
          <ExpenseModal
            expense={selectedExpense}
            onClose={() => setSelectedExpense(null)}
          />
        )}

        {/* Stats */}
        <div className="mt-10">
          <ExpenseStats expenses={expenses} />
        </div>
      </main>
    </div>
  );
}