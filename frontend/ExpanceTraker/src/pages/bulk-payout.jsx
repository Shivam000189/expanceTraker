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
    <Layout>
      <div className="space-y-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-primary">
              <Wallet size={14} />
              Bulk Payout
            </div>
            <h1 className="text-3xl font-bold font-display text-zinc-900">Upload, validate, and pay vendors in one batch</h1>
            <p className="mt-2 max-w-2xl text-sm text-zinc-500">
              Import a CSV, review account validation results, and execute bulk vendor payouts with a downloadable receipt.
            </p>
          </div>

          <div className="rounded-[1.75rem] bg-surface-dark px-6 py-5 text-white shadow-2xl">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-400">Ready To Pay</p>
            <div className="mt-3 flex items-center gap-3">
              <Building2 size={18} className="text-primary" />
              <span className="text-2xl font-bold">{formatCurrency(totalAmount)}</span>
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
