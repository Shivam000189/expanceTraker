import { useMemo, useState } from 'react'
import { CreditCard, IndianRupee } from 'lucide-react'
import { StatCard } from '../dashboard/StatCard'
import { formatCurrency } from '../../lib/utils'

function isSameLocalDate(firstDate, secondDate) {
  return (
    firstDate.getFullYear() === secondDate.getFullYear() &&
    firstDate.getMonth() === secondDate.getMonth() &&
    firstDate.getDate() === secondDate.getDate()
  )
}

export function EarningsToggle({ expenses = [] }) {
  const [showAmount, setShowAmount] = useState(true)

  const totals = useMemo(() => {
    const today = new Date()
    const yesterday = new Date()
    yesterday.setDate(today.getDate() - 1)

    const todayExpenses = expenses.filter((expense) => isSameLocalDate(new Date(expense.date), today))
    const yesterdayExpenses = expenses.filter((expense) =>
      isSameLocalDate(new Date(expense.date), yesterday)
    )

    const summarize = (items) => ({
      count: items.length,
      amount: items.reduce((sum, item) => sum + Number(item.amount || 0), 0),
    })

    return {
      today: summarize(todayExpenses),
      yesterday: summarize(yesterdayExpenses),
    }
  }, [expenses])

  const displayValue = (value) => (showAmount ? formatCurrency(value.amount) : `${value.count}`)
  const displayChange = (value) =>
    showAmount ? `${value.count} transaction${value.count === 1 ? '' : 's'}` : formatCurrency(value.amount)

  const icon = showAmount ? IndianRupee : CreditCard

  return (
    <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/80 p-6 shadow-sm backdrop-blur-sm">
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-xl font-bold text-white">Daily earnings snapshot</h2>
          <p className="mt-1 text-sm text-zinc-400">
            Switch between rupee totals and transaction counts for the last two days.
          </p>
        </div>

        <label className="inline-flex cursor-pointer items-center gap-3 self-start md:self-center">
          <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
            {showAmount ? 'Showing amount' : 'Showing count'}
          </span>
          <span className="relative">
            <input
              type="checkbox"
              className="peer sr-only"
              checked={showAmount}
              onChange={() => setShowAmount((current) => !current)}
            />
            <span className="block h-7 w-12 rounded-full bg-zinc-800 transition-colors peer-checked:bg-white" />
            <span className="absolute left-1 top-1 h-5 w-5 rounded-full bg-zinc-400 transition-transform peer-checked:translate-x-5 peer-checked:bg-black" />
          </span>
        </label>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <StatCard
          title="Today's Total"
          value={displayValue(totals.today)}
          change={displayChange(totals.today)}
          trend="up"
          icon={icon}
          color="primary"
        />
        <StatCard
          title="Yesterday's Total"
          value={displayValue(totals.yesterday)}
          change={displayChange(totals.yesterday)}
          trend="neutral"
          icon={icon}
          color="neutral"
        />
      </div>
    </div>
  )
}
