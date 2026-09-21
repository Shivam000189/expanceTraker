import { motion } from 'framer-motion'
import { Navbar } from './Navbar'
import { cn } from '../../lib/utils'

export function Layout({ children, contentClassName }) {
  return (
    <div className="min-h-screen overflow-x-hidden bg-zinc-950 font-sans text-white selection:bg-white selection:text-black antialiased relative">
      {/* Subtle top ambient glow for depth */}
      <div className="pointer-events-none absolute left-1/2 top-0 h-[500px] w-full max-w-7xl -translate-x-1/2 rounded-full bg-gradient-to-b from-white/[0.03] via-white/[0.01] to-transparent blur-[120px]" />
      <div className="radial-dot-grid pointer-events-none absolute inset-0 opacity-30" />

      <div className="relative z-10 flex min-h-screen flex-col min-w-0">
        <Navbar />
        <main className={cn("flex-1 px-4 py-8 sm:px-6 lg:px-8 max-w-7xl w-full mx-auto", contentClassName)}>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="h-full"
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  )
}
