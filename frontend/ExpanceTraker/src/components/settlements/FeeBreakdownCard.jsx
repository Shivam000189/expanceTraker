import { formatCurrency } from '../../lib/utils'

export function FeeBreakdownCard({ amount = 0, fee = 0, netAmount = 0 }) {
  return (
    <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/80 p-6 text-white shadow-sm backdrop-blur-sm">
      <div className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-400">Fee Breakdown</p>
        <h2 className="mt-1 text-2xl font-bold tracking-tight">Settlement summary</h2>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
          <span className="text-sm text-zinc-400">Gross amount</span>
          <span className="font-mono text-base font-semibold text-white">{formatCurrency(amount)}</span>
        </div>
        <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
          <span className="text-sm text-zinc-400">Processing fee</span>
          <span className="font-mono text-base font-semibold text-red-400">-{formatCurrency(fee)}</span>
        </div>
        <div className="flex items-center justify-between pt-1">
          <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Net amount</span>
          <span className="font-mono text-2xl font-bold text-emerald-400">{formatCurrency(netAmount)}</span>
        </div>
      </div>
    </div>
  )
}
