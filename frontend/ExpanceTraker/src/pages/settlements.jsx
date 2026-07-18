import { useEffect, useMemo, useState } from 'react'
import { ArrowRightLeft, Landmark } from 'lucide-react'
import toast from 'react-hot-toast'
import API from '../api'
import LoadingSpinner from '../components/LoadingSpinner'
import { Layout } from '../components/layout/Layout'
import { FeeBreakdownCard } from '../components/settlements/FeeBreakdownCard'
import { ReceiptDownloadButton } from '../components/settlements/ReceiptDownloadButton'
import { SettlementTimeline } from '../components/settlements/SettlementTimeline'
import { cn, formatCurrency } from '../lib/utils'

const statusConfig = {
  scanned: 'bg-zinc-100 text-zinc-600',
  processing: 'bg-blue-100 text-blue-700',
  cleared: 'bg-yellow-100 text-yellow-700',
  deposited: 'bg-emerald-100 text-emerald-700',
}

const statusLabel = {
  scanned: 'Scanned',
  processing: 'Processing',
  cleared: 'Clearing',
  deposited: 'Deposited',
}

export default function Settlements() {
  const [settlements, setSettlements] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedSettlementId, setSelectedSettlementId] = useState(null)

  useEffect(() => {
    const fetchSettlements = async () => {
      try {
        setLoading(true)
        const response = await API.get('/settlements')
        const records = response.data || []
        setSettlements(records)
        setSelectedSettlementId(records[0]?.id || null)
      } catch (error) {
        console.error('Failed to load settlements:', error)
        toast.error('Failed to load settlements')
        setSettlements([])
      } finally {
        setLoading(false)
      }
    }

    fetchSettlements()
  }, [])

  const selectedSettlement = useMemo(
    () => settlements.find((record) => record.id === selectedSettlementId) || settlements[0] || null,
    [settlements, selectedSettlementId]
  )

  const depositedTotal = useMemo(
    () =>
      settlements
        .filter((settlement) => settlement.status === 'deposited')
        .reduce((sum, settlement) => sum + Number(settlement.netAmount || 0), 0),
    [settlements]
  )

  if (loading) {
    return <LoadingSpinner message="Loading settlements..." />
  }

  return (
    <Layout>
      <div className="space-y-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-primary">
              <ArrowRightLeft size={14} />
              Settlement Tracker
            </div>
            <h1 className="text-3xl font-bold text-zinc-900">Track payout movement from scan to bank</h1>
            <p className="mt-2 max-w-2xl text-sm text-zinc-500">
              Monitor every settlement stage, review fee deductions, and download receipts for your records.
            </p>
          </div>

          <div className="rounded-[1.5rem] border border-emerald-100 bg-white px-5 py-4 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-400">Deposited Net Total</p>
            <div className="mt-2 flex items-center gap-2 text-zinc-900">
              <Landmark size={18} className="text-primary" />
              <span className="text-2xl font-bold">{formatCurrency(depositedTotal)}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 xl:grid-cols-[1.25fr_0.75fr]">
          <div className="rounded-[2rem] border border-zinc-100 bg-white p-8 shadow-sm">
            <div className="mb-8 flex items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold">Settlement Records</h2>
                <p className="mt-2 text-sm text-zinc-500">Select a row to inspect the timeline and receipt details.</p>
              </div>
              <span className="rounded-full bg-zinc-100 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-zinc-500">
                {settlements.length} records
              </span>
            </div>

            <div className="space-y-4">
              {settlements.length > 0 ? (
                settlements.map((settlement) => (
                  <button
                    key={settlement.id}
                    onClick={() => setSelectedSettlementId(settlement.id)}
                    className={cn(
                      'flex w-full flex-col gap-4 rounded-[1.5rem] border p-5 text-left transition-all md:flex-row md:items-center md:justify-between',
                      selectedSettlement?.id === settlement.id
                        ? 'border-emerald-200 bg-emerald-50/60 shadow-sm'
                        : 'border-zinc-100 bg-white hover:border-zinc-200 hover:bg-zinc-50'
                    )}
                  >
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-base font-bold text-zinc-900">{settlement.transactionId}</p>
                      <p className="mt-1 text-sm text-zinc-500">
                        {new Date(settlement.createdAt).toLocaleString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                          hour: 'numeric',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 md:justify-end">
                      <span className={cn('rounded-full px-4 py-2 text-xs font-bold uppercase tracking-[0.18em]', statusConfig[settlement.status] || statusConfig.scanned)}>
                        {statusLabel[settlement.status] || settlement.status}
                      </span>
                      <span className="text-lg font-bold text-zinc-900">{formatCurrency(settlement.amount)}</span>
                    </div>
                  </button>
                ))
              ) : (
                <div className="rounded-[1.5rem] border border-dashed border-zinc-200 p-10 text-center text-sm font-medium text-zinc-500">
                  No settlements available yet.
                </div>
              )}
            </div>
          </div>

          <div className="space-y-8">
            {selectedSettlement ? (
              <>
                <FeeBreakdownCard
                  amount={Number(selectedSettlement.amount || 0)}
                  fee={Number(selectedSettlement.fee || 0)}
                  netAmount={Number(selectedSettlement.netAmount || 0)}
                />
                <div className="rounded-[2rem] border border-zinc-100 bg-white p-6 shadow-sm">
                  <div className="mb-4">
                    <p className="text-sm font-medium text-zinc-500">Selected transaction</p>
                    <p className="mt-1 text-lg font-bold text-zinc-900">{selectedSettlement.transactionId}</p>
                  </div>
                  <ReceiptDownloadButton settlement={selectedSettlement} />
                </div>
              </>
            ) : null}
          </div>
        </div>

        {selectedSettlement && <SettlementTimeline settlement={selectedSettlement} />}
      </div>
    </Layout>
  )
}
