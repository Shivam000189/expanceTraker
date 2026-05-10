import { ShoppingBag, Coffee, Car, CreditCard, ChevronRight, Utensils, Zap, MoreHorizontal, Trash2, Edit2 } from 'lucide-react'
import { formatCurrency } from '../../lib/utils'
import { cn } from '../../lib/utils'
import toast from 'react-hot-toast'
import API from '../../api'

const iconMap = {
  Food: { icon: Utensils, color: 'bg-orange-100 text-orange-600' },
  Shopping: { icon: ShoppingBag, color: 'bg-blue-100 text-blue-600' },
  Travel: { icon: Car, color: 'bg-purple-100 text-purple-600' },
  Bills: { icon: Zap, color: 'bg-emerald-100 text-emerald-600' },
  Entertainment: { icon: Coffee, color: 'bg-pink-100 text-pink-600' },
  Other: { icon: CreditCard, color: 'bg-zinc-100 text-zinc-600' },
}

export function ExpenseTable({ transactions, onEdit, onDelete, onRefresh }) {
  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('token')
      await API.delete(`/expenses/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      toast.success('Expense deleted successfully!')
      onRefresh()
    } catch (err) {
      toast.error('Failed to delete expense')
      console.error(err)
    }
  }

  return (
    <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-zinc-100">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-xl font-bold font-display">Recent Transactions</h2>
          <p className="text-sm text-zinc-500">Your latest spending activities</p>
        </div>
        <button className="text-sm font-bold text-primary flex items-center gap-1 hover:gap-2 transition-all">
          View All <ChevronRight size={16} />
        </button>
      </div>

      <div className="space-y-6">
        {transactions && transactions.length > 0 ? (
          transactions.map((tx) => {
            const category = tx.category || 'Other'
            const cat = iconMap[category] || iconMap.Other
            const Icon = cat.icon
            const dateStr = new Date(tx.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })

            return (
              <div key={tx._id} className="flex items-center group cursor-pointer hover:bg-zinc-50 p-3 -mx-3 rounded-2xl transition-all border border-transparent hover:border-zinc-100">
                <div className={cn('w-12 h-12 rounded-2xl flex items-center justify-center mr-4 shadow-sm', cat.color)}>
                  <Icon size={20} />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-bold text-zinc-900 truncate">{tx.title}</h4>
                  <p className="text-xs font-medium text-zinc-400">{dateStr}</p>
                </div>
                <div className="text-right ml-4">
                  <p className="text-sm font-bold text-zinc-900">{formatCurrency(tx.amount)}</p>
                  <div className="flex items-center justify-end gap-1 text-[10px] uppercase tracking-wider font-bold text-zinc-400">
                    <p>{category}</p>
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity ml-2 flex gap-2">
                      <button
                        onClick={() => onEdit && onEdit(tx)}
                        className="text-primary hover:text-primary-dark"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        onClick={() => handleDelete(tx._id)}
                        className="text-red-500 hover:text-red-600"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )
          })
        ) : (
          <div className="py-10 text-center">
            <div className="w-16 h-16 bg-zinc-100 rounded-full flex items-center justify-center mx-auto mb-4 text-zinc-400">
              <CreditCard size={32} />
            </div>
            <p className="text-zinc-500 font-medium italic">No transactions recorded yet</p>
          </div>
        )}
      </div>
    </div>
  )
}
