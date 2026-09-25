import { useEffect, useState } from "react";
import {
  ArrowRightLeft,
  Landmark,
  PlusCircle,
  ShieldCheck,
  Wallet,
} from "lucide-react";
import toast from "react-hot-toast";
import API from "../api";
import { Layout } from "../components/layout/Layout";
import GlassCard from "../UI/GlassCard";

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
    <Layout>
      <div className="h-full min-h-0 flex flex-col justify-between gap-3 overflow-hidden">
        {/* Header Strip */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-[24px] border border-white/10 bg-[#131313] px-4 py-2.5 shadow-[0_10px_30px_rgba(0,0,0,0.3)] shrink-0">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full border border-[#10EE74]/20 bg-[#0D2E18] px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-[#10EE74]">
              <Wallet size={11} />
              Bank &amp; Wallet Center
            </div>
            <h1 className="text-base font-bold font-display text-white tracking-tight mt-0.5">
              Wallet &amp; Funds Transfer
            </h1>
            <p className="text-[11px] text-gray-400">
              Manage your balance, add funds, and transfer securely
            </p>
          </div>

          <div className="flex items-center gap-3 rounded-2xl border border-white/5 bg-[#1C1C1C] px-3.5 py-1.5 self-start sm:self-auto">
            <Landmark className="h-4 w-4 text-[#10EE74]" />
            <div>
              <p className="text-[9px] font-semibold uppercase tracking-wider text-gray-400">
                Available balance
              </p>
              <p className="font-mono text-lg font-bold text-[#10EE74]">
                {loading ? "..." : formatCurrency(balance)}
              </p>
            </div>
          </div>
        </div>

        {/* 3-Column Bento Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 items-stretch flex-1 min-h-0">
          {/* Col 1: GlassCard & Account Details */}
          <div className="flex flex-col justify-between gap-3 h-full min-h-0">
            <GlassCard
              title="Spendora Bank"
              cardHolder={userName.toUpperCase()}
              balance={loading ? "..." : formatCurrency(balance)}
              cardNumber="5432 9812 4432 XXXX"
              expiry="12/30"
              status="Verified"
            />

            <div className="rounded-[24px] border border-white/10 bg-[#131313] p-5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400">Account Holder</span>
                <span className="text-xs font-semibold text-white">{userName}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400">Email</span>
                <span className="text-xs font-mono text-gray-300 truncate max-w-[160px]">
                  {userEmail}
                </span>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-white/5">
                <span className="text-xs text-gray-400">Status</span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#0D2E18] text-[#10EE74] text-[11px] font-medium border border-[#10EE74]/20">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#10EE74]" />
                  Active
                </span>
              </div>
            </div>
          </div>

          {/* Col 2: Add Balance Form */}
          <div className="rounded-[24px] border border-white/10 bg-[#131313] p-5 sm:p-6 shadow-[0_10px_30px_rgba(0,0,0,0.3)] flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2.5 mb-4">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#0D2E18] text-[#10EE74] border border-[#10EE74]/20">
                  <PlusCircle size={18} />
                </div>
                <div>
                  <h2 className="text-base font-bold font-display text-white">
                    Add Balance
                  </h2>
                  <p className="text-xs text-gray-400">
                    Top-up wallet funds instantly
                  </p>
                </div>
              </div>

              <form onSubmit={handleAddBalance} className="space-y-4">
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-gray-300">
                    Amount (₹)
                  </label>
                  <input
                    type="number"
                    min="1"
                    step="1"
                    value={topUpForm.amount}
                    onChange={(e) =>
                      setTopUpForm({ amount: e.target.value })
                    }
                    placeholder="e.g. 1000"
                    className="w-full rounded-xl border border-white/5 bg-[#373737] px-3.5 py-2.5 font-mono text-sm text-white placeholder-gray-400 outline-none focus:border-[#10EE74] transition"
                  />
                </div>

                <div className="flex flex-wrap gap-2">
                  {[500, 1000, 2500, 5000].map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => setTopUpForm({ amount: String(amt) })}
                      className="px-3 py-1 rounded-full border border-white/10 bg-[#1C1C1C] text-xs font-mono text-gray-300 hover:border-[#10EE74] hover:text-[#10EE74] transition cursor-pointer"
                    >
                      +₹{amt}
                    </button>
                  ))}
                </div>

                <button
                  type="submit"
                  disabled={topUpSubmitting}
                  className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-[#10EE74] px-4 py-2.5 text-xs font-semibold text-black shadow-lg shadow-[#10EE74]/20 transition hover:bg-[#10EE74]/90 disabled:opacity-50 cursor-pointer"
                >
                  <PlusCircle size={15} />
                  {topUpSubmitting ? "Adding..." : "Add Balance"}
                </button>
              </form>
            </div>

            <div className="mt-4 flex items-center gap-2 text-xs text-gray-400 bg-white/5 p-3 rounded-xl border border-white/5">
              <ShieldCheck size={16} className="text-[#10EE74] shrink-0" />
              <span className="text-[11px]">
                Instant balance credit with verified gateway.
              </span>
            </div>
          </div>

          {/* Col 3: Transfer Funds Form */}
          <div className="rounded-[24px] border border-white/10 bg-[#131313] p-5 sm:p-6 shadow-[0_10px_30px_rgba(0,0,0,0.3)] flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2.5 mb-4">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/5 text-white border border-white/10">
                  <ArrowRightLeft size={18} />
                </div>
                <div>
                  <h2 className="text-base font-bold font-display text-white">
                    Transfer Funds
                  </h2>
                  <p className="text-xs text-gray-400">
                    Send money to any user by email
                  </p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-3.5">
                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-300">
                    Recipient
                  </label>
                  <select
                    value={form.recipientEmail}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        recipientEmail: e.target.value,
                      }))
                    }
                    className="w-full rounded-xl border border-white/5 bg-[#373737] px-3.5 py-2.5 text-xs text-white outline-none focus:border-[#10EE74] transition"
                  >
                    <option value="" className="bg-[#1C1C1C] text-gray-400">
                      Choose recipient
                    </option>
                    {recipients.map((recipient) => (
                      <option
                        key={recipient.email}
                        value={recipient.email}
                        className="bg-[#1C1C1C] text-white"
                      >
                        {recipient.name} ({recipient.email})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-300">
                    Amount (₹)
                  </label>
                  <input
                    type="number"
                    min="1"
                    step="1"
                    value={form.amount}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        amount: e.target.value,
                      }))
                    }
                    placeholder="e.g. 500"
                    className="w-full rounded-xl border border-white/5 bg-[#373737] px-3.5 py-2.5 font-mono text-sm text-white placeholder-gray-400 outline-none focus:border-[#10EE74] transition"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-white px-4 py-2.5 text-xs font-semibold text-black shadow-sm transition hover:bg-gray-200 disabled:opacity-50 cursor-pointer"
                >
                  <ArrowRightLeft size={15} />
                  {submitting ? "Processing..." : "Transfer Now"}
                </button>
              </form>
            </div>

            <p className="mt-4 text-[10px] text-gray-500 text-center">
              Direct peer-to-peer authenticated ledger transfer.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}