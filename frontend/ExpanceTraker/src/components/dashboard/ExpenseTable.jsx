import {
  ShoppingBag,
  Coffee,
  Car,
  CreditCard,
  Utensils,
  Zap,
  Trash2,
  Edit2,
} from "lucide-react";
import { formatCurrency } from "../../lib/utils";
import toast from "react-hot-toast";
import API from "../../api";

const iconMap = {
  Food: Utensils,
  Shopping: ShoppingBag,
  Travel: Car,
  Bills: Zap,
  Entertainment: Coffee,
  Other: CreditCard,
};

export function ExpenseTable({ transactions, onEdit, onDelete, onRefresh, className = "" }) {
  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await API.delete(`/expenses/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Expense deleted successfully!");
      if (onDelete) onDelete(id);
      if (onRefresh) onRefresh();
    } catch (err) {
      toast.error("Failed to delete expense");
      console.error(err);
    }
  };

  return (
    <div
      className={`rounded-[24px] border border-white/10 bg-[#131313] p-4 lg:p-5 text-white shadow-[0_10px_30px_rgba(0,0,0,0.3)] flex flex-col justify-between h-full overflow-hidden ${className}`}
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-3 shrink-0">
        <div>
          <h2 className="text-sm lg:text-base font-semibold text-white tracking-tight font-display">
            History Transaction
          </h2>
          <p className="text-[11px] text-gray-400">Recent recorded transactions</p>
        </div>
        <span className="rounded-full border border-white/10 bg-[#1C1C1C] px-2.5 py-0.5 text-[11px] font-mono text-gray-400">
          {transactions ? transactions.length : 0} items
        </span>
      </div>

      {/* Table Header (Desktop) */}
      <div className="hidden sm:grid sm:grid-cols-12 gap-3 text-[11px] text-gray-400 font-medium pb-1.5 border-b border-white/5 px-2 shrink-0">
        <span className="col-span-5">Name</span>
        <span className="col-span-3">Amount</span>
        <span className="col-span-2">Date</span>
        <span className="col-span-2 text-right">Status</span>
      </div>

      {/* Rows with internal scroll */}
      <div className="divide-y divide-white/5 overflow-y-auto flex-1 pr-1 min-h-0">
        {transactions && transactions.length > 0 ? (
          transactions.map((tx) => {
            const category = tx.category || "Other";
            const Icon = iconMap[category] || CreditCard;
            const dateStr = new Date(tx.date).toLocaleDateString("en-GB", {
              day: "numeric",
              month: "short",
            });

            return (
              <div
                key={tx._id}
                className="grid grid-cols-1 sm:grid-cols-12 gap-2 sm:gap-3 items-center py-2 px-2 rounded-xl hover:bg-white/[0.03] transition-colors group"
              >
                {/* Name & Icon */}
                <div className="sm:col-span-5 flex items-center gap-2.5 min-w-0">
                  <div className="h-8 w-8 shrink-0 rounded-xl bg-[#222222] border border-white/5 flex items-center justify-center text-gray-300">
                    <Icon className="h-3.5 w-3.5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-white truncate">{tx.title}</p>
                    <p className="text-[10px] text-gray-400 sm:hidden font-mono">{dateStr}</p>
                  </div>
                </div>

                {/* Amount */}
                <div className="sm:col-span-3 flex sm:block items-center justify-between">
                  <span className="text-xs lg:text-sm font-semibold font-mono text-white">
                    {formatCurrency(tx.amount)}
                  </span>
                  <span className="text-[9px] text-gray-400 uppercase tracking-wider font-mono sm:hidden bg-white/5 px-1.5 py-0.5 rounded border border-white/5">
                    {category}
                  </span>
                </div>

                {/* Date */}
                <div className="hidden sm:block sm:col-span-2 text-[11px] text-gray-300 font-mono">
                  {dateStr}
                </div>

                {/* Status & Actions */}
                <div className="sm:col-span-2 flex items-center justify-between sm:justify-end gap-1.5">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#0D2E18] text-[#10EE74] text-[10px] font-medium border border-[#10EE74]/20">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#10EE74]" />
                    Paid
                  </span>

                  <div className="flex items-center gap-1 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      type="button"
                      onClick={() => onEdit && onEdit(tx)}
                      className="p-1 text-gray-400 hover:text-white rounded hover:bg-white/10 transition"
                      title="Edit transaction"
                    >
                      <Edit2 size={12} />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(tx._id)}
                      className="p-1 text-gray-400 hover:text-red-400 rounded hover:bg-red-500/10 transition"
                      title="Delete transaction"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="py-8 text-center">
            <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-2 text-gray-400">
              <CreditCard size={18} />
            </div>
            <p className="text-xs font-medium text-white">No transactions recorded</p>
            <p className="text-[10px] text-gray-400 mt-0.5">Start by adding your first expense.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default ExpenseTable;
