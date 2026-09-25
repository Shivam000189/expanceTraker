import { useEffect, useMemo, useState } from "react";
import { ArrowRightLeft, Landmark } from "lucide-react";
import toast from "react-hot-toast";
import API from "../api";
import LoadingSpinner from "../components/LoadingSpinner";
import { Layout } from "../components/layout/Layout";
import { FeeBreakdownCard } from "../components/settlements/FeeBreakdownCard";
import { ReceiptDownloadButton } from "../components/settlements/ReceiptDownloadButton";
import { SettlementTimeline } from "../components/settlements/SettlementTimeline";
import { cn, formatCurrency } from "../lib/utils";

const statusConfig = {
  scanned: "border border-white/10 bg-white/5 text-gray-300",
  processing: "border border-amber-500/20 bg-amber-500/10 text-amber-400",
  cleared: "border border-[#10EE74]/20 bg-[#0D2E18] text-[#10EE74]",
  deposited: "border border-[#10EE74]/20 bg-[#0D2E18] text-[#10EE74]",
};

const statusLabel = {
  scanned: "Scanned",
  processing: "Processing",
  cleared: "Clearing",
  deposited: "Deposited",
};

export default function Settlements() {
  const [settlements, setSettlements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSettlementId, setSelectedSettlementId] = useState(null);

  useEffect(() => {
    const fetchSettlements = async () => {
      try {
        setLoading(true);
        const response = await API.get("/settlements");
        const records = response.data || [];
        setSettlements(records);
        setSelectedSettlementId(records[0]?.id || null);
      } catch (error) {
        console.error("Failed to load settlements:", error);
        toast.error("Failed to load settlements");
        setSettlements([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSettlements();
  }, []);

  const selectedSettlement = useMemo(
    () =>
      settlements.find((record) => record.id === selectedSettlementId) ||
      settlements[0] ||
      null,
    [settlements, selectedSettlementId]
  );

  const depositedTotal = useMemo(
    () =>
      settlements
        .filter((settlement) => settlement.status === "deposited")
        .reduce((sum, settlement) => sum + Number(settlement.netAmount || 0), 0),
    [settlements]
  );

  if (loading) {
    return <LoadingSpinner message="Loading settlements..." />;
  }

  return (
    <Layout>
      <div className="h-full min-h-0 flex flex-col justify-between gap-3 overflow-hidden">
        {/* Header Ribbon */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-[24px] border border-white/10 bg-[#131313] px-4 py-2.5 shadow-[0_10px_30px_rgba(0,0,0,0.3)] shrink-0">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full border border-[#10EE74]/20 bg-[#0D2E18] px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-[#10EE74]">
              <ArrowRightLeft size={11} />
              Settlement Tracker
            </div>
            <h1 className="text-base font-bold font-display text-white tracking-tight mt-0.5">
              Settlement Ledger &amp; Timeline
            </h1>
            <p className="text-[11px] text-gray-400">
              Track settlement lifecycle from terminal scan to direct bank deposit
            </p>
          </div>

          <div className="flex items-center gap-3 rounded-2xl border border-white/5 bg-[#1C1C1C] px-3.5 py-1.5 self-start sm:self-auto">
            <Landmark size={16} className="text-[#10EE74]" />
            <div>
              <p className="text-[9px] font-semibold uppercase tracking-wider text-gray-400">
                Deposited Net Total
              </p>
              <p className="font-mono text-lg font-bold text-[#10EE74]">
                {formatCurrency(depositedTotal)}
              </p>
            </div>
          </div>
        </div>

        {/* 2-Column Bento Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 items-start flex-1 min-h-0">
          {/* Left Column: Settlement Records (7 cols) */}
          <div className="lg:col-span-7 rounded-[24px] border border-white/10 bg-[#131313] p-5 shadow-[0_10px_30px_rgba(0,0,0,0.3)] flex flex-col">
            <div className="mb-3 flex items-center justify-between gap-4 border-b border-white/5 pb-3">
              <div>
                <h2 className="text-sm sm:text-base font-bold text-white font-display">
                  Settlement Records
                </h2>
                <p className="text-xs text-gray-400">
                  Select any record to inspect status &amp; receipt
                </p>
              </div>
              <span className="rounded-full border border-white/10 bg-[#1C1C1C] px-3 py-1 font-mono text-xs text-gray-400">
                {settlements.length} records
              </span>
            </div>

            <div className="space-y-2.5 max-h-[calc(100vh-250px)] overflow-y-auto pr-1 divide-y divide-white/5">
              {settlements.length > 0 ? (
                settlements.map((settlement) => (
                  <button
                    key={settlement.id}
                    onClick={() => setSelectedSettlementId(settlement.id)}
                    className={cn(
                      "flex w-full flex-col gap-2 rounded-2xl border p-3.5 text-left transition-all sm:flex-row sm:items-center sm:justify-between cursor-pointer",
                      selectedSettlement?.id === settlement.id
                        ? "border-[#10EE74]/50 bg-[#1C1C1C] shadow-sm"
                        : "border-transparent bg-transparent hover:bg-white/[0.03]"
                    )}
                  >
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-mono text-xs font-semibold text-white">
                        {settlement.transactionId}
                      </p>
                      <p className="mt-0.5 text-[11px] text-gray-400 font-mono">
                        {new Date(settlement.createdAt).toLocaleString("en-IN", {
                          day: "numeric",
                          month: "short",
                          hour: "numeric",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>

                    <div className="flex items-center gap-2.5 shrink-0 sm:justify-end">
                      <span
                        className={cn(
                          "rounded-full px-2.5 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider",
                          statusConfig[settlement.status] || statusConfig.scanned
                        )}
                      >
                        {statusLabel[settlement.status] || settlement.status}
                      </span>
                      <span className="font-mono text-sm font-bold text-white">
                        {formatCurrency(settlement.amount)}
                      </span>
                    </div>
                  </button>
                ))
              ) : (
                <div className="rounded-2xl border border-dashed border-white/10 p-8 text-center text-xs text-gray-500">
                  No settlements available yet.
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Selected Record Details & Timeline (5 cols) */}
          <div className="lg:col-span-5 flex flex-col gap-3.5 max-h-[calc(100vh-250px)] overflow-y-auto pr-1">
            {selectedSettlement ? (
              <>
                <FeeBreakdownCard
                  amount={Number(selectedSettlement.amount || 0)}
                  fee={Number(selectedSettlement.fee || 0)}
                  netAmount={Number(selectedSettlement.netAmount || 0)}
                />
                <div className="rounded-[24px] border border-white/10 bg-[#131313] p-4 shadow-sm flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                      Selected transaction
                    </p>
                    <p className="mt-0.5 font-mono text-xs font-bold text-white truncate">
                      {selectedSettlement.transactionId}
                    </p>
                  </div>
                  <ReceiptDownloadButton settlement={selectedSettlement} />
                </div>
                <SettlementTimeline settlement={selectedSettlement} />
              </>
            ) : (
              <div className="rounded-[24px] border border-dashed border-white/10 p-8 text-center text-xs text-gray-500">
                Select a settlement to view its fee breakdown and timeline.
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
