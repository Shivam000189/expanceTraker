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
  AlertCircle
} from 'lucide-react';
import { formatCurrency, cn } from "../lib/utils";

export default function Analytics() {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await API.get("/expenses", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setExpenses(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Calculate analytics data
  const total = expenses.reduce((a, e) => a + Number(e.amount), 0);
  const avg = expenses.length ? total / expenses.length : 0;
  
  // Group by category for pie chart
  const categoryData = expenses.reduce((acc, exp) => {
    const cat = exp.category || "Other";
    const existing = acc.find((c) => c.name === cat);
    if (existing) {
      existing.value += Number(exp.amount);
    } else {
      acc.push({ name: cat, value: Number(exp.amount) });
    }
    return acc;
  }, []).sort((a, b) => b.value - a.value);

  // Colors for categories
  const COLORS = ['#10B981', '#F97316', '#8B5CF6', '#EC4899', '#06B6D4', '#F59E0B', '#6366F1', '#14B8A6'];
  
  // Fix category colors
  const categoryDataWithColors = categoryData.map((item, index) => ({
    ...item,
    color: COLORS[index % COLORS.length]
  }));

  // Group by date for spending flow
  const spendingByDay = expenses.reduce((acc, exp) => {
    const date = new Date(exp.date).toLocaleDateString('en-US', { weekday: 'short' });
    const existing = acc.find((d) => d.day === date);
    if (existing) {
      existing.expense += Number(exp.amount);
    } else {
      acc.push({ day: date, expense: Number(exp.amount) });
    }
    return acc;
  }, []).slice(0, 7);

  // Monthly spending data
  const monthlySpending = expenses.reduce((acc, exp) => {
    const month = new Date(exp.date).toLocaleDateString('en-US', { month: 'short' });
    const existing = acc.find((m) => m.month === month);
    if (existing) {
      existing.amount += Number(exp.amount);
    } else {
      acc.push({ month, amount: Number(exp.amount) });
    }
    return acc;
  }, []).slice(0, 6);

  const topCategory = categoryData[0]?.name || "-";
  const totalTransactions = expenses.length;

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
      <Layout>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-zinc-500">Loading analytics...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6 lg:space-y-8">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold font-display text-zinc-900">Spending Insights</h1>
            <p className="text-zinc-500 text-sm lg:text-base mt-1">Detailed analysis of your financial behavior.</p>
          </div>
          <button 
            onClick={handleExportReport}
            className="bg-white border border-zinc-200 px-4 lg:px-6 py-2 lg:py-3 rounded-xl lg:rounded-2xl flex items-center gap-2 hover:bg-zinc-50 transition-all font-bold text-sm shadow-sm w-fit"
          >
            <Download size={16} className="lg:w-[18px] lg:h-[18px]" />
            Export Report
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          <StatBox 
            label="Total Spent" 
            value={formatCurrency(total)} 
            icon={TrendingUp} 
            color="bg-emerald-50 text-emerald-600" 
          />
          <StatBox 
            label="Average Expense" 
            value={formatCurrency(avg)} 
            icon={Calendar} 
            color="bg-blue-50 text-blue-600" 
          />
          <StatBox 
            label="Transactions" 
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

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Spending Flow Chart */}
          <div className="lg:col-span-2 bg-white rounded-2xl lg:rounded-[2rem] p-5 lg:p-8 shadow-sm border border-zinc-100">
            <div className="flex justify-between items-center mb-6 lg:mb-8">
              <h3 className="text-lg lg:text-xl font-bold font-display">Spending Flow</h3>
              <div className="flex gap-2">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 lg:w-3 lg:h-3 rounded-full bg-orange-500"></span>
                  <span className="text-xs font-bold text-zinc-500">Expense</span>
                </div>
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
                      contentStyle={{ borderRadius: '12px lg:16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontWeight: 'bold' }}
                      cursor={{ stroke: '#E2E8F0', strokeWidth: 2 }}
                      formatter={(value) => formatCurrency(value)}
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
                        contentStyle={{ borderRadius: '12px lg:16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontWeight: 'bold' }}
                        formatter={(value) => formatCurrency(value)}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="space-y-3 lg:space-y-4 max-h-[250px] lg:max-h-[300px] overflow-y-auto">
                  {categoryDataWithColors.slice(0, 6).map((cat, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <div className="flex items-center gap-2 lg:gap-3">
                        <div className="w-1.5 h-1.5 lg:w-2 lg:h-2 rounded-full" style={{ backgroundColor: cat.color }}></div>
                        <span className="text-xs lg:text-sm font-medium text-zinc-600">{cat.name}</span>
                      </div>
                      <span className="text-xs lg:text-sm font-bold text-zinc-900">{formatCurrency(cat.value)}</span>
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
                  <Tooltip formatter={(value) => formatCurrency(value)} />
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

        {/* AI Smart Forecast */}
        <div className="bg-zinc-900 rounded-2xl lg:rounded-[2.5rem] p-6 lg:p-10 shadow-2xl relative overflow-hidden text-white">
          <div className="absolute top-0 right-0 p-6 lg:p-10 opacity-10">
            <TrendingUp size={120} className="lg:w-[180px] lg:h-[180px]" />
          </div>
          <div className="relative z-10 max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-white/10 px-3 lg:px-4 py-1 rounded-full text-xs font-bold tracking-widest uppercase mb-4 lg:mb-6 border border-white/10">
              <Sparkles size={12} className="lg:w-[14px] lg:h-[14px] text-emerald-500" />
              AI Smart Forecast
            </div>
            <h2 className="text-xl lg:text-3xl font-display font-bold mb-3 lg:mb-4">
              {total > 0 
                ? `You're projected to save ₹${Math.max(0, Math.floor(avg * 0.3)).toLocaleString()} this month.`
                : "Start adding expenses to get AI insights"}
            </h2>
            <p className="text-zinc-400 text-sm lg:text-base leading-relaxed mb-6 lg:mb-8">
              {total > 0
                ? `Based on your spending habits across ${categoryData.length} categories, you're on track for better financial management. Try reducing spending in "${topCategory.toLowerCase()}" to save more.`
                : "Add your first expense to receive personalized AI-powered insights and forecasts."}
            </p>
            <button className="flex items-center gap-2 font-bold text-emerald-500 hover:gap-3 lg:hover:gap-4 transition-all text-sm lg:text-base">
              View Detailed Plan <ArrowRight size={16} className="lg:w-[20px] lg:h-[20px]" />
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}

// Stat Box Component
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

function buildSimplePdf(lines) {
  const pageWidth = 595;
  const pageHeight = 842;
  const left = 50;
  const top = 790;
  const lineHeight = 18;
  const maxLinesPerPage = 40;
  const pages = [];

  for (let index = 0; index < lines.length; index += maxLinesPerPage) {
    pages.push(lines.slice(index, index + maxLinesPerPage));
  }

  let pdf = '%PDF-1.4\n';
  const offsets = [];
  let objectIndex = 1;

  const addObject = (content) => {
    offsets[objectIndex] = pdf.length;
    pdf += `${objectIndex} 0 obj\n${content}\nendobj\n`;
    objectIndex += 1;
    return objectIndex - 1;
  };

  const fontObject = addObject('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>');
  const pageObjectIds = [];

  pages.forEach((pageLines) => {
    const textCommands = pageLines
      .map((line, lineIndex) => {
        const safeLine = escapePdfText(line);
        const y = top - lineIndex * lineHeight;
        return `BT /F1 12 Tf 1 0 0 1 ${left} ${y} Tm (${safeLine}) Tj ET`;
      })
      .join('\n');

    const streamObject = addObject(
      `<< /Length ${textCommands.length} >>\nstream\n${textCommands}\nendstream`
    );

    const pageObject = addObject(
      `<< /Type /Page /Parent PAGES_REF /MediaBox [0 0 ${pageWidth} ${pageHeight}] /Contents ${streamObject} 0 R /Resources << /Font << /F1 ${fontObject} 0 R >> >> >>`
    );

    pageObjectIds.push(pageObject);
  });

  const pagesObjectId = addObject(
    `<< /Type /Pages /Count ${pageObjectIds.length} /Kids [${pageObjectIds.map((id) => `${id} 0 R`).join(' ')}] >>`
  );

  pdf = pdf.replaceAll('PAGES_REF', `${pagesObjectId} 0 R`);

  const catalogObjectId = addObject(`<< /Type /Catalog /Pages ${pagesObjectId} 0 R >>`);
  const xrefOffset = pdf.length;

  pdf += `xref\n0 ${objectIndex}\n`;
  pdf += '0000000000 65535 f \n';

  for (let i = 1; i < objectIndex; i += 1) {
    pdf += `${String(offsets[i]).padStart(10, '0')} 00000 n \n`;
  }

  pdf += `trailer\n<< /Size ${objectIndex} /Root ${catalogObjectId} 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;

  return new TextEncoder().encode(pdf);
}

function escapePdfText(value) {
  return String(value)
    .replace(/\\/g, '\\\\')
    .replace(/\(/g, '\\(')
    .replace(/\)/g, '\\)');
}
