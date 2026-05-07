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

      <main className="w-full flex-1 space-y-6 px-4 py-6 pt-24 sm:px-6 md:ml-64 md:p-8">
        <h1 className="text-2xl sm:text-3xl font-serif text-violet-900">
          Analytics
        </h1>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          <StatCard label="Total" value={`₹${total}`} sub="All time" icon="💰" accent="#7C3AED" />
          <StatCard label="Average" value={`₹${avg.toFixed(0)}`} sub="Per entry" icon="📊" accent="#A855F7" />
          <StatCard label="Entries" value={expenses.length} sub="Count" icon="🧾" accent="#6D28D9" />
          <StatCard label="Top Category" value={categories[0]?.name || "-"} sub="Highest" icon="🏆" accent="#9333EA" />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-5 sm:gap-6">
          <CategoryBreakdown expenses={expenses} />
          <TopSpendingDays expenses={expenses} />
        </div>
      </main>
    </div>
  );
}
