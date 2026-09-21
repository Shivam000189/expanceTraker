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
  scanned: 'border border-white/10 bg-zinc-800 text-zinc-300',
  processing: 'border border-amber-500/20 bg-amber-500/10 text-amber-400',
  cleared: 'border border-teal-500/20 bg-teal-500/10 text-teal-400',
  deposited: 'border border-white/20 bg-white/10 text-white',
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
    <Layout contentClassName="px-4 py-4 sm:px-6 lg:px-8 max-w-7xl w-full mx-auto">
      <div className="flex flex-col gap-4">
        {/* Header Ribbon in Single Frame */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-zinc-800 bg-zinc-900/90 px-4 py-3 shadow-sm backdrop-blur-sm">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-300">
              <ArrowRightLeft size={11} />
              Settlement Tracker
            </div>
            <h1 className="text-lg font-bold font-display text-white tracking-tight mt-1">Settlement Ledger & Timeline</h1>
            <p className="text-[11px] text-zinc-400">Track movement from terminal scan to direct bank deposit</p>
          </div>

          <div className="flex items-center gap-3 rounded-xl border border-zinc-800/80 bg-zinc-950/80 px-4 py-2 self-start sm:self-auto">
            <Landmark size={18} className="text-emerald-400" />
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">Deposited Net Total</p>
              <p className="font-mono text-xl font-bold text-emerald-400">
                {formatCurrency(depositedTotal)}
              </p>
            </div>
          </div>
        </div>

        {/* 2-Column Single-Frame Bento Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
          {/* Left Column: Settlement Records (7 cols) with internal scroll */}
          <div className="lg:col-span-7 rounded-2xl border border-zinc-800 bg-zinc-900/90 p-4 sm:p-5 shadow-sm backdrop-blur-sm flex flex-col">
            <div className="mb-3 flex items-center justify-between gap-4 border-b border-zinc-800/80 pb-3">
              <div>
                <h2 className="text-sm font-bold text-white">Settlement Records</h2>
                <p className="text-[11px] text-zinc-400">Select any record to inspect status and receipt</p>
              </div>
              <span className="rounded-full border border-white/10 bg-zinc-800/80 px-2.5 py-0.5 font-mono text-[11px] font-semibold text-zinc-400">
                {settlements.length} records
              </span>
            </div>

            <div className="space-y-2.5 max-h-[calc(100vh-210px)] overflow-y-auto pr-1">
              {settlements.length > 0 ? (
                settlements.map((settlement) => (
                  <button
                    key={settlement.id}
                    onClick={() => setSelectedSettlementId(settlement.id)}
                    className={cn(
                      'flex w-full flex-col gap-2 rounded-xl border p-3.5 text-left transition-all sm:flex-row sm:items-center sm:justify-between',
                      selectedSettlement?.id === settlement.id
                        ? 'border-white/40 bg-zinc-950/90 shadow-sm'
                        : 'border-zinc-800/60 bg-zinc-950/60 hover:border-zinc-700/80 hover:bg-zinc-900/40'
                    )}
                  >
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-mono text-xs font-semibold text-white">{settlement.transactionId}</p>
                      <p className="mt-0.5 text-[11px] text-zinc-400 font-mono">
                        {new Date(settlement.createdAt).toLocaleString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          hour: 'numeric',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>

                    <div className="flex items-center gap-2.5 shrink-0 sm:justify-end">
                      <span className={cn('rounded px-2 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider', statusConfig[settlement.status] || statusConfig.scanned)}>
                        {statusLabel[settlement.status] || settlement.status}
                      </span>
                      <span className="font-mono text-sm font-bold text-white">{formatCurrency(settlement.amount)}</span>
                    </div>
                  </button>
                ))
              ) : (
                <div className="rounded-xl border border-dashed border-zinc-800 p-8 text-center text-xs font-medium text-zinc-500">
                  No settlements available yet.
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Selected Record Details & Timeline (5 cols) with internal scroll */}
          <div className="lg:col-span-5 flex flex-col gap-3.5 max-h-[calc(100vh-210px)] overflow-y-auto pr-1">
            {selectedSettlement ? (
              <>
                <FeeBreakdownCard
                  amount={Number(selectedSettlement.amount || 0)}
                  fee={Number(selectedSettlement.fee || 0)}
                  netAmount={Number(selectedSettlement.netAmount || 0)}
                />
                <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/80 p-4 shadow-sm backdrop-blur-sm flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400">Selected transaction</p>
                    <p className="mt-0.5 font-mono text-xs font-bold text-white truncate">{selectedSettlement.transactionId}</p>
                  </div>
                  <ReceiptDownloadButton settlement={selectedSettlement} />
                </div>
                <SettlementTimeline settlement={selectedSettlement} />
              </>
            ) : (
              <div className="rounded-2xl border border-dashed border-zinc-800 p-8 text-center text-xs text-zinc-500">
                Select a settlement to view its fee breakdown and timeline.
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  )
}
