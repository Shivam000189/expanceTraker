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
  Area
} from 'recharts';
import { 
  TrendingUp, 
  Users, 
  Calendar, 
  Download, 
  Sparkles, 
  Wallet,
  AlertCircle,
  BarChart2,
  LineChart as LineChartIcon
} from 'lucide-react';
import { formatCurrency, cn } from "../lib/utils";
import AnalyticsAdvisorCard from "../components/AnalyticsAdvisorCard";
import { buildSimplePdf } from "../lib/pdf";

export default function Analytics() {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeChartTab, setActiveChartTab] = useState("daily"); // 'daily' | 'monthly'

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

  // Calculate analytics data
  const total = expenses.reduce((a, e) => a + Number(e.amount || 0), 0);
  const avg = expenses.length ? total / expenses.length : 0;
  
  // Group by category for pie chart
  const categoryData = expenses.reduce((acc, exp) => {
    const cat = exp.category || "Other";
    const existing = acc.find((c) => c.name === cat);
    if (existing) {
      existing.value += Number(exp.amount || 0);
    } else {
      acc.push({ name: cat, value: Number(exp.amount || 0) });
    }
    return acc;
  }, []).sort((a, b) => b.value - a.value);

  // Palette for categories featuring emerald (#10B981) for lead slice
  const CHART_COLORS = ['#10B981', '#34D399', '#6EE7B7', '#E4E4E7', '#A1A1AA', '#71717A', '#52525B', '#3F3F46'];
  
  const categoryDataWithColors = categoryData.map((item, index) => ({
    ...item,
    color: CHART_COLORS[index % CHART_COLORS.length]
  }));

  // Group by date for spending flow
  const spendingByDay = expenses.reduce((acc, exp) => {
    const date = new Date(exp.date).toLocaleDateString('en-US', { weekday: 'short' });
    const existing = acc.find((d) => d.day === date);
    if (existing) {
      existing.expense += Number(exp.amount || 0);
    } else {
      acc.push({ day: date, expense: Number(exp.amount || 0) });
    }
    return acc;
  }, []).slice(0, 7);

  // Monthly spending data
  const monthlySpending = expenses.reduce((acc, exp) => {
    const month = new Date(exp.date).toLocaleDateString('en-US', { month: 'short' });
    const existing = acc.find((m) => m.month === month);
    if (existing) {
      existing.amount += Number(exp.amount || 0);
    } else {
      acc.push({ month, amount: Number(exp.amount || 0) });
    }
    return acc;
  }, []).slice(0, 6);

  const topCategory = categoryData[0]?.name || "-";
  const totalTransactions = expenses.length;
  const projectedSavings = Math.max(0, Math.floor(avg * 0.3));

  const handleExportReport = () => {
    const reportData = {
      generatedAt: new Date().toLocaleString('en-IN'),
      total,
      average: avg,
      transactions: totalTransactions,
      topCategory: topCategory,
      categoryBreakdown: categoryData,
      expenses: expenses,
    };

    downloadAnalyticsPdf(reportData);
  };

  if (loading) {
    return (
      <Layout contentClassName="px-4 py-6 sm:px-6 lg:px-8 max-w-7xl w-full mx-auto">
        <div className="flex items-center justify-center h-[70vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"></div>
            <p className="text-zinc-400 text-sm">Loading analytics...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout contentClassName="px-4 py-4 sm:px-6 lg:px-8 max-w-7xl w-full mx-auto">
      <div className="flex flex-col gap-4">
        {/* Top Header & 4 KPI Metrics Strip (60% Black, 30% White) */}
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-3 rounded-2xl border border-zinc-800 bg-zinc-900/90 px-4 py-3 shadow-sm backdrop-blur-sm">
          <div className="flex items-center justify-between xl:justify-start gap-4">
            <div>
              <h1 className="text-lg font-bold font-display text-white tracking-tight">Spending Insights</h1>
              <p className="text-[11px] text-zinc-400">Financial analytics & forecast cockpit</p>
            </div>

            <button 
              onClick={handleExportReport}
              className="xl:hidden border border-zinc-800 bg-zinc-950 px-3 py-1.5 rounded-xl flex items-center gap-1.5 hover:bg-zinc-800 text-zinc-300 hover:text-white transition font-semibold text-[11px]"
            >
              <Download size={13} />
              Export
            </button>
          </div>

          {/* Inline Metrics Ribbon (Monochrome White & Zinc) */}
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
            className="hidden xl:inline-flex border border-zinc-800 bg-zinc-950 px-3.5 py-2 rounded-xl items-center gap-2 hover:bg-zinc-800 hover:border-zinc-700 text-zinc-300 hover:text-white transition font-semibold text-xs shrink-0"
          >
            <Download size={14} />
            Export Report
          </button>
        </div>

        {/* Main Single-Frame Cockpit Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Left Column: Visual Charts (7 cols) */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            {/* Primary Interactive Chart with Tab Switcher */}
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/90 p-4 sm:p-5 shadow-sm backdrop-blur-sm">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="text-sm sm:text-base font-bold font-display text-white">
                    {activeChartTab === "daily" ? "Daily Spending Flow" : "Monthly Spending Trend"}
                  </h3>
                  <p className="text-[11px] text-zinc-400">
                    {activeChartTab === "daily" ? "Fluctuations across recent weekdays" : "Macro monthly outflow distribution"}
                  </p>
                </div>

                {/* Tab Switcher (Crisp 30% White on Active) */}
                <div className="flex items-center rounded-xl border border-zinc-800 bg-zinc-950 p-1">
                  <button
                    onClick={() => setActiveChartTab("daily")}
                    className={cn(
                      "flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all",
                      activeChartTab === "daily"
                        ? "bg-white text-black shadow-sm"
                        : "text-zinc-400 hover:text-white"
                    )}
                  >
                    <LineChartIcon size={12} />
                    Daily
                  </button>
                  <button
                    onClick={() => setActiveChartTab("monthly")}
                    className={cn(
                      "flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all",
                      activeChartTab === "monthly"
                        ? "bg-white text-black shadow-sm"
                        : "text-zinc-400 hover:text-white"
                    )}
                  >
                    <BarChart2 size={12} />
                    Monthly
                  </button>
                </div>
              </div>

              {/* Chart Viewport (Clean Monochrome Stroke / Subtle Shading) */}
              <div className="h-[210px] sm:h-[225px] w-full">
                {activeChartTab === "daily" ? (
                  spendingByDay.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={spendingByDay} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                        <defs>
                          <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.06)" />
                        <XAxis 
                          dataKey="day" 
                          axisLine={false} 
                          tickLine={false} 
                          tick={{ fontSize: 11, fill: '#a1a1aa', fontWeight: 600 }}
                        />
                        <YAxis 
                          axisLine={false} 
                          tickLine={false} 
                          tick={{ fontSize: 11, fill: '#a1a1aa', fontWeight: 600 }}
                        />
                        <Tooltip 
                          contentStyle={{ borderRadius: '12px', border: '1px solid rgba(16,185,129,0.3)', background: '#09090b', color: '#fff', boxShadow: '0 10px 30px -5px rgb(0 0 0 / 0.8)', fontWeight: 'bold' }}
                          itemStyle={{ color: '#fff' }}
                          labelStyle={{ color: '#a1a1aa' }}
                          cursor={{ stroke: 'rgba(16,185,129,0.3)', strokeWidth: 1.5 }}
                          formatter={(value) => formatCurrency(value)}
                        />
                        <Area type="monotone" dataKey="expense" stroke="#10B981" strokeWidth={2.5} fillOpacity={1} fill="url(#colorExpense)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="flex items-center justify-center h-full text-zinc-500 text-xs">
                      No daily spending data recorded.
                    </div>
                  )
                ) : (
                  monthlySpending.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={monthlySpending} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
                        <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#a1a1aa', fontWeight: 600 }} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#a1a1aa', fontWeight: 600 }} />
                        <Tooltip
                          formatter={(value) => formatCurrency(value)}
                          contentStyle={{ borderRadius: '12px', border: '1px solid rgba(16,185,129,0.3)', background: '#09090b', color: '#fff', boxShadow: '0 10px 30px -5px rgb(0 0 0 / 0.8)', fontWeight: 'bold' }}
                          itemStyle={{ color: '#fff' }}
                          labelStyle={{ color: '#a1a1aa' }}
                          cursor={{ fill: 'rgba(255,255,255,0.03)' }}
                        />
                        <Bar dataKey="amount" fill="#10B981" radius={[6, 6, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="flex items-center justify-center h-full text-zinc-500 text-xs">
                      No monthly spending data recorded.
                    </div>
                  )
                )}
              </div>
            </div>

            {/* Bottom 2 Sub-Cards: Category Distribution & AI Forecast */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Category Breakdown Donut */}
              <div className="rounded-2xl border border-zinc-800 bg-zinc-900/90 p-4 shadow-sm backdrop-blur-sm flex flex-col justify-between">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-300">Category Share</h4>
                  <span className="font-mono text-[10px] text-zinc-500">{categoryData.length} active</span>
                </div>

                {categoryData.length > 0 ? (
                  <div className="flex items-center gap-3">
                    <div className="h-[105px] w-[105px] shrink-0">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={categoryDataWithColors}
                            innerRadius={30}
                            outerRadius={45}
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
                            <span className="h-1.5 w-1.5 shrink-0 rounded-full" style={{ backgroundColor: cat.color }} />
                            <span className="truncate text-[11px] text-zinc-400">{cat.name}</span>
                          </div>
                          <span className="font-mono text-[11px] font-bold text-white shrink-0">
                            {formatCurrency(cat.value)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="py-6 text-center text-zinc-500 text-xs">
                    <AlertCircle size={20} className="mx-auto mb-1 opacity-60" />
                    No category data
                  </div>
                )}
              </div>

              {/* AI Smart Forecast Card (10% GREEN RESERVED FOR THE 1 MAJOR HIGHLIGHT: SAVINGS) */}
              <div className="rounded-2xl border border-zinc-800 bg-zinc-900/90 p-4 shadow-sm backdrop-blur-sm flex flex-col justify-between">
                <div>
                  <div className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-zinc-300 mb-2">
                    <Sparkles size={10} />
                    Forecast Model
                  </div>
                  <p className="text-xs font-medium text-zinc-400">
                    Projected Savings
                  </p>
                  {/* The 1 major green accent on the entire page */}
                  <p className="font-mono text-xl font-bold text-emerald-400 mt-0.5">
                    {total > 0 ? `₹${projectedSavings.toLocaleString()}` : "₹0"}
                  </p>
                  <p className="mt-1 text-[11px] text-zinc-400 leading-relaxed line-clamp-2">
                    {total > 0
                      ? `Optimizing "${topCategory}" will help reach your monthly savings target.`
                      : "Add expenses to generate automated savings targets."}
                  </p>
                </div>

                <div className="mt-2.5 pt-2 border-t border-zinc-800/80 flex items-center justify-between text-[10px]">
                  <span className="text-zinc-500 uppercase font-semibold">Model Confidence</span>
                  <span className="font-mono font-bold text-white">94.2%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: AI Financial Advisor Chat (5 cols) */}
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

// Compact Metric Pill Component
function MetricPill({ label, value, icon: Icon, isHighlight = false }) {
  return (
    <div className="flex items-center gap-2.5 rounded-xl border border-zinc-800/80 bg-zinc-950/70 px-3 py-2">
      <div className={cn("flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border", isHighlight ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-400" : "border border-white/10 bg-zinc-800 text-zinc-300")}>
        <Icon size={14} />
      </div>
      <div className="min-w-0">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500 truncate">{label}</p>
        <p className={cn("truncate font-mono text-xs font-bold", isHighlight ? "text-emerald-400" : "text-white")}>
          {value}
        </p>
      </div>
    </div>
  );
}

function downloadAnalyticsPdf(report) {
  const lines = [
    'Spendora Analytics Report',
    `Generated: ${report.generatedAt}`,
    '',
    `Total Spent: ${formatCurrency(report.total)}`,
    `Average Expense: ${formatCurrency(report.average)}`,
    `Transactions: ${report.transactions}`,
    `Top Category: ${report.topCategory}`,
    '',
    'Category Breakdown',
    ...report.categoryBreakdown.map(
      (item) => `- ${item.name}: ${formatCurrency(item.value)}`
    ),
    '',
    'Recent Expenses',
    ...report.expenses.slice(0, 15).map((expense) => {
      const date = new Date(expense.date).toLocaleDateString('en-IN');
      return `- ${date} | ${expense.title} | ${expense.category} | ${formatCurrency(expense.amount)}`;
    }),
  ];

  const pdfBytes = buildSimplePdf(lines);
  const blob = new Blob([pdfBytes], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);
  const linkElement = document.createElement('a');
  linkElement.href = url;
  linkElement.download = `expense-report-${new Date().toISOString().slice(0, 10)}.pdf`;
  linkElement.click();
  URL.revokeObjectURL(url);
}
