import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { QrCode, X } from 'lucide-react'
import { QRCodeSVG } from 'qrcode.react'

export function UPIQRGenerator() {
  const [isOpen, setIsOpen] = useState(false)
  const [amount, setAmount] = useState('')

  const qrValue = useMemo(() => {
    const safeAmount = amount || '0'
    return `upi://pay?pa=merchant@upi&pn=Spendora&am=${safeAmount}&cu=INR`
  }, [amount])

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-black shadow-sm transition-all hover:bg-zinc-200 active:scale-95"
      >
        <QrCode size={18} />
        Generate UPI QR
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-xl rounded-2xl border border-zinc-800 bg-zinc-950 p-6 shadow-2xl"
            >
              <div className="mb-6 flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold tracking-tight text-white">UPI QR Generator</h2>
                  <p className="mt-1 text-sm text-zinc-400">
                    Enter an amount and show this QR to collect payment instantly.
                  </p>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="rounded-lg p-2 text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-white"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="grid gap-6 md:grid-cols-[1.1fr_0.9fr] md:items-center">
                <div>
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-zinc-400">Amount (INR)</label>
                  <input
                    type="number"
                    min="0"
                    step="1"
                    value={amount}
                    onChange={(event) => setAmount(event.target.value)}
                    placeholder="Enter amount"
                    className="w-full rounded-xl border border-zinc-800 bg-zinc-900/90 px-4 py-2.5 font-mono text-base text-white placeholder:text-zinc-500 outline-none transition-all focus:border-zinc-500 focus:ring-1 focus:ring-white/20"
                  />

                  <div className="mt-5 rounded-xl border border-zinc-800/80 bg-zinc-900/60 p-4">
                    <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400">UPI Deep Link</p>
                    <p className="mt-2 break-all font-mono text-xs leading-relaxed text-zinc-400">{qrValue}</p>
                  </div>
                </div>

                <div className="flex flex-col items-center rounded-xl border border-zinc-800 bg-zinc-900/80 p-5 text-center">
                  <div className="rounded-lg bg-white p-3 shadow-md">
                    <QRCodeSVG value={qrValue} size={180} includeMargin />
                  </div>
                  <p className="mt-3 text-sm font-semibold text-white">Scan to pay Spendora</p>
                  <p className="mt-0.5 font-mono text-xs text-zinc-400">UPI ID: merchant@upi</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
