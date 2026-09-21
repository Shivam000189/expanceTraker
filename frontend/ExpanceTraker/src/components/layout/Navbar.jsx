import { useEffect, useMemo, useRef, useState } from 'react'
import {
  Bell,
  LogOut,
  Wallet,
  BarChart3,
  LayoutDashboard,
  Settings,
  TrendingUp,
  Store,
  Landmark,
  CircleDollarSign,
  Menu,
  X,
  CreditCard,
} from 'lucide-react'
import { NavLink, useNavigate } from 'react-router-dom'
import { cn } from '../../lib/utils'
import API from '../../api'

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
  { icon: CreditCard, label: 'Expenses', path: '/expenses' },
  { icon: Store, label: 'Store', path: '/store-dashboard' },
  { icon: Landmark, label: 'Bank', path: '/bank' },
  { icon: Landmark, label: 'Settlements', path: '/settlements' },
  { icon: CircleDollarSign, label: 'Bulk Payout', path: '/bulk-payout' },
  { icon: BarChart3, label: 'Analytics', path: '/analytics' },
  { icon: Settings, label: 'Settings', path: '/setting' },
]

export function Navbar() {
  const navigate = useNavigate()
  const userName = localStorage.getItem('userName') || 'User'
  const monthlyIncome = Number(localStorage.getItem('monthlyIncome') || 0)
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const [expenses, setExpenses] = useState([])
  const notificationRef = useRef(null)
  const menuRef = useRef(null)
  const userMenuRef = useRef(null)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) return

    const loadExpenses = async () => {
      try {
        const response = await API.get('/expenses', {
          headers: { Authorization: `Bearer ${token}` },
        })
        setExpenses(response.data || [])
      } catch (error) {
        console.error('Failed to load forecast data:', error)
      }
    }

    loadExpenses()
  }, [])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setIsNotificationsOpen(false)
      }
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false)
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const forecast = useMemo(() => {
    const totalExpense = expenses.reduce((sum, expense) => sum + Number(expense.amount || 0), 0)
    const topCategory = expenses.reduce((acc, expense) => {
      const category = expense.category || 'Other'
      acc[category] = (acc[category] || 0) + Number(expense.amount || 0)
      return acc
    }, {})

    const [leadingCategory = 'Other'] =
      Object.entries(topCategory).sort((a, b) => b[1] - a[1])[0] || []

    const safeIncome = monthlyIncome > 0 ? monthlyIncome : totalExpense
    const projectedSavings = Math.max(0, Math.round(safeIncome - totalExpense * 1.15))
    const spentPercent = safeIncome > 0 ? Math.min(100, Math.round((totalExpense / safeIncome) * 100)) : 0

    return {
      totalExpense,
      topCategory: leadingCategory,
      projectedSavings,
      spentPercent,
    }
  }, [expenses, monthlyIncome])

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('userName')
    localStorage.removeItem('userEmail')
    localStorage.removeItem('monthlyIncome')
    navigate('/login')
  }

  return (
    <header className="sticky top-0 z-40 border-b border-zinc-800/80 bg-zinc-950/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 sm:px-6 lg:px-8">
        {/* Brand Logo matching Main.jsx */}
        <button
          type="button"
          onClick={() => navigate('/dashboard')}
          className="group flex items-center gap-2.5 text-left"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-emerald-500/20 bg-emerald-500/10 transition-colors group-hover:border-emerald-500/40">
            <Wallet className="h-5 w-5 text-emerald-400 transition-transform group-hover:scale-110" />
          </div>
          <div>
            <span className="font-display text-lg font-bold tracking-tight text-white transition-colors group-hover:text-emerald-400">
              Spendora
            </span>
          </div>
        </button>

        {/* Center Desktop Navigation Pills */}
        <nav className="hidden items-center gap-1 xl:flex">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold transition-all',
                  isActive
                    ? 'bg-white text-black shadow-sm font-bold'
                    : 'text-zinc-400 hover:bg-white/5 hover:text-white'
                )
              }
            >
              <item.icon size={15} />
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Right Section: Notifications & User */}
        <div className="flex items-center gap-3">
          {/* Notifications / Forecast */}
          <div className="relative" ref={notificationRef}>
            <button
              onClick={() => {
                setIsNotificationsOpen((open) => !open)
                setIsUserMenuOpen(false)
              }}
              className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-zinc-800 bg-zinc-900/80 text-zinc-400 transition hover:border-zinc-700 hover:text-white"
              aria-label="Notifications"
            >
              <Bell size={16} />
              <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-white" />
            </button>
            {isNotificationsOpen && <ForecastPopover forecast={forecast} />}
          </div>

          {/* User Profile & Menu */}
          <div className="relative" ref={userMenuRef}>
            <button
              onClick={() => {
                setIsUserMenuOpen((open) => !open)
                setIsNotificationsOpen(false)
              }}
              className="flex items-center gap-2.5 rounded-xl border border-zinc-800 bg-zinc-900/80 p-1.5 pr-3 text-left transition hover:border-zinc-700 hover:bg-zinc-800/80"
            >
              <div className="flex h-7 w-7 items-center justify-center overflow-hidden rounded-lg border border-zinc-700 bg-zinc-800">
                <img
                  src={`https://api.dicebear.com/7.x/pixel-art/svg?seed=${userName}`}
                  alt="User avatar"
                  className="h-full w-full object-cover"
                />
              </div>
              <span className="hidden text-xs font-semibold text-zinc-200 sm:inline-block max-w-[100px] truncate">
                {userName}
              </span>
            </button>

            {isUserMenuOpen && (
              <div className="absolute right-0 top-12 w-52 overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950/95 p-2 shadow-2xl shadow-black/80 backdrop-blur-xl">
                <div className="border-b border-zinc-800/80 px-3 py-2.5">
                  <p className="text-xs font-bold text-white truncate">{userName}</p>
                  <p className="text-[10px] font-mono text-zinc-400">Active Session</p>
                </div>
                <div className="mt-1 space-y-1">
                  <button
                    onClick={() => {
                      setIsUserMenuOpen(false)
                      navigate('/setting')
                    }}
                    className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-zinc-300 transition hover:bg-white/5 hover:text-white"
                  >
                    <Settings size={15} />
                    Account Settings
                  </button>
                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-red-400 transition hover:bg-red-500/10 hover:text-red-300"
                  >
                    <LogOut size={15} />
                    Sign out
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="relative xl:hidden" ref={menuRef}>
            <button
              onClick={() => setIsMenuOpen((open) => !open)}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-zinc-800 bg-zinc-900/80 text-zinc-400 transition hover:text-white"
              aria-label="Navigation menu"
            >
              {isMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>

            {isMenuOpen && (
              <div className="absolute right-0 top-12 w-64 overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950/95 p-2 shadow-2xl shadow-black/80 backdrop-blur-xl">
                <div className="space-y-1">
                  {navItems.map((item) => (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      onClick={() => setIsMenuOpen(false)}
                      className={({ isActive }) =>
                        cn(
                          'flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs font-semibold transition-all',
                          isActive
                            ? 'bg-white text-black font-bold'
                            : 'text-zinc-300 hover:bg-white/5 hover:text-white'
                        )
                      }
                    >
                      <item.icon size={16} />
                      {item.label}
                    </NavLink>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

function ForecastPopover({ forecast }) {
  return (
    <div className="absolute right-0 top-12 w-[310px] overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950/95 p-5 shadow-2xl shadow-black/80 backdrop-blur-xl">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div>
          <div className="mb-1.5 inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-zinc-300">
            <TrendingUp size={11} />
            Cashflow Insight
          </div>
          <h3 className="text-sm font-bold text-white">Monthly Cashflow</h3>
        </div>
      </div>

      <p className="text-xs leading-relaxed text-zinc-400">
        {forecast.totalExpense > 0
          ? `On track to save ₹${forecast.projectedSavings.toLocaleString()} if spending pace remains steady.`
          : 'Add expenses to unlock real-time cashflow predictions.'}
      </p>

      <div className="mt-4 space-y-2.5 rounded-xl border border-zinc-800/80 bg-zinc-900/60 p-3.5">
        <div className="flex items-center justify-between text-xs">
          <span className="font-medium text-zinc-400">Cycle budget used</span>
          <span className="font-mono font-bold text-emerald-400">{forecast.spentPercent}%</span>
        </div>
        <div className="h-1.5 overflow-hidden rounded-full bg-zinc-800">
          <div
            className="h-full rounded-full bg-emerald-500 transition-all"
            style={{ width: `${forecast.spentPercent}%` }}
          />
        </div>
        <div className="flex items-center justify-between text-xs pt-1">
          <span className="font-medium text-zinc-400">Top category</span>
          <span className="font-semibold text-white">{forecast.topCategory}</span>
        </div>
      </div>
    </div>
  )
}

