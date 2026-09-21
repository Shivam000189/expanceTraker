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
    <div className="relative overflow-hidden rounded-2xl border border-zinc-800/80 bg-zinc-900/80 p-6 shadow-sm backdrop-blur-sm">
      <div className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-white/[0.02] blur-2xl" />

      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.25em] text-zinc-300">
            <CheckCircle2 size={14} />
            Latest Transaction
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-white">Live payment activity</h2>
          <p className="mt-1 text-sm text-zinc-400">
            The newest expense from your store feed refreshes every 10 seconds.
          </p>
        </div>
        <div className="hidden h-12 w-12 items-center justify-center rounded-xl border border-white/10 bg-zinc-800 text-zinc-300 md:flex">
          <CheckCircle2 size={24} />
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={latestExpense?._id || 'empty-state'}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -16 }}
          transition={{ duration: 0.3 }}
          className="rounded-xl border border-zinc-800/80 bg-zinc-950/70 p-5"
        >
          {latestExpense ? (
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Most recent expense</p>
                <h3 className="text-2xl font-bold text-white">{latestExpense.title}</h3>
                <div className="flex flex-wrap items-center gap-3">
                  <span className="rounded-lg border border-white/10 bg-white/5 px-3 py-1 font-mono text-xs font-semibold text-zinc-300">
                    {latestExpense.category || 'Other'}
                  </span>
                  <span className="text-xs text-zinc-400">{relativeTime}</span>
                </div>
              </div>

              <div className="text-left md:text-right">
                <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Amount paid</p>
                <p className="mt-1 font-mono text-3xl font-bold text-white">
                  {formatCurrency(Number(latestExpense.amount || 0))}
                </p>
              </div>
            </div>
          ) : (
            <div className="flex min-h-24 items-center justify-center text-center">
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
