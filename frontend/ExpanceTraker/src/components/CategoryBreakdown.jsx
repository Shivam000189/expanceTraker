import DonutChart from "./DonutChart";
import { groupByCategory, getCategory } from "../utils/analytics";

export default function CategoryBreakdown({ expenses }) {
  const categories = groupByCategory(expenses);
  const total = categories.reduce((s, c) => s + c.amount, 0);

  return (
    <div className="bg-white rounded-2xl p-4 sm:p-6 border border-violet-100 shadow-sm overflow-hidden">
      <h3 className="text-lg font-semibold text-violet-900">
        Spending by Category
      </h3>
      <p className="text-sm text-gray-400 mb-6">
        Where your money is going
      </p>

      <div className="flex flex-col gap-6 lg:flex-row lg:gap-8 lg:items-center">
        {categories.length ? (
          <DonutChart data={categories} total={total} />
        ) : (
          <div className="mx-auto w-[200px] h-[200px] flex items-center justify-center text-gray-400 lg:mx-0">
            No data
          </div>
        )}

        <div className="flex-1 min-w-0">
          {categories.map((cat, i) => {
            const pct = ((cat.amount / total) * 100).toFixed(1);
            const cfg = getCategory(cat.name);

            return (
              <div key={i} className="mb-4">
                <div className="flex flex-col gap-1 text-sm mb-1 sm:flex-row sm:justify-between">
                  <span className="break-words">{cfg.icon} {cat.name}</span>
                  <span className="font-bold text-violet-800">
                    ₹{cat.amount.toLocaleString()} ({pct}%)
                  </span>
                </div>

                <div className="h-2 bg-violet-100 rounded-full">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${pct}%`,
                      background: cfg.color,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
