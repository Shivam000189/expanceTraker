import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { 
  LayoutDashboard, 
  BarChart3, 
  Settings, 
  LogOut, 
  Wallet,
  Menu,
  X
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '../../lib/utils'

const sidebarItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/expenses' },
  { icon: BarChart3, label: 'Analytics', path: '/analytics' },
  { icon: Settings, label: 'Settings', path: '/setting' },
]

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(false)
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('userName')
    localStorage.removeItem('userEmail')
    localStorage.removeItem('monthlyIncome')
    navigate('/login')
  }

  return (
    <>
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="p-2.5 bg-zinc-900 text-zinc-300 rounded-xl shadow-lg border border-zinc-800 hover:text-white"
        >
          {isOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      <aside className="hidden lg:flex flex-col w-64 h-screen sticky top-0 bg-zinc-950 border-r border-zinc-800/80 text-white p-6 transition-all duration-300">
        <div className="flex items-center gap-3 mb-10 px-2">
          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
            <Wallet className="text-black" size={22} />
          </div>
          <span className="text-xl font-bold tracking-tight text-white">Spendora</span>
        </div>

        <nav className="flex-1 space-y-2">
          {sidebarItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 group hover:bg-white/5",
                isActive 
                  ? "border border-white/20 bg-white text-black shadow-sm font-bold" 
                  : "text-zinc-400 hover:text-white"
              )}
            >
              <item.icon size={18} className="transition-transform duration-200 group-hover:scale-110" />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="pt-6 border-t border-zinc-800">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold text-zinc-400 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200 w-full text-left group"
          >
            <LogOut size={18} className="group-hover:translate-x-0.5 transition-transform" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-md z-40 lg:hidden"
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 bottom-0 w-72 bg-zinc-950 border-r border-zinc-800 text-white p-6 z-50 lg:hidden"
            >
              <div className="flex items-center gap-3 mb-10 px-2">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                  <Wallet className="text-black" size={22} />
                </div>
                <span className="text-xl font-bold tracking-tight text-white">Spendora</span>
              </div>

              <nav className="space-y-2">
                {sidebarItems.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsOpen(false)}
                    className={({ isActive }) => cn(
                      "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200",
                      isActive 
                        ? "border border-white/20 bg-white text-black shadow-sm font-bold" 
                        : "text-zinc-400 hover:bg-white/5 hover:text-white"
                    )}
                  >
                    <item.icon size={18} />
                    <span>{item.label}</span>
                  </NavLink>
                ))}
              </nav>

              <div className="mt-auto pt-6 border-t border-zinc-800">
                <button 
                  onClick={() => {
                    handleLogout()
                    setIsOpen(false)
                  }}
                  className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold text-zinc-400 hover:text-red-400 hover:bg-red-500/10 w-full text-left"
                >
                  <LogOut size={18} />
                  <span>Logout</span>
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
