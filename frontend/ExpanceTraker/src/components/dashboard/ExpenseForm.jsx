import { useState, useEffect } from 'react'
import { X, Plus, Calendar, Tag, User, IndianRupee } from 'lucide-react'
import { motion } from 'framer-motion'
import API from '../../api'
import toast from 'react-hot-toast'

const categories = [
  'Food & Dining',
  'Shopping',
  'Transportation',
  'Bills & Utilities',
  'Entertainment',
  'Healthcare',
  'Travel',
  'Education',
  'Investment',
  'Other'
]

export function ExpenseForm({ onClose, onSubmit, initialData = null, isEditing = false }) {
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    category: 'Food & Dining',
    date: new Date().toISOString().split('T')[0],
    description: ''
  })
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || initialData.merchant || '',
        amount: initialData.amount ? String(initialData.amount) : '',
        category: initialData.category || 'Food & Dining',
        date: initialData.date ? new Date(initialData.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        description: initialData.description || ''
      })
    }
  }, [initialData])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const token = localStorage.getItem('token')
      const payload = {
        title: formData.title,
        amount: Number(formData.amount),
        category: formData.category,
        date: formData.date,
        description: formData.description
      }

      if (isEditing && initialData?._id) {
        await API.put(`/expenses/${initialData._id}`, payload, {
          headers: { Authorization: `Bearer ${token}` }
        })
        toast.success('Expense updated successfully')
      } else {
        await API.post('/expenses', payload, {
          headers: { Authorization: `Bearer ${token}` }
        })
        toast.success('Expense added successfully')
      }

      onSubmit()
      onClose()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save expense')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      className="bg-zinc-950 rounded-2xl p-7 shadow-2xl border border-zinc-800 w-full max-w-lg relative overflow-hidden backdrop-blur-xl"
    >
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-white/20"></div>
      
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold font-display text-white">
            {isEditing ? 'Edit Expense' : 'Add New Expense'}
          </h2>
          <p className="text-zinc-400 text-xs mt-0.5">
            {isEditing ? 'Update transaction details' : 'Enter transaction details manually'}
          </p>
        </div>
        <button 
          onClick={onClose}
          className="p-1.5 hover:bg-white/5 rounded-lg transition-colors text-zinc-400 hover:text-white"
        >
          <X size={20} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-4">
          <div className="relative group">
            <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-white transition-colors" size={16} />
            <input
              type="text"
              required
              placeholder="Merchant or Service Title"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-2.5 pl-10 pr-4 focus:ring-1 focus:ring-white/20 focus:border-zinc-500 outline-none transition text-sm text-white placeholder-zinc-500 font-medium"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="relative group">
              <IndianRupee className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-white transition-colors" size={16} />
              <input
                type="number"
                required
                placeholder="Amount"
                value={formData.amount}
                onChange={(e) => setFormData({...formData, amount: e.target.value})}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-2.5 pl-10 pr-4 focus:ring-1 focus:ring-white/20 focus:border-zinc-500 outline-none transition text-sm text-white placeholder-zinc-500 font-medium font-mono"
              />
            </div>
            
            <div className="relative group">
              <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-white transition-colors" size={16} />
              <input
                type="date"
                required
                value={formData.date}
                onChange={(e) => setFormData({...formData, date: e.target.value})}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-2.5 pl-10 pr-4 focus:ring-1 focus:ring-white/20 focus:border-zinc-500 outline-none transition text-sm text-white placeholder-zinc-500 font-medium font-mono"
              />
            </div>
          </div>

          <div className="relative group">
            <Tag className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-white transition-colors" size={16} />
            <select
              value={formData.category}
              onChange={(e) => setFormData({...formData, category: e.target.value})}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-2.5 pl-10 pr-4 focus:ring-1 focus:ring-white/20 focus:border-zinc-500 outline-none transition text-sm text-white font-medium appearance-none"
            >
              {categories.map(cat => (
                <option key={cat} value={cat} className="bg-zinc-900 text-white">{cat}</option>
              ))}
            </select>
          </div>

          <textarea
            placeholder="Add a note or description..."
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            className="w-full h-20 bg-zinc-900 border border-zinc-800 rounded-xl p-3 focus:ring-1 focus:ring-white/20 focus:border-zinc-500 outline-none transition text-sm text-white placeholder-zinc-500 font-medium resize-none"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-emerald-500 text-black font-semibold py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-emerald-400 transition shadow-lg shadow-emerald-500/20 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed text-sm"
        >
          <Plus size={18} />
          {isLoading ? 'Saving...' : isEditing ? 'Update Transaction' : 'Save Transaction'}
        </button>
      </form>
    </motion.div>
  )
}
