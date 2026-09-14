import React from "react";
import { Flame, Wind, CloudRain, Trees, Car, Users, LucideIcon } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { getRiskLevel } from "@/lib/utils";

export interface RiskCardProps {
  id: string;
  title: string;
  score: number;
  levelLabel?: string;
  unit?: string;
  iconType: "heat" | "air" | "flood" | "green" | "mobility" | "population";
  trend?: "up" | "stable" | "down";
  description?: string;
  isDeficitMetric?: boolean; // e.g. green infrastructure where lower score means worse
}

export function RiskCard({
  title,
  score,
  levelLabel,
  unit = "/100",
  iconType,
  description,
  isDeficitMetric = false,
}: RiskCardProps) {
  const iconConfig: Record<string, { icon: LucideIcon; color: string; bg: string }> = {
    heat: { icon: Flame, color: "text-red-400", bg: "bg-red-500/10 border-red-500/30" },
    air: { icon: Wind, color: "text-amber-400", bg: "bg-amber-500/10 border-amber-500/30" },
    flood: { icon: CloudRain, color: "text-sky-400", bg: "bg-sky-500/10 border-sky-500/30" },
    green: { icon: Trees, color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/30" },
    mobility: { icon: Car, color: "text-blue-400", bg: "bg-blue-500/10 border-blue-500/30" },
    population: { icon: Users, color: "text-purple-400", bg: "bg-purple-500/10 border-purple-500/30" },
  };

  const currentIcon = iconConfig[iconType] || iconConfig.heat;
  const Icon = currentIcon.icon;

  // Determine risk label and color
  const risk = getRiskLevel(isDeficitMetric ? 100 - score : score);
  const displayLabel = levelLabel || (isDeficitMetric && score < 45 ? "LOW COVERAGE" : risk.label);

  return (
    <div className="glass-panel-interactive p-5 rounded-2xl border-slate-800/80 flex flex-col justify-between">
      <div>
        {/* Top bar: Icon and Status Badge */}
        <div className="flex items-center justify-between mb-3">
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center border ${currentIcon.bg} ${currentIcon.color}`}>
            <Icon className="w-4 h-4" />
          </div>
          <span
            className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border uppercase ${
              displayLabel.includes("HIGH") || displayLabel.includes("CRITICAL")
                ? "bg-red-500/10 text-red-400 border-red-500/30"
                : displayLabel.includes("ELEVATED")
                ? "bg-amber-500/10 text-amber-400 border-amber-500/30"
                : displayLabel.includes("LOW COVERAGE")
                ? "bg-orange-500/10 text-orange-400 border-orange-500/30"
                : "bg-sky-500/10 text-sky-400 border-sky-500/30"
            }`}
          >
            {displayLabel}
          </span>
        </div>

        {/* Title */}
        <h4 className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-300 mb-1">
          {title}
        </h4>

        {/* Score Value */}
        <div className="flex items-baseline gap-1 my-1">
          <span className="text-3xl font-extrabold font-mono text-white tracking-tight">
            {score}
          </span>
          <span className="text-xs font-mono text-slate-500">
            {unit}
          </span>
        </div>
      </div>

      {/* Progress Bar & Subtext */}
      <div className="mt-4 pt-3 border-t border-slate-800/80 space-y-1.5">
        <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-700 ${
              isDeficitMetric
                ? "bg-emerald-400"
                : score > 75
                ? "bg-red-500"
                : score > 60
                ? "bg-amber-400"
                : "bg-sky-400"
            }`}
            style={{ width: `${Math.min(100, Math.max(5, score))}%` }}
          />
        </div>
        {description && (
          <p className="text-[11px] text-slate-400 leading-tight truncate">
            {description}
          </p>
        )}
      </div>
    </div>
  );
}
