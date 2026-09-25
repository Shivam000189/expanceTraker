import { useState, useEffect } from "react";
import { X, Calendar, Tag, IndianRupee, FileText } from "lucide-react";
import { motion } from "framer-motion";
import API from "../../api";
import toast from "react-hot-toast";

const categories = [
  "Food",
  "Shopping",
  "Travel",
  "Bills",
  "Entertainment",
  "Healthcare",
  "Education",
  "Investment",
  "Other",
];

export function ExpenseForm({
  onClose,
  onSubmit,
  initialData = null,
  isEditing = false,
}) {
  const [formData, setFormData] = useState({
    title: "",
    amount: "",
    category: "Food",
    date: new Date().toISOString().split("T")[0],
    description: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || initialData.merchant || "",
        amount: initialData.amount ? String(initialData.amount) : "",
        category: initialData.category || "Food",
        date: initialData.date
          ? new Date(initialData.date).toISOString().split("T")[0]
          : new Date().toISOString().split("T")[0],
        description: initialData.description || "",
      });
    }
  }, [initialData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const token = localStorage.getItem("token");
      const payload = {
        title: formData.title,
        amount: Number(formData.amount),
        category: formData.category,
        date: formData.date,
        description: formData.description,
      };

      if (isEditing && initialData?._id) {
        await API.put(`/expenses/${initialData._id}`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("Expense updated successfully");
      } else {
        await API.post("/expenses", payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("Expense added successfully");
      }

      onSubmit();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save expense");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 15 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: 15 }}
      className="bg-[#1C1C1C] rounded-[28px] p-6 sm:p-7 shadow-2xl border border-white/10 w-full max-w-lg relative overflow-hidden backdrop-blur-xl text-white"
    >
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold font-display text-white tracking-tight">
            {isEditing ? "Edit Expense" : "Add New Expense"}
          </h2>
          <p className="text-gray-400 text-xs mt-0.5">
            {isEditing
              ? "Update transaction details"
              : "Enter details for your new transaction"}
          </p>
        </div>
        <button
          onClick={onClose}
          className="p-2 hover:bg-white/10 rounded-full transition-colors text-gray-400 hover:text-white"
        >
          <X size={18} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title */}
        <div>
          <label className="block text-xs font-medium text-gray-300 mb-1.5">
            Title / Merchant
          </label>
          <div className="relative">
            <input
              type="text"
              required
              placeholder="e.g. Lunch at Cafe"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className="w-full bg-[#373737] border border-white/5 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-gray-400 outline-none focus:border-[#10EE74] transition"
            />
          </div>
        </div>

        {/* Amount & Category */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div>
            <label className="block text-xs font-medium text-gray-300 mb-1.5">
              Amount (₹)
            </label>
            <div className="relative">
              <input
                type="number"
                required
                min="0"
                step="any"
                placeholder="0.00"
                value={formData.amount}
                onChange={(e) =>
                  setFormData({ ...formData, amount: e.target.value })
                }
                className="w-full bg-[#373737] border border-white/5 rounded-xl px-3.5 py-2.5 text-sm font-mono text-white placeholder-gray-400 outline-none focus:border-[#10EE74] transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-300 mb-1.5">
              Category
            </label>
            <select
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
              className="w-full bg-[#373737] border border-white/5 rounded-xl px-3.5 py-2.5 text-sm text-white outline-none focus:border-[#10EE74] transition"
            >
              {categories.map((c) => (
                <option key={c} value={c} className="bg-[#1C1C1C] text-white">
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Date */}
        <div>
          <label className="block text-xs font-medium text-gray-300 mb-1.5">
            Date
          </label>
          <input
            type="date"
            required
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            className="w-full bg-[#373737] border border-white/5 rounded-xl px-3.5 py-2.5 text-sm text-white outline-none focus:border-[#10EE74] transition"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs font-medium text-gray-300 mb-1.5">
            Notes (Optional)
          </label>
          <textarea
            rows="2"
            placeholder="Add any extra notes..."
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            className="w-full bg-[#373737] border border-white/5 rounded-xl px-3.5 py-2 text-sm text-white placeholder-gray-400 outline-none focus:border-[#10EE74] transition resize-none"
          />
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-3 pt-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 rounded-full border border-white/10 bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white transition text-xs font-medium"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="flex-1 py-2.5 rounded-full bg-[#10EE74] text-black hover:bg-[#10EE74]/90 transition text-xs font-semibold shadow-lg shadow-[#10EE74]/20 disabled:opacity-50"
          >
            {isLoading ? "Saving..." : isEditing ? "Save Changes" : "Add Expense"}
          </button>
        </div>
      </form>
    </motion.div>
  );
}

export default ExpenseForm;
