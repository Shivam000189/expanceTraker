import { motion } from "framer-motion";

export default function GlassCard({
  className = "",
  title = "Expance",
  status = "Active",
  cardNumber = "7812 2139 0823 XXXX",
  expiry = "08/32",
  balance = "$500",
  cardHolder = "John Doe",
  onClick,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 25, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1],
      }}
      whileHover={{
        y: -5,
        scale: 1.01,
      }}
      onClick={onClick}
      className={`
        relative
        w-full
        min-h-[220px]
        flex
        flex-col
        justify-between
        overflow-hidden
        rounded-[28px]
        border border-white/20
        bg-white/[0.10]
        p-6
        lg:p-7
        text-white
        shadow-[0_25px_80px_rgba(0,0,0,0.35)]
        backdrop-blur-[30px]
        backdrop-saturate-150
        ${className}
      `}
    >
      {/* Background glow neon green */}
      <div
        className="
          pointer-events-none
          absolute
          -left-20
          -top-20
          h-64
          w-64
          rounded-full
          bg-[#10EE74]/25
          blur-[80px]
        "
      />

      {/* Background glow purple */}
      <div
        className="
          pointer-events-none
          absolute
          -bottom-24
          -right-20
          h-60
          w-60
          rounded-full
          bg-purple-500/20
          blur-[90px]
        "
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col justify-between h-full">
        {/* Header */}
        <div className="flex items-center justify-between">
          <p className="text-[24px] lg:text-[28px] font-semibold text-white/95 tracking-tight font-display">
            {title}
          </p>
          <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs text-white/80 font-medium">
            {status}
          </span>
        </div>

        {/* Card Number & Info */}
        <div className="mt-6">
          <p className="text-[20px] lg:text-[22px] font-mono tracking-wider text-white/90">
            {cardNumber}
          </p>

          <div className="mt-2 flex items-center justify-between text-[14px] text-white/60">
            <span>
              {expiry} &middot; <span className="font-semibold text-white font-mono">{balance}</span>
            </span>
            <span className="text-xs uppercase tracking-wider text-white/50 font-medium">
              {cardHolder}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
