"use client";

import React from "react";
import { SimulationScenario } from "@/types/simulation";
import { Trees, Shield, CloudRain, Car, Sparkles, RefreshCw } from "lucide-react";

export interface InterventionControlsProps {
  scenario: SimulationScenario;
  onChange: (scenario: SimulationScenario) => void;
  onReset: () => void;
}

export function InterventionControls({
  scenario,
  onChange,
  onReset,
}: InterventionControlsProps) {
  const handleSliderChange = (key: keyof SimulationScenario, value: number) => {
    onChange({
      ...scenario,
      [key]: value,
    });
  };

  const handleToggleCorridors = () => {
    onChange({
      ...scenario,
      greenCorridors: !scenario.greenCorridors,
    });
  };

  return (
    <div className="glass-panel p-6 rounded-2xl border-cyan-500/25 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div>
          <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span>Intervention Parameter Deck</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Adjust policy levers to simulate thermodynamic responses.
          </p>
        </div>
        <button
          type="button"
          onClick={onReset}
          className="flex items-center gap-1.5 text-xs font-mono text-slate-400 hover:text-cyan-300 transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Reset</span>
        </button>
      </div>

      <div className="space-y-5">
        {/* 1. Tree Coverage Slider (30% to 60%) */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="flex items-center gap-2 text-slate-300">
              <Trees className="w-4 h-4 text-emerald-400" />
              <span>Tree Canopy Coverage</span>
            </span>
            <span className="text-emerald-400 font-bold text-sm">
              {scenario.treeCoverage}%
            </span>
          </div>
          <input
            type="range"
            min="30"
            max="60"
            step="1"
            value={scenario.treeCoverage}
            onChange={(e) => handleSliderChange("treeCoverage", Number(e.target.value))}
            className="w-full h-2 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-emerald-400 border border-slate-800"
          />
          <div className="flex justify-between text-[10px] font-mono text-slate-500">
            <span>Baseline: 30%</span>
            <span>Target: 60% Maximum</span>
          </div>
        </div>

        {/* 2. Cool Roof Adoption (0% to 50%) */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="flex items-center gap-2 text-slate-300">
              <Shield className="w-4 h-4 text-cyan-400" />
              <span>Cool Roof Coating Adoption</span>
            </span>
            <span className="text-cyan-400 font-bold text-sm">
              {scenario.coolRoofs}%
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="50"
            step="5"
            value={scenario.coolRoofs}
            onChange={(e) => handleSliderChange("coolRoofs", Number(e.target.value))}
            className="w-full h-2 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-cyan-400 border border-slate-800"
          />
          <div className="flex justify-between text-[10px] font-mono text-slate-500">
            <span>0% Current</span>
            <span>50% Municipal Mandate</span>
          </div>
        </div>

        {/* 3. Drainage Infrastructure (0% to 100%) */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="flex items-center gap-2 text-slate-300">
              <CloudRain className="w-4 h-4 text-sky-400" />
              <span>Drainage Capacity Upgrade</span>
            </span>
            <span className="text-sky-400 font-bold text-sm">
              {scenario.drainage < 30 ? "Low" : scenario.drainage < 70 ? "Moderate" : "High"} ({scenario.drainage}%)
            </span>
          </div>
          <input
            type="range"
            min="10"
            max="100"
            step="10"
            value={scenario.drainage}
            onChange={(e) => handleSliderChange("drainage", Number(e.target.value))}
            className="w-full h-2 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-sky-400 border border-slate-800"
          />
          <div className="flex justify-between text-[10px] font-mono text-slate-500">
            <span>Low (Current)</span>
            <span>High Engineered Bioswales</span>
          </div>
        </div>

        {/* 4. Traffic Reduction (0% to 40%) */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="flex items-center gap-2 text-slate-300">
              <Car className="w-4 h-4 text-blue-400" />
              <span>Vehicular Traffic Calming</span>
            </span>
            <span className="text-blue-400 font-bold text-sm">
              -{scenario.trafficReduction}%
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="40"
            step="5"
            value={scenario.trafficReduction}
            onChange={(e) => handleSliderChange("trafficReduction", Number(e.target.value))}
            className="w-full h-2 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-blue-400 border border-slate-800"
          />
          <div className="flex justify-between text-[10px] font-mono text-slate-500">
            <span>0% Unrestricted</span>
            <span>40% Transit Corridors</span>
          </div>
        </div>

        {/* 5. Green Corridors Toggle */}
        <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-xs font-mono font-semibold text-slate-200 block">
              Continuous Ecological Corridors
            </span>
            <span className="text-[11px] text-slate-400">
              Connect linear parks & water nullahs
            </span>
          </div>

          <button
            type="button"
            onClick={handleToggleCorridors}
            className={`w-12 h-6 rounded-full transition-colors p-0.5 border ${
              scenario.greenCorridors
                ? "bg-emerald-500 border-emerald-400"
                : "bg-slate-800 border-slate-700"
            }`}
          >
            <div
              className={`w-5 h-5 rounded-full bg-white transition-transform ${
                scenario.greenCorridors ? "translate-x-6" : "translate-x-0"
              }`}
            />
          </button>
        </div>
      </div>
    </div>
  );
}
