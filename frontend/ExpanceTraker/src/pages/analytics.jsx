import { useEffect, useMemo, useRef, useState } from "react";
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
  Legend 
} from 'recharts';
import { 
  TrendingUp, 
  Users, 
  Calendar, 
  ArrowRight, 
  Download, 
  Sparkles, 
  Wallet, 
  AlertCircle,
  FileText,
  FileSpreadsheet,
  Check,
  Edit3,
  Globe,
  ChevronDown
} from 'lucide-react';
import { formatCurrency, cn, SUPPORTED_CURRENCIES, getActiveCurrency } from "../lib/utils";
import { calculateRunRateForecast, getBudgetThresholdStatus, generateExpensesCsv } from "../utils/analytics";
import AnalyticsAdvisorCard from "../components/AnalyticsAdvisorCard";
import { buildSimplePdf } from "../lib/pdf";
import toast from "react-hot-toast";

const DEFAULT_BUDGETS = {
  Food: 6000,
  Shopping: 5000,
  Travel: 3000,
  Bills: 4000,
  Entertainment: 2500,
  Health: 2000,
  Other: 2000,
};

export default function Analytics() {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currency, setCurrency] = useState(getActiveCurrency());
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [monthlyIncome, setMonthlyIncome] = useState(Number(localStorage.getItem('monthlyIncome') || 0));
  const [editingCategory, setEditingCategory] = useState(null);
  const [budgetInput, setBudgetInput] = useState('');
  const exportRef = useRef(null);

  const [categoryBudgets, setCategoryBudgets] = useState(() => {
    try {
      const saved = localStorage.getItem('categoryBudgets');
      return saved ? JSON.parse(saved) : DEFAULT_BUDGETS;
    } catch {
      return DEFAULT_BUDGETS;
    }
  });

  useEffect(() => {
    fetchExpenses();
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (exportRef.current && !exportRef.current.contains(e.target)) {
        setIsExportOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchExpenses = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const [expensesRes, profileRes] = await Promise.all([
        API.get("/expenses", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        API.get("/auth/profile", {
          headers: { Authorization: `Bearer ${token}` },
        }).catch(() => ({ data: {} })),
      ]);

      setExpenses(expensesRes.data || []);
      if (profileRes.data?.monthlyIncome) {
        setMonthlyIncome(Number(profileRes.data.monthlyIncome));
      }
    } catch (err) {
      console.error('Failed to load analytics:', err);
      toast.error('Failed to load analytics');
    } finally {
      setLoading(false);
    }
  };

  const handleCurrencyChange = (newCurrency) => {
    setCurrency(newCurrency);
    localStorage.setItem('preferredCurrency', newCurrency);
    toast.success(`Currency changed to ${newCurrency}`);
  };

  const saveCategoryBudget = (category) => {
    const numeric = Number(budgetInput);
    if (Number.isNaN(numeric) || numeric < 0) {
      toast.error('Please enter a valid positive budget amount');
      return;
    }

    const updated = { ...categoryBudgets, [category]: numeric };
    setCategoryBudgets(updated);
    localStorage.setItem('categoryBudgets', JSON.stringify(updated));
    setEditingCategory(null);
    setBudgetInput('');
    toast.success(`Updated budget for ${category}`);
  };

  // Run rate forecast
  const forecast = useMemo(() => {
    return calculateRunRateForecast(expenses, monthlyIncome);
  }, [expenses, monthlyIncome]);

  // Aggregate metrics
  const total = expenses.reduce((a, e) => a + Number(e.amount), 0);
  const avg = expenses.length ? total / expenses.length : 0;
  
  // Category Breakdown
  const categoryData = useMemo(() => {
    return expenses.reduce((acc, exp) => {
      const cat = exp.category || "Other";
      const existing = acc.find((c) => c.name === cat);
      if (existing) {
        existing.value += Number(exp.amount);
      } else {
        acc.push({ name: cat, value: Number(exp.amount) });
      }
      return acc;
    }, []).sort((a, b) => b.value - a.value);
  }, [expenses]);

  const COLORS = ['#10B981', '#F97316', '#8B5CF6', '#EC4899', '#06B6D4', '#F59E0B', '#6366F1', '#14B8A6'];
  
  const categoryDataWithColors = categoryData.map((item, index) => ({
    ...item,
    color: COLORS[index % COLORS.length]
  }));

  // Daily Spending Flow
  const spendingByDay = useMemo(() => {
    return expenses.reduce((acc, exp) => {
      const date = new Date(exp.date).toLocaleDateString('en-US', { weekday: 'short' });
      const existing = acc.find((d) => d.day === date);
      if (existing) {
        existing.expense += Number(exp.amount);
      } else {
        acc.push({ day: date, expense: Number(exp.amount) });
      }
      return acc;
    }, []).slice(0, 7);
  }, [expenses]);

  // Monthly Spending
  const monthlySpending = useMemo(() => {
    return expenses.reduce((acc, exp) => {
      const month = new Date(exp.date).toLocaleDateString('en-US', { month: 'short' });
      const existing = acc.find((m) => m.month === month);
      if (existing) {
        existing.amount += Number(exp.amount);
      } else {
        acc.push({ month, amount: Number(exp.amount) });
      }
      return acc;
    }, []).slice(0, 6);
  }, [expenses]);

  const topCategory = categoryData[0]?.name || "-";
  const totalTransactions = expenses.length;

  const handleExportPdf = () => {
    setIsExportOpen(false);
    downloadAnalyticsPdf({
      generatedAt: new Date().toLocaleString(),
      total,
      average: avg,
      transactions: totalTransactions,
      topCategory,
      categoryBreakdown: categoryData,
      expenses,
      currency,
    });
    toast.success('Downloaded PDF report');
  };

  const handleExportCsv = () => {
    setIsExportOpen(false);
    downloadExpensesCsv(expenses);
    toast.success('Downloaded CSV export');
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-zinc-500 font-medium">Loading analytics...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6 lg:space-y-8">
        {/* Header Section with Currency & Export Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold font-display text-zinc-900">Spending Insights</h1>
            <p className="text-zinc-500 text-sm lg:text-base mt-1">Detailed analysis, predictive forecasting, and category budgets.</p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Currency Selector */}
            <div className="inline-flex items-center gap-2 bg-white border border-zinc-200 rounded-xl px-3 py-2 text-sm font-semibold shadow-sm text-zinc-700">
              <Globe size={16} className="text-primary" />
              <select
                value={currency}
                onChange={(e) => handleCurrencyChange(e.target.value)}
                className="bg-transparent focus:outline-none cursor-pointer text-sm font-bold text-zinc-800"
                aria-label="Select currency"
              >
                {SUPPORTED_CURRENCIES.map((c) => (
                  <option key={c.code} value={c.code}>{c.label}</option>
                ))}
              </select>
            </div>

            {/* Export Dropdown */}
            <div className="relative" ref={exportRef}>
              <button
                onClick={() => setIsExportOpen(!isExportOpen)}
                className="bg-white border border-zinc-200 px-4 py-2.5 rounded-xl flex items-center gap-2 hover:bg-zinc-50 transition-all font-bold text-sm shadow-sm text-zinc-800"
                aria-haspopup="true"
                aria-expanded={isExportOpen}
              >
                <Download size={16} />
                Export
                <ChevronDown size={14} className={cn('transition-transform', isExportOpen && 'rotate-180')} />
              </button>

              {isExportOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-2xl bg-white border border-zinc-200 p-2 shadow-xl z-20 space-y-1">
                  <button
                    onClick={handleExportPdf}
                    className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left text-sm font-medium text-zinc-700 hover:bg-zinc-50 hover:text-zinc-900"
                  >
                    <FileText size={16} className="text-red-500" />
                    Download PDF
                  </button>
                  <button
                    onClick={handleExportCsv}
                    className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left text-sm font-medium text-zinc-700 hover:bg-zinc-50 hover:text-zinc-900"
                  >
                    <FileSpreadsheet size={16} className="text-emerald-500" />
                    Export to CSV
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Predictive Run-Rate Forecast Card */}
        <div className="bg-gradient-to-br from-zinc-900 via-zinc-850 to-zinc-900 rounded-[2rem] p-6 lg:p-8 text-white shadow-xl relative overflow-hidden border border-zinc-800">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 relative z-10">
            <div className="space-y-2 max-w-xl">
              <div className="inline-flex items-center gap-2 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                <Sparkles size={12} />
                Predictive Spend Forecast
              </div>
              <h2 className="text-xl lg:text-2xl font-bold font-display">
                Month-End Projected Spend: {formatCurrency(forecast.projectedMonthEnd, currency)}
              </h2>
              <p className="text-zinc-400 text-sm leading-relaxed">
                At your current run rate of <span className="text-white font-semibold">{formatCurrency(forecast.dailyRunRate, currency)}/day</span> over {forecast.daysElapsed} days elapsed, you are on track to spend approximately {formatCurrency(forecast.projectedMonthEnd, currency)} this cycle.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 sm:items-center">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-4 min-w-[150px]">
                <p className="text-xs font-medium text-zinc-400">Status</p>
                <div className="mt-1">
                  {forecast.riskLevel === 'on-track' && (
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400 bg-emerald-400/10 px-2.5 py-1 rounded-full border border-emerald-400/20">
                      ● On Track
                    </span>
                  )}
                  {forecast.riskLevel === 'near-budget' && (
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-400 bg-amber-400/10 px-2.5 py-1 rounded-full border border-amber-400/20">
                      ⚠️ Near Budget Limit
                    </span>
                  )}
                  {forecast.riskLevel === 'over-budget' && (
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold text-red-400 bg-red-400/10 px-2.5 py-1 rounded-full border border-red-400/20">
                      🚨 Over Budget Risk
                    </span>
                  )}
                </div>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-2xl p-4 min-w-[150px]">
                <p className="text-xs font-medium text-zinc-400">Projected Savings</p>
                <p className="text-lg font-bold text-white mt-1">
                  {forecast.monthlyIncome > 0 ? formatCurrency(forecast.projectedSavings, currency) : 'Set Income in Settings'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          <StatBox 
            label="Total Spent" 
            value={formatCurrency(total, currency)} 
            icon={TrendingUp} 
            color="bg-emerald-50 text-emerald-600" 
          />
          <StatBox 
            label="Average Expense" 
            value={formatCurrency(avg, currency)} 
            icon={Calendar} 
            color="bg-blue-50 text-blue-600" 
          />
          <StatBox 
            label="Total Transactions" 
            value={totalTransactions} 
            icon={Users} 
            color="bg-purple-50 text-purple-600" 
          />
          <StatBox 
            label="Top Category" 
            value={topCategory} 
            icon={Wallet} 
            color="bg-orange-50 text-orange-600" 
          />
        </div>

        {/* Category Budget Tracker */}
        <div className="bg-white rounded-2xl lg:rounded-[2rem] p-5 lg:p-8 shadow-sm border border-zinc-200/80">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
            <div>
              <h3 className="text-lg lg:text-xl font-bold font-display text-zinc-900">Category Budgets & Thresholds</h3>
              <p className="text-xs lg:text-sm text-zinc-500">Monitor spending against your custom category targets.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.keys(DEFAULT_BUDGETS).map((category) => {
              const spent = categoryData.find((c) => c.name === category)?.value || 0;
              const limit = categoryBudgets[category] || DEFAULT_BUDGETS[category] || 0;
              const { status, percentage, badgeColor } = getBudgetThresholdStatus(spent, limit);
              const isEditing = editingCategory === category;

              return (
                <div key={category} className="rounded-2xl border border-zinc-100 bg-zinc-50/50 p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-sm text-zinc-900">{category}</span>
                    <span className={cn('text-xs px-2 py-0.5 rounded-full font-bold uppercase tracking-wider', badgeColor)}>
                      {status === 'safe' && 'Safe'}
                      {status === 'warning' && 'Near Limit'}
                      {status === 'exceeded' && 'Exceeded'}
                      {status === 'none' && 'No Limit'}
                    </span>
                  </div>

                  <div className="flex items-baseline justify-between text-xs text-zinc-600">
                    <span>Spent: <strong className="text-zinc-900">{formatCurrency(spent, currency)}</strong></span>
                    {isEditing ? (
                      <div className="flex items-center gap-1">
                        <input
                          type="number"
                          value={budgetInput}
                          onChange={(e) => setBudgetInput(e.target.value)}
                          placeholder={String(limit)}
                          className="w-20 rounded border border-zinc-300 bg-white px-1.5 py-0.5 text-xs text-zinc-900 focus:outline-none"
                          autoFocus
                        />
                        <button
                          onClick={() => saveCategoryBudget(category)}
                          className="p-1 rounded text-emerald-600 hover:bg-emerald-50"
                          title="Save budget"
                        >
                          <Check size={14} />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => {
                          setEditingCategory(category);
                          setBudgetInput(String(limit));
                        }}
                        className="inline-flex items-center gap-1 text-zinc-500 hover:text-primary transition-colors"
                        title="Edit budget limit"
                      >
                        Limit: <strong className="text-zinc-800">{formatCurrency(limit, currency)}</strong>
                        <Edit3 size={11} className="ml-0.5" />
                      </button>
                    )}
                  </div>

                  {/* Progress Bar */}
                  <div className="h-2 w-full bg-zinc-200 rounded-full overflow-hidden">
                    <div
                      className={cn(
                        'h-full transition-all duration-300',
                        status === 'safe' && 'bg-emerald-500',
                        status === 'warning' && 'bg-amber-500',
                        status === 'exceeded' && 'bg-red-500',
                        status === 'none' && 'bg-zinc-400'
                      )}
                      style={{ width: `${Math.min(percentage, 100)}%` }}
                    />
                  </div>
                  <p className="text-[11px] text-right font-medium text-zinc-400">{percentage}% of budget used</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Spending Flow Chart */}
          <div className="lg:col-span-2 bg-white rounded-2xl lg:rounded-[2rem] p-5 lg:p-8 shadow-sm border border-zinc-100">
            <div className="flex justify-between items-center mb-6 lg:mb-8">
              <h3 className="text-lg lg:text-xl font-bold font-display">Spending Flow</h3>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 lg:w-3 lg:h-3 rounded-full bg-orange-500"></span>
                <span className="text-xs font-bold text-zinc-500">Expense</span>
              </div>
            </div>
            <div className="h-[280px] lg:h-[350px] w-full">
              {spendingByDay.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={spendingByDay}>
                    <defs>
                      <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#F97316" stopOpacity={0.1}/>
                        <stop offset="95%" stopColor="#F97316" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                    <XAxis 
                      dataKey="day" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fontSize: 12, fill: '#94A3B8', fontWeight: 600 }}
                      dy={10}
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fontSize: 12, fill: '#94A3B8', fontWeight: 600 }}
                    />
                    <Tooltip 
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontWeight: 'bold' }}
                      cursor={{ stroke: '#E2E8F0', strokeWidth: 2 }}
                      formatter={(value) => formatCurrency(value, currency)}
                    />
                    <Area type="monotone" dataKey="expense" stroke="#F97316" strokeWidth={2} fillOpacity={1} fill="url(#colorExpense)" />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p className="text-zinc-400">No expense data available</p>
                </div>
              )}
            </div>
          </div>

          {/* Category Breakdown Pie Chart */}
          <div className="bg-white rounded-2xl lg:rounded-[2rem] p-5 lg:p-8 shadow-sm border border-zinc-100">
            <h3 className="text-lg lg:text-xl font-bold font-display mb-6 lg:mb-8">Category Breakdown</h3>
            {categoryData.length > 0 ? (
              <>
                <div className="h-[220px] lg:h-[250px] w-full mb-6 lg:mb-8">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categoryDataWithColors}
                        innerRadius={50}
                        outerRadius={70}
                        paddingAngle={3}
                        dataKey="value"
                      >
                        {categoryDataWithColors.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontWeight: 'bold' }}
                        formatter={(value) => formatCurrency(value, currency)}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="space-y-3 lg:space-y-4 max-h-[250px] lg:max-h-[300px] overflow-y-auto">
                  {categoryDataWithColors.slice(0, 6).map((cat, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <div className="flex items-center gap-2 lg:gap-3">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: cat.color }}></div>
                        <span className="text-xs lg:text-sm font-medium text-zinc-600">{cat.name}</span>
                      </div>
                      <span className="text-xs lg:text-sm font-bold text-zinc-900">{formatCurrency(cat.value, currency)}</span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-8 lg:py-12">
                <AlertCircle className="mx-auto mb-4 text-zinc-400" size={40} />
                <p className="text-zinc-500 text-sm">No expense data available</p>
              </div>
            )}
          </div>
        </div>

        {/* Monthly Trend Chart */}
        <div className="bg-white rounded-2xl lg:rounded-[2rem] p-5 lg:p-8 shadow-sm border border-zinc-100">
          <h3 className="text-lg lg:text-xl font-bold font-display mb-6 lg:mb-8">Monthly Spending Trend</h3>
          <div className="h-[280px] lg:h-[300px] w-full">
            {monthlySpending.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlySpending}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => formatCurrency(value, currency)} />
                  <Legend />
                  <Bar dataKey="amount" fill="#8B5CF6" radius={[8, 8, 0, 0]}>
                    {monthlySpending.map((_, idx) => (
                      <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-zinc-400">No monthly data available</p>
              </div>
            )}
          </div>
        </div>

        {/* AI Financial Advisor */}
        <AnalyticsAdvisorCard />
      </div>
    </Layout>
  );
}

const StatBox = ({ label, value, icon: Icon, color }) => {
  return (
    <div className="bg-white p-4 lg:p-6 rounded-xl lg:rounded-[2rem] border border-zinc-100 shadow-sm hover:shadow-md transition-all">
      <div className={cn('p-2 lg:p-3 rounded-xl lg:rounded-2xl w-fit mb-3 lg:mb-4', color)}>
        <Icon size={18} className="lg:w-[20px] lg:h-[20px]" />
      </div>
      <p className="text-xs lg:text-sm font-medium text-zinc-500 mb-1">{label}</p>
      <h3 className="text-lg lg:text-2xl font-bold text-zinc-900 font-display break-words">{value}</h3>
    </div>
  );
};

function downloadAnalyticsPdf(report) {
  const currency = report.currency || 'INR';
  const lines = [
    'Spendora Analytics Report',
    `Generated: ${report.generatedAt}`,
    `Currency: ${currency}`,
    '',
    `Total Spent: ${formatCurrency(report.total, currency)}`,
    `Average Expense: ${formatCurrency(report.average, currency)}`,
    `Transactions: ${report.transactions}`,
    `Top Category: ${report.topCategory}`,
    '',
    'Category Breakdown',
    ...report.categoryBreakdown.map(
      (item) => `- ${item.name}: ${formatCurrency(item.value, currency)}`
    ),
    '',
    'Recent Expenses',
    ...report.expenses.slice(0, 15).map((expense) => {
      const date = new Date(expense.date).toLocaleDateString();
      return `- ${date} | ${expense.title} | ${expense.category} | ${formatCurrency(expense.amount, currency)}`;
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

function downloadExpensesCsv(expenses) {
  const csvContent = generateExpensesCsv(expenses);
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const linkElement = document.createElement('a');
  linkElement.href = url;
  linkElement.download = `expenses-export-${new Date().toISOString().slice(0, 10)}.csv`;
  linkElement.click();
  URL.revokeObjectURL(url);
}
