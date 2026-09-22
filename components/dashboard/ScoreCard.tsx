import type { RiskResponse } from "@/types/risk";

export function ScoreCard({ risk }: { risk: RiskResponse | null }) {
  const score = risk?.scores.overall;
  return (
    <div className="rounded-2xl border border-cyan-500/30 p-6 glass-panel">
      <div className="grid gap-6 lg:grid-cols-12 lg:items-center">
        <div className="lg:col-span-4"><span className="text-[11px] font-mono uppercase tracking-widest text-slate-400">Overall score</span><div className="mt-2 text-5xl font-extrabold font-mono text-white">{score ?? "—"}</div></div>
        <div className="space-y-2 lg:col-span-8"><h3 className="text-sm font-semibold text-white">Source information</h3><p className="text-sm text-slate-300">{risk?.metadata.dataSources?.length ? risk.metadata.dataSources.join(", ") : "No data sources were supplied with this response."}</p><p className="text-xs font-mono text-slate-500">Updated: {risk?.metadata.updated ? new Date(risk.metadata.updated).toLocaleString() : "not supplied"}</p></div>
      </div>
    </div>
  );
}
