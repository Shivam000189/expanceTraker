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
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold font-display text-zinc-900">
              Good Morning, {localStorage.getItem('userName') || 'User'}
            </h1>
            <p className="text-zinc-500 mt-1">
              Today's expense balance is <span className="text-primary font-bold">{formatCurrency(totalBalance)}</span>
            </p>
          </div>
          <div className="flex items-center gap-3">
            {/* <div className="bg-white px-4 py-2 rounded-2xl border border-zinc-100 shadow-sm flex items-center gap-2 text-sm font-bold text-zinc-600">
              <span className="w-2 h-2 bg-primary rounded-full animate-pulse"></span>
              Live Feed
            </div> */}
            <button 
              onClick={() => setIsFormOpen(true)}
              className="bg-primary text-white font-bold px-6 py-3 rounded-2xl flex items-center gap-2 hover:bg-primary-dark transition-all shadow-lg shadow-primary/30 active:scale-95"
            >
              <Plus size={18} />
              Add Expense
            </button>
          </div>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard 
            title="Total Balance" 
            value={formatCurrency(totalBalance)} 
            change={`${balancePercent}%`} 
            trend="up" 
            icon={Wallet} 
            color="primary" 
          />
          <StatCard 
            title="Monthly Income" 
            value={formatCurrency(monthlyIncome)} 
            change="+0.0%" 
            trend="up" 
            icon={ArrowUpRight} 
            color="blue" 
          />
          <StatCard 
            title="Total Expense" 
            value={formatCurrency(totalExpense)} 
            change={`+${expensePercent}%`} 
            trend="down" 
            icon={ArrowDownRight} 
            color="orange" 
          />
          <StatCard 
            title="Avg. Transaction" 
            value={formatCurrency(averageTransaction)} 
            change={`${expenses.length} transactions`} 
            trend="up" 
            icon={CreditCard} 
            color="purple" 
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          <div className="xl:col-span-2 space-y-8">
            {/* SMS Detector and Upgrade Card */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <SMSDetector onDetect={handleSMSDetect} />
              <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-zinc-100 flex flex-col justify-between relative overflow-hidden group">
                {/* <div className="absolute top-0 right-0 p-8 opacity-5 -rotate-12 group-hover:rotate-0 transition-transform duration-500">
                  <Sparkles size={120} className="text-primary" />
                </div> */}
                <div>
                  <div className="w-12 h-12 bg-zinc-900 rounded-2xl flex items-center justify-center mb-6 text-white shadow-xl">
                    <Sparkles size={24} />
                  </div>
                  <h3 className="text-xl font-bold font-display mb-2">Upgrade to Pro</h3>
                  <p className="text-zinc-500 text-sm mb-6 leading-relaxed">
                    Get advanced analytics, budgeting tools, and expense predictions.
                  </p>
                </div>
                <button className="w-full py-4 bg-primary text-white font-bold rounded-2xl hover:bg-primary-dark transition-all shadow-lg shadow-primary/20">
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
          <div className="space-y-8 text-white">
            <div className="bg-surface-dark rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden">
               <div className="absolute top-[-20%] right-[-10%] w-64 h-64 bg-primary/20 rounded-full blur-[80px]"></div>
               <div className="relative z-10">
                 <div className="flex justify-between items-center mb-10">
                   <p className="text-sm font-medium text-zinc-400">My Spending Card</p>
                   <CreditCard size={24} className="text-primary" />
                 </div>
                 <div className="space-y-6 mb-10">
                   <h2 className="text-4xl font-bold font-display tracking-tight leading-none">
                     {formatCurrency(totalExpense)}
                   </h2>
                   <div className="flex items-center gap-4">
                     <p className="text-sm font-mono text-zinc-400">5432 •••• •••• 9801</p>
                     <span className="text-[10px] font-bold bg-white/10 px-2 py-0.5 rounded border border-white/10 uppercase tracking-widest text-zinc-400">
                       Visa
                     </span>
                   </div>
                 </div>
                 <div className="flex justify-between items-end">
                   <div>
                     <p className="text-[10px] uppercase tracking-widest text-zinc-500 mb-1">Card Holder</p>
                     <p className="font-bold font-display">{(localStorage.getItem('userName') || 'USER').toUpperCase()}</p>
                   </div>
                   <div className="text-right">
                     <p className="text-[10px] uppercase tracking-widest text-zinc-500 mb-1">Limit</p>
                     <p className="font-bold font-mono">{formatCurrency(monthlyIncome)}</p>
                   </div>
                 </div>
               </div>
            </div>

            {/* Category Summary */}
            {categoryBreakdown.length > 0 && (
              <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-zinc-100">
                <h3 className="text-lg font-bold font-display mb-6">Spending by Category</h3>
                <div className="space-y-4">
                  {categoryBreakdown.map((cat, idx) => (
                    <div key={idx}>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-semibold text-zinc-700">{cat.name}</span>
                        <span className="text-sm font-bold text-zinc-900">{formatCurrency(cat.value)}</span>
                      </div>
                      <div className="w-full h-2 bg-zinc-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-primary"
                          style={{width: `${(cat.value / totalExpense) * 100}%`}}
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
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
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
