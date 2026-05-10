import { useEffect, useMemo, useRef, useState } from 'react'
import {
  Bell,
  LogOut,
  Wallet,
  BarChart3,
  LayoutDashboard,
  Settings,
  Sparkles,
  TrendingUp,
  ChevronDown,
} from 'lucide-react'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import { cn } from '../../lib/utils'
import API from '../../api'

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/expenses' },
  { icon: BarChart3, label: 'Analytics', path: '/analytics' },
  { icon: Settings, label: 'Settings', path: '/setting' },
]

export function Navbar() {
  const navigate = useNavigate()
  const location = useLocation()
  const userName = localStorage.getItem('userName') || 'User'
  const monthlyIncome = Number(localStorage.getItem('monthlyIncome') || 0)
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [expenses, setExpenses] = useState([])
  const notificationRef = useRef(null)
  const menuRef = useRef(null)

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

  const currentItem = navItems.find((item) => location.pathname.startsWith(item.path)) || navItems[0]

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('userName')
    localStorage.removeItem('userEmail')
    localStorage.removeItem('monthlyIncome')
    navigate('/login')
  }

  return (
    <header className="sticky top-0 z-30 border-b border-zinc-200/70 bg-white/90 backdrop-blur-xl">
      <div className="px-4 py-4 lg:px-10">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary text-white shadow-lg shadow-primary/20">
                <Wallet size={24} />
              </div>
              <div>
                <p className="text-lg font-display font-bold tracking-tight text-zinc-900">Spendora</p>
                <p className="text-xs font-medium uppercase tracking-[0.2em] text-zinc-400">Expense Tracker</p>
              </div>
            </div>

            <div className="flex items-center gap-3 xl:hidden">
              <div className="relative" ref={notificationRef}>
                <button
                  onClick={() => {
                    setIsNotificationsOpen((open) => !open)
                    setIsMenuOpen(false)
                  }}
                  className="relative p-2 text-zinc-500 hover:text-primary transition-colors"
                >
                  <Bell size={20} />
                  <span className="absolute top-2 right-2 h-2 w-2 rounded-full border-2 border-white bg-red-500"></span>
                </button>
                {isNotificationsOpen && <ForecastPopover forecast={forecast} />}
              </div>

              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => {
                    setIsMenuOpen((open) => !open)
                    setIsNotificationsOpen(false)
                  }}
                  className="inline-flex items-center gap-2 rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm font-semibold text-zinc-700 transition hover:border-zinc-300 hover:text-zinc-900"
                >
                  <currentItem.icon size={16} />
                  {currentItem.label}
                  <ChevronDown size={16} className={cn('transition-transform', isMenuOpen && 'rotate-180')} />
                </button>
                {isMenuOpen && <MenuPopover onLogout={handleLogout} closeMenu={() => setIsMenuOpen(false)} />}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between xl:flex-1 xl:justify-end">
            <div className="hidden items-center gap-4 xl:flex">
              <div className="relative" ref={notificationRef}>
                <button
                  onClick={() => {
                    setIsNotificationsOpen((open) => !open)
                    setIsMenuOpen(false)
                  }}
                  className="relative p-2 text-zinc-500 hover:text-primary transition-colors"
                >
                  <Bell size={20} />
                  <span className="absolute top-2 right-2 h-2 w-2 rounded-full border-2 border-white bg-red-500"></span>
                </button>
                {isNotificationsOpen && <ForecastPopover forecast={forecast} />}
              </div>

              <div className="h-10 w-px bg-zinc-200"></div>

              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="text-sm font-semibold leading-tight text-zinc-900">{userName}</p>
                  <p className="text-[11px] font-medium text-zinc-500">Premium Plan</p>
                </div>
                <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-2xl bg-zinc-200 ring-4 ring-zinc-50">
                  <img
                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${userName}`}
                    alt="User"
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="relative" ref={menuRef}>
                  <button
                    onClick={() => {
                      setIsMenuOpen((open) => !open)
                      setIsNotificationsOpen(false)
                    }}
                    className="inline-flex items-center gap-2 rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm font-semibold text-zinc-700 transition hover:border-zinc-300 hover:text-zinc-900"
                  >
                    <currentItem.icon size={16} />
                    {currentItem.label}
                    <ChevronDown size={16} className={cn('transition-transform', isMenuOpen && 'rotate-180')} />
                  </button>
                  {isMenuOpen && <MenuPopover onLogout={handleLogout} closeMenu={() => setIsMenuOpen(false)} />}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

function MenuPopover({ onLogout, closeMenu }) {
  return (
    <div className="absolute right-0 top-14 w-60 overflow-hidden rounded-[1.5rem] border border-zinc-200 bg-white p-3 shadow-2xl shadow-zinc-900/10">
      <div className="space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={closeMenu}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition-all',
                isActive
                  ? 'bg-surface-dark text-white'
                  : 'bg-white text-zinc-700 hover:bg-zinc-50 hover:text-zinc-900'
              )
            }
          >
            <item.icon size={18} />
            {item.label}
          </NavLink>
        ))}
      </div>

      <div className="my-3 h-px bg-zinc-200"></div>

      <button
        onClick={onLogout}
        className="flex w-full items-center gap-3 rounded-2xl bg-white px-4 py-3 text-left text-sm font-semibold text-red-600 transition hover:bg-red-50"
      >
        <LogOut size={18} />
        Logout
      </button>
    </div>
  )
}

function ForecastPopover({ forecast }) {
  return (
    <div className="absolute right-0 top-14 w-[320px] overflow-hidden rounded-[1.75rem] border border-zinc-200 bg-white p-5 shadow-2xl shadow-zinc-900/10">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.2em] text-primary">
            {/* <Sparkles size={12} /> */}
            AI Smart Forecast
          </div>
          <h3 className="text-base font-bold text-zinc-900">Your next spending signal</h3>
        </div>
        <div className="rounded-2xl bg-zinc-900 p-2 text-primary">
          <TrendingUp size={18} />
        </div>
      </div>

      <p className="text-sm leading-relaxed text-zinc-600">
        {forecast.totalExpense > 0
          ? `You're on track to save Rs ${forecast.projectedSavings.toLocaleString()} if spending stays steady.`
          : 'Start adding expenses and your forecast will appear here instantly.'}
      </p>

      <div className="mt-4 space-y-3 rounded-[1.25rem] bg-zinc-50 p-4">
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium text-zinc-500">Spent this cycle</span>
          <span className="font-bold text-zinc-900">{forecast.spentPercent}%</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-zinc-200">
          <div
            className="h-full rounded-full bg-primary transition-all"
            style={{ width: `${forecast.spentPercent}%` }}
          />
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium text-zinc-500">Top category</span>
          <span className="font-bold text-zinc-900">{forecast.topCategory}</span>
        </div>
      </div>

      <p className="mt-4 text-xs font-medium leading-relaxed text-zinc-500">
        Tip: keep your highest category under control to improve your month-end balance.
      </p>
    </div>
  )
}
