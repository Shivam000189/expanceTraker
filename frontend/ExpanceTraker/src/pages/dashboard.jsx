import { useState, useEffect, useRef } from "react";
import { Layout } from "../components/layout/Layout";
import AreaChart from "../UI/AreaChart";
import { ExpenseTable } from "../components/dashboard/ExpenseTable";
import { ExpenseForm } from "../components/dashboard/ExpenseForm";
import { SMSDetector } from "../components/dashboard/SMSDetector";
import LoadingSpinner from "../components/LoadingSpinner";
import API from "../api";
import toast from "react-hot-toast";
import {
  Plus,
  ArrowDown,
  ArrowUpRight,
  ArrowDownRight,
  CreditCard,
  TrendingUp,
  PiggyBank,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { formatCurrency } from "../lib/utils";

export default function Dashboard() {
  const [expenses, setExpenses] = useState([]);
  const [monthlyIncome, setMonthlyIncome] = useState(
    Number(localStorage.getItem("monthlyIncome") || 0)
  );
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [smsAutofillData, setSmsAutofillData] = useState(null);
  const formRef = useRef(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const [expensesRes, profileRes] = await Promise.all([
        API.get("/expenses", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        API.get("/auth/profile", {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      setExpenses(expensesRes.data || []);
      const income = Number(profileRes.data?.monthlyIncome || 0);
      setMonthlyIncome(income);
      localStorage.setItem("monthlyIncome", String(income));
      if (profileRes.data?.name) {
        localStorage.setItem("userName", profileRes.data.name);
      }
      if (profileRes.data?.email) {
        localStorage.setItem("userEmail", profileRes.data.email);
      }
    } catch (err) {
      toast.error("Failed to load dashboard data");
      console.error(err);
      setExpenses([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchExpenses = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await API.get("/expenses", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setExpenses(res.data || []);
    } catch (err) {
      toast.error("Failed to load expenses");
      console.error(err);
    }
  };

  const handleSMSDetect = (data) => {
    setSmsAutofillData(data);
    setIsFormOpen(true);
  };

  const handleFormSubmit = async () => {
    await fetchExpenses();
    setSmsAutofillData(null);
  };

  const handleEdit = (expense) => {
    setEditingExpense(expense);
    setSmsAutofillData(null);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingExpense(null);
    setSmsAutofillData(null);
  };

  if (loading) return <LoadingSpinner message="Loading your dashboard..." />;

  // Calculated metrics
  const totalExpense = expenses.reduce((sum, e) => sum + Number(e.amount || 0), 0);
  const totalBalance = Math.max(0, monthlyIncome - totalExpense);
  const averageTransaction =
    expenses.length > 0 ? Math.round(totalExpense / expenses.length) : 0;
  const expensePercentage =
    monthlyIncome > 0
      ? Math.min(100, Math.round((totalExpense / monthlyIncome) * 100))
      : 0;

  // Group by date for AreaChart
  const dateMap = {};
  expenses.slice(0, 15).forEach((e) => {
    const d = new Date(e.date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
    dateMap[d] = (dateMap[d] || 0) + Number(e.amount || 0);
  });
  const chartData = Object.entries(dateMap).map(([name, amount]) => ({
    name,
    amount,
  }));

  // Category breakdown
  const categoryBreakdown = expenses.reduce((acc, e) => {
    const cat = e.category || "Other";
    const existing = acc.find((d) => d.name === cat);
    if (existing) {
      existing.value += Number(e.amount);
    } else {
      acc.push({ name: cat, value: Number(e.amount) });
    }
    return acc;
  }, []);

  return (
    <Layout>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 lg:grid-rows-[repeat(12,minmax(0,1fr))] gap-3 w-full h-full min-h-0">
        {/* 1. Bento Hero Card: Total Balance in Neon Green #10EE74 (3 cols, 5 rows) */}
        <div className="col-span-1 md:col-span-1 lg:col-span-3 lg:row-span-5 h-[210px] lg:h-full min-h-0">
          <div className="relative h-full flex flex-col justify-between overflow-hidden rounded-[24px] bg-[#10EE74] text-black p-4 lg:p-5 shadow-lg shadow-[#10EE74]/15">
            {/* Top: Title & Plus button */}
            <div className="flex items-start justify-between w-full">
              <div>
                <p className="text-xs font-semibold tracking-tight text-black/80">
                  Total Balance
                </p>
                <div className="mt-1 flex items-baseline gap-1.5">
                  <span className="text-2xl lg:text-[32px] font-bold font-mono tracking-tight text-black leading-none">
                    {formatCurrency(totalBalance)}
                  </span>
                  <span className="text-[10px] font-bold tracking-wide text-black/70">
                    INR
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsFormOpen(true)}
                aria-label="Add transaction"
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-black text-white hover:bg-black/85 transition-colors shadow-sm cursor-pointer"
              >
                <Plus className="h-4 w-4 stroke-[2.5]" />
              </button>
            </div>

            {/* Middle preview info */}
            <div className="my-1">
              <span className="text-[11px] text-black/75 font-medium">
                {expenses.length} txns recorded
              </span>
            </div>

            {/* Bottom: Pill Buttons */}
            <div className="flex items-center gap-2 w-full pt-1">
              <button
                type="button"
                onClick={() => setIsFormOpen(true)}
                className="flex-1 flex items-center justify-center gap-1 h-[36px] lg:h-[38px] rounded-full bg-black text-white font-semibold text-xs hover:bg-black/85 transition-colors cursor-pointer"
              >
                <span>Add Expense</span>
                <Plus className="h-3 w-3 stroke-[2.5]" />
              </button>

              <button
                type="button"
                onClick={() => setIsFormOpen(true)}
                className="flex-1 flex items-center justify-center gap-1 h-[36px] lg:h-[38px] rounded-full bg-white text-black font-semibold text-xs hover:bg-white/90 transition-colors shadow-sm cursor-pointer"
              >
                <span>Deposit</span>
                <ArrowDown className="h-3 w-3 stroke-[2.5]" />
              </button>
            </div>
          </div>
        </div>

        {/* 2. Bento Centerpiece: AreaChart (6 cols, 5 rows) */}
        <div className="col-span-1 md:col-span-2 lg:col-span-6 lg:row-span-5 h-[210px] lg:h-full min-h-0">
          <AreaChart
            data={chartData}
            title="Expense Analysis"
            subtitle="Daily Trend Overview"
            className="h-full p-4 lg:p-5"
          />
        </div>

        {/* 3. Bento Right: SMS Detector in Upgrade To Pro position (3 cols, 5 rows) */}
        <div className="col-span-1 md:col-span-1 lg:col-span-3 lg:row-span-5 h-[210px] lg:h-full min-h-0">
          <SMSDetector onDetect={handleSMSDetect} className="h-full min-h-0" />
        </div>

        {/* 4. Metric 1: Monthly Income with Neon Green donut ring (3 cols, 3 rows) */}
        <motion.div
          whileHover={{ y: -2 }}
          transition={{ duration: 0.2 }}
          className="col-span-1 md:col-span-1 lg:col-span-3 lg:row-span-3 h-[125px] lg:h-full min-h-0 relative w-full flex flex-col justify-between overflow-hidden rounded-[24px] border border-white/10 bg-[#131313] p-3.5 lg:p-4 text-white shadow-[0_10px_30px_rgba(0,0,0,0.3)] transition-all hover:border-white/20"
        >
          <div className="flex items-start justify-between w-full">
            <div className="flex h-7 w-7 lg:h-8 lg:w-8 shrink-0 items-center justify-center rounded-xl bg-[#0D2E18] text-[#10EE74]">
              <ArrowUpRight className="h-3.5 w-3.5 stroke-[2.5]" />
            </div>

            {/* Neon Green donut ring */}
            <div className="relative w-8 h-8 lg:w-9 lg:h-9 shrink-0">
              <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                <circle
                  cx="18"
                  cy="18"
                  r="14"
                  fill="none"
                  stroke="#262626"
                  strokeWidth="3.5"
                />
                <circle
                  cx="18"
                  cy="18"
                  r="14"
                  fill="none"
                  stroke="#10EE74"
                  strokeWidth="3.5"
                  strokeDasharray="72 100"
                  strokeLinecap="round"
                  className="drop-shadow-[0_0_8px_rgba(16,238,116,0.65)]"
                />
              </svg>
            </div>
          </div>

          <div className="mt-auto pt-1">
            <p className="text-[11px] lg:text-xs font-medium text-gray-400 truncate">Monthly Income</p>
            <p className="text-base sm:text-lg lg:text-xl font-bold tracking-tight font-mono text-white leading-tight truncate">
              {formatCurrency(monthlyIncome)}
            </p>
          </div>
        </motion.div>

        {/* 5. Metric 2: Total Expense with Coral donut ring & % spent (3 cols, 3 rows) */}
        <motion.div
          whileHover={{ y: -2 }}
          transition={{ duration: 0.2 }}
          className="col-span-1 md:col-span-1 lg:col-span-3 lg:row-span-3 h-[125px] lg:h-full min-h-0 relative w-full flex flex-col justify-between overflow-hidden rounded-[24px] border border-white/10 bg-[#131313] p-3.5 lg:p-4 text-white shadow-[0_10px_30px_rgba(0,0,0,0.3)] transition-all hover:border-white/20"
        >
          <div className="flex items-start justify-between w-full">
            <div className="flex h-7 w-7 lg:h-8 lg:w-8 shrink-0 items-center justify-center rounded-xl bg-[#2C1511] text-[#FF6B57]">
              <ArrowDownRight className="h-3.5 w-3.5 stroke-[2.5]" />
            </div>

            {/* Coral donut ring with percentage */}
            <div className="relative w-8 h-8 lg:w-9 lg:h-9 shrink-0">
              <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                <circle
                  cx="18"
                  cy="18"
                  r="14"
                  fill="none"
                  stroke="#262626"
                  strokeWidth="3.5"
                />
                <circle
                  cx="18"
                  cy="18"
                  r="14"
                  fill="none"
                  stroke="#FF6E5A"
                  strokeWidth="3.5"
                  strokeDasharray={`${expensePercentage} 100`}
                  strokeLinecap="round"
                  className="drop-shadow-[0_0_8px_rgba(255,110,90,0.6)]"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-[8px] font-bold font-mono text-white/80">
                  {expensePercentage}%
                </span>
              </div>
            </div>
          </div>

          <div className="mt-auto pt-1">
            <p className="text-[11px] lg:text-xs font-medium text-gray-400 truncate">Total Expense</p>
            <p className="text-base sm:text-lg lg:text-xl font-bold tracking-tight font-mono text-white leading-tight truncate">
              {formatCurrency(totalExpense)}
            </p>
          </div>
        </motion.div>

        {/* 6. Metric 3: Avg Transaction (3 cols, 3 rows) */}
        <motion.div
          whileHover={{ y: -2 }}
          transition={{ duration: 0.2 }}
          className="col-span-1 md:col-span-1 lg:col-span-3 lg:row-span-3 h-[125px] lg:h-full min-h-0 relative w-full flex flex-col justify-between overflow-hidden rounded-[24px] border border-white/10 bg-[#131313] p-3.5 lg:p-4 text-white shadow-[0_10px_30px_rgba(0,0,0,0.3)] transition-all hover:border-white/20"
        >
          <div className="flex items-start justify-between w-full">
            <div className="flex h-7 w-7 lg:h-8 lg:w-8 shrink-0 items-center justify-center rounded-xl bg-white/10 text-white/70">
              <CreditCard className="h-3.5 w-3.5" />
            </div>

            <div className="flex items-center gap-1 rounded-full bg-white/5 border border-white/10 px-2 py-0.5 text-[9px] font-mono text-white/60 shrink-0">
              <TrendingUp className="h-2.5 w-2.5" />
              <span>{expenses.length} txns</span>
            </div>
          </div>

          <div className="mt-auto pt-1">
            <p className="text-[11px] lg:text-xs font-medium text-gray-400 truncate">Avg Transaction</p>
            <p className="text-base sm:text-lg lg:text-xl font-bold tracking-tight font-mono text-white leading-tight truncate">
              {formatCurrency(averageTransaction)}
            </p>
          </div>
        </motion.div>

        {/* 7. Metric 4: Net Savings (3 cols, 3 rows) */}
        <motion.div
          whileHover={{ y: -2 }}
          transition={{ duration: 0.2 }}
          className="col-span-1 md:col-span-1 lg:col-span-3 lg:row-span-3 h-[125px] lg:h-full min-h-0 relative w-full flex flex-col justify-between overflow-hidden rounded-[24px] border border-white/10 bg-[#131313] p-3.5 lg:p-4 text-white shadow-[0_10px_30px_rgba(0,0,0,0.3)] transition-all hover:border-white/20"
        >
          <div className="flex items-start justify-between w-full">
            <div className="flex h-7 w-7 lg:h-8 lg:w-8 shrink-0 items-center justify-center rounded-xl bg-[#0D2E18] text-[#10EE74]">
              <PiggyBank className="h-3.5 w-3.5" />
            </div>

            <div className="flex items-center gap-1 rounded-full bg-[#0D2E18] border border-[#10EE74]/20 px-2 py-0.5 text-[9px] font-mono text-[#10EE74] shrink-0">
              <span>Active</span>
            </div>
          </div>

          <div className="mt-auto pt-1">
            <p className="text-[11px] lg:text-xs font-medium text-gray-400 truncate">Net Savings</p>
            <p className="text-base sm:text-lg lg:text-xl font-bold tracking-tight font-mono text-[#10EE74] leading-tight truncate">
              {formatCurrency(totalBalance)}
            </p>
          </div>
        </motion.div>

        {/* 8. History Transaction (ExpenseTable: 8 cols, 4 rows) */}
        <div className="col-span-1 md:col-span-2 lg:col-span-8 lg:row-span-4 h-[220px] lg:h-full min-h-0">
          <ExpenseTable
            transactions={expenses.slice(0, 15)}
            onEdit={handleEdit}
            onRefresh={fetchExpenses}
            className="h-full"
          />
        </div>

        {/* 9. Spending by Category (In place of GlassCard: 4 cols, 4 rows) */}
        <div className="col-span-1 md:col-span-2 lg:col-span-4 lg:row-span-4 h-[220px] lg:h-full min-h-0">
          <div className="rounded-[24px] border border-white/10 bg-[#131313] p-4 lg:p-5 text-white shadow-[0_10px_30px_rgba(0,0,0,0.3)] h-full flex flex-col justify-between overflow-hidden">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs sm:text-sm font-semibold text-white tracking-tight font-display">
                Spending by Category
              </h3>
              <span className="text-[10px] font-mono text-gray-400 bg-white/5 border border-white/5 px-2 py-0.5 rounded-full">
                {categoryBreakdown.length} categories
              </span>
            </div>

            {categoryBreakdown.length > 0 ? (
              <div className="space-y-2.5 overflow-y-auto pr-1 flex-1 my-1">
                {categoryBreakdown.slice(0, 5).map((cat, idx) => {
                  const pct = Math.round(
                    (cat.value / (totalExpense || 1)) * 100
                  );
                  return (
                    <div key={idx} className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-white/80 font-medium truncate max-w-[150px]">
                          {cat.name}
                        </span>
                        <span className="text-white font-mono font-semibold text-[11px]">
                          {formatCurrency(cat.value)} ({pct}%)
                        </span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-[#262626] overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            idx === 0
                              ? "bg-[#10EE74]"
                              : idx === 1
                              ? "bg-white"
                              : "bg-gray-400"
                          }`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="py-6 text-center text-xs text-gray-500 flex-1 flex items-center justify-center">
                No categorical expenses recorded yet
              </div>
            )}

            <div className="text-[11px] text-gray-400 border-t border-white/5 pt-2 flex justify-between shrink-0">
              <span>Monthly Budget Target</span>
              <span className="text-white font-mono font-medium">
                {expensePercentage}% used
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Expense Form Modal */}
      <AnimatePresence>
        {isFormOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4"
          >
            <div ref={formRef} className="w-full max-w-lg">
              <ExpenseForm
                initialData={editingExpense || smsAutofillData}
                onClose={handleCloseForm}
                onSubmit={handleFormSubmit}
                isEditing={!!editingExpense}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Layout>
  );
}
