import { groupByDay } from "../utils/analytics";

export default function TopSpendingDays({ expenses }) {
  const days = groupByDay(expenses);
  const max = days[0]?.amount || 1;

  return (
    <div className="bg-white rounded-2xl p-6 border border-violet-100 shadow-sm">
      <h3 className="text-lg font-semibold text-violet-900">
        Top Spending Days
      </h3>

      <div className="mt-6 space-y-4">
        {days.map((d, i) => {
          const pct = (d.amount / max) * 100;

          return (
            <div key={i}>
              <div className="flex justify-between text-sm mb-1">
                <span>{d.date}</span>
                <span className="font-bold text-violet-800">
                  ₹{d.amount}
                </span>
              </div>

              <div className="h-2 bg-violet-100 rounded-full">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-violet-600 to-purple-400"
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}