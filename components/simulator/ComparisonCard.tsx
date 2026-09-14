import React from "react";
import { SimulationResults } from "@/types/simulation";
import { ArrowRight, TrendingDown, TrendingUp, Sparkles, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/Badge";

export interface ComparisonCardProps {
  results: SimulationResults;
}

export function ComparisonCard({ results }: ComparisonCardProps) {
  const { baselineScores, projectedScores, delta } = results;

  const comparisons = [
    {
      metric: "Heat Risk Index",
      baseline: baselineScores.heat,
      projected: projectedScores.heat,
      diff: delta.heat,
      goodDirection: "down",
      unit: "pts",
      desc: "Thermal Infrared reduction",
    },
    {
      metric: "Green Canopy Score",
      baseline: baselineScores.green,
      projected: projectedScores.green,
      diff: delta.green,
      goodDirection: "up",
      unit: "%",
      desc: "Vegetative buffer expansion",
    },
    {
      metric: "Urban Priority Score",
      baseline: baselineScores.overall,
      projected: projectedScores.overall,
      diff: delta.overall,
      goodDirection: "down",
      unit: "pts",
      desc: "Composite hazard de-escalation",
    },
    {
      metric: "Air Quality Deficit",
      baseline: baselineScores.air,
      projected: projectedScores.air,
      diff: delta.air,
      goodDirection: "down",
      unit: "pts",
      desc: "Particulate dispersion gain",
    },
  ];

  return (
    <div className="glass-panel p-6 rounded-2xl border-cyan-500/30 space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-mono font-bold tracking-widest text-cyan-400 uppercase">
              MODELLED SCENARIO
            </span>
            <Badge variant="cyan" size="sm">
              PROTOTYPE PREVIEW
            </Badge>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Baseline vs projected thermodynamic response.
          </p>
        </div>

        <div className="text-[11px] font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-800/60 px-2.5 py-1 rounded-md">
          {delta.overall < 0 ? `${Math.abs(delta.overall)} Pts De-escalation` : "Neutral Scenario"}
        </div>
      </div>

      {/* Comparison Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {comparisons.map((item) => {
          const isFavorable =
            (item.goodDirection === "down" && item.diff < 0) ||
            (item.goodDirection === "up" && item.diff > 0);

          return (
            <div
              key={item.metric}
              className="bg-slate-950/70 p-4 rounded-xl border border-slate-800/80 space-y-3"
            >
              <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                <span className="uppercase tracking-wider">{item.metric}</span>
                <span className="text-[10px] text-slate-500">{item.desc}</span>
              </div>

              {/* Numerical Transition */}
              <div className="flex items-center justify-between font-mono">
                <div className="text-left">
                  <span className="text-[10px] text-slate-500 uppercase block">CURRENT</span>
                  <span className="text-2xl font-bold text-slate-300">
                    {item.baseline}
                  </span>
                </div>

                <div className="flex flex-col items-center px-2">
                  <ArrowRight className="w-4 h-4 text-slate-600" />
                  <span
                    className={`text-[11px] font-bold mt-0.5 ${
                      isFavorable ? "text-emerald-400" : "text-slate-400"
                    }`}
                  >
                    {item.diff > 0 ? `+${item.diff}` : item.diff}
                  </span>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-cyan-400 uppercase block">MODELLED</span>
                  <span
                    className={`text-2xl font-bold ${
                      isFavorable ? "text-cyan-300" : "text-white"
                    }`}
                  >
                    {item.projected}
                  </span>
                </div>
              </div>

              {/* Visual Diff Bar */}
              <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden flex">
                <div
                  className="h-full bg-slate-700 transition-all duration-500"
                  style={{ width: `${item.baseline}%` }}
                />
                <div
                  className={`h-full transition-all duration-500 ${
                    isFavorable ? "bg-emerald-400" : "bg-red-400"
                  }`}
                  style={{ width: `${Math.abs(item.diff)}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
