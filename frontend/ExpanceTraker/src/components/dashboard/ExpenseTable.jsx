import { ShoppingBag, Coffee, Car, CreditCard, Utensils, Zap, Trash2, Edit2 } from 'lucide-react'
import { formatCurrency } from '../../lib/utils'
import { cn } from '../../lib/utils'
import toast from 'react-hot-toast'
import API from '../../api'

const iconMap = {
  Food: { icon: Utensils, color: 'border border-white/10 bg-zinc-800 text-zinc-300' },
  Shopping: { icon: ShoppingBag, color: 'border border-white/10 bg-zinc-800 text-zinc-300' },
  Travel: { icon: Car, color: 'border border-white/10 bg-zinc-800 text-zinc-300' },
  Bills: { icon: Zap, color: 'border border-white/10 bg-zinc-800 text-zinc-300' },
  Entertainment: { icon: Coffee, color: 'border border-white/10 bg-zinc-800 text-zinc-300' },
  Other: { icon: CreditCard, color: 'border border-white/10 bg-zinc-800 text-zinc-400' },
}

export function ExpenseTable({ transactions, onEdit, onDelete, onRefresh }) {
  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('token')
      await API.delete(`/expenses/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      toast.success('Expense deleted successfully!')
      if (onDelete) onDelete(id)
      onRefresh()
    } catch (err) {
      toast.error('Failed to delete expense')
      console.error(err)
    }
  }

  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900/90 p-6 shadow-sm backdrop-blur-sm">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-lg font-bold font-display text-white">Recent Transactions</h2>
          <p className="text-xs text-zinc-400 mt-0.5">Your latest spending activities</p>
        </div>
        <span className="rounded-full border border-zinc-800 bg-zinc-950 px-3 py-1 text-xs font-mono text-zinc-400">
          {transactions ? transactions.length : 0} items
        </span>
      </div>

      <div className="space-y-3">
        {transactions && transactions.length > 0 ? (
          transactions.map((tx) => {
            const category = tx.category || 'Other'
            const cat = iconMap[category] || iconMap.Other
            const Icon = cat.icon
            const dateStr = new Date(tx.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })

            return (
              <div
                key={tx._id}
                className="flex items-center group cursor-pointer hover:bg-white/[0.04] p-3 rounded-xl transition-all border border-transparent hover:border-zinc-800"
              >
                <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center mr-3.5 shrink-0 shadow-sm', cat.color)}>
                  <Icon size={18} />
                </div>
                <div className="flex-1 min-w-0 pr-3">
                  <h4 className="text-sm font-semibold text-white truncate">{tx.title}</h4>
                  <p className="text-xs font-mono text-zinc-500">{dateStr}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-bold font-mono text-white">{formatCurrency(tx.amount)}</p>
                  <div className="flex items-center justify-end gap-1.5 mt-0.5">
                    <span className="text-[10px] uppercase font-mono tracking-wider text-zinc-400 rounded border border-white/10 bg-zinc-950/60 px-1.5 py-0.5">
                      {category}
                    </span>
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity ml-1 flex gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          if (onEdit) onEdit(tx)
                        }}
                        className="text-zinc-400 hover:text-white transition"
                        title="Edit expense"
                      >
                        <Edit2 size={13} />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDelete(tx._id)
                        }}
                        className="text-zinc-400 hover:text-red-400 transition"
                        title="Delete expense"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )
          })
        ) : (
          <div className="py-12 text-center">
            <div className="w-12 h-12 rounded-xl bg-zinc-800/60 border border-white/10 flex items-center justify-center mx-auto mb-3 text-zinc-500">
              <CreditCard size={22} />
            </div>
            <p className="text-zinc-400 text-sm">No expenses recorded yet</p>
          </div>
        )}
      </div>
    </div>
  )
}
