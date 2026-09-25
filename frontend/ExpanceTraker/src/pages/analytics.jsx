import { useEffect, useState } from "react";
import { Layout } from "../components/layout/Layout";
import API from "../api";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts";
import {
  TrendingUp,
  Users,
  Calendar,
  Download,
  Wallet,
  AlertCircle,
  BarChart2,
  LineChart as LineChartIcon,
} from "lucide-react";
import { formatCurrency, cn } from "../lib/utils";
import AnalyticsAdvisorCard from "../components/AnalyticsAdvisorCard";
import { buildSimplePdf } from "../lib/pdf";

export default function Analytics() {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeChartTab, setActiveChartTab] = useState("daily");

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
    } catch (err) {
      console.error("Failed to load expenses:", err);
    } finally {
      setLoading(false);
    }
  };

  const total = expenses.reduce((a, e) => a + Number(e.amount || 0), 0);
  const avg = expenses.length ? Math.round(total / expenses.length) : 0;

  // Group by category for pie chart
  const categoryData = expenses
    .reduce((acc, exp) => {
      const cat = exp.category || "Other";
      const existing = acc.find((c) => c.name === cat);
      if (existing) {
        existing.value += Number(exp.amount || 0);
      } else {
        acc.push({ name: cat, value: Number(exp.amount || 0) });
      }
      return acc;
    }, [])
    .sort((a, b) => b.value - a.value);

  // Vibrant palette matching expancetraker with electric neon green #10EE74
  const CHART_COLORS = [
    "#10EE74",
    "#34D399",
    "#38BDF8",
    "#A78BFA",
    "#FB923C",
    "#F43F5E",
    "#94A3B8",
    "#64748B",
  ];

  const categoryDataWithColors = categoryData.map((item, index) => ({
    ...item,
    color: CHART_COLORS[index % CHART_COLORS.length],
  }));

  // Spending flow by day
  const spendingByDay = expenses
    .reduce((acc, exp) => {
      const date = new Date(exp.date).toLocaleDateString("en-US", {
        weekday: "short",
      });
      const existing = acc.find((d) => d.day === date);
      if (existing) {
        existing.expense += Number(exp.amount || 0);
      } else {
        acc.push({ day: date, expense: Number(exp.amount || 0) });
      }
      return acc;
    }, [])
    .slice(0, 7);

  // Monthly spending
  const monthlySpending = expenses
    .reduce((acc, exp) => {
      const month = new Date(exp.date).toLocaleDateString("en-US", {
        month: "short",
      });
      const existing = acc.find((m) => m.month === month);
      if (existing) {
        existing.amount += Number(exp.amount || 0);
      } else {
        acc.push({ month, amount: Number(exp.amount || 0) });
      }
      return acc;
    }, [])
    .slice(0, 6);

  const topCategory = categoryData[0]?.name || "-";
  const totalTransactions = expenses.length;
  const projectedSavings = Math.max(0, Math.floor(avg * 0.3));

  const handleExportReport = () => {
    const reportData = {
      generatedAt: new Date().toLocaleString("en-IN"),
      total,
      average: avg,
      transactions: totalTransactions,
      topCategory,
      categoryBreakdown: categoryData,
      expenses,
    };
    downloadAnalyticsPdf(reportData);
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-[70vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#10EE74] mx-auto mb-4" />
            <p className="text-gray-400 text-sm">Loading analytics...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="h-full min-h-0 flex flex-col justify-between gap-3 overflow-hidden">
        {/* Top Header & Metrics Strip */}
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-3 rounded-[24px] border border-white/10 bg-[#131313] px-4 py-2.5 shadow-[0_10px_30px_rgba(0,0,0,0.3)] shrink-0">
          <div className="flex items-center justify-between xl:justify-start gap-4">
            <div>
              <h1 className="text-base font-bold font-display text-white tracking-tight">
                Spending Insights
              </h1>
              <p className="text-[11px] text-gray-400">
                Financial analytics &amp; forecast intelligence
              </p>
            </div>

            <button
              onClick={handleExportReport}
              className="xl:hidden border border-white/10 bg-[#1C1C1C] px-3 py-1.5 rounded-full flex items-center gap-1.5 hover:bg-white/10 text-white transition font-medium text-xs"
            >
              <Download size={13} />
              Export
            </button>
          </div>

          {/* Metric Pills */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 flex-1 xl:max-w-3xl xl:px-4">
            <MetricPill
              label="Total Spent"
              value={formatCurrency(total)}
              icon={TrendingUp}
              isHighlight={true}
            />
            <MetricPill
              label="Avg Expense"
              value={formatCurrency(avg)}
              icon={Calendar}
            />
            <MetricPill
              label="Transactions"
              value={String(totalTransactions)}
              icon={Users}
            />
            <MetricPill
              label="Top Category"
              value={topCategory}
              icon={Wallet}
            />
          </div>

          <button
            onClick={handleExportReport}
            className="hidden xl:inline-flex border border-white/10 bg-[#1C1C1C] px-3.5 py-1.5 rounded-full items-center gap-1.5 hover:bg-white/10 text-white transition font-semibold text-xs shrink-0"
          >
            <Download size={13} className="text-[#10EE74]" />
            Export Report
          </button>
        </div>

        {/* Charts & Advisor Cockpit */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 flex-1 min-h-0">
          {/* Left Column (7 cols) */}
          <div className="lg:col-span-7 flex flex-col justify-between gap-3 h-full min-h-0">
            {/* Main Flow Chart */}
            <div className="rounded-[24px] border border-white/10 bg-[#131313] p-4 shadow-[0_10px_30px_rgba(0,0,0,0.3)] flex-1 min-h-0 flex flex-col justify-between">
              <div className="flex items-center justify-between mb-2 shrink-0">
                <div>
                  <h3 className="text-sm font-bold font-display text-white">
                    {activeChartTab === "daily"
                      ? "Daily Spending Flow"
                      : "Monthly Spending Trend"}
                  </h3>
                  <p className="text-[11px] text-gray-400">
                    {activeChartTab === "daily"
                      ? "Recent daily expenditure distribution"
                      : "Macro monthly outflow comparison"}
                  </p>
                </div>

                {/* Tab Switcher */}
                <div className="flex items-center rounded-full border border-white/10 bg-[#1C1C1C] p-0.5">
                  <button
                    onClick={() => setActiveChartTab("daily")}
                    className={cn(
                      "flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer",
                      activeChartTab === "daily"
                        ? "bg-[#10EE74] text-black shadow-sm"
                        : "text-gray-400 hover:text-white"
                    )}
                  >
                    <LineChartIcon size={12} />
                    Daily
                  </button>
                  <button
                    onClick={() => setActiveChartTab("monthly")}
                    className={cn(
                      "flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer",
                      activeChartTab === "monthly"
                        ? "bg-[#10EE74] text-black shadow-sm"
                        : "text-gray-400 hover:text-white"
                    )}
                  >
                    <BarChart2 size={12} />
                    Monthly
                  </button>
                </div>
              </div>

              {/* Viewport */}
              <div className="h-[210px] sm:h-[230px] w-full pt-2">
                {activeChartTab === "daily" ? (
                  spendingByDay.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart
                        data={spendingByDay}
                        margin={{ top: 10, right: 10, left: -15, bottom: 0 }}
                      >
                        <defs>
                          <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10EE74" stopOpacity={0.4} />
                            <stop offset="95%" stopColor="#10EE74" stopOpacity={0.02} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid
                          strokeDasharray="3 3"
                          vertical={false}
                          stroke="rgba(255,255,255,0.06)"
                        />
                        <XAxis
                          dataKey="day"
                          axisLine={false}
                          tickLine={false}
                          tick={{ fontSize: 11, fill: "#9ca3af" }}
                        />
                        <YAxis
                          axisLine={false}
                          tickLine={false}
                          tick={{ fontSize: 11, fill: "#9ca3af" }}
                        />
                        <Tooltip
                          contentStyle={{
                            borderRadius: "14px",
                            border: "1px solid rgba(255,255,255,0.1)",
                            background: "#1C1C1C",
                            color: "#fff",
                            boxShadow: "0 10px 30px rgba(0,0,0,0.8)",
                          }}
                          itemStyle={{ color: "#10EE74", fontWeight: "bold" }}
                          labelStyle={{ color: "#9ca3af" }}
                          formatter={(value) => formatCurrency(value)}
                        />
                        <Area
                          type="monotone"
                          dataKey="expense"
                          stroke="#10EE74"
                          strokeWidth={2.5}
                          fillOpacity={1}
                          fill="url(#colorExpense)"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-500 text-xs">
                      No daily spending data recorded.
                    </div>
                  )
                ) : monthlySpending.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={monthlySpending}
                      margin={{ top: 10, right: 10, left: -15, bottom: 0 }}
                    >
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="rgba(255,255,255,0.06)"
                        vertical={false}
                      />
                      <XAxis
                        dataKey="month"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 11, fill: "#9ca3af" }}
                      />
                      <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 11, fill: "#9ca3af" }}
                      />
                      <Tooltip
                        formatter={(value) => formatCurrency(value)}
                        contentStyle={{
                          borderRadius: "14px",
                          border: "1px solid rgba(255,255,255,0.1)",
                          background: "#1C1C1C",
                          color: "#fff",
                        }}
                      />
                      <Bar dataKey="amount" fill="#10EE74" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-500 text-xs">
                    No monthly spending data recorded.
                  </div>
                )}
              </div>
            </div>

            {/* Bottom 2 Sub-Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Category Share */}
              <div className="rounded-[24px] border border-white/10 bg-[#131313] p-4 shadow-[0_10px_30px_rgba(0,0,0,0.3)] flex flex-col justify-between">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-gray-300">
                    Category Share
                  </h4>
                  <span className="font-mono text-[10px] text-gray-500">
                    {categoryData.length} active
                  </span>
                </div>

                {categoryData.length > 0 ? (
                  <div className="flex items-center gap-3">
                    <div className="h-[110px] w-[110px] shrink-0">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={categoryDataWithColors}
                            innerRadius={32}
                            outerRadius={48}
                            paddingAngle={3}
                            dataKey="value"
                          >
                            {categoryDataWithColors.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                        </PieChart>
                      </ResponsiveContainer>
                    </div>

                    <div className="flex-1 space-y-1.5 overflow-hidden">
                      {categoryDataWithColors.slice(0, 3).map((cat, i) => (
                        <div key={i} className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-1.5 truncate">
                            <span
                              className="h-2 w-2 shrink-0 rounded-full"
                              style={{ backgroundColor: cat.color }}
                            />
                            <span className="truncate text-[11px] text-gray-300">
                              {cat.name}
                            </span>
                          </div>
                          <span className="font-mono text-[11px] font-bold text-white shrink-0">
                            {formatCurrency(cat.value)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="py-6 text-center text-gray-500 text-xs">
                    <AlertCircle size={20} className="mx-auto mb-1 opacity-60" />
                    No category data
                  </div>
                )}
              </div>

              {/* AI Forecast */}
              <div className="rounded-[24px] border border-white/10 bg-[#131313] p-4 shadow-[0_10px_30px_rgba(0,0,0,0.3)] flex flex-col justify-between">
                <div>
                  <div className="inline-flex items-center gap-1.5 rounded-full border border-[#10EE74]/20 bg-[#0D2E18] px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-[#10EE74] mb-2">
                    <TrendingUp size={11} />
                    Forecast Model
                  </div>
                  <p className="text-xs font-medium text-gray-400">
                    Projected Savings
                  </p>
                  <p className="font-mono text-2xl font-bold text-[#10EE74] mt-0.5">
                    {total > 0 ? `₹${projectedSavings.toLocaleString()}` : "₹0"}
                  </p>
                  <p className="mt-1 text-[11px] text-gray-400 leading-relaxed line-clamp-2">
                    {total > 0
                      ? `Optimizing "${topCategory}" will help reach your monthly target.`
                      : "Add expenses to generate automated savings targets."}
                  </p>
                </div>

                <div className="mt-2.5 pt-2 border-t border-white/5 flex items-center justify-between text-[10px]">
                  <span className="text-gray-500 uppercase font-semibold">
                    Confidence
                  </span>
                  <span className="font-mono font-bold text-[#10EE74]">94.2%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: AI Advisor (5 cols) */}
          <div className="lg:col-span-5 flex flex-col">
            <AnalyticsAdvisorCard
              className="h-full"
              chatHeight="h-[260px] sm:h-[285px] lg:h-[305px]"
            />
          </div>
        </div>
      </div>
    </Layout>
  );
}

function MetricPill({ label, value, icon: Icon, isHighlight = false }) {
  return (
    <div className="flex items-center gap-2.5 rounded-2xl border border-white/5 bg-[#1C1C1C] px-3.5 py-2.5">
      <div
        className={cn(
          "flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border",
          isHighlight
            ? "border-[#10EE74]/30 bg-[#0D2E18] text-[#10EE74]"
            : "border-white/10 bg-white/5 text-gray-300"
        )}
      >
        <Icon size={14} />
      </div>
      <div className="min-w-0">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400 truncate">
          {label}
        </p>
        <p
          className={cn(
            "truncate font-mono text-xs font-bold",
            isHighlight ? "text-[#10EE74]" : "text-white"
          )}
        >
          {value}
        </p>
      </div>
    </div>
  );
}

function downloadAnalyticsPdf(report) {
  const lines = [
    "Spendora Analytics Report",
    `Generated: ${report.generatedAt}`,
    "",
    `Total Spent: ${formatCurrency(report.total)}`,
    `Average Expense: ${formatCurrency(report.average)}`,
    `Transactions: ${report.transactions}`,
    `Top Category: ${report.topCategory}`,
    "",
    "Category Breakdown",
    ...report.categoryBreakdown.map(
      (item) => `- ${item.name}: ${formatCurrency(item.value)}`
    ),
    "",
    "Recent Expenses",
    ...report.expenses.slice(0, 15).map((expense) => {
      const date = new Date(expense.date).toLocaleDateString("en-IN");
      return `- ${date} | ${expense.title} | ${expense.category} | ${formatCurrency(expense.amount)}`;
    }),
  ];

  const pdfBytes = buildSimplePdf(lines);
  const blob = new Blob([pdfBytes], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);
  const linkElement = document.createElement("a");
  linkElement.href = url;
  linkElement.download = `expense-report-${new Date().toISOString().slice(0, 10)}.pdf`;
  linkElement.click();
  URL.revokeObjectURL(url);
}
