import { motion } from "framer-motion";
import { TrendingUp, TrendingDown } from "lucide-react";

export function StatCard({
  title,
  value,
  change,
  trend = "up",
  icon: Icon,
  color = "neutral",
  percentage = null,
  index = 0,
}) {
  const isGreen = color === "emerald" || color === "green";
  const isCoral = color === "danger" || color === "coral" || color === "red";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.05 }}
      whileHover={{ y: -3 }}
      className="relative w-full min-h-[140px] flex flex-col justify-between overflow-hidden rounded-[24px] border border-white/10 bg-[#131313] p-4 lg:p-5 text-white shadow-[0_10px_30px_rgba(0,0,0,0.3)] transition-all hover:border-white/20 group"
    >
      {/* Top row */}
      <div className="flex items-start justify-between w-full">
        <div
          className={`flex h-9 w-9 items-center justify-center rounded-xl transition-colors ${
            isGreen
              ? "bg-[#0D2E18] text-[#10EE74] border border-[#10EE74]/20"
              : isCoral
              ? "bg-[#2C1511] text-[#FF6B57] border border-[#FF6B57]/20"
              : "bg-white/5 text-gray-300 border border-white/10"
          }`}
        >
          {Icon && <Icon className="h-4 w-4 stroke-[2.2]" />}
        </div>

        {percentage !== null ? (
          /* SVG Donut Ring */
          <div className="relative w-11 h-11">
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
                stroke={isGreen ? "#10EE74" : isCoral ? "#FF6E5A" : "#ffffff"}
                strokeWidth="3.5"
                strokeDasharray={`${Math.min(100, Math.max(0, percentage))} 100`}
                strokeLinecap="round"
                className={
                  isGreen
                    ? "drop-shadow-[0_0_6px_rgba(16,238,116,0.65)]"
                    : isCoral
                    ? "drop-shadow-[0_0_6px_rgba(255,110,90,0.65)]"
                    : ""
                }
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-[9px] font-bold font-mono text-white/80">
                {Math.round(percentage)}%
              </span>
            </div>
          </div>
        ) : change ? (
          <div
            className={`flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-mono border ${
              trend === "up"
                ? "bg-[#0D2E18] text-[#10EE74] border-[#10EE74]/20"
                : "bg-[#2C1511] text-[#FF6B57] border-[#FF6B57]/20"
            }`}
          >
            {trend === "up" ? (
              <TrendingUp className="h-3 w-3" />
            ) : (
              <TrendingDown className="h-3 w-3" />
            )}
            <span>{change}</span>
          </div>
        ) : null}
      </div>

      {/* Value & Title */}
      <div className="mt-3">
        <p className="text-xs font-medium text-gray-400 tracking-tight">{title}</p>
        <p className="text-xl lg:text-2xl font-bold tracking-tight text-white font-mono mt-0.5">
          {value}
        </p>
      </div>
    </motion.div>
  );
}

export default StatCard;
