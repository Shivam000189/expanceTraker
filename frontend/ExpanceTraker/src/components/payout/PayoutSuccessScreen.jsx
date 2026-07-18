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
    <div className="rounded-[2.5rem] border border-emerald-100 bg-white p-10 text-center shadow-sm">
      <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-emerald-50 text-primary">
        <CheckCircle2 size={64} />
      </div>
      <h2 className="mt-6 text-3xl font-bold font-display text-zinc-900">Bulk payout completed</h2>
      <p className="mt-3 text-sm text-zinc-500">Your vendor payment batch has been processed successfully.</p>

      <div className="mx-auto mt-8 grid max-w-2xl gap-4 md:grid-cols-2">
        <SuccessStat label="Total Paid" value={formatCurrency(totalAmount)} />
        <SuccessStat label="Vendors Paid" value={String(vendorCount)} />
      </div>

      <button
        onClick={handleDownloadReceipt}
        className="mt-8 inline-flex items-center justify-center gap-2 rounded-2xl bg-zinc-900 px-6 py-4 text-sm font-bold text-white transition-all hover:bg-zinc-800"
      >
        <Download size={18} />
        Download Receipt
      </button>
    </div>
  )
}

function SuccessStat({ label, value }) {
  return (
    <div className="rounded-[1.75rem] bg-zinc-50 p-6">
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-400">{label}</p>
      <p className="mt-3 text-2xl font-bold text-zinc-900">{value}</p>
    </div>
  )
}
