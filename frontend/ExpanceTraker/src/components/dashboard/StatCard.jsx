import { TrendingUp, TrendingDown } from 'lucide-react'
import { motion } from 'framer-motion'
import { cn } from '../../lib/utils'

const colors = {
  // Default to clean monochrome 30% white
  primary: 'border border-white/10 bg-zinc-800 text-zinc-200',
  neutral: 'border border-white/10 bg-zinc-800 text-zinc-200',
  // Specific semantic colors when highlighting the 1 major metric
  emerald: 'border border-emerald-500/20 bg-emerald-500/10 text-emerald-400',
  danger: 'border border-red-500/20 bg-red-500/10 text-red-400',
  warning: 'border border-amber-500/20 bg-amber-500/10 text-amber-400',
  blue: 'border border-white/10 bg-zinc-800 text-zinc-200',
  orange: 'border border-red-500/20 bg-red-500/10 text-red-400',
  purple: 'border border-white/10 bg-zinc-800 text-zinc-200',
}

export function StatCard({ title, value, change, trend, icon: Icon, color = 'neutral', index = 0 }) {
  const iconStyle = colors[color] || colors.neutral

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.06 }}
      whileHover={{ y: -3 }}
      className="rounded-2xl border border-zinc-800 bg-zinc-900/90 p-6 backdrop-blur-sm transition-all duration-300 hover:border-zinc-700 group"
    >
      <div className="flex items-start justify-between mb-4">
        <div className={cn('flex h-11 w-11 items-center justify-center rounded-xl transition-colors', iconStyle)}>
          <Icon size={20} />
        </div>
        {change && (
          <div
            className={cn(
              'flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold',
              trend === 'up'
                ? 'border border-white/10 bg-white/5 text-zinc-300'
                : 'border border-red-500/20 bg-red-500/10 text-red-400'
            )}
          >
            {trend === 'up' ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
            <span className="font-mono text-[11px]">{change}</span>
          </div>
        )}
      </div>
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1">{title}</p>
        <h3 className="font-display text-2xl font-bold tracking-tight text-white">{value}</h3>
      </div>
    </motion.div>
  )
}
