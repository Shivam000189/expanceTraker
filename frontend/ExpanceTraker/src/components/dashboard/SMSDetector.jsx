import { useState } from "react";
import { FileText, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { formatCurrency } from "../../lib/utils";
import API from "../../api";

export function SMSDetector({ onDetect, className = "" }) {
  const [sms, setSms] = useState("");
  const [isDetecting, setIsDetecting] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleDetect = async () => {
    if (!sms.trim()) return;

    setIsDetecting(true);
    setError(null);
    setResult(null);

    try {
      const response = await API.post("/expenses/detect-sms", { smsText: sms });
      setResult(response.data);
    } catch (err) {
      setError(
        err.response?.data?.msg ||
          'Could not parse SMS. Example: "Rs 450 debited from SBI Bank for SWIGGY on 12 May"'
      );
    } finally {
      setIsDetecting(false);
    }
  };

  const handleUseResult = () => {
    if (result) {
      onDetect(result);
      setSms("");
      setResult(null);
    }
  };

  const EXAMPLE_SMS = "e.g. Rs 450 debited from SBI Bank for SWIGGY on 12 May";

  return (
    <div
      className={`rounded-[24px] border border-white/10 bg-[#131313] p-4 lg:p-5 text-white shadow-[0_10px_30px_rgba(0,0,0,0.3)] flex flex-col justify-between overflow-hidden ${className}`}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-xl bg-[#0D2E18] text-[#10EE74] border border-[#10EE74]/20 flex items-center justify-center shrink-0">
            <FileText size={14} />
          </div>
          <div>
            <h3 className="text-xs sm:text-sm font-semibold text-white tracking-tight font-display">
              Smart SMS Detector
            </h3>
            <p className="text-[10px] text-gray-400">Auto-parse bank SMS</p>
          </div>
        </div>

        <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[9px] font-mono text-[#10EE74]">
          AI
        </span>
      </div>

      <div className="space-y-2 flex-1 flex flex-col justify-between my-1">
        {!result && (
          <textarea
            value={sms}
            onChange={(e) => setSms(e.target.value)}
            placeholder={EXAMPLE_SMS}
            rows={2}
            className="w-full p-2.5 bg-[#373737] border border-white/5 rounded-xl outline-none focus:border-[#10EE74] transition resize-none text-xs text-white placeholder-gray-400 font-mono leading-relaxed"
          />
        )}

        {!result ? (
          <button
            onClick={handleDetect}
            disabled={isDetecting || !sms.trim()}
            className="w-full bg-white/10 hover:bg-white/15 border border-white/10 text-white font-medium py-2 rounded-full flex items-center justify-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed transition text-xs shadow-sm cursor-pointer"
          >
            {isDetecting ? (
              <>
                <Loader2 className="animate-spin text-[#10EE74]" size={13} />
                <span>Parsing SMS...</span>
              </>
            ) : (
              <span>Detect Expense</span>
            )}
          </button>
        ) : null}

        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="p-2 bg-red-500/10 text-red-400 rounded-xl flex items-center gap-1.5 text-[11px] border border-red-500/20"
            >
              <AlertCircle size={13} className="shrink-0" />
              <span>{error}</span>
            </motion.div>
          )}

          {result && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 5 }}
              className="space-y-2"
            >
              <div className="p-2.5 bg-[#1C1C1C] border border-white/5 rounded-xl space-y-1 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] text-gray-400 font-mono">Merchant</span>
                  <span className="font-semibold text-white truncate max-w-[120px]">
                    {result.merchant}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[10px] text-gray-400 font-mono">Amount</span>
                  <span className="font-bold font-mono text-[#10EE74]">
                    {formatCurrency(result.amount)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[10px] text-gray-400 font-mono">Category</span>
                  <span className="text-gray-300">{result.category}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={handleUseResult}
                  className="w-full bg-[#10EE74] text-black font-semibold py-1.5 rounded-full hover:bg-[#10EE74]/90 transition text-xs shadow-md shadow-[#10EE74]/15 cursor-pointer"
                >
                  Use Expense
                </button>
                <button
                  onClick={() => {
                    setResult(null);
                    setSms("");
                  }}
                  className="w-full bg-white/5 border border-white/10 text-gray-300 font-medium py-1.5 rounded-full hover:bg-white/10 transition text-xs cursor-pointer"
                >
                  Clear
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default SMSDetector;
