export const CATEGORY_CONFIG = {
  Food: { color: "#7C3AED", light: "#EDE9FE", icon: "🍔" },
  Transport: { color: "#A855F7", light: "#F3E8FF", icon: "🚗" },
  Shopping: { color: "#6D28D9", light: "#EDE9FE", icon: "🛍️" },
  Entertainment: { color: "#9333EA", light: "#FAE8FF", icon: "🎬" },
  Health: { color: "#7E22CE", light: "#F5F3FF", icon: "💊" },
  Bills: { color: "#5B21B6", light: "#EDE9FE", icon: "📄" },
  Other: { color: "#8B5CF6", light: "#F5F3FF", icon: "📦" },
};

export const getCategory = (name) =>
  CATEGORY_CONFIG[name] ?? CATEGORY_CONFIG["Other"];

export function groupByCategory(expenses) {
  const map = {};
  expenses.forEach((e) => {
    const cat = e.category || "Other";
    map[cat] = (map[cat] || 0) + Number(e.amount);
  });
  return Object.entries(map)
    .map(([name, amount]) => ({ name, amount }))
    .sort((a, b) => b.amount - a.amount);
}

export function groupByDay(expenses) {
  const map = {};
  expenses.forEach((e) => {
    const day = e.date ? e.date.slice(0, 10) : "Unknown";
    map[day] = (map[day] || 0) + Number(e.amount);
  });
  return Object.entries(map)
    .map(([date, amount]) => ({ date, amount }))
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 5);
}

export function calculateRunRateForecast(expenses = [], monthlyIncome = 0, referenceDate = new Date()) {
  const targetYear = referenceDate.getFullYear();
  const targetMonth = referenceDate.getMonth();
  const daysElapsed = referenceDate.getDate();
  const daysInMonth = new Date(targetYear, targetMonth + 1, 0).getDate();

  const currentMonthExpenses = expenses.filter((e) => {
    if (!e.date) return false;
    const d = new Date(e.date);
    return d.getFullYear() === targetYear && d.getMonth() === targetMonth;
  });

  const spentSoFar = currentMonthExpenses.reduce((sum, e) => sum + Number(e.amount || 0), 0);
  const dailyRunRate = daysElapsed > 0 ? spentSoFar / daysElapsed : 0;
  const projectedMonthEnd = Math.round(dailyRunRate * daysInMonth);

  let riskLevel = 'on-track';
  const income = Number(monthlyIncome) || 0;

  if (income > 0) {
    if (projectedMonthEnd > income) {
      riskLevel = 'over-budget';
    } else if (projectedMonthEnd > income * 0.85) {
      riskLevel = 'near-budget';
    }
  }

  return {
    spentSoFar,
    daysElapsed,
    daysInMonth,
    dailyRunRate: Math.round(dailyRunRate),
    projectedMonthEnd,
    monthlyIncome: income,
    projectedSavings: Math.max(0, income - projectedMonthEnd),
    riskLevel,
  };
}

export function getBudgetThresholdStatus(spent = 0, limit = 0) {
  const numericLimit = Number(limit) || 0;
  const numericSpent = Number(spent) || 0;

  if (numericLimit <= 0) {
    return { status: 'none', percentage: 0, badgeColor: 'bg-zinc-100 text-zinc-600' };
  }

  const percentage = Math.round((numericSpent / numericLimit) * 100);

  if (percentage >= 100) {
    return { status: 'exceeded', percentage, badgeColor: 'bg-red-100 text-red-700' };
  }
  if (percentage >= 75) {
    return { status: 'warning', percentage, badgeColor: 'bg-amber-100 text-amber-700' };
  }
  return { status: 'safe', percentage, badgeColor: 'border border-white/10 bg-white/5 text-zinc-300' };
}

export function generateExpensesCsv(expenses = []) {
  const headers = ['Date', 'Title', 'Category', 'Amount'];
  const rows = expenses.map((e) => {
    const date = e.date ? new Date(e.date).toISOString().slice(0, 10) : '';
    const title = `"${String(e.title || '').replace(/"/g, '""')}"`;
    const category = `"${String(e.category || 'Other').replace(/"/g, '""')}"`;
    const amount = Number(e.amount || 0);
    return [date, title, category, amount].join(',');
  });

  return [headers.join(','), ...rows].join('\n');
}