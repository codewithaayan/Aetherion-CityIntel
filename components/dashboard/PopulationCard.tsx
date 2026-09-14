import React from "react";
import { Area } from "@/types/area";
import { formatNumber } from "@/lib/utils";
import { Users, AlertCircle, ShieldAlert, HeartPulse } from "lucide-react";

export interface PopulationCardProps {
  area: Area;
}

export function PopulationCard({ area }: PopulationCardProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
          <Users className="w-4 h-4 text-cyan-400" />
          <span>Demographic Exposure Analysis</span>
        </h3>
        <span className="text-[11px] font-mono text-slate-400">
          WorldPop 100m² Gridded Census
        </span>
      </div>

      {/* 3 Premium Metric Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Total Population */}
        <div className="glass-panel p-5 rounded-2xl border-slate-800/80">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-2">
            <span className="uppercase tracking-wider">TOTAL POPULATION</span>
            <Users className="w-4 h-4 text-slate-500" />
          </div>
          <div className="text-3xl font-extrabold font-mono text-white tracking-tight">
            {formatNumber(area.population)}
          </div>
          <div className="text-[11px] font-mono text-slate-500 mt-1">
            Density: {formatNumber(area.densityPerKm2)}/km²
          </div>
        </div>

        {/* High-Risk Population */}
        <div className="glass-panel p-5 rounded-2xl border-red-500/30 bg-red-950/10">
          <div className="flex items-center justify-between text-xs font-mono text-red-400 mb-2">
            <span className="uppercase tracking-wider">HIGH-RISK POPULATION</span>
            <AlertCircle className="w-4 h-4 text-red-400" />
          </div>
          <div className="text-3xl font-extrabold font-mono text-red-400 tracking-tight">
            {formatNumber(area.highRiskPopulation)}
          </div>
          <div className="text-[11px] font-mono text-red-300/80 mt-1">
            Acute multi-stress vulnerability
          </div>
        </div>

        {/* Population Exposed % */}
        <div className="glass-panel p-5 rounded-2xl border-amber-500/30 bg-amber-950/10">
          <div className="flex items-center justify-between text-xs font-mono text-amber-400 mb-2">
            <span className="uppercase tracking-wider">POPULATION EXPOSED</span>
            <ShieldAlert className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-3xl font-extrabold font-mono text-amber-400 tracking-tight">
            {area.exposedPercentage}%
          </div>
          <div className="text-[11px] font-mono text-amber-300/80 mt-1">
            Above baseline threshold
          </div>
        </div>
      </div>
    </div>
  );
}
