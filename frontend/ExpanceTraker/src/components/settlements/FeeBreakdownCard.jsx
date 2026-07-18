import { formatCurrency } from '../../lib/utils'

export function FeeBreakdownCard({ amount = 0, fee = 0, netAmount = 0 }) {
  return (
    <div className="rounded-[2.5rem] bg-zinc-900 p-8 text-white shadow-2xl">
      <div className="mb-8">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-zinc-400">Fee Breakdown</p>
        <h2 className="mt-3 text-3xl font-bold">Settlement summary</h2>
      </div>

      <div className="space-y-5">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <span className="text-sm font-medium text-zinc-400">Gross amount</span>
          <span className="text-lg font-bold">{formatCurrency(amount)}</span>
        </div>
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <span className="text-sm font-medium text-zinc-400">Processing fee</span>
          <span className="text-lg font-bold text-red-300">-{formatCurrency(fee)}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium uppercase tracking-[0.2em] text-zinc-400">Net amount</span>
          <span className="text-3xl font-bold text-emerald-400">{formatCurrency(netAmount)}</span>
        </div>
      </div>
    </div>
  )
}
