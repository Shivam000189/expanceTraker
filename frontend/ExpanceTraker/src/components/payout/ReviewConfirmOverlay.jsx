import { AlertCircle, CheckCircle2, X } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import { cn, formatCurrency } from '../../lib/utils'

export function ReviewConfirmOverlay({
  isOpen,
  validRows,
  invalidRows,
  isSubmitting,
  onClose,
  onConfirm,
}) {
  const totalAmount = validRows.reduce((sum, row) => sum + Number(row.amount || 0), 0)
  const totalVendors = validRows.length + invalidRows.length

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            className="flex h-[min(90vh,850px)] w-full max-w-5xl flex-col overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950 shadow-2xl"
          >
            <div className="flex items-start justify-between gap-4 border-b border-zinc-800 px-6 py-5">
              <div>
                <h2 className="text-xl font-bold tracking-tight text-white">Review & Confirm</h2>
                <p className="mt-0.5 text-xs text-zinc-400">
                  Double-check valid payouts, inspect any invalid rows, then confirm the batch payment.
                </p>
              </div>
              <button
                onClick={onClose}
                className="rounded-lg p-2 text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>

            <div className="grid gap-3 border-b border-zinc-800 bg-zinc-900/40 px-6 py-4 md:grid-cols-3">
              <SummaryStat label="Total Vendors" value={String(totalVendors)} />
              <SummaryStat label="Total Amount" value={formatCurrency(totalAmount)} />
              <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/80 p-3.5">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">Invalid Rows</p>
                <div className="mt-1 inline-flex items-center gap-1.5 rounded-lg border border-red-500/20 bg-red-500/10 px-2.5 py-0.5 font-mono text-sm font-bold text-red-400">
                  {invalidRows.length}
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-5">
              <div className="space-y-3">
                {validRows.map((row) => (
                  <div
                    key={`valid-${row.rowNumber}-${row.vendorName}`}
                    className="rounded-xl border border-zinc-800/80 border-l-4 border-l-white/60 bg-zinc-900/70 p-4"
                  >
                    <div className="grid gap-3 md:grid-cols-[1.3fr_1fr_1fr_0.8fr]">
                      <Cell label="Vendor" value={row.vendorName} />
                      <Cell label="Account" value={row.accountNumber} isMono />
                      <Cell label="IFSC" value={row.ifscCode} isMono />
                      <Cell label="Amount" value={formatCurrency(Number(row.amount || 0))} isMono />
                    </div>
                  </div>
                ))}

                {invalidRows.map((item) => (
                  <div
                    key={`invalid-${item.row.rowNumber}-${item.row.vendorName || 'row'}`}
                    className="rounded-xl border border-red-500/30 border-l-4 border-l-red-500 bg-red-500/5 p-4"
                  >
                    <div className="grid gap-3 md:grid-cols-[1.3fr_1fr_1fr_0.8fr_auto] md:items-center">
                      <Cell label="Vendor" value={item.row.vendorName || 'Missing'} />
                      <Cell label="Account" value={item.row.accountNumber || 'Missing'} isMono />
                      <Cell label="IFSC" value={item.row.ifscCode || 'Missing'} isMono />
                      <Cell
                        label="Amount"
                        value={item.row.amount ? formatCurrency(Number(item.row.amount || 0)) : 'Missing'}
                        isMono
                      />
                      <div className="flex items-center justify-start md:justify-end">
                        <span
                          title={item.errors.join(', ')}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-red-500/30 bg-red-500/10 px-2.5 py-1 text-xs font-semibold text-red-400"
                        >
                          <AlertCircle size={13} />
                          Errors
                        </span>
                      </div>
                    </div>
                    <p className="mt-2 text-xs text-red-400">{item.errors.join(', ')}</p>
                  </div>
                ))}

                {validRows.length === 0 && invalidRows.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-zinc-800 p-8 text-center text-sm font-medium text-zinc-500">
                    No payout rows to review yet.
                  </div>
                ) : null}
              </div>
            </div>

            <div className="flex flex-col gap-3 border-t border-zinc-800 px-6 py-4 md:flex-row md:items-center md:justify-between">
              <button
                onClick={onClose}
                className="rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-2.5 text-sm font-semibold text-zinc-300 transition-all hover:bg-zinc-800 hover:text-white"
              >
                Fix Errors
              </button>

              <button
                onClick={onConfirm}
                disabled={isSubmitting || validRows.length === 0}
                className={cn(
                  'inline-flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition-all',
                  isSubmitting || validRows.length === 0
                    ? 'cursor-not-allowed bg-zinc-800 text-zinc-500'
                    : 'bg-white text-black shadow-sm hover:bg-zinc-200 active:scale-95'
                )}
              >
                <CheckCircle2 size={16} />
                {isSubmitting ? 'Processing...' : 'Confirm & Pay'}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function SummaryStat({ label, value }) {
  return (
    <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/80 p-3.5">
      <p className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">{label}</p>
      <p className="mt-1 font-mono text-xl font-bold text-white">{value}</p>
    </div>
  )
}

function Cell({ label, value, isMono = false, isEmerald = false }) {
  return (
    <div>
      <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400">{label}</p>
      <p className={cn('mt-0.5 text-sm font-semibold', isMono && 'font-mono', isEmerald ? 'text-emerald-400' : 'text-white')}>
        {value}
      </p>
    </div>
  )
}
