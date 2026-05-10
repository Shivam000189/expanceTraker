import { useState } from 'react'
import { Sparkles, Loader2, CheckCircle2, AlertCircle } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { formatCurrency } from '../../lib/utils'
import API from '../../api'

export function SMSDetector({ onDetect }) {
  const [sms, setSms] = useState('')
  const [isDetecting, setIsDetecting] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)

  const handleDetect = async () => {
    if (!sms.trim()) return

    setIsDetecting(true)
    setError(null)
    setResult(null)

    try {
      const response = await API.post('/expenses/detect-sms', { smsText: sms })
      setResult(response.data)
    } catch (err) {
      setError(
        err.response?.data?.msg ||
          'Could not parse SMS. Expected format: "Rs 450 debited from SBI for SWIGGY on 12 May"'
      )
    } finally {
      setIsDetecting(false)
    }
  }

  const handleUseResult = () => {
    if (result) {
      onDetect(result)
      setSms('')
      setResult(null)
    }
  }

  const EXAMPLE_SMS = 'Rs 450 debited from SBI Bank for SWIGGY on 12 May'

  return (
    <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-zinc-100 flex flex-col h-full overflow-hidden">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-primary/10 text-primary rounded-2xl">
          <Sparkles size={24} />
        </div>
        <div>
          <h2 className="text-xl font-bold font-display">Smart Expense Detection</h2>
          <p className="text-sm text-zinc-500">Paste bank SMS to auto-fill expense</p>
        </div>
      </div>

      <div className="flex-1 space-y-6">
        <div className="space-y-3">
          <textarea
            value={sms}
            onChange={(e) => setSms(e.target.value)}
            placeholder={`${EXAMPLE_SMS}`}
            className="w-full h-32 p-4 bg-zinc-50 border border-zinc-200 rounded-2xl focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all resize-none text-sm leading-relaxed"
          />
          {/* <button
            onClick={() => setSms(EXAMPLE_SMS)}
            className="text-xs font-semibold text-primary hover:underline"
          >
            Use Example SMS
          </button> */}
        </div>

        <button
          onClick={handleDetect}
          disabled={isDetecting || !sms.trim() || result !== null}
          className="w-full bg-surface-dark text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-zinc-800 disabled:bg-zinc-300 disabled:cursor-not-allowed transition-all active:scale-95 shadow-lg shadow-zinc-200"
        >
          {isDetecting ? (
            <>
              <Loader2 className="animate-spin" size={18} />
              Detecting...
            </>
          ) : result ? (
            <>
              <CheckCircle2 size={18} />
              Detected! Use to fill form
            </>
          ) : (
            <>
              {/* <Sparkles size={18} /> */}
              Detect Expense
            </>
          )}
        </button>

        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="p-4 bg-red-50 text-red-700 rounded-2xl flex items-center gap-3 text-sm border border-red-100"
            >
              <AlertCircle size={20} />
              {error}
            </motion.div>
          )}

          {result && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="space-y-4 pt-4 border-t border-zinc-100"
            >
              <div className="space-y-3 bg-zinc-50 p-4 rounded-2xl">
                <div>
                  <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wide mb-1">Merchant</p>
                  <p className="text-sm font-bold text-zinc-900">{result.merchant}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wide mb-1">Amount</p>
                    <p className="text-sm font-bold text-zinc-900">{formatCurrency(result.amount)}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wide mb-1">Category</p>
                    <p className="text-sm font-bold text-zinc-900">{result.category}</p>
                  </div>
                </div>
              </div>

              <button
                onClick={handleUseResult}
                className="w-full bg-primary text-white font-bold py-3 rounded-2xl hover:bg-primary-dark transition-all shadow-lg shadow-primary/30 active:scale-95"
              >
                Use This Expense
              </button>
              <button
                onClick={() => {
                  setResult(null)
                  setSms('')
                }}
                className="w-full bg-zinc-100 text-zinc-700 font-bold py-3 rounded-2xl hover:bg-zinc-200 transition-all"
              >
                Try Again
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
