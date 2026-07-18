import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { CheckCircle2 } from 'lucide-react'
import API from '../../api'
import { formatCurrency } from '../../lib/utils'

function sortByNewest(expenses = []) {
  return [...expenses].sort((a, b) => new Date(b.date) - new Date(a.date))
}

function formatRelativeTime(value) {
  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return 'Just now'
  }

  const diffMs = date.getTime() - Date.now()
  const diffMinutes = Math.round(diffMs / (1000 * 60))
  const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' })

  if (Math.abs(diffMinutes) < 60) {
    return rtf.format(diffMinutes, 'minute')
  }

  const diffHours = Math.round(diffMinutes / 60)
  if (Math.abs(diffHours) < 24) {
    return rtf.format(diffHours, 'hour')
  }

  const diffDays = Math.round(diffHours / 24)
  return rtf.format(diffDays, 'day')
}

export function LatestTransactionAlert() {
  const [latestExpense, setLatestExpense] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let isMounted = true

    const fetchLatestExpense = async () => {
      try {
        const response = await API.get('/expenses')
        const newestExpense = sortByNewest(response.data || [])[0] || null

        if (isMounted) {
          setLatestExpense((current) => {
            if (!current || current._id !== newestExpense?._id) {
              return newestExpense
            }

            return newestExpense
          })
        }
      } catch (error) {
        console.error('Failed to load latest transaction:', error)
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    fetchLatestExpense()
    const intervalId = setInterval(fetchLatestExpense, 10000)

    return () => {
      isMounted = false
      clearInterval(intervalId)
    }
  }, [])

  const relativeTime = useMemo(() => {
    if (!latestExpense?.date) {
      return ''
    }

    return formatRelativeTime(latestExpense.date)
  }, [latestExpense])

  return (
    <div className="rounded-[2rem] border border-emerald-200 bg-white p-8 shadow-sm">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-primary">
            <CheckCircle2 size={16} />
            Latest Transaction
          </div>
          <h2 className="text-2xl font-bold text-zinc-900">Live payment activity</h2>
          <p className="mt-2 text-sm text-zinc-500">
            The newest expense from your store feed refreshes every 10 seconds.
          </p>
        </div>
        <div className="hidden h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-primary md:flex">
          <CheckCircle2 size={28} />
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={latestExpense?._id || 'empty-state'}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -24 }}
          transition={{ duration: 0.35 }}
          className="rounded-[1.75rem] border border-emerald-100 bg-emerald-50/60 p-6"
        >
          {latestExpense ? (
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="space-y-3">
                <p className="text-sm font-medium text-zinc-500">Most recent expense</p>
                <h3 className="text-3xl font-bold text-zinc-900">{latestExpense.title}</h3>
                <div className="flex flex-wrap items-center gap-3">
                  <span className="rounded-full bg-white px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-emerald-700 shadow-sm">
                    {latestExpense.category || 'Other'}
                  </span>
                  <span className="text-sm font-medium text-zinc-500">{relativeTime}</span>
                </div>
              </div>

              <div className="text-left md:text-right">
                <p className="text-sm font-medium text-zinc-500">Amount paid</p>
                <p className="mt-2 text-4xl font-bold text-emerald-700">
                  {formatCurrency(Number(latestExpense.amount || 0))}
                </p>
              </div>
            </div>
          ) : (
            <div className="flex min-h-28 items-center justify-center text-center">
              <p className="text-sm font-medium text-zinc-500">
                {isLoading ? 'Loading the latest transaction...' : 'No expense activity yet.'}
              </p>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
