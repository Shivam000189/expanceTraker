import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import API from "../api";
import LoadingSpinner from "../components/LoadingSpinner";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  BarChart, Bar, PieChart, Pie, Cell, Legend, ResponsiveContainer,
} from "recharts";

export default function Dashboard() {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterMonth, setFilterMonth] = useState("All");

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await API.get("/expenses", { headers: { Authorization: `Bearer ${token}` } });
      setExpenses(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner message="Loading dashboard..." />;

  // Chart data transforms
  const expenseByDate = expenses.reduce((acc, e) => {
    const date = new Date(e.date).toLocaleDateString();
    const existing = acc.find((d) => d.date === date);
    if (existing) existing.amount += Number(e.amount);
    else acc.push({ date, amount: Number(e.amount) });
    return acc;
  }, []);

  const expenseByCategory = expenses.reduce((acc, e) => {
    const cat = e.category || "Other";
    const existing = acc.find((d) => d.name === cat);
    if (existing) existing.value += Number(e.amount);
    else acc.push({ name: cat, value: Number(e.amount) });
    return acc;
  }, []);

  // Colors
  const COLORS = ["#7C3AED", "#A855F7", "#6D28D9", "#9333EA", "#8B5CF6"];

  return (
    <div className="flex min-h-screen bg-[#FAFAFF] text-[#1A1A1A]">
      <Sidebar />

      <main className="ml-64 flex-1 p-8 space-y-8">
        {/* Filters */}
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-[#4B2C85]">Analytics</h1>

          <select
            value={filterMonth}
            onChange={(e) => setFilterMonth(e.target.value)}
            className="border rounded-lg px-3 py-2 text-sm"
          >
            <option value="All">All Months</option>
            <option value="Jan">January</option>
            <option value="Feb">February</option>
            <option value="Mar">March</option>
            {/* add other months dynamically if desired */}
          </select>
        </div>

        {/* Line Chart: Trends Over Time */}
        <div className="bg-white p-6 rounded-xl shadow border border-gray-100">
          <h3 className="text-xl font-semibold text-[#4B2C85] mb-2">
            Spending Over Time
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={expenseByDate}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="amount" stroke="#7C3AED" activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Bar + Pie Row */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Bar Chart: Category Comparison */}
          <div className="bg-white p-6 rounded-xl shadow border border-gray-100">
            <h3 className="text-xl font-semibold text-[#4B2C85] mb-2">
              Expenses by Category
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={expenseByCategory}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="#7C3AED">
                  {expenseByCategory.map((_, idx) => (
                    <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Pie Chart */}
          <div className="bg-white p-6 rounded-xl shadow border border-gray-100">
            <h3 className="text-xl font-semibold text-[#4B2C85] mb-2">
              Proportion by Category
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={expenseByCategory}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label
                >
                  {expenseByCategory.map((_, idx) => (
                    <Cell key={`pie-${idx}`} fill={COLORS[idx % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

      </main>
    </div>
  );
}