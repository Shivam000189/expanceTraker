import { motion } from "framer-motion";
import {
  AreaChart as RechartsAreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { twMerge } from "tailwind-merge";

const defaultData = [
  { name: "01 Jan", amount: 420 },
  { name: "04 Jan", amount: 680 },
  { name: "08 Jan", amount: 350 },
  { name: "12 Jan", amount: 920 },
  { name: "16 Jan", amount: 560 },
  { name: "20 Jan", amount: 810 },
  { name: "24 Jan", amount: 1100 },
  { name: "28 Jan", amount: 740 },
  { name: "31 Jan", amount: 980 },
];

function CustomTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-xl border border-white/10 bg-[#1C1C1C]/95 p-3 shadow-2xl backdrop-blur-md">
        <p className="text-[11px] font-medium text-gray-400">{label}</p>
        <p className="text-sm font-bold font-mono text-[#10EE74]">
          ₹{Number(payload[0].value).toLocaleString()}
        </p>
      </div>
    );
  }
  return null;
}

export default function AreaChart({
  className = "",
  data = defaultData,
  title = "Expense Analysis",
  subtitle = "Daily Expenses Trend",
  dataKey = "amount",
  xKey = "name",
}) {
  const chartData = data && data.length > 0 ? data : defaultData;

  return (
    <motion.div
      initial={{ opacity: 0, y: 25, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -3 }}
      className={twMerge(
        "relative w-full h-full min-h-[220px] flex flex-col justify-between overflow-hidden rounded-[24px] border border-white/10 bg-[#131313] p-5 text-white shadow-[0_10px_30px_rgba(0,0,0,0.3)]",
        className
      )}
    >
      <div className="mb-3 flex items-start justify-between">
        <div>
          <h3 className="text-sm lg:text-base font-semibold text-white tracking-tight">
            {title}
          </h3>
          <p className="text-[11px] text-gray-400 mt-0.5">{subtitle}</p>
        </div>
        <div className="flex items-center gap-1.5 rounded-full bg-[#0D2E18] border border-[#10EE74]/20 px-2.5 py-0.5">
          <span className="h-1.5 w-1.5 rounded-full bg-[#10EE74] animate-pulse" />
          <span className="text-[10px] font-semibold text-[#10EE74]">Live</span>
        </div>
      </div>

      <div className="w-full flex-1 min-h-[140px] pt-1">
        <ResponsiveContainer width="100%" height="100%">
          <RechartsAreaChart
            data={chartData}
            margin={{ top: 5, right: 10, left: -25, bottom: 0 }}
          >
            <defs>
              <linearGradient id="neonGreenGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10EE74" stopOpacity={0.45} />
                <stop offset="95%" stopColor="#10EE74" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(255, 255, 255, 0.06)"
              vertical={false}
            />
            <XAxis
              dataKey={xKey}
              stroke="#6b7280"
              fontSize={10}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="#6b7280"
              fontSize={10}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => `₹${v}`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey={dataKey}
              stroke="#10EE74"
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#neonGreenGradient)"
              dot={false}
              activeDot={{
                r: 5,
                fill: "#10EE74",
                stroke: "#000000",
                strokeWidth: 2,
              }}
            />
          </RechartsAreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
