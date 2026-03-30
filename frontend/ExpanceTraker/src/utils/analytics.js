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