import { useEffect, useState } from "react";
import { ArrowRightLeft, Landmark, PlusCircle, ShieldCheck, Sparkles } from "lucide-react";
import toast from "react-hot-toast";
import API from "../api";
import { Layout } from "../components/layout/Layout";

export default function Bank() {
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [topUpSubmitting, setTopUpSubmitting] = useState(false);
  const [recipients, setRecipients] = useState([]);
  const [form, setForm] = useState({ recipientEmail: "", amount: "" });
  const [topUpForm, setTopUpForm] = useState({ amount: "" });
  const userName = localStorage.getItem("userName") || "User";
  const userEmail = localStorage.getItem("userEmail") || "No email linked";

  const formatCurrency = (value) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(Number(value || 0));

  const loadBalance = async () => {
    try {
      const response = await API.get("/bank/balance");
      setBalance(response.data?.balance ?? 0);
    } catch (error) {
      console.error("Failed to load bank balance:", error);
      toast.error(error.response?.data?.message || "Unable to load bank balance");
    } finally {
      setLoading(false);
    }
  };

  const loadRecipients = async () => {
    try {
      const response = await API.get("/bank/recipients");
      setRecipients(response.data?.recipients ?? []);
    } catch (error) {
      console.error("Failed to load recipients:", error);
    }
  };

  useEffect(() => {
    loadBalance();
    loadRecipients();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!form.recipientEmail || !form.amount) {
      toast.error("Please enter the recipient email and amount");
      return;
    }

    try {
      setSubmitting(true);
      await API.post("/bank/transfer", {
        recipientId: form.recipientEmail,
        amount: Number(form.amount),
      });

      toast.success("Transfer completed successfully");
      setForm({ recipientEmail: "", amount: "" });
      await loadBalance();
    } catch (error) {
      toast.error(error.response?.data?.message || "Transfer failed");
    } finally {
      setSubmitting(false);
    }
  };

  const handleAddBalance = async (event) => {
    event.preventDefault();

    if (!topUpForm.amount) {
      toast.error("Please enter an amount to add");
      return;
    }

    try {
      setTopUpSubmitting(true);
      await API.post("/bank/add-balance", {
        amount: Number(topUpForm.amount),
      });

      toast.success("Balance added successfully");
      setTopUpForm({ amount: "" });
      await loadBalance();
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to add balance");
    } finally {
      setTopUpSubmitting(false);
    }
  };

  return (
    <Layout contentClassName="px-4 py-4 sm:px-6 lg:px-8 max-w-7xl w-full mx-auto">
      <div className="flex flex-col gap-4">
        {/* Header Ribbon in Single Frame */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-zinc-800 bg-zinc-900/90 px-4 py-3 shadow-sm backdrop-blur-sm">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-300">
              <Sparkles size={11} />
              Bank Center
            </div>
            <h1 className="text-lg font-bold font-display text-white tracking-tight mt-1">Wallet & Funds Transfer</h1>
            <p className="text-[11px] text-zinc-400">Manage your available balance and transfer securely</p>
          </div>

          <div className="flex items-center gap-3 rounded-xl border border-zinc-800/80 bg-zinc-950/80 px-4 py-2 self-start sm:self-auto">
            <Landmark className="h-5 w-5 text-zinc-400" />
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">Available balance</p>
              <p className="font-mono text-xl font-bold text-emerald-400">
                {loading ? "Loading..." : formatCurrency(balance)}
              </p>
            </div>
          </div>
        </div>

        {/* 3-Column Single-Frame Bento Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-stretch">
          {/* Col 1: Wallet Overview */}
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/90 p-5 shadow-sm backdrop-blur-sm flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between gap-3 mb-4">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-400">Account Details</p>
                  <h2 className="mt-0.5 text-base font-bold text-white">Primary Account</h2>
                </div>
                <div className="rounded-lg border border-white/10 bg-white/5 p-2 text-zinc-300">
                  <Landmark size={18} />
                </div>
              </div>

              <div className="rounded-xl border border-zinc-800 bg-zinc-950/70 p-4 space-y-3">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-zinc-500">Signed In As</p>
                  <p className="text-sm font-semibold text-white mt-0.5">{userName}</p>
                  <p className="text-xs text-zinc-400">{userEmail}</p>
                </div>

                <div className="border-t border-zinc-800/80 pt-3 flex items-center justify-between text-xs">
                  <span className="text-zinc-400">Wallet Status</span>
                  <span className="inline-flex items-center gap-1 rounded border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 font-mono text-[11px] font-bold text-emerald-400">
                    Active
                  </span>
                </div>

                <div className="border-t border-zinc-800/80 pt-3 flex items-center justify-between text-xs">
                  <span className="text-zinc-400">Current Balance</span>
                  <span className="font-mono font-bold text-emerald-400">{loading ? "..." : formatCurrency(balance)}</span>
                </div>
              </div>
            </div>

            <div className="mt-4 flex items-center gap-2 text-xs text-zinc-400 bg-zinc-950/40 p-3 rounded-xl border border-zinc-800/60">
              <ShieldCheck size={16} className="text-zinc-400 shrink-0" />
              <span className="text-[11px]">Transfers protected with encrypted session.</span>
            </div>
          </div>

          {/* Col 2: Add Balance Form (with green Add button) */}
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/90 p-5 shadow-sm backdrop-blur-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/10 p-2 text-emerald-400">
                  <PlusCircle size={18} />
                </div>
                <div>
                  <h2 className="text-base font-bold text-white">Add Balance</h2>
                  <p className="text-[11px] text-zinc-400">Top-up wallet funds instantly</p>
                </div>
              </div>

              <form onSubmit={handleAddBalance} className="space-y-4">
                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-zinc-400">Amount (₹)</label>
                  <input
                    type="number"
                    min="1"
                    step="1"
                    value={topUpForm.amount}
                    onChange={(event) => setTopUpForm((prev) => ({ ...prev, amount: event.target.value }))}
                    placeholder="e.g. 1000"
                    className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3.5 py-2.5 font-mono text-sm text-white placeholder:text-zinc-500 outline-none transition focus:border-zinc-500 focus:ring-1 focus:ring-white/20"
                  />
                </div>

                <div className="flex flex-wrap gap-2">
                  {[500, 1000, 2500, 5000].map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => setTopUpForm({ amount: String(amt) })}
                      className="px-2.5 py-1 rounded-lg border border-zinc-800 bg-zinc-950 text-xs font-mono text-zinc-300 hover:border-zinc-700 hover:text-white transition"
                    >
                      +₹{amt}
                    </button>
                  ))}
                </div>

                <button
                  type="submit"
                  disabled={topUpSubmitting}
                  className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-black shadow-lg shadow-emerald-500/20 transition hover:bg-emerald-400 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <PlusCircle size={16} />
                  {topUpSubmitting ? "Adding..." : "Add Balance"}
                </button>
              </form>
            </div>

            <p className="mt-4 text-[10px] text-zinc-500 text-center">
              Funds are instantly credited to your Spendora account.
            </p>
          </div>

          {/* Col 3: Transfer Funds Form */}
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/90 p-5 shadow-sm backdrop-blur-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="rounded-lg border border-white/10 bg-white/5 p-2 text-zinc-300">
                  <ArrowRightLeft size={18} />
                </div>
                <div>
                  <h2 className="text-base font-bold text-white">Transfer Funds</h2>
                  <p className="text-[11px] text-zinc-400">Send money to any user by email</p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-3">
                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-zinc-400">Recipient</label>
                  <select
                    value={form.recipientEmail}
                    onChange={(event) => setForm((prev) => ({ ...prev, recipientEmail: event.target.value }))}
                    className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3.5 py-2 text-xs text-white outline-none transition focus:border-zinc-500 focus:ring-1 focus:ring-white/20"
                  >
                    <option value="" className="bg-zinc-900 text-zinc-400">Choose recipient</option>
                    {recipients.map((recipient) => (
                      <option key={recipient.email} value={recipient.email} className="bg-zinc-900 text-white">
                        {recipient.name} ({recipient.email})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-zinc-400">Amount (₹)</label>
                  <input
                    type="number"
                    min="1"
                    step="1"
                    value={form.amount}
                    onChange={(event) => setForm((prev) => ({ ...prev, amount: event.target.value }))}
                    placeholder="e.g. 500"
                    className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3.5 py-2 font-mono text-sm text-white placeholder:text-zinc-500 outline-none transition focus:border-zinc-500 focus:ring-1 focus:ring-white/20"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-black shadow-sm transition hover:bg-zinc-200 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <ArrowRightLeft size={16} />
                  {submitting ? "Processing..." : "Transfer Now"}
                </button>
              </form>
            </div>

            <p className="mt-4 text-[10px] text-zinc-500 text-center">
              Direct peer-to-peer authenticated ledger transfer.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}