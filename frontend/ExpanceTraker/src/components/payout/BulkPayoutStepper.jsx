import { motion } from 'framer-motion'
import { cn } from '../../lib/utils'

const steps = [
  'Upload',
  'Review & Confirm',
  'Done',
]

export function BulkPayoutStepper({ currentStep = 1 }) {
  return (
    <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/80 p-5 shadow-sm backdrop-blur-sm">
      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        {steps.map((label, index) => {
          const stepNumber = index + 1
          const isActive = stepNumber === currentStep
          const isComplete = stepNumber < currentStep

          return (
            <div key={label} className="flex flex-1 items-center gap-3">
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.08 }}
                className="flex items-center gap-3"
              >
                <div
                  className={cn(
                    'flex h-10 w-10 items-center justify-center rounded-xl text-xs font-bold transition-colors',
                    isActive || isComplete
                      ? 'border border-white bg-white text-black shadow-sm'
                      : 'border border-zinc-800 bg-zinc-950 text-zinc-500'
                  )}
                >
                  {stepNumber}
                </div>
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">Step {stepNumber}</p>
                  <p className={cn('text-sm font-semibold', isActive || isComplete ? 'text-white' : 'text-zinc-400')}>
                    {label}
                  </p>
                </div>
              </motion.div>

              {index < steps.length - 1 && (
                <div className="hidden flex-1 md:block">
                  <div className="h-1.5 overflow-hidden rounded-full bg-zinc-800">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: currentStep > stepNumber ? '100%' : isActive ? '45%' : '0%' }}
                      transition={{ duration: 0.35 }}
                      className="h-full rounded-full bg-white"
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
