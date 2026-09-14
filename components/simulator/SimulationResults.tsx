import React from "react";
import { SimulationResults as SimResultsType } from "@/types/simulation";
import { Thermometer, CloudRain, Leaf, ShieldCheck, AlertCircle } from "lucide-react";
import { formatNumber } from "@/lib/utils";

export interface SimulationResultsProps {
  results: SimResultsType;
}

export function SimulationResults({ results }: SimulationResultsProps) {
  const { metrics } = results;

  return (
    <div className="space-y-4">
      {/* 4 Impact Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Temp Drop */}
        <div className="glass-panel p-4 rounded-xl border-emerald-500/20 bg-emerald-950/10">
          <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 mb-1">
            <Thermometer className="w-4 h-4" />
            <span>TEMP REDUCTION</span>
          </div>
          <div className="text-2xl font-extrabold font-mono text-white tracking-tight">
            -{metrics.tempReductionC}°C
          </div>
          <div className="text-[11px] font-mono text-slate-400 mt-0.5">
            Microclimate cooling
          </div>
        </div>

        {/* Stormwater Absorption */}
        <div className="glass-panel p-4 rounded-xl border-sky-500/20 bg-sky-950/10">
          <div className="flex items-center gap-2 text-xs font-mono text-sky-400 mb-1">
            <CloudRain className="w-4 h-4" />
            <span>DRAINAGE GAIN</span>
          </div>
          <div className="text-2xl font-extrabold font-mono text-white tracking-tight">
            +{metrics.stormwaterAbsorptionRate}%
          </div>
          <div className="text-[11px] font-mono text-slate-400 mt-0.5">
            Runoff retention
          </div>
        </div>

        {/* CO2 Reduction */}
        <div className="glass-panel p-4 rounded-xl border-cyan-500/20 bg-cyan-950/10">
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 mb-1">
            <Leaf className="w-4 h-4" />
            <span>CARBON OFFSET</span>
          </div>
          <div className="text-2xl font-extrabold font-mono text-white tracking-tight">
            {metrics.co2ReductionTons} t
          </div>
          <div className="text-[11px] font-mono text-slate-400 mt-0.5">
            Annual sequestration
          </div>
        </div>

        {/* Citizens De-escalated */}
        <div className="glass-panel p-4 rounded-xl border-purple-500/20 bg-purple-950/10">
          <div className="flex items-center gap-2 text-xs font-mono text-purple-400 mb-1">
            <ShieldCheck className="w-4 h-4" />
            <span>CITIZENS BUFFERED</span>
          </div>
          <div className="text-2xl font-extrabold font-mono text-white tracking-tight">
            ~{formatNumber(metrics.vulnerablePopulationProtected)}
          </div>
          <div className="text-[11px] font-mono text-slate-400 mt-0.5">
            Shifted from high-risk
          </div>
        </div>
      </div>

      {/* Scientific Notice Banner */}
      <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 flex items-start gap-3 text-xs font-mono text-slate-400">
        <AlertCircle className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
        <div>
          <span className="text-cyan-300 font-semibold uppercase">MODELLED SCENARIO: </span>
          Prototype demonstration — calculations will later be connected to Chip&apos;s thermodynamic scientific modelling engine. Values represent simulated sensitivity responses, not empirical guarantees.
        </div>
      </div>
    </div>
  );
}
