import { useState, useEffect, useRef } from "react";
import { Layout } from "../components/layout/Layout";
import { StatCard } from "../components/dashboard/StatCard";
import { SMSDetector } from "../components/dashboard/SMSDetector";
import { ExpenseTable } from "../components/dashboard/ExpenseTable";
import { ExpenseForm } from "../components/dashboard/ExpenseForm";
import API from "../api";
import LoadingSpinner from "../components/LoadingSpinner";
import toast from "react-hot-toast";
import { 
  Wallet, 
  ArrowUpRight, 
  ArrowDownRight, 
  CreditCard, 
  Plus, 
  Sparkles
} from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import { formatCurrency } from '../lib/utils'

export default function Dashboard() {
  const [expenses, setExpenses] = useState([])
  const [monthlyIncome, setMonthlyIncome] = useState(Number(localStorage.getItem('monthlyIncome') || 0))
  const [loading, setLoading] = useState(true)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingExpense, setEditingExpense] = useState(null)
  const [smsAutofillData, setSmsAutofillData] = useState(null)
  const formRef = useRef(null)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem("token")
      const [expensesRes, profileRes] = await Promise.all([
        API.get("/expenses", {
          headers: { Authorization: `Bearer ${token}` }
        }),
        API.get("/auth/profile", {
          headers: { Authorization: `Bearer ${token}` }
        })
      ])

      setExpenses(expensesRes.data || [])
      const income = Number(profileRes.data?.monthlyIncome || 0)
      setMonthlyIncome(income)
      localStorage.setItem('monthlyIncome', String(income))
      if (profileRes.data?.name) {
        localStorage.setItem('userName', profileRes.data.name)
      }
      if (profileRes.data?.email) {
        localStorage.setItem('userEmail', profileRes.data.email)
      }
    } catch (err) {
      toast.error("Failed to load dashboard")
      console.error(err)
      setExpenses([])
    } finally {
      setLoading(false)
    }
  }

  const fetchExpenses = async () => {
    try {
      const token = localStorage.getItem("token")
      const res = await API.get("/expenses", {
        headers: { Authorization: `Bearer ${token}` }
      })
      setExpenses(res.data || [])
    } catch (err) {
      toast.error("Failed to load expenses")
      console.error(err)
      setExpenses([])
    }
  }

  const handleSMSDetect = (data) => {
    setSmsAutofillData(data)
    setIsFormOpen(true)
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "center" })
  }

  const handleFormSubmit = async () => {
    await fetchExpenses()
    setSmsAutofillData(null)
  }

  const handleEdit = (expense) => {
    setEditingExpense(expense)
    setSmsAutofillData(null)
    setIsFormOpen(true)
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "center" })
  }

  const handleCloseForm = () => {
    setIsFormOpen(false)
    setEditingExpense(null)
    setSmsAutofillData(null)
  }

  if (loading) return <LoadingSpinner message="Loading dashboard..." />

  // Calculate stats
  const totalExpense = expenses.reduce((sum, e) => sum + Number(e.amount), 0)
  const totalBalance = monthlyIncome - totalExpense
  const averageTransaction = expenses.length > 0 ? totalExpense / expenses.length : 0
  const balancePercent = monthlyIncome > 0 ? ((totalBalance / monthlyIncome) * 100).toFixed(1) : '0.0'
  const expensePercent = monthlyIncome > 0 ? ((totalExpense / monthlyIncome) * 100).toFixed(1) : '0.0'

  // Get category breakdown
  const categoryBreakdown = expenses.reduce((acc, e) => {
    const cat = e.category || 'Other'
    const existing = acc.find(d => d.name === cat)
    if (existing) {
      existing.value += Number(e.amount)
    } else {
      acc.push({ name: cat, value: Number(e.amount) })
    }
    return acc
  }, [])

  // Sort expenses by date (newest first)
  const sortedExpenses = [...expenses].sort((a, b) => 
    new Date(b.date) - new Date(a.date)
  ).slice(0, 10)

  return (
    <Layout>
      <div className="space-y-8">
        {/* Header (60% Black, 30% White, 10% Green on Total Balance) */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold font-display text-white">
              Good Morning, {localStorage.getItem('userName') || 'User'}
            </h1>
            <p className="text-zinc-400 text-sm mt-1">
              Today's expense balance is <span className="text-emerald-400 font-bold font-mono">{formatCurrency(totalBalance)}</span>
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsFormOpen(true)}
              className="bg-emerald-500 text-black font-semibold px-5 py-2.5 rounded-xl flex items-center gap-2 hover:bg-emerald-400 active:scale-95 shadow-lg shadow-emerald-500/20 transition text-sm"
            >
              <Plus size={16} />
              Add Expense
            </button>
          </div>
        </div>

        {/* Stat Cards: Emerald reserved ONLY for the 1 major metric (Total Balance) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          <StatCard 
            index={0}
            title="Total Balance" 
            value={formatCurrency(totalBalance)} 
            change={`${balancePercent}%`} 
            trend="up" 
            icon={Wallet} 
            color="emerald" 
          />
          <StatCard 
            index={1}
            title="Monthly Income" 
            value={formatCurrency(monthlyIncome)} 
            change="+0.0%" 
            trend="up" 
            icon={ArrowUpRight} 
            color="neutral" 
          />
          <StatCard 
            index={2}
            title="Total Expense" 
            value={formatCurrency(totalExpense)} 
            change={`+${expensePercent}%`} 
            trend="down" 
            icon={ArrowDownRight} 
            color="danger" 
          />
          <StatCard 
            index={3}
            title="Avg. Transaction" 
            value={formatCurrency(averageTransaction)} 
            change={`${expenses.length} transactions`} 
            trend="up" 
            icon={CreditCard} 
            color="neutral" 
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8">
          <div className="xl:col-span-2 space-y-6 lg:space-y-8">
            {/* SMS Detector and Upgrade Card */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <SMSDetector onDetect={handleSMSDetect} />
              <div className="bg-zinc-900/90 rounded-2xl p-6 shadow-sm border border-zinc-800 flex flex-col justify-between relative overflow-hidden backdrop-blur-sm">
                <div>
                  <div className="w-10 h-10 border border-white/10 bg-white/5 rounded-xl flex items-center justify-center mb-5 text-zinc-300">
                    <Sparkles size={18} />
                  </div>
                  <h3 className="text-lg font-bold font-display text-white mb-1.5">Upgrade to Pro</h3>
                  <p className="text-zinc-400 text-xs mb-6 leading-relaxed">
                    Get advanced analytics, budgeting tools, and expense predictions.
                  </p>
                </div>
                <button className="w-full py-2.5 border border-white/20 bg-white/10 text-white font-semibold rounded-xl hover:bg-white/20 transition active:scale-95 text-xs">
                  Upgrade Now
                </button>
              </div>
            </div>

            {/* Expense Table */}
            <ExpenseTable 
              transactions={sortedExpenses} 
              onEdit={handleEdit}
              onRefresh={fetchExpenses}
            />
          </div>

          {/* Spending Card - Sidebar */}
          <div className="space-y-6 text-white">
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.15 }}
              className="rounded-2xl border border-zinc-800 bg-zinc-900/95 p-7 shadow-xl relative overflow-hidden backdrop-blur-xl"
            >
              <div className="absolute top-[-20%] right-[-10%] w-64 h-64 bg-white/[0.02] rounded-full blur-[80px]"></div>
              <div className="relative z-10">
                <div className="flex justify-between items-center mb-8">
                  <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Spending Card</span>
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-zinc-300">
                    <CreditCard size={16} />
                  </div>
                </div>
                <div className="space-y-4 mb-8">
                  <h2 className="text-3xl sm:text-4xl font-bold font-display tracking-tight leading-none text-white">
                    {formatCurrency(totalExpense)}
                  </h2>
                  <div className="flex items-center gap-3">
                    <p className="text-xs font-mono text-zinc-400 tracking-wider">5432 •••• •••• 9801</p>
                    <span className="text-[10px] font-bold bg-white/10 px-2 py-0.5 rounded border border-white/10 uppercase tracking-widest text-zinc-300 font-mono">
                      Visa
                    </span>
                  </div>
                </div>
                <div className="flex justify-between items-end border-t border-zinc-800 pt-4">
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-zinc-500 mb-0.5">Card Holder</p>
                    <p className="font-bold text-xs font-display text-white">{(localStorage.getItem('userName') || 'USER').toUpperCase()}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] uppercase tracking-widest text-zinc-500 mb-0.5">Limit</p>
                    <p className="font-bold text-xs font-mono text-zinc-200">{formatCurrency(monthlyIncome)}</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Category Summary */}
            {categoryBreakdown.length > 0 && (
              <div className="rounded-2xl border border-zinc-800 bg-zinc-900/90 p-6 shadow-sm backdrop-blur-sm">
                <h3 className="text-base font-bold font-display text-white mb-5">Spending by Category</h3>
                <div className="space-y-3.5">
                  {categoryBreakdown.map((cat, idx) => (
                    <div key={idx}>
                      <div className="flex justify-between mb-1.5 text-xs">
                        <span className="font-semibold text-zinc-300">{cat.name}</span>
                        <span className="font-mono font-bold text-white">{formatCurrency(cat.value)}</span>
                      </div>
                      <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-white rounded-full transition-all"
                          style={{width: `${(cat.value / (totalExpense || 1)) * 100}%`}}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Expense Form Modal */}
      <AnimatePresence>
        {isFormOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <div ref={formRef}>
              <ExpenseForm 
                initialData={editingExpense || smsAutofillData}
                onClose={handleCloseForm}
                onSubmit={handleFormSubmit}
                isEditing={!!editingExpense}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Layout>
  )
}
