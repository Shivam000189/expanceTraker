import React from "react";

export default function ExpenseStats({ expenses = [] }) {
  const totalSpent = expenses.reduce((sum, exp) => sum + Number(exp.amount || 0), 0);
  const highestCategory = expenses.reduce((acc, exp) => {
    acc[exp.category] = (acc[exp.category] || 0) + Number(exp.amount || 0);
    return acc;
  }, {});
  const topCategory = Object.entries(highestCategory).sort((a, b) => b[1] - a[1])[0]?.[0] || "None";

  return (
    <div className="bg-zinc-900 border border-white/10 p-6 rounded-[2rem] shadow-sm">
      <h3 className="text-lg font-bold font-display text-white mb-4">Spending Summary</h3>
      <div className="space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-zinc-400">Total Spent</span>
          <span className="font-bold text-white">₹{totalSpent.toLocaleString()}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-zinc-400">Top Category</span>
          <span className="font-bold text-primary">{topCategory}</span>
        </div>
      </div>
    </div>
  );
}
