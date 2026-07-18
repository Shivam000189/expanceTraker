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
        className="inline-flex items-center justify-center gap-3 rounded-2xl bg-primary px-6 py-4 text-sm font-bold text-white shadow-lg shadow-primary/30 transition-all hover:bg-primary-dark active:scale-[0.98]"
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
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-xl rounded-[2rem] border border-zinc-100 bg-white p-8 shadow-2xl"
            >
              <div className="mb-8 flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-zinc-900">UPI QR Generator</h2>
                  <p className="mt-2 text-sm text-zinc-500">
                    Enter an amount and show this QR to collect payment instantly.
                  </p>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="rounded-xl p-2 text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-900"
                >
                  <X size={22} />
                </button>
              </div>

              <div className="grid gap-8 md:grid-cols-[1.1fr_0.9fr] md:items-center">
                <div>
                  <label className="mb-3 block text-sm font-semibold text-zinc-700">Amount (INR)</label>
                  <input
                    type="number"
                    min="0"
                    step="1"
                    value={amount}
                    onChange={(event) => setAmount(event.target.value)}
                    placeholder="Enter amount"
                    className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-5 py-4 text-lg font-semibold text-zinc-900 outline-none transition-all focus:border-primary focus:ring-4 focus:ring-primary/10"
                  />

                  <div className="mt-6 rounded-[1.5rem] bg-zinc-50 p-5">
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-400">UPI Deep Link</p>
                    <p className="mt-3 break-all text-sm font-medium leading-relaxed text-zinc-600">{qrValue}</p>
                  </div>
                </div>

                <div className="flex flex-col items-center rounded-[1.75rem] bg-emerald-50 p-6 text-center">
                  <div className="rounded-[1.5rem] bg-white p-4 shadow-sm">
                    <QRCodeSVG value={qrValue} size={220} includeMargin />
                  </div>
                  <p className="mt-4 text-sm font-semibold text-zinc-700">Scan to pay Spendora</p>
                  <p className="mt-1 text-xs text-zinc-500">UPI ID: merchant@upi</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
