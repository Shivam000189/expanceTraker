import React from "react";
import { X } from "lucide-react";

export default function ExpenseModal({ expense, onClose }) {
  if (!expense) return null;
  return (
    <div className="fixed inset-0 flex justify-center items-center z-50 px-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-zinc-900 border border-white/10 rounded-2xl shadow-2xl p-6 w-full max-w-sm" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-white break-words">{expense.title}</h2>
          <button onClick={onClose} className="p-1 text-zinc-400 hover:text-white rounded-lg"><X size={20} /></button>
        </div>
        <div className="space-y-3 text-sm text-zinc-300">
          <p><strong className="text-zinc-500">Amount:</strong> <span className="text-white font-bold">₹{expense.amount}</span></p>
          <p><strong className="text-zinc-500">Category:</strong> {expense.category}</p>
          <p><strong className="text-zinc-500">Date:</strong> {new Date(expense.date).toLocaleDateString()}</p>
        </div>
        <button onClick={onClose} className="mt-6 w-full bg-primary text-white py-2.5 rounded-xl font-bold hover:bg-primary-dark transition">Close</button>
      </div>
    </div>
  );
}
