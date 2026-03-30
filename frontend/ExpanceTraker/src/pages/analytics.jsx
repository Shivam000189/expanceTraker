import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import API from "../api";
import StatCard from "../components/StatCard";
import CategoryBreakdown from "../components/CategoryBreakdown";
import TopSpendingDays from "../components/TopSpendingDays";

import { groupByCategory } from "../utils/analytics";


export default function Analytics() {
  const [expenses, setExpenses] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    API.get("/expenses", {
      headers: { Authorization: `Bearer ${token}` },
    }).then((res) => setExpenses(res.data));
  }, []);

  const total = expenses.reduce((a, e) => a + Number(e.amount), 0);
  const avg = expenses.length ? total / expenses.length : 0;
  const categories = groupByCategory(expenses);

  return (
    <div className="flex min-h-screen bg-[#FDFDFF] font-nunito">
      <Sidebar />

      <main className="ml-64 flex-1 p-8 space-y-6">
        <h1 className="text-3xl font-serif text-violet-900">
          Analytics
        </h1>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <StatCard label="Total" value={`₹${total}`} sub="All time" icon="💰" accent="#7C3AED" />
          <StatCard label="Average" value={`₹${avg.toFixed(0)}`} sub="Per entry" icon="📊" accent="#A855F7" />
          <StatCard label="Entries" value={expenses.length} sub="Count" icon="🧾" accent="#6D28D9" />
          <StatCard label="Top Category" value={categories[0]?.name || "-"} sub="Highest" icon="🏆" accent="#9333EA" />
        </div>

        {/* Charts */}
        <div className="grid md:grid-cols-2 gap-6">
          <CategoryBreakdown expenses={expenses} />
          <TopSpendingDays expenses={expenses} />
        </div>
      </main>
    </div>
  );
}