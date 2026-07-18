import { Download } from 'lucide-react'
import { buildSimplePdf } from '../../lib/pdf'
import { formatCurrency } from '../../lib/utils'

const formatDateTime = (value) =>
  value ? new Date(value).toLocaleString('en-IN') : 'Pending'

export function ReceiptDownloadButton({ settlement }) {
  const handleDownload = () => {
    const lines = [
      'Spendora Settlement Receipt',
      `Generated: ${new Date().toLocaleString('en-IN')}`,
      '',
      `Transaction ID: ${settlement.transactionId}`,
      `Amount: ${formatCurrency(settlement.amount)}`,
      `Fee: -${formatCurrency(settlement.fee)}`,
      `Net Amount: ${formatCurrency(settlement.netAmount)}`,
      `Status: ${settlement.status}`,
      `Created At: ${formatDateTime(settlement.createdAt)}`,
      `Settled At: ${formatDateTime(settlement.settledAt)}`,
    ]

    const pdfBytes = buildSimplePdf(lines)
    const blob = new Blob([pdfBytes], { type: 'application/pdf' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `settlement-${settlement.transactionId}.pdf`
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <button
      onClick={handleDownload}
      className="inline-flex items-center justify-center gap-2 rounded-2xl border border-zinc-200 bg-white px-5 py-3 text-sm font-bold text-zinc-800 shadow-sm transition-all hover:bg-zinc-50"
    >
      <Download size={16} />
      Download Receipt
    </button>
  )
}
