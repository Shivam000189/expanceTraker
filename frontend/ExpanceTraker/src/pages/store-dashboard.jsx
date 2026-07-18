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
    <Layout>
      <div className="space-y-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-primary">
              <Store size={14} />
              Store Dashboard
            </div>
            <h1 className="text-3xl font-bold text-zinc-900">In-store payments at a glance</h1>
            <p className="mt-2 max-w-2xl text-sm text-zinc-500">
              Watch the latest transaction, compare today against yesterday, and generate a fresh UPI QR on demand.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <div className="rounded-[1.5rem] border border-emerald-100 bg-white px-5 py-4 shadow-sm">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-400">Today Collected</p>
              <div className="mt-2 flex items-center gap-2 text-zinc-900">
                <TrendingUp size={18} className="text-primary" />
                <span className="text-2xl font-bold">{formatCurrency(todayRevenue)}</span>
              </div>
            </div>
            <UPIQRGenerator />
          </div>
        </div>

        <LatestTransactionAlert />

        <EarningsToggle expenses={expenses} />

        <div className="rounded-[2rem] border border-zinc-100 bg-white p-8 shadow-sm">
          <div className="mb-6 flex items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-zinc-900">Recent store activity</h2>
              <p className="mt-2 text-sm text-zinc-500">A quick view of your five most recent expense entries.</p>
            </div>
            <span className="rounded-full bg-zinc-100 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-zinc-500">
              {recentTransactions.length} entries
            </span>
          </div>

          <div className="space-y-4">
            {recentTransactions.length > 0 ? (
              recentTransactions.map((transaction) => (
                <div
                  key={transaction._id}
                  className="flex flex-col gap-3 rounded-[1.5rem] border border-zinc-100 bg-zinc-50/70 p-5 md:flex-row md:items-center md:justify-between"
                >
                  <div>
                    <p className="text-lg font-bold text-zinc-900">{transaction.title}</p>
                    <p className="mt-1 text-sm text-zinc-500">
                      {new Date(transaction.date).toLocaleString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                        hour: 'numeric',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="rounded-full bg-emerald-100 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-emerald-700">
                      {transaction.category || 'Other'}
                    </span>
                    <span className="text-xl font-bold text-zinc-900">
                      {formatCurrency(Number(transaction.amount || 0))}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="rounded-[1.5rem] border border-dashed border-zinc-200 p-10 text-center text-sm font-medium text-zinc-500">
                No store expenses found yet.
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  )
}
