import { Building2, CheckCircle2, Loader2, QrCode } from 'lucide-react'
import { cn } from '../../lib/utils'

const timelineSteps = [
  { key: 'scanned', label: 'Customer Scanned', icon: QrCode },
  { key: 'processing', label: 'NGMB Processing', icon: Loader2 },
  { key: 'cleared', label: 'Bank Clearing', icon: Building2 },
  { key: 'deposited', label: 'Deposited', icon: CheckCircle2 },
]

const formatTimestamp = (dateValue) => {
  if (!dateValue) {
    return ''
  }

  return new Date(dateValue).toLocaleString('en-IN', {
    day: 'numeric',
    month: 'short',
    hour: 'numeric',
    minute: '2-digit',
  })
}

export function SettlementTimeline({ settlement }) {
  const currentIndex = timelineSteps.findIndex((step) => step.key === settlement?.status)

  return (
    <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/80 p-6 shadow-sm backdrop-blur-sm">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-white">Settlement timeline</h2>
        <p className="mt-1 text-sm text-zinc-400">Track how this payment moves from scan to deposit.</p>
      </div>

      <div className="space-y-4">
        {timelineSteps.map((step, index) => {
          const Icon = step.icon
          const isComplete = index <= currentIndex
          const isActive = index === currentIndex
          const timestamp =
            index === 0 ? settlement?.createdAt : index === timelineSteps.length - 1 ? settlement?.settledAt : isComplete ? settlement?.createdAt : null

          return (
            <div key={step.key} className="flex gap-4">
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    'flex h-10 w-10 items-center justify-center rounded-xl border text-xs font-bold transition-colors',
                    isComplete
                      ? 'border-white bg-white text-black shadow-sm'
                      : 'border-zinc-800 bg-zinc-950 text-zinc-500'
                  )}
                >
                  {index + 1}
                </div>
                {index < timelineSteps.length - 1 && <div className="mt-2 h-12 w-px bg-zinc-800" />}
              </div>

              <div className="flex-1 rounded-xl border border-zinc-800/60 bg-zinc-950/60 p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-3">
                      <div className={cn('rounded-lg p-2', isComplete ? 'border border-white/10 bg-zinc-800 text-zinc-200' : 'border border-zinc-800 bg-zinc-900 text-zinc-500')}>
                        <Icon size={16} className={cn(step.key === 'processing' && isActive && 'animate-spin')} />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-white">{step.label}</p>
                        <p className="text-xs text-zinc-400">
                          {isComplete && timestamp ? formatTimestamp(timestamp) : 'Pending'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {isActive && (
                    <span className="mt-1 flex h-2 w-2">
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-white" />
                    </span>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
