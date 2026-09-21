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
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900/90 p-6 shadow-sm flex flex-col h-full overflow-hidden backdrop-blur-sm">
      <div className="flex items-center gap-3 mb-5">
        <div className="p-2.5 border border-white/10 bg-white/5 text-zinc-300 rounded-xl">
          <Sparkles size={18} />
        </div>
        <div>
          <h2 className="text-lg font-bold font-display text-white">Smart SMS Detection</h2>
          <p className="text-xs text-zinc-400">Paste bank SMS to auto-fill expense</p>
        </div>
      </div>

      <div className="flex-1 space-y-4">
        <div className="space-y-2">
          <textarea
            value={sms}
            onChange={(e) => setSms(e.target.value)}
            placeholder={EXAMPLE_SMS}
            className="w-full h-28 p-3.5 bg-zinc-950 border border-zinc-800 rounded-xl focus:ring-1 focus:ring-white/20 focus:border-zinc-500 outline-none transition resize-none text-xs leading-relaxed text-white placeholder-zinc-500 font-mono"
          />
        </div>

        <button
          onClick={handleDetect}
          disabled={isDetecting || !sms.trim() || result !== null}
          className="w-full bg-zinc-800 border border-white/10 text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-zinc-700 disabled:opacity-40 disabled:cursor-not-allowed transition active:scale-95 text-xs shadow-sm"
        >
          {isDetecting ? (
            <>
              <Loader2 className="animate-spin" size={16} />
              Detecting...
            </>
          ) : result ? (
            <>
              <CheckCircle2 size={16} className="text-zinc-200" />
              Detected! Ready to apply
            </>
          ) : (
            'Detect Expense'
          )}
        </button>

        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="p-3 bg-red-500/10 text-red-400 rounded-xl flex items-center gap-2.5 text-xs border border-red-500/20"
            >
              <AlertCircle size={16} className="shrink-0" />
              <span>{error}</span>
            </motion.div>
          )}

          {result && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="space-y-3 pt-3 border-t border-zinc-800"
            >
              <div className="space-y-2 bg-zinc-950 border border-zinc-800 p-3.5 rounded-xl">
                <div>
                  <p className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider mb-0.5">Merchant</p>
                  <p className="text-xs font-bold text-white">{result.merchant}</p>
                </div>
                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div>
                    <p className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider mb-0.5">Amount</p>
                    <p className="text-xs font-bold font-mono text-white">{formatCurrency(result.amount)}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider mb-0.5">Category</p>
                    <p className="text-xs font-bold text-white">{result.category}</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={handleUseResult}
                  className="w-full bg-white text-black font-semibold py-2.5 rounded-xl hover:bg-zinc-200 transition shadow-sm active:scale-95 text-xs"
                >
                  Use Expense
                </button>
                <button
                  onClick={() => {
                    setResult(null)
                    setSms('')
                  }}
                  className="w-full bg-zinc-800 border border-white/10 text-zinc-300 font-semibold py-2.5 rounded-xl hover:bg-zinc-700 transition text-xs"
                >
                  Clear
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
