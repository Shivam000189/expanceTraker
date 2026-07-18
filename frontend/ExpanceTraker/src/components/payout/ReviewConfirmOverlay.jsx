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
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            className="flex h-[min(92vh,900px)] w-full max-w-6xl flex-col overflow-hidden rounded-[2.5rem] border border-zinc-100 bg-white shadow-2xl"
          >
            <div className="flex items-start justify-between gap-4 border-b border-zinc-100 px-8 py-6">
              <div>
                <h2 className="text-2xl font-bold font-display text-zinc-900">Review & Confirm</h2>
                <p className="mt-2 text-sm text-zinc-500">
                  Double-check valid payouts, inspect any invalid rows, then confirm the batch payment.
                </p>
              </div>
              <button
                onClick={onClose}
                className="rounded-xl p-2 text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-900"
              >
                <X size={22} />
              </button>
            </div>

            <div className="grid gap-4 border-b border-zinc-100 bg-zinc-50 px-8 py-5 md:grid-cols-3">
              <SummaryStat label="Total Vendors" value={String(totalVendors)} />
              <SummaryStat label="Total Amount" value={formatCurrency(totalAmount)} />
              <div className="rounded-[1.5rem] bg-white p-4 shadow-sm">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-400">Invalid Rows</p>
                <div className="mt-2 inline-flex items-center gap-2 rounded-full bg-red-100 px-3 py-1 text-sm font-bold text-red-700">
                  {invalidRows.length}
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-8 py-6">
              <div className="space-y-4">
                {validRows.map((row) => (
                  <div
                    key={`valid-${row.rowNumber}-${row.vendorName}`}
                    className="rounded-[1.5rem] border border-emerald-100 border-l-[6px] border-l-primary bg-white p-5"
                  >
                    <div className="grid gap-3 md:grid-cols-[1.3fr_1fr_1fr_0.8fr]">
                      <Cell label="Vendor" value={row.vendorName} />
                      <Cell label="Account" value={row.accountNumber} />
                      <Cell label="IFSC" value={row.ifscCode} />
                      <Cell label="Amount" value={formatCurrency(Number(row.amount || 0))} />
                    </div>
                  </div>
                ))}

                {invalidRows.map((item) => (
                  <div
                    key={`invalid-${item.row.rowNumber}-${item.row.vendorName || 'row'}`}
                    className="rounded-[1.5rem] border border-red-200 bg-red-50 p-5"
                  >
                    <div className="grid gap-3 md:grid-cols-[1.3fr_1fr_1fr_0.8fr_auto] md:items-center">
                      <Cell label="Vendor" value={item.row.vendorName || 'Missing'} />
                      <Cell label="Account" value={item.row.accountNumber || 'Missing'} />
                      <Cell label="IFSC" value={item.row.ifscCode || 'Missing'} />
                      <Cell
                        label="Amount"
                        value={item.row.amount ? formatCurrency(Number(item.row.amount || 0)) : 'Missing'}
                      />
                      <div className="flex items-center justify-start md:justify-end">
                        <span
                          title={item.errors.join(', ')}
                          className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-2 text-xs font-bold text-red-700 shadow-sm"
                        >
                          <AlertCircle size={14} />
                          Errors
                        </span>
                      </div>
                    </div>
                    <p className="mt-3 text-sm font-medium text-red-700">{item.errors.join(', ')}</p>
                  </div>
                ))}

                {validRows.length === 0 && invalidRows.length === 0 ? (
                  <div className="rounded-[1.5rem] border border-dashed border-zinc-200 p-10 text-center text-sm font-medium text-zinc-500">
                    No payout rows to review yet.
                  </div>
                ) : null}
              </div>
            </div>

            <div className="flex flex-col gap-3 border-t border-zinc-100 px-8 py-6 md:flex-row md:items-center md:justify-between">
              <button
                onClick={onClose}
                className="rounded-2xl border border-zinc-200 bg-white px-5 py-3 text-sm font-bold text-zinc-800 transition-all hover:bg-zinc-50"
              >
                Fix Errors
              </button>

              <button
                onClick={onConfirm}
                disabled={isSubmitting || validRows.length === 0}
                className={cn(
                  'inline-flex items-center justify-center gap-2 rounded-2xl px-6 py-3 text-sm font-bold text-white transition-all',
                  isSubmitting || validRows.length === 0
                    ? 'cursor-not-allowed bg-emerald-300'
                    : 'bg-primary shadow-lg shadow-primary/30 hover:bg-primary-dark'
                )}
              >
                <CheckCircle2 size={18} />
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
    <div className="rounded-[1.5rem] bg-white p-4 shadow-sm">
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-400">{label}</p>
      <p className="mt-2 text-xl font-bold text-zinc-900">{value}</p>
    </div>
  )
}

function Cell({ label, value }) {
  return (
    <div>
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-zinc-400">{label}</p>
      <p className="mt-2 text-sm font-semibold text-zinc-900">{value}</p>
    </div>
  )
}
