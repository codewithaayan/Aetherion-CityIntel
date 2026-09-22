import { Info } from "lucide-react";

export function RiskLegend() {
  return (
    <div className="glass-panel rounded-xl border border-slate-800/80 p-4">
      <div className="flex items-start gap-2 text-xs text-slate-400">
        <Info className="mt-0.5 h-4 w-4 shrink-0 text-cyan-400" />
        <p>Scores are shown exactly as supplied by the risk service. Risk bands and thresholds have not been provided, so the interface does not assign labels.</p>
      </div>
    </div>
  );
}
