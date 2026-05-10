import { motion } from 'framer-motion'
import { Navbar } from './Navbar'

export function Layout({ children }) {
  return (
    <div className="min-h-screen bg-background">
      <div className="flex min-h-screen flex-col min-w-0">
        <Navbar />
        <main className="flex-1 p-6 lg:p-10 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  )
}
