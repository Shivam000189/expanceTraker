import { useState } from "react";
import { motion as Motion } from "framer-motion";
import { ClipboardPaste, Loader2, Sparkles } from "lucide-react";
import toast from "react-hot-toast";
import API from "../api";

const exampleSms = "Rs 220 paid to Zomato via UPI";

export default function SmartSmsDetector({ onDetected }) {
  const [smsText, setSmsText] = useState("");
  const [detecting, setDetecting] = useState(false);
  const [detectedExpense, setDetectedExpense] = useState(null);

  const handleDetect = async () => {
    if (!smsText.trim()) {
      toast.error("Paste a transaction SMS first.");
      return;
    }

    setDetecting(true);
    try {
      const res = await API.post("/expenses/detect-sms", { smsText });
      setDetectedExpense(res.data);
      onDetected(res.data);
      toast.success("Expense detected and form filled!");
    } catch (error) {
      toast.error(error.response?.data?.msg || "Could not detect this SMS.");
    } finally {
      setDetecting(false);
    }
  };

  return (
    <Motion.section
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="relative overflow-hidden rounded-2xl border border-violet-100 bg-white p-4 shadow-sm sm:rounded-3xl sm:p-6"
    >
      <div className="absolute right-0 top-0 h-28 w-28 rounded-bl-full bg-violet-50" />

      <div className="relative">
        <div className="mb-4 flex items-start gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#7C3AED] text-white">
            <Sparkles size={20} />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-[#4B2C85]">
              Smart Expense Detection
            </h3>
            <p className="text-sm text-gray-400">
              Paste a bank SMS and let AI prepare the expense for you.
            </p>
          </div>
        </div>

        <label className="mb-2 block text-sm font-semibold text-gray-700">
          Paste Your Transaction SMS
        </label>
        <textarea
          value={smsText}
          onChange={(e) => setSmsText(e.target.value)}
          rows={5}
          placeholder="Rs 450 debited from SBI Bank for SWIGGY on 12 May"
          className="w-full resize-none rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none transition focus:border-[#7C3AED] focus:bg-white focus:ring-2 focus:ring-violet-100"
        />

        <div className="mt-3 rounded-2xl bg-violet-50 px-4 py-3 text-sm text-violet-900">
          <span className="font-semibold">Example:</span> "{exampleSms}"
        </div>

        <button
          type="button"
          onClick={handleDetect}
          disabled={detecting}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#1A1A1A] px-4 py-3 font-semibold text-white transition hover:bg-[#4B2C85] disabled:cursor-not-allowed disabled:opacity-70"
        >
          {detecting ? (
            <Loader2 size={18} className="animate-spin" />
          ) : (
            <ClipboardPaste size={18} />
          )}
          {detecting ? "Detecting..." : "Detect Expense"}
        </button>

        {detectedExpense && (
          <div className="mt-5 grid grid-cols-1 gap-3 rounded-2xl border border-violet-100 bg-white p-4 text-sm sm:grid-cols-2">
            <DetectedItem label="Amount" value={`₹${detectedExpense.amount}`} />
            <DetectedItem label="Merchant" value={detectedExpense.merchant} />
            <DetectedItem label="Category" value={detectedExpense.category} />
            <DetectedItem label="Type" value={detectedExpense.type} />
            <DetectedItem label="Date" value={detectedExpense.date} />
            <DetectedItem label="Payment" value={detectedExpense.paymentMethod} />
          </div>
        )}
      </div>
    </Motion.section>
  );
}

function DetectedItem({ label, value }) {
  return (
    <div className="min-w-0">
      <p className="text-xs uppercase tracking-wide text-gray-400">{label}</p>
      <p className="truncate font-semibold text-gray-900">{value || "-"}</p>
    </div>
  );
}
