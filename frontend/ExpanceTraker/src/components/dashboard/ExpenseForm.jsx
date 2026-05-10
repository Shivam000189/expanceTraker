import { useState, useEffect } from 'react'
import { Plus, X, Calendar, User, Tag, IndianRupee } from 'lucide-react'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import API from '../../api'

export function ExpenseForm({ initialData, onClose, onSubmit, isEditing = false }) {
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    category: 'Other',
    date: new Date().toISOString().split('T')[0],
    description: ''
  })
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (initialData) {
      const dateStr = initialData.date instanceof Date 
        ? initialData.date.toISOString().split('T')[0]
        : (initialData.date || new Date().toISOString()).split('T')[0]
      
      setFormData({
        title: initialData.title || initialData.merchant || '',
        amount: initialData.amount?.toString() || '',
        category: initialData.category || 'Other',
        date: dateStr,
        description: initialData.description || initialData.paymentMethod || ''
      })
    }
  }, [initialData])

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.title || !formData.amount || !formData.category) {
      toast.error('Please fill all required fields')
      return
    }

    setIsLoading(true)
    try {
      const token = localStorage.getItem('token')
      const payload = {
        title: formData.title,
        amount: parseFloat(formData.amount),
        category: formData.category,
        date: formData.date,
        description: formData.description
      }

      if (isEditing && initialData?._id) {
        await API.put(`/expenses/${initialData._id}`, payload, {
          headers: { Authorization: `Bearer ${token}` }
        })
        toast.success('Expense updated successfully!')
      } else {
        await API.post('/expenses', payload, {
          headers: { Authorization: `Bearer ${token}` }
        })
        toast.success('Expense added successfully!')
      }

      onSubmit()
      onClose()
    } catch (err) {
      toast.error(err.response?.data?.msg || err.response?.data?.message || 'Failed to save expense')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const categories = ['Food', 'Shopping', 'Travel', 'Bills', 'Entertainment', 'Other']

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="bg-white rounded-[2.5rem] p-8 shadow-2xl border border-zinc-100 w-full max-w-lg relative overflow-hidden"
    >
      <div className="absolute top-0 left-0 right-0 h-2 bg-primary"></div>
      
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold font-display text-zinc-900">
            {isEditing ? 'Edit Expense' : 'Add New Expense'}
          </h2>
          <p className="text-zinc-500 text-sm">
            {isEditing ? 'Update transaction details' : 'Enter transaction details manually'}
          </p>
        </div>
        <button 
          onClick={onClose}
          className="p-2 hover:bg-zinc-100 rounded-xl transition-colors text-zinc-400 hover:text-zinc-900"
        >
          <X size={24} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div className="relative group">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-primary transition-colors" size={18} />
            <input
              type="text"
              required
              placeholder="Merchant or Service Title"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl py-4 pl-12 pr-4 focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all font-medium"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="relative group">
              <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-primary transition-colors" size={18} />
              <input
                type="number"
                required
                placeholder="Amount"
                value={formData.amount}
                onChange={(e) => setFormData({...formData, amount: e.target.value})}
                className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl py-4 pl-12 pr-4 focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all font-medium"
              />
            </div>
            
            <div className="relative group">
              <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-primary transition-colors" size={18} />
              <input
                type="date"
                required
                value={formData.date}
                onChange={(e) => setFormData({...formData, date: e.target.value})}
                className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl py-4 pl-12 pr-4 focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all font-medium"
              />
            </div>
          </div>

          <div className="relative group">
            <Tag className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-primary transition-colors" size={18} />
            <select
              value={formData.category}
              onChange={(e) => setFormData({...formData, category: e.target.value})}
              className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl py-4 pl-12 pr-4 focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all font-medium appearance-none"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <textarea
            placeholder="Add a note or description..."
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            className="w-full h-24 bg-zinc-50 border border-zinc-200 rounded-2xl p-4 focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all font-medium resize-none"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-primary text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-primary-dark transition-all shadow-lg shadow-primary/30 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Plus size={20} />
          {isLoading ? 'Saving...' : isEditing ? 'Update Transaction' : 'Save Transaction'}
        </button>
      </form>
    </motion.div>
  )
}
