import { CheckCircle2, Download } from 'lucide-react'
import { buildSimplePdf } from '../../lib/pdf'
import { formatCurrency } from '../../lib/utils'

export function PayoutSuccessScreen({ vendorCount = 0, totalAmount = 0 }) {
  const handleDownloadReceipt = () => {
    const lines = [
      'Spendora Bulk Payout Receipt',
      `Generated: ${new Date().toLocaleString('en-IN')}`,
      '',
      `Vendors Paid: ${vendorCount}`,
      `Total Paid: ${formatCurrency(totalAmount)}`,
      'Status: Completed',
    ]

    const pdfBytes = buildSimplePdf(lines)
    const blob = new Blob([pdfBytes], { type: 'application/pdf' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `bulk-payout-${new Date().toISOString().slice(0, 10)}.pdf`
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/80 p-8 text-center shadow-sm backdrop-blur-sm">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-zinc-800 text-white">
        <CheckCircle2 size={36} />
      </div>
      <h2 className="mt-5 text-2xl font-bold tracking-tight text-white">Bulk payout completed</h2>
      <p className="mt-1 text-sm text-zinc-400">Your vendor payment batch has been processed successfully.</p>

      <div className="mx-auto mt-6 grid max-w-lg gap-4 md:grid-cols-2">
        <SuccessStat label="Total Paid" value={formatCurrency(totalAmount)} isEmerald />
        <SuccessStat label="Vendors Paid" value={String(vendorCount)} />
      </div>

      <button
        onClick={handleDownloadReceipt}
        className="mt-6 inline-flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-black shadow-sm transition-all hover:bg-zinc-200 active:scale-95"
      >
        <Download size={16} />
        Download Receipt
      </button>
    </div>
  )
}

function SuccessStat({ label, value, isEmerald = false }) {
  return (
    <div className="rounded-xl border border-zinc-800/80 bg-zinc-950/60 p-4">
      <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400">{label}</p>
      <p className={`mt-1 font-mono text-xl font-bold ${isEmerald ? 'text-emerald-400' : 'text-white'}`}>{value}</p>
    </div>
  )
}
