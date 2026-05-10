import { useState, useEffect, useRef } from "react";
import API from "../api";
import toast from "react-hot-toast";
import ExpenseModal from "../components/ExpenseModal";
import LoadingSpinner from "../components/LoadingSpinner";
import ExpenseStats from "../components/ExpenseStats";
import Sidebar from "../components/Sidebar";
import SmartSmsDetector from "../components/SmartSmsDetector";
import { 
  Wallet, 
  ArrowUpRight, 
  ArrowDownRight, 
  CreditCard, 
  Plus, 
  Sparkles,
  Trash2,
  Edit2,
  X
} from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

export default function Expenses() {
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
  const [isFormOpen, setIsFormOpen] = useState(false);

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
    } catch {
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
      setIsFormOpen(false);
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
    setIsFormOpen(true);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setFormData({ title: "", amount: "", category: "", date: "" });
    setIsFormOpen(false);
  };

  const handleDetectedExpense = (detectedExpense) => {
    setEditingId(null);
    setFormData({
      title: detectedExpense.merchant || "",
      amount: detectedExpense.amount || "",
      category: detectedExpense.category || "",
      date: detectedExpense.date || "",
    });
    setIsFormOpen(true);
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (loading) return <LoadingSpinner message="Loading..." />;

  const total = expenses.reduce((acc, e) => acc + Number(e.amount), 0);
  const monthlyIncome = 85000; // You can replace with actual data
  const totalBalance = monthlyIncome - total;

  return (
    <div className="flex min-h-screen bg-[#FAFAFF] text-[#1A1A1A]">
      
      {/* Sidebar */}
      <Sidebar />

      {/* Main */}
      <main className="w-full flex-1 overflow-y-auto px-4 py-6 pt-24 sm:px-6 md:ml-64 md:p-8">
        <div className="space-y-8">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold font-display text-zinc-900">Expense Tracker</h1>
              <p className="text-zinc-500 mt-1">Track and manage all your expenses in one place</p>
            </div>
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setIsFormOpen(true)}
                className="bg-[#4B2C85] text-white font-bold px-6 py-3 rounded-2xl flex items-center gap-2 hover:bg-[#3d236e] transition-all shadow-lg shadow-[#4B2C85]/30 active:scale-95"
              >
                <Plus size={18} />
                Add Expense
              </button>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard 
              title="Total Balance" 
              value={formatCurrency(totalBalance)} 
              change="+12.5%" 
              trend="up" 
              icon={Wallet} 
              color="primary" 
            />
            <StatCard 
              title="Monthly Income" 
              value={formatCurrency(monthlyIncome)} 
              change="+8.2%" 
              trend="up" 
              icon={ArrowUpRight} 
              color="blue" 
            />
            <StatCard 
              title="Total Expense" 
              value={formatCurrency(total)} 
              change="+14.3%" 
              trend="down" 
              icon={ArrowDownRight} 
              color="orange" 
            />
            <StatCard 
              title="Remaining" 
              value={formatCurrency(totalBalance)} 
              change="+5.2%" 
              trend="up" 
              icon={CreditCard} 
              color="purple" 
            />
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            {/* Left/Main Column */}
            <div className="xl:col-span-2 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <SmartSmsDetector onDetected={handleDetectedExpense} />
                
                <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-zinc-100 flex flex-col justify-between relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-8 opacity-5 -rotate-12 group-hover:rotate-0 transition-transform duration-500">
                    <Sparkles size={120} className="text-[#4B2C85]" />
                  </div>
                  
                  <div>
                    <div className="w-12 h-12 bg-zinc-900 rounded-2xl flex items-center justify-center mb-6 text-white shadow-xl">
                      <Sparkles size={24} />
                    </div>
                    <h3 className="text-xl font-bold font-display mb-2">Upgrade to Pro</h3>
                    <p className="text-zinc-500 text-sm mb-6 leading-relaxed">Get advanced AI analytics, custom categories, and multi-currency support.</p>
                  </div>
                  
                  <button className="w-full py-4 bg-[#4B2C85] text-white font-bold rounded-2xl hover:bg-[#3d236e] transition-all shadow-lg shadow-[#4B2C85]/20">
                    Upgrade Now
                  </button>
                </div>
              </div>

              {/* Expense Table */}
              <div className="bg-white rounded-2xl shadow-sm border border-zinc-100 overflow-hidden">
                <div className="p-6 border-b border-zinc-100">
                  <h3 className="text-lg font-bold font-display text-zinc-900">All Expenses</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-zinc-50 border-b border-zinc-100">
                      <tr>
                        <th className="text-left p-4 text-xs font-bold text-zinc-500 uppercase tracking-wider">Title</th>
                        <th className="text-left p-4 text-xs font-bold text-zinc-500 uppercase tracking-wider">Category</th>
                        <th className="text-left p-4 text-xs font-bold text-zinc-500 uppercase tracking-wider">Date</th>
                        <th className="text-right p-4 text-xs font-bold text-zinc-500 uppercase tracking-wider">Amount</th>
                        <th className="text-right p-4 text-xs font-bold text-zinc-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {expenses.length === 0 ? (
                        <tr>
                          <td colSpan="5" className="p-8 text-center text-zinc-500">
                            No expenses yet. Add your first expense!
                          </td>
                        </tr>
                      ) : (
                        expenses.map((exp) => (
                          <tr 
                            key={exp._id} 
                            className="border-b border-zinc-100 hover:bg-zinc-50 transition cursor-pointer"
                            onClick={() => setSelectedExpense(exp)}
                          >
                            <td className="p-4 font-medium text-zinc-900">{exp.title}</td>
                            <td className="p-4">
                              <span className="inline-flex px-2 py-1 rounded-lg bg-purple-50 text-purple-600 text-xs font-bold">
                                {exp.category || "Other"}
                              </span>
                            </td>
                            <td className="p-4 text-zinc-600">{new Date(exp.date).toLocaleDateString()}</td>
                            <td className="p-4 text-right font-bold text-zinc-900">-{formatCurrency(exp.amount)}</td>
                            <td className="p-4 text-right">
                              <div className="flex items-center justify-end gap-2">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    startEdit(exp);
                                  }}
                                  className="p-2 text-zinc-400 hover:text-blue-600 transition"
                                >
                                  <Edit2 size={16} />
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDelete(exp._id);
                                  }}
                                  className="p-2 text-zinc-400 hover:text-red-600 transition"
                                >
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Right Sidebar */}
            <div className="space-y-8">
              <div className="bg-zinc-900 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden text-white">
                <div className="absolute top-[-20%] right-[-10%] w-64 h-64 bg-[#4B2C85]/20 rounded-full blur-[80px]"></div>
                <div className="relative z-10">
                  <div className="flex justify-between items-center mb-10">
                    <p className="text-sm font-medium text-zinc-400">Total Spending</p>
                    <CreditCard size={24} className="text-[#4B2C85]" />
                  </div>
                  
                  <div className="space-y-6 mb-10">
                    <h2 className="text-4xl font-bold font-display tracking-tight leading-none">
                      {formatCurrency(total)}
                    </h2>
                    <div className="flex items-center gap-4">
                      <p className="text-sm font-mono text-zinc-400">This month's expenses</p>
                    </div>
                  </div>

                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-[10px] uppercase tracking-widest text-zinc-500 mb-1">Total Transactions</p>
                      <p className="font-bold font-display text-2xl">{expenses.length}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] uppercase tracking-widest text-zinc-500 mb-1">Average Expense</p>
                      <p className="font-bold font-display">{expenses.length > 0 ? formatCurrency(total / expenses.length) : formatCurrency(0)}</p>
                    </div>
                  </div>
                </div>
              </div>

              <ExpenseStats expenses={expenses} />
            </div>
          </div>
        </div>
      </main>

      {/* Expense Form Modal */}
      <AnimatePresence>
        {isFormOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={cancelEdit}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl"
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-zinc-900">
                  {editingId ? "Edit Expense" : "Add New Expense"}
                </h2>
                <button
                  onClick={cancelEdit}
                  className="p-2 hover:bg-zinc-100 rounded-lg transition"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Title</label>
                  <input
                    type="text"
                    name="title"
                    placeholder="Enter title"
                    value={formData.title}
                    onChange={handleChange}
                    className="w-full border border-zinc-200 px-4 py-2 rounded-xl focus:ring-2 focus:ring-[#4B2C85] focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Amount</label>
                  <input
                    type="number"
                    name="amount"
                    placeholder="Enter amount"
                    value={formData.amount}
                    onChange={handleChange}
                    className="w-full border border-zinc-200 px-4 py-2 rounded-xl focus:ring-2 focus:ring-[#4B2C85] focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Category</label>
                  <input
                    type="text"
                    name="category"
                    placeholder="Enter category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full border border-zinc-200 px-4 py-2 rounded-xl focus:ring-2 focus:ring-[#4B2C85] focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Date</label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    className="w-full border border-zinc-200 px-4 py-2 rounded-xl focus:ring-2 focus:ring-[#4B2C85] focus:outline-none"
                    required
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={cancelEdit}
                    className="flex-1 px-4 py-3 border border-zinc-200 rounded-xl font-medium hover:bg-zinc-50 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-[#4B2C85] text-white rounded-xl px-4 py-3 font-medium hover:bg-[#3d236e] transition"
                  >
                    {editingId ? "Update Expense" : "Add Expense"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Expense Detail Modal */}
      {selectedExpense && (
        <ExpenseModal
          expense={selectedExpense}
          onClose={() => setSelectedExpense(null)}
        />
      )}
    </div>
  );
}

// Stat Card Component
const StatCard = ({ title, value, change, trend, icon: Icon, color }) => {
  const colorClasses = {
    primary: "bg-purple-50 text-purple-600",
    blue: "bg-blue-50 text-blue-600",
    orange: "bg-orange-50 text-orange-600",
    purple: "bg-purple-50 text-purple-600",
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-zinc-100 hover:shadow-md transition-all">
      <div className="flex justify-between items-start mb-4">
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${colorClasses[color]}`}>
          <Icon size={24} />
        </div>
        <div className={`flex items-center gap-1 text-xs font-bold ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
          {change}
          {trend === 'up' ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
        </div>
      </div>
      <h3 className="text-sm font-medium text-zinc-500 mb-1">{title}</h3>
      <p className="text-2xl font-bold font-display text-zinc-900">{value}</p>
    </div>
  );
};