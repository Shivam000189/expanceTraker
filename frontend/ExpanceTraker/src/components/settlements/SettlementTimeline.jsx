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
    <div className="rounded-[2rem] border border-zinc-100 bg-white p-8 shadow-sm">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-zinc-900">Settlement timeline</h2>
        <p className="mt-2 text-sm text-zinc-500">Track how this payment moves from scan to deposit.</p>
      </div>

      <div className="space-y-6">
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
                    'flex h-11 w-11 items-center justify-center rounded-full border text-sm font-bold transition-colors',
                    isComplete
                      ? 'border-emerald-500 bg-primary text-white'
                      : 'border-zinc-200 bg-zinc-100 text-zinc-500'
                  )}
                >
                  {index + 1}
                </div>
                {index < timelineSteps.length - 1 && <div className="mt-2 h-14 w-px bg-zinc-200" />}
              </div>

              <div className="flex-1 rounded-[1.5rem] border border-zinc-100 bg-zinc-50/70 p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-3">
                      <div className={cn('rounded-xl p-2', isComplete ? 'bg-emerald-100 text-emerald-700' : 'bg-zinc-200 text-zinc-500')}>
                        <Icon size={18} className={cn(step.key === 'processing' && isActive && 'animate-spin')} />
                      </div>
                      <div>
                        <p className="font-bold text-zinc-900">{step.label}</p>
                        <p className="text-sm text-zinc-500">
                          {isComplete && timestamp ? formatTimestamp(timestamp) : 'Pending'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {isActive && (
                    <span className="mt-1 flex h-3 w-3">
                      <span className="absolute inline-flex h-3 w-3 animate-ping rounded-full bg-primary opacity-60" />
                      <span className="relative inline-flex h-3 w-3 rounded-full bg-primary" />
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
