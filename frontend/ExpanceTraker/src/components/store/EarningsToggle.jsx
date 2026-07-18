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
    <div className="rounded-[2rem] border border-zinc-100 bg-white p-8 shadow-sm">
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-xl font-bold text-zinc-900">Daily earnings snapshot</h2>
          <p className="mt-2 text-sm text-zinc-500">
            Switch between rupee totals and transaction counts for the last two days.
          </p>
        </div>

        <label className="inline-flex items-center gap-3 self-start md:self-center">
          <span className="text-sm font-semibold text-zinc-600">
            {showAmount ? 'Showing amount' : 'Showing count'}
          </span>
          <span className="relative">
            <input
              type="checkbox"
              className="peer sr-only"
              checked={showAmount}
              onChange={() => setShowAmount((current) => !current)}
            />
            <span className="block h-8 w-14 rounded-full bg-zinc-200 transition-colors peer-checked:bg-primary" />
            <span className="absolute left-1 top-1 h-6 w-6 rounded-full bg-white shadow-sm transition-transform peer-checked:translate-x-6" />
          </span>
        </label>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
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
          trend="up"
          icon={icon}
          color="blue"
        />
      </div>
    </div>
  )
}
