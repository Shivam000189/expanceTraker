import { TrendingUp, TrendingDown } from 'lucide-react'
import { cn } from '../../lib/utils'

const colors = {
  primary: 'bg-emerald-50 text-emerald-600',
  blue: 'bg-blue-50 text-blue-600',
  orange: 'bg-orange-50 text-orange-600',
  purple: 'bg-purple-50 text-purple-600',
}

export function StatCard({ title, value, change, trend, icon: Icon, color }) {
  return (
    <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-zinc-100 group transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      <div className="flex justify-between items-start mb-4">
        <div className={cn('p-3 rounded-2xl transition-colors', colors[color])}>
          <Icon size={24} />
        </div>
        <div className={cn(
          'flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full',
          trend === 'up' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
        )}>
          {trend === 'up' ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
          {change}
        </div>
      </div>
      <div>
        <p className="text-zinc-500 font-medium text-sm mb-1">{title}</p>
        <h3 className="text-2xl font-bold text-zinc-900 font-display">{value}</h3>
      </div>
    </div>
  )
}
