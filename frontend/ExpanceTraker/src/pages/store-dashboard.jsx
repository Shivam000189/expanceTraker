import { useEffect, useMemo, useState } from "react";
import { Store, TrendingUp } from "lucide-react";
import toast from "react-hot-toast";
import API from "../api";
import LoadingSpinner from "../components/LoadingSpinner";
import { Layout } from "../components/layout/Layout";
import { EarningsToggle } from "../components/store/EarningsToggle";
import { LatestTransactionAlert } from "../components/store/LatestTransactionAlert";
import { UPIQRGenerator } from "../components/store/UPIQRGenerator";
import { formatCurrency } from "../lib/utils";

function sortByNewest(expenses = []) {
  return [...expenses].sort((a, b) => new Date(b.date) - new Date(a.date));
}

export default function StoreDashboard() {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadExpenses = async () => {
      try {
        setLoading(true);
        const response = await API.get("/expenses");
        setExpenses(response.data || []);
      } catch (error) {
        console.error("Failed to load store dashboard:", error);
        toast.error("Failed to load store dashboard");
        setExpenses([]);
      } finally {
        setLoading(false);
      }
    };

    loadExpenses();
  }, []);

  const recentTransactions = useMemo(
    () => sortByNewest(expenses).slice(0, 8),
    [expenses]
  );
  const todayRevenue = useMemo(() => {
    const today = new Date();

    return expenses
      .filter((expense) => {
        const expenseDate = new Date(expense.date);
        return (
          expenseDate.getFullYear() === today.getFullYear() &&
          expenseDate.getMonth() === today.getMonth() &&
          expenseDate.getDate() === today.getDate()
        );
      })
      .reduce((sum, expense) => sum + Number(expense.amount || 0), 0);
  }, [expenses]);

  if (loading) {
    return <LoadingSpinner message="Loading store dashboard..." />;
  }

  return (
    <Layout>
      <div className="h-full min-h-0 flex flex-col justify-between gap-3 overflow-hidden">
        {/* Header Ribbon */}
        <div className="shrink-0 flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-[24px] border border-white/10 bg-[#131313] px-5 py-4 shadow-[0_10px_30px_rgba(0,0,0,0.3)]">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full border border-[#10EE74]/20 bg-[#0D2E18] px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-[#10EE74]">
              <Store size={11} />
              Store Dashboard
            </div>
            <h1 className="text-lg font-bold font-display text-white tracking-tight mt-1">
              In-Store Merchant Activity
            </h1>
            <p className="text-xs text-gray-400">
              Live feed, daily earnings snapshot, and instant UPI QR
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-3 rounded-2xl border border-white/5 bg-[#1C1C1C] px-4 py-2">
              <TrendingUp size={16} className="text-[#10EE74]" />
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                  Today Collected
                </p>
                <p className="font-mono text-xl font-bold text-[#10EE74]">
                  {formatCurrency(todayRevenue)}
                </p>
              </div>
            </div>
            <UPIQRGenerator />
          </div>
        </div>

        {/* 2-Column Bento Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start flex-1 min-h-0">
          {/* Left Column (6 cols) */}
          <div className="lg:col-span-6 flex flex-col gap-4 h-full overflow-y-auto pr-1">
            <LatestTransactionAlert />
            <EarningsToggle expenses={expenses} />
          </div>

          {/* Right Column (6 cols) */}
          <div className="lg:col-span-6 rounded-[24px] border border-white/10 bg-[#131313] p-5 shadow-[0_10px_30px_rgba(0,0,0,0.3)] flex flex-col h-full min-h-0">
            <div className="mb-4 flex items-center justify-between gap-4 border-b border-white/5 pb-3">
              <div>
                <h2 className="text-sm sm:text-base font-bold text-white font-display">
                  Recent store activity
                </h2>
                <p className="text-xs text-gray-400">
                  Chronological feed of incoming customer purchases
                </p>
              </div>
              <span className="rounded-full border border-white/10 bg-[#1C1C1C] px-3 py-1 font-mono text-xs text-gray-400">
                {recentTransactions.length} items
              </span>
            </div>

            <div className="space-y-2.5 max-h-[calc(100vh-270px)] overflow-y-auto pr-1 divide-y divide-white/5">
              {recentTransactions.length > 0 ? (
                recentTransactions.map((tx) => (
                  <div
                    key={tx._id}
                    className="pt-2.5 first:pt-0 flex items-center justify-between gap-3 text-xs"
                  >
                    <div>
                      <p className="font-medium text-white">{tx.title}</p>
                      <p className="text-[11px] text-gray-400 font-mono mt-0.5">
                        {new Date(tx.date).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                        })}
                        {" · "}
                        {tx.category || "General"}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-mono font-bold text-white text-sm">
                        {formatCurrency(tx.amount)}
                      </p>
                      <span className="inline-flex items-center gap-1 text-[10px] text-[#10EE74] font-medium font-mono">
                        <span className="h-1.5 w-1.5 rounded-full bg-[#10EE74]" />
                        Success
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-8 text-center text-xs text-gray-500">
                  No activity recorded today.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
