import { useMemo, useState } from 'react'
import { Building2, Wallet } from 'lucide-react'
import toast from 'react-hot-toast'
import API from '../api'
import { Layout } from '../components/layout/Layout'
import { BulkPayoutStepper } from '../components/payout/BulkPayoutStepper'
import { CSVUploader } from '../components/payout/CSVUploader'
import { PayoutSuccessScreen } from '../components/payout/PayoutSuccessScreen'
import { ReviewConfirmOverlay } from '../components/payout/ReviewConfirmOverlay'
import { formatCurrency } from '../lib/utils'

export default function BulkPayout() {
  const [currentStep, setCurrentStep] = useState(1)
  const [isBusy, setIsBusy] = useState(false)
  const [isReviewOpen, setIsReviewOpen] = useState(false)
  const [validRows, setValidRows] = useState([])
  const [invalidRows, setInvalidRows] = useState([])
  const [result, setResult] = useState({ success: 0, total: 0 })

  const totalAmount = useMemo(
    () => validRows.reduce((sum, row) => sum + Number(row.amount || 0), 0),
    [validRows]
  )

  const handleValidated = ({ valid, invalid }) => {
    setValidRows(valid)
    setInvalidRows(invalid)
    setCurrentStep(2)
    setIsReviewOpen(true)
  }

  const handleConfirm = async () => {
    try {
      setIsBusy(true)
      const response = await API.post('/payouts/execute', validRows)
      setResult({
        success: response.data.success || 0,
        total: Number(response.data.total || 0),
      })
      setIsReviewOpen(false)
      setCurrentStep(3)
      toast.success('Bulk payout executed successfully')
    } catch (error) {
      console.error('Failed to execute payouts:', error)
      toast.error(error.response?.data?.msg || 'Failed to execute payouts')
    } finally {
      setIsBusy(false)
    }
  }

  return (
    <Layout contentClassName="px-4 py-4 sm:px-6 lg:px-8 max-w-7xl w-full mx-auto">
      <div className="flex flex-col gap-4">
        {/* Header Ribbon in Single Frame */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-zinc-800 bg-zinc-900/90 px-4 py-3 shadow-sm backdrop-blur-sm">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-300">
              <Wallet size={11} />
              Bulk Payout
            </div>
            <h1 className="text-lg font-bold font-display text-white tracking-tight mt-1">Batch Vendor Disbursement</h1>
            <p className="text-[11px] text-zinc-400">Validate beneficiary accounts and execute batch payouts with receipt</p>
          </div>

          <div className="flex items-center gap-3 rounded-xl border border-zinc-800/80 bg-zinc-950/80 px-4 py-2 self-start sm:self-auto">
            <Building2 size={18} className="text-emerald-400" />
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">Ready To Pay</p>
              <p className="font-mono text-xl font-bold text-emerald-400">
                {formatCurrency(totalAmount)}
              </p>
            </div>
          </div>
        </div>

        <BulkPayoutStepper currentStep={currentStep} />

        {currentStep < 3 ? (
          <CSVUploader onValidated={handleValidated} setBusy={setIsBusy} />
        ) : (
          <PayoutSuccessScreen vendorCount={result.success} totalAmount={result.total} />
        )}

        <ReviewConfirmOverlay
          isOpen={isReviewOpen}
          validRows={validRows}
          invalidRows={invalidRows}
          isSubmitting={isBusy}
          onClose={() => {
            setIsReviewOpen(false)
            setCurrentStep(1)
          }}
          onConfirm={handleConfirm}
        />
      </div>
    </Layout>
  )
}
