import { motion } from 'framer-motion'
import { cn } from '../../lib/utils'

const steps = [
  'Upload',
  'Review & Confirm',
  'Done',
]

export function BulkPayoutStepper({ currentStep = 1 }) {
  return (
    <div className="rounded-[2rem] border border-zinc-100 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        {steps.map((label, index) => {
          const stepNumber = index + 1
          const isActive = stepNumber === currentStep
          const isComplete = stepNumber < currentStep

          return (
            <div key={label} className="flex flex-1 items-center gap-3">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.08 }}
                className="flex items-center gap-3"
              >
                <div
                  className={cn(
                    'flex h-12 w-12 items-center justify-center rounded-full text-sm font-bold transition-colors',
                    isActive || isComplete
                      ? 'bg-primary text-white'
                      : 'bg-zinc-100 text-zinc-500'
                  )}
                >
                  {stepNumber}
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-zinc-400">Step {stepNumber}</p>
                  <p className={cn('text-sm font-semibold', isActive || isComplete ? 'text-zinc-900' : 'text-zinc-500')}>
                    {label}
                  </p>
                </div>
              </motion.div>

              {index < steps.length - 1 && (
                <div className="hidden flex-1 md:block">
                  <div className="h-2 overflow-hidden rounded-full bg-zinc-100">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: currentStep > stepNumber ? '100%' : isActive ? '45%' : '0%' }}
                      transition={{ duration: 0.35 }}
                      className="h-full rounded-full bg-primary"
                    />
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
