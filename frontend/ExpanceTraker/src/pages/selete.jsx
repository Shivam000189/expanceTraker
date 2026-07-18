import { Clock3, Landmark, Sparkles } from "lucide-react";
import { Layout } from "../components/layout/Layout";

export default function Selete() {
  return (
    <Layout>
      <div className="space-y-6 lg:space-y-8">
        <div className="rounded-[2rem] border border-zinc-200 bg-white p-8 shadow-sm">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.25em] text-primary">
            <Sparkles size={12} />
            Settlements Hub
          </div>
          <h1 className="mt-4 text-3xl font-bold text-zinc-900">This experience is being polished</h1>
          <p className="mt-3 max-w-2xl text-sm text-zinc-600">
            The settlements workspace is being prepared to match the rest of the dashboard with richer tracking and cleaner transaction states.
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <div className="rounded-[1.5rem] border border-zinc-200 bg-zinc-50 p-5">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-primary/10 p-3 text-primary">
                  <Landmark size={18} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-zinc-900">Bank clearance</p>
                  <p className="text-sm text-zinc-600">Status updates will be surfaced here soon.</p>
                </div>
              </div>
            </div>

            <div className="rounded-[1.5rem] border border-zinc-200 bg-zinc-50 p-5">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-primary/10 p-3 text-primary">
                  <Clock3 size={18} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-zinc-900">Live timeline</p>
                  <p className="text-sm text-zinc-600">Progress markers and payouts will appear in this section.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}