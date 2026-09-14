import React from "react";
import { Flame, Trees, Users, AlertTriangle, Info, CheckCircle2 } from "lucide-react";
import { KeyInsight } from "@/types/area";
import { Badge } from "@/components/ui/Badge";

export interface InsightCardProps {
  insights: KeyInsight[];
}

export function InsightCard({ insights }: InsightCardProps) {
  const iconMap: Record<string, { icon: React.ElementType; color: string; bg: string }> = {
    heat: { icon: Flame, color: "text-red-400", bg: "bg-red-500/10 border-red-500/30" },
    green: { icon: Trees, color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/30" },
    population: { icon: Users, color: "text-purple-400", bg: "bg-purple-500/10 border-purple-500/30" },
    flood: { icon: AlertTriangle, color: "text-sky-400", bg: "bg-sky-500/10 border-sky-500/30" },
    air: { icon: Info, color: "text-amber-400", bg: "bg-amber-500/10 border-amber-500/30" },
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-400" />
          <span>Key Diagnostic Insights</span>
        </h3>
        <span className="text-[11px] font-mono text-slate-400">
          Identified by Aetherion Engine
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {insights.map((item) => {
          const config = iconMap[item.category] || iconMap.heat;
          const Icon = config.icon;

          return (
            <div
              key={item.id}
              className="glass-panel p-5 rounded-2xl border-slate-800/80 hover:border-slate-700 transition-colors flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                {/* Header: Icon + Metric Badge */}
                <div className="flex items-center justify-between">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center border ${config.bg} ${config.color}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="font-mono text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-cyan-300">
                    {item.metricBadge}
                  </span>
                </div>

                {/* Title */}
                <h4 className="text-sm font-semibold text-white tracking-tight">
                  {item.title}
                </h4>

                {/* Description */}
                <p className="text-xs text-slate-400 leading-relaxed">
                  {item.description}
                </p>
              </div>

              {/* Status footer */}
              <div className="pt-3 border-t border-slate-800/70 flex items-center justify-between text-[10px] font-mono">
                <span className="text-slate-500 uppercase">Severity</span>
                <span
                  className={
                    item.severity === "critical"
                      ? "text-red-400 font-bold"
                      : item.severity === "warning"
                      ? "text-amber-400 font-bold"
                      : "text-cyan-400 font-bold"
                  }
                >
                  {item.severity.toUpperCase()}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
