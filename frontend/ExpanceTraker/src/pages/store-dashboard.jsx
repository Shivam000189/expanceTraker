import { useEffect, useMemo, useState } from 'react'
import { Store, TrendingUp } from 'lucide-react'
import toast from 'react-hot-toast'
import API from '../api'
import LoadingSpinner from '../components/LoadingSpinner'
import { Layout } from '../components/layout/Layout'
import { EarningsToggle } from '../components/store/EarningsToggle'
import { LatestTransactionAlert } from '../components/store/LatestTransactionAlert'
import { UPIQRGenerator } from '../components/store/UPIQRGenerator'
import { formatCurrency } from '../lib/utils'

function sortByNewest(expenses = []) {
  return [...expenses].sort((a, b) => new Date(b.date) - new Date(a.date))
}

export default function StoreDashboard() {
  const [expenses, setExpenses] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadExpenses = async () => {
      try {
        setLoading(true)
        const response = await API.get('/expenses')
        setExpenses(response.data || [])
      } catch (error) {
        console.error('Failed to load store dashboard:', error)
        toast.error('Failed to load store dashboard')
        setExpenses([])
      } finally {
        setLoading(false)
      }
    }

    loadExpenses()
  }, [])

  const recentTransactions = useMemo(() => sortByNewest(expenses).slice(0, 5), [expenses])
  const todayRevenue = useMemo(() => {
    const today = new Date()

    return expenses
      .filter((expense) => {
        const expenseDate = new Date(expense.date)
        return (
          expenseDate.getFullYear() === today.getFullYear() &&
          expenseDate.getMonth() === today.getMonth() &&
          expenseDate.getDate() === today.getDate()
        )
      })
      .reduce((sum, expense) => sum + Number(expense.amount || 0), 0)
  }, [expenses])

  if (loading) {
    return <LoadingSpinner message="Loading store dashboard..." />
  }

  return (
    <Layout contentClassName="px-4 py-4 sm:px-6 lg:px-8 max-w-7xl w-full mx-auto">
      <div className="flex flex-col gap-4">
        {/* Header Ribbon in Single Frame */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-zinc-800 bg-zinc-900/90 px-4 py-3 shadow-sm backdrop-blur-sm">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-300">
              <Store size={11} />
              Store Dashboard
            </div>
            <h1 className="text-lg font-bold font-display text-white tracking-tight mt-1">In-Store Merchant Activity</h1>
            <p className="text-[11px] text-zinc-400">Live feed, daily earnings snapshot, and instant UPI QR</p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-3 rounded-xl border border-zinc-800/80 bg-zinc-950/80 px-4 py-2">
              <TrendingUp size={16} className="text-emerald-400" />
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">Today Collected</p>
                <p className="font-mono text-xl font-bold text-emerald-400">
                  {formatCurrency(todayRevenue)}
                </p>
              </div>
            </div>
            <UPIQRGenerator />
          </div>
        </div>

        {/* 2-Column Single-Frame Bento Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
          {/* Left Column: Live Alert & Earnings Toggle (6 cols) */}
          <div className="lg:col-span-6 flex flex-col gap-4">
            <LatestTransactionAlert />
            <EarningsToggle expenses={expenses} />
          </div>

          {/* Right Column: Recent Store Activity (6 cols) with internal scroll */}
          <div className="lg:col-span-6 rounded-2xl border border-zinc-800 bg-zinc-900/90 p-5 shadow-sm backdrop-blur-sm flex flex-col">
            <div className="mb-4 flex items-center justify-between gap-4 border-b border-zinc-800/80 pb-3">
              <div>
                <h2 className="text-sm font-bold text-white">Recent store activity</h2>
                <p className="text-[11px] text-zinc-400">Chronological feed of incoming customer purchases</p>
              </div>
              <span className="rounded-full border border-white/10 bg-zinc-800 px-3 py-1 font-mono text-xs font-semibold text-zinc-400">
                {recentTransactions.length} entries
              </span>
            </div>

            <div className="space-y-2.5 max-h-[calc(100vh-250px)] overflow-y-auto pr-1">
              {recentTransactions.length > 0 ? (
                recentTransactions.map((transaction) => (
                  <div
                    key={transaction._id}
                    className="flex flex-col gap-2 rounded-xl border border-zinc-800/80 bg-zinc-950/70 p-3.5 transition-colors hover:border-zinc-700 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-white truncate">{transaction.title}</p>
                      <p className="mt-0.5 text-[11px] text-zinc-400 font-mono">
                        {new Date(transaction.date).toLocaleString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          hour: 'numeric',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>

                    <div className="flex items-center gap-2.5 shrink-0">
                      <span className="rounded-lg border border-white/10 bg-zinc-900 px-2.5 py-1 font-mono text-[11px] font-semibold text-zinc-300">
                        {transaction.category || 'Other'}
                      </span>
                      <span className="font-mono text-sm font-bold text-white">
                        {formatCurrency(Number(transaction.amount || 0))}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="rounded-xl border border-dashed border-zinc-800 p-8 text-center text-xs font-medium text-zinc-500">
                  No store expenses found yet.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
