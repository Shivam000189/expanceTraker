import { useMemo, useState } from "react";
import { Building2, Wallet } from "lucide-react";
import toast from "react-hot-toast";
import API from "../api";
import { Layout } from "../components/layout/Layout";
import { BulkPayoutStepper } from "../components/payout/BulkPayoutStepper";
import { CSVUploader } from "../components/payout/CSVUploader";
import { PayoutSuccessScreen } from "../components/payout/PayoutSuccessScreen";
import { ReviewConfirmOverlay } from "../components/payout/ReviewConfirmOverlay";
import { formatCurrency } from "../lib/utils";

export default function BulkPayout() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isBusy, setIsBusy] = useState(false);
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [validRows, setValidRows] = useState([]);
  const [invalidRows, setInvalidRows] = useState([]);
  const [result, setResult] = useState({ success: 0, total: 0 });

  const totalAmount = useMemo(
    () => validRows.reduce((sum, row) => sum + Number(row.amount || 0), 0),
    [validRows]
  );

  const handleValidated = ({ valid, invalid }) => {
    setValidRows(valid);
    setInvalidRows(invalid);
    setCurrentStep(2);
    setIsReviewOpen(true);
  };

  const handleConfirm = async () => {
    try {
      setIsBusy(true);
      const response = await API.post("/payouts/execute", validRows);
      setResult({
        success: response.data.success || 0,
        total: Number(response.data.total || 0),
      });
      setIsReviewOpen(false);
      setCurrentStep(3);
      toast.success("Bulk payout executed successfully");
    } catch (error) {
      console.error("Failed to execute payouts:", error);
      toast.error(error.response?.data?.msg || "Failed to execute payouts");
    } finally {
      setIsBusy(false);
    }
  };

  return (
    <Layout>
      <div className="h-full min-h-0 flex flex-col justify-between gap-3 overflow-hidden">
        {/* Header Ribbon */}
        <div className="shrink-0 flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-[24px] border border-white/10 bg-[#131313] px-5 py-4 shadow-[0_10px_30px_rgba(0,0,0,0.3)]">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full border border-[#10EE74]/20 bg-[#0D2E18] px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-[#10EE74]">
              <Wallet size={11} />
              Bulk Payout
            </div>
            <h1 className="text-lg font-bold font-display text-white tracking-tight mt-1">
              Batch Vendor Disbursement
            </h1>
            <p className="text-xs text-gray-400">
              Validate beneficiary accounts and execute batch payouts with audit receipt
            </p>
          </div>

          <div className="flex items-center gap-3 rounded-2xl border border-white/5 bg-[#1C1C1C] px-4 py-2 self-start sm:self-auto">
            <Building2 size={18} className="text-[#10EE74]" />
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                Ready To Pay
              </p>
              <p className="font-mono text-xl font-bold text-[#10EE74]">
                {formatCurrency(totalAmount)}
              </p>
            </div>
          </div>
        </div>

        <div className="shrink-0">
          <BulkPayoutStepper currentStep={currentStep} />
        </div>

        {currentStep < 3 ? (
          <div className="flex-1 min-h-0 rounded-[24px] border border-white/10 bg-[#131313] p-5 shadow-[0_10px_30px_rgba(0,0,0,0.3)] overflow-y-auto">
            <CSVUploader onValidated={handleValidated} setBusy={setIsBusy} />
          </div>
        ) : (
          <div className="flex-1 min-h-0 overflow-y-auto">
            <PayoutSuccessScreen
              vendorCount={result.success}
              totalAmount={result.total}
            />
          </div>
        )}

        <ReviewConfirmOverlay
          isOpen={isReviewOpen}
          validRows={validRows}
          invalidRows={invalidRows}
          isSubmitting={isBusy}
          onClose={() => {
            setIsReviewOpen(false);
            setCurrentStep(1);
          }}
          onConfirm={handleConfirm}
        />
      </div>
    </Layout>
  );
}
