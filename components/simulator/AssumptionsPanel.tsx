"use client";

import React, { useState } from "react";
import { ChevronDown, ChevronUp, ShieldAlert, AlertTriangle, Layers, Info } from "lucide-react";

export function AssumptionsPanel() {
  const [isOpen, setIsOpen] = useState(false);

  const assumptions = [
    {
      title: "Results are Modelled Scenarios",
      description: "Outputs illustrate estimated thermodynamic sensitivities under constant meteorological assumptions rather than real-time weather forecasts.",
      icon: ShieldAlert,
    },
    {
      title: "Not Guaranteed Predictions",
      description: "Calculations project relative proportional cooling and absorption deltas; actual outcomes depend on structural compliance and seasonal extremes.",
      icon: AlertTriangle,
    },
    {
      title: "Environmental Relationships Vary by Location",
      description: "Coastal wind vectors, soil permeability, and multi-story street canyon geometry influence microclimate heat transfer differently across sub-wards.",
      icon: Layers,
    },
    {
      title: "Data Resolution Has Limitations",
      description: "Satellite thermal data (Landsat 30-100m) and gridded population rasters (WorldPop 100m) are aggregated to neighborhood blocks and may mask micro-hotspots.",
      icon: Info,
    },
  ];

  return (
    <div className="glass-panel rounded-2xl border-slate-800/90 overflow-hidden transition-all">
      {/* Toggle Header */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-5 flex items-center justify-between text-left hover:bg-slate-900/40 transition-colors select-none cursor-pointer"
      >
        <div className="flex items-center gap-2.5">
          <Info className="w-4 h-4 text-cyan-400" />
          <span className="text-sm font-mono font-bold tracking-wider text-white uppercase">
            Simulation Scientific Assumptions & Limitations
          </span>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
          <span>{isOpen ? "Collapse" : "Expand (4 Disclosures)"}</span>
          {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </div>
      </button>

      {/* Expanded Content */}
      {isOpen && (
        <div className="p-5 pt-0 border-t border-slate-800/80 space-y-4 animate-in fade-in duration-200">
          <p className="text-xs text-slate-400 leading-relaxed pt-3">
            To ensure scientific rigor and policy transparency, all intervention simulations operate under the following explicit boundary assumptions:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
            {assumptions.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1.5"
                >
                  <div className="flex items-center gap-2">
                    <Icon className="w-3.5 h-3.5 text-cyan-400" />
                    <h5 className="text-xs font-semibold text-slate-200">
                      {item.title}
                    </h5>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="pt-2 text-[10px] font-mono text-slate-500 border-t border-slate-800/60 flex items-center justify-between">
            <span>METHODOLOGY: AETHERION SCIENTIFIC PROTOCOL V2.4</span>
            <span>REVIEWED BY AYESHA (RESEARCH & VALIDATION)</span>
          </div>
        </div>
      )}
    </div>
  );
}
