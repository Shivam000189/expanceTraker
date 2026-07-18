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
  const [form, setForm] = useState({ recipientEmail: "", amount: "" });
  const [topUpForm, setTopUpForm] = useState({ amount: "" });

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

  useEffect(() => {
    loadBalance();
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
      <div className="space-y-6 lg:space-y-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.25em] text-primary">
              <Sparkles size={12} />
              Bank Center
            </div>
            <h1 className="mt-3 text-3xl font-bold text-zinc-900">Manage your balance and transfer securely</h1>
            <p className="mt-2 max-w-2xl text-sm text-zinc-600">
              Send money to another user using their email and keep your wallet activity in one polished workspace.
            </p>
          </div>

          <div className="rounded-[1.5rem] border border-zinc-200 bg-white px-4 py-3 shadow-sm">
            <p className="text-sm text-zinc-500">Available balance</p>
            <div className="mt-1 flex items-center gap-2">
              <Landmark className="h-5 w-5 text-primary" />
              <span className="text-2xl font-semibold text-zinc-900">
                {loading ? "Loading..." : formatCurrency(balance)}
              </span>
            </div>
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-[2rem] border border-zinc-200 bg-white p-6 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-zinc-400">Wallet overview</p>
                <h2 className="mt-2 text-xl font-semibold text-zinc-900">Your primary account</h2>
              </div>
              <div className="rounded-2xl bg-primary/10 p-3 text-primary">
                <Landmark size={20} />
              </div>
            </div>

            <div className="mt-6 rounded-[1.5rem] bg-zinc-50 p-5">
              <div className="flex items-center justify-between text-sm text-zinc-500">
                <span>Current balance</span>
                <span className="font-semibold text-zinc-900">{loading ? "Loading..." : formatCurrency(balance)}</span>
              </div>
              <div className="mt-4 h-2 rounded-full bg-zinc-200">
                <div className="h-2 w-full rounded-full bg-primary" />
              </div>
              <div className="mt-4 flex items-center gap-2 text-sm text-zinc-600">
                <ShieldCheck size={16} className="text-primary" />
                Transfers are protected with your authenticated session.
              </div>
            </div>
          </div>

          <div className="rounded-[2rem] border border-zinc-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-primary/10 p-3 text-primary">
                <ArrowRightLeft size={20} />
              </div>
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-zinc-400">Wallet actions</p>
                <h2 className="text-xl font-semibold text-zinc-900">Top up or send money instantly</h2>
              </div>
            </div>

            <div className="mt-6 space-y-5">
              <form onSubmit={handleAddBalance} className="rounded-[1.5rem] border border-zinc-200 bg-zinc-50 p-4">
                <div className="flex items-center gap-2">
                  <div className="rounded-2xl bg-primary/10 p-2 text-primary">
                    <PlusCircle size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-zinc-900">Add balance</p>
                    <p className="text-sm text-zinc-500">Increase your wallet with a quick top-up.</p>
                  </div>
                </div>

                <div className="mt-4">
                  <label className="mb-2 block text-sm font-semibold text-zinc-700">Amount</label>
                  <input
                    type="number"
                    min="1"
                    step="1"
                    value={topUpForm.amount}
                    onChange={(event) => setTopUpForm((prev) => ({ ...prev, amount: event.target.value }))}
                    placeholder="1000"
                    className="w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 outline-none transition focus:border-primary"
                  />
                </div>

                <button
                  type="submit"
                  disabled={topUpSubmitting}
                  className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-primary px-4 py-3 text-sm font-semibold text-white transition hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-70"
                >
                  <PlusCircle size={16} />
                  {topUpSubmitting ? "Adding..." : "Add balance"}
                </button>
              </form>

              <form onSubmit={handleSubmit} className="rounded-[1.5rem] border border-zinc-200 bg-zinc-50 p-4">
                <div className="flex items-center gap-2">
                  <div className="rounded-2xl bg-primary/10 p-2 text-primary">
                    <ArrowRightLeft size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-zinc-900">Transfer funds</p>
                    <p className="text-sm text-zinc-500">Send money to another account by email.</p>
                  </div>
                </div>

                <div className="mt-4 space-y-4">
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-zinc-700">Recipient email</label>
                    <input
                      type="email"
                      value={form.recipientEmail}
                      onChange={(event) => setForm((prev) => ({ ...prev, recipientEmail: event.target.value }))}
                      placeholder="name@example.com"
                      className="w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 outline-none transition focus:border-primary"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-zinc-700">Amount</label>
                    <input
                      type="number"
                      min="1"
                      step="1"
                      value={form.amount}
                      onChange={(event) => setForm((prev) => ({ ...prev, amount: event.target.value }))}
                      placeholder="500"
                      className="w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 outline-none transition focus:border-primary"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex w-full items-center justify-center gap-2 rounded-2xl bg-primary px-4 py-3 text-sm font-semibold text-white transition hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    <ArrowRightLeft size={16} />
                    {submitting ? "Processing..." : "Transfer now"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}