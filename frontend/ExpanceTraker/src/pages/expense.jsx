import { useState, useEffect, useRef } from "react";
import API from "../api";
import toast from "react-hot-toast";
import ExpenseModal from "../components/ExpenseModal";
import LoadingSpinner from "../components/LoadingSpinner";
import { Layout } from "../components/layout/Layout";
import { StatCard } from "../components/dashboard/StatCard";
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
      setExpenses(res.data || []);
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
      date: exp.date ? exp.date.slice(0, 10) : "",
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
    }).format(Number(amount || 0));
  };

  if (loading) return <LoadingSpinner message="Loading expenses..." />;

  const total = expenses.reduce((acc, e) => acc + Number(e.amount || 0), 0);
  const monthlyIncome = Number(localStorage.getItem('monthlyIncome') || 0);
  const totalBalance = monthlyIncome - total;

  return (
    <Layout contentClassName="px-4 py-4 sm:px-6 lg:px-8 max-w-7xl w-full mx-auto">
      <div className="flex flex-col gap-4">
        {/* Top Header & KPI Strip in Single Frame */}
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-3 rounded-2xl border border-zinc-800 bg-zinc-900/90 px-4 py-3 shadow-sm backdrop-blur-sm">
          <div className="flex items-center justify-between xl:justify-start gap-4">
            <div>
              <h1 className="text-lg font-bold font-display text-white tracking-tight">Expense Tracker</h1>
              <p className="text-[11px] text-zinc-400">Financial entries & balance manager</p>
            </div>

            <button 
              onClick={() => setIsFormOpen(true)}
              className="xl:hidden bg-emerald-500 text-black font-semibold px-3 py-1.5 rounded-xl flex items-center gap-1.5 hover:bg-emerald-400 active:scale-95 shadow-lg shadow-emerald-500/20 transition text-[11px]"
            >
              <Plus size={13} />
              Add
            </button>
          </div>

          {/* Inline Metrics Ribbon */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 flex-1 xl:max-w-3xl xl:px-4">
            <div className="flex items-center gap-2.5 rounded-xl border border-zinc-800/80 bg-zinc-950/70 px-3 py-2">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-emerald-500/20 bg-emerald-500/10 text-emerald-400">
                <Wallet size={14} />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500 truncate">Total Balance</p>
                <p className="truncate font-mono text-xs font-bold text-emerald-400">
                  {formatCurrency(totalBalance)}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 rounded-xl border border-zinc-800/80 bg-zinc-950/70 px-3 py-2">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-zinc-800 text-zinc-300">
                <ArrowUpRight size={14} />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500 truncate">Income</p>
                <p className="truncate font-mono text-xs font-bold text-white">
                  {formatCurrency(monthlyIncome)}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 rounded-xl border border-zinc-800/80 bg-zinc-950/70 px-3 py-2">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-red-500/20 bg-red-500/10 text-red-400">
                <ArrowDownRight size={14} />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500 truncate">Expense</p>
                <p className="truncate font-mono text-xs font-bold text-white">
                  {formatCurrency(total)}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 rounded-xl border border-zinc-800/80 bg-zinc-950/70 px-3 py-2">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-zinc-800 text-zinc-300">
                <CreditCard size={14} />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500 truncate">Records</p>
                <p className="truncate font-mono text-xs font-bold text-white">
                  {expenses.length} items
                </p>
              </div>
            </div>
          </div>

          <button 
            onClick={() => setIsFormOpen(true)}
            className="hidden xl:inline-flex bg-emerald-500 text-black font-semibold px-4 py-2 rounded-xl items-center gap-2 hover:bg-emerald-400 active:scale-95 shadow-lg shadow-emerald-500/20 transition text-xs shrink-0"
          >
            <Plus size={15} />
            Add Expense
          </button>
        </div>

        {/* Main Single-Frame Cockpit Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
          {/* Left Column: All Expenses Table (8 cols) with internal scroll */}
          <div className="lg:col-span-8 rounded-2xl border border-zinc-800 bg-zinc-900/90 shadow-sm backdrop-blur-sm overflow-hidden flex flex-col">
            <div className="p-4 sm:p-5 border-b border-zinc-800/80 flex items-center justify-between">
              <div>
                <h3 className="text-sm sm:text-base font-bold font-display text-white">All Expenses</h3>
                <p className="text-[11px] text-zinc-400 mt-0.5">Interactive ledger with quick actions</p>
              </div>
              <span className="rounded-full border border-zinc-800 bg-zinc-950/80 px-3 py-1 text-xs font-mono text-zinc-400">
                {expenses.length} entries
              </span>
            </div>

            <div className="overflow-x-auto max-h-[calc(100vh-220px)] lg:max-h-[calc(100vh-210px)] overflow-y-auto">
              <table className="w-full">
                <thead className="bg-zinc-950/90 sticky top-0 z-10 border-b border-zinc-800/80">
                  <tr>
                    <th className="text-left p-3.5 text-xs font-semibold uppercase tracking-wider text-zinc-400">Title</th>
                    <th className="text-left p-3.5 text-xs font-semibold uppercase tracking-wider text-zinc-400">Category</th>
                    <th className="text-left p-3.5 text-xs font-semibold uppercase tracking-wider text-zinc-400">Date</th>
                    <th className="text-right p-3.5 text-xs font-semibold uppercase tracking-wider text-zinc-400">Amount</th>
                    <th className="text-right p-3.5 text-xs font-semibold uppercase tracking-wider text-zinc-400">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/40">
                  {expenses.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="p-8 text-center text-zinc-500 text-xs">
                        No expenses recorded yet. Add your first expense!
                      </td>
                    </tr>
                  ) : (
                    expenses.map((exp) => (
                      <tr 
                        key={exp._id} 
                        className="hover:bg-white/[0.03] transition cursor-pointer group"
                        onClick={() => setSelectedExpense(exp)}
                      >
                        <td className="p-3.5 text-sm font-semibold text-white truncate max-w-[160px]">{exp.title}</td>
                        <td className="p-3.5 text-xs">
                          <span className="inline-flex px-2 py-0.5 rounded border border-white/10 bg-zinc-950/60 text-zinc-300 font-mono text-[11px] uppercase tracking-wider">
                            {exp.category || "General"}
                          </span>
                        </td>
                        <td className="p-3.5 text-xs font-mono text-zinc-400 whitespace-nowrap">
                          {exp.date ? new Date(exp.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }) : "-"}
                        </td>
                        <td className="p-3.5 text-right text-sm font-bold font-mono text-white">
                          {formatCurrency(exp.amount)}
                        </td>
                        <td className="p-3.5 text-right">
                          <div className="flex items-center justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                            <button
                              onClick={() => startEdit(exp)}
                              className="p-1.5 text-zinc-400 hover:text-emerald-400 rounded-lg hover:bg-white/5 transition"
                              title="Edit"
                            >
                              <Edit2 size={13} />
                            </button>
                            <button
                              onClick={() => handleDelete(exp._id)}
                              className="p-1.5 text-zinc-400 hover:text-red-400 rounded-lg hover:bg-white/5 transition"
                              title="Delete"
                            >
                              <Trash2 size={13} />
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

          {/* Right Column: Spending Card + SMS Detector (4 cols) */}
          <div className="lg:col-span-4 flex flex-col gap-4">
            {/* Spending Overview card */}
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/90 p-5 shadow-sm relative overflow-hidden backdrop-blur-sm text-white">
              <div className="flex justify-between items-center mb-4">
                <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Spending Overview</span>
                <div className="flex h-7 w-7 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-zinc-300">
                  <CreditCard size={14} />
                </div>
              </div>
              <div className="space-y-1 mb-5">
                <p className="text-xs text-zinc-400">Current Cycle Spend</p>
                <h2 className="text-2xl font-bold font-display tracking-tight text-white">
                  {formatCurrency(total)}
                </h2>
              </div>
              <div className="flex justify-between items-end border-t border-zinc-800/80 pt-3 text-xs">
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-zinc-500 mb-0.5">Budget Limit</p>
                  <p className="font-bold font-mono text-white">{formatCurrency(monthlyIncome)}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] uppercase tracking-widest text-zinc-500 mb-0.5">Remaining</p>
                  <p className="font-bold font-mono text-emerald-400">{formatCurrency(totalBalance)}</p>
                </div>
              </div>
            </div>

            {/* Smart SMS Detector */}
            <SmartSmsDetector onDetected={handleDetectedExpense} />
          </div>
        </div>
      </div>

      {/* Expense Form Modal */}
      <AnimatePresence>
        {isFormOpen && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <motion.div
              ref={formRef}
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative bg-zinc-950 border border-zinc-800 rounded-2xl p-6 sm:p-7 max-w-md w-full shadow-2xl backdrop-blur-xl"
            >
              <div className="flex justify-between items-center mb-5">
                <h2 className="text-xl font-bold font-display text-white">
                  {editingId ? "Edit Expense" : "Add New Expense"}
                </h2>
                <button
                  onClick={cancelEdit}
                  className="p-1.5 hover:bg-white/5 rounded-lg transition text-zinc-400 hover:text-white"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-400 mb-1.5 uppercase tracking-wider">Title</label>
                  <input
                    type="text"
                    name="title"
                    placeholder="e.g. Grocery, Electricity"
                    value={formData.title}
                    onChange={handleChange}
                    className="w-full bg-zinc-900 border border-zinc-800 px-3.5 py-2.5 rounded-xl text-white placeholder-zinc-500 focus:border-zinc-500 focus:ring-1 focus:ring-white/20 focus:outline-none transition text-sm"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-400 mb-1.5 uppercase tracking-wider">Amount</label>
                    <input
                      type="number"
                      name="amount"
                      placeholder="0.00"
                      value={formData.amount}
                      onChange={handleChange}
                      className="w-full bg-zinc-900 border border-zinc-800 px-3.5 py-2.5 rounded-xl text-white placeholder-zinc-500 focus:border-zinc-500 focus:ring-1 focus:ring-white/20 focus:outline-none transition text-sm font-mono"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-400 mb-1.5 uppercase tracking-wider">Category</label>
                    <input
                      type="text"
                      name="category"
                      placeholder="e.g. Food, Bills"
                      value={formData.category}
                      onChange={handleChange}
                      className="w-full bg-zinc-900 border border-zinc-800 px-3.5 py-2.5 rounded-xl text-white placeholder-zinc-500 focus:border-zinc-500 focus:ring-1 focus:ring-white/20 focus:outline-none transition text-sm"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-400 mb-1.5 uppercase tracking-wider">Date</label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    className="w-full bg-zinc-900 border border-zinc-800 px-3.5 py-2.5 rounded-xl text-white placeholder-zinc-500 focus:border-zinc-500 focus:ring-1 focus:ring-white/20 focus:outline-none transition text-sm font-mono"
                    required
                  />
                </div>

                <div className="flex gap-3 pt-3">
                  <button
                    type="button"
                    onClick={cancelEdit}
                    className="flex-1 px-4 py-2.5 border border-zinc-800 rounded-xl font-semibold text-zinc-300 hover:bg-white/5 transition text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-emerald-500 text-black font-semibold rounded-xl px-4 py-2.5 hover:bg-emerald-400 transition shadow-lg shadow-emerald-500/20 text-xs active:scale-95"
                  >
                    {editingId ? "Update" : "Save Expense"}
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
    </Layout>
  );
}