import React from "react";
import Link from "next/link";
import { Area } from "@/types/area";
import { Badge } from "@/components/ui/Badge";
import { ArrowRight, Users, Flame, Trees, ShieldAlert } from "lucide-react";
import { formatNumber, getRiskLevel } from "@/lib/utils";

export interface AreaPopupProps {
  area: Area;
  onClose?: () => void;
}

export function AreaPopup({ area, onClose }: AreaPopupProps) {
  const risk = getRiskLevel(area.scores.overall);

  return (
    <div className="w-80 rounded-xl glass-panel p-4 border-cyan-500/30 shadow-2xl space-y-3 font-sans">
      <div className="flex items-start justify-between">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
            {area.city}, {area.country}
          </span>
          <h3 className="text-base font-bold text-white tracking-tight">
            {area.name}
          </h3>
        </div>
        <Badge
          variant={
            risk.label === "LOW"
              ? "low"
              : risk.label === "MODERATE"
              ? "moderate"
              : risk.label === "ELEVATED"
              ? "elevated"
              : risk.label === "HIGH"
              ? "high"
              : "critical"
          }
          size="sm"
        >
          {risk.label}
        </Badge>
      </div>

      {/* Primary Score & Population summary */}
      <div className="grid grid-cols-2 gap-2 bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/80 font-mono text-xs">
        <div>
          <span className="text-[10px] text-slate-500 block">PRIORITY SCORE</span>
          <span className="text-lg font-bold text-white">
            {area.scores.overall}
            <span className="text-xs text-slate-500">/100</span>
          </span>
        </div>
        <div>
          <span className="text-[10px] text-slate-500 block">POPULATION</span>
          <span className="text-lg font-bold text-cyan-300">
            {formatNumber(area.population)}
          </span>
        </div>
      </div>

      {/* Mini Risk Factors */}
      <div className="space-y-1.5 text-xs">
        <div className="flex items-center justify-between text-slate-300">
          <span className="flex items-center gap-1 text-slate-400">
            <Flame className="w-3.5 h-3.5 text-red-400" /> Heat Risk:
          </span>
          <span className="font-mono font-bold text-red-400">{area.scores.heat}</span>
        </div>
        <div className="flex items-center justify-between text-slate-300">
          <span className="flex items-center gap-1 text-slate-400">
            <Trees className="w-3.5 h-3.5 text-emerald-400" /> Green Coverage:
          </span>
          <span className="font-mono font-bold text-emerald-400">{area.scores.green}%</span>
        </div>
        <div className="flex items-center justify-between text-slate-300">
          <span className="flex items-center gap-1 text-slate-400">
            <Users className="w-3.5 h-3.5 text-purple-400" /> High-Risk Pop:
          </span>
          <span className="font-mono font-bold text-purple-300">
            {formatNumber(area.highRiskPopulation)} ({area.exposedPercentage}%)
          </span>
        </div>
      </div>

      {/* Action Button */}
      <div className="pt-2 border-t border-slate-800">
        <Link
          href={`/area/${area.id}`}
          className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold text-xs tracking-tight transition-colors shadow-md shadow-cyan-500/20"
        >
          <span>Open Full Intelligence Report</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
