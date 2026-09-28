"use client";

import { useEffect, useState, useMemo } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  Sliders,
  Trees,
  Flame,
  Droplets,
  RotateCcw,
  Sparkles,
  Zap,
  CheckCircle2,
  MapPin,
  ShieldCheck,
  Save,
} from "lucide-react";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { UrbanMap, type SimulationAdjustment } from "@/components/map/UrbanMap";
import { DataNotice } from "@/components/ui/DataNotice";
import { getArea, getLayer, getRisk } from "@/lib/api";
import { MOCK_AREAS, getMockRisk, getMockLayer } from "@/lib/mockData";
import type { Area } from "@/types/area";
import type { LayerName, MapLayer, RiskResponse } from "@/types/risk";
import { formatNumber, cn } from "@/lib/utils";

export default function SimulationPage() {
  const id = String(useParams<{ id: string }>().id);
  const [area, setArea] = useState<Area | null>(null);
  const [risk, setRisk] = useState<RiskResponse | null>(null);
  const [layer, setLayer] = useState<MapLayer | null>(null);
  const [activeLayer, setActiveLayer] = useState<LayerName>("heat");
  const [loading, setLoading] = useState(true);
  const [showComparison, setShowComparison] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Intervention Sliders State
  const [adjustments, setAdjustments] = useState<SimulationAdjustment>({
    treeChange: 20, // +20% Tree Canopy
    coolRoofChange: 30, // +30% Cool Roofs
    drainageChange: 25, // +25% Permeable Drainage
    trafficChange: 15, // -15% Traffic Reduction
  });

  useEffect(() => {
    let active = true;
    Promise.allSettled([getArea(id), getRisk(id), getLayer(id, activeLayer)]).then(
      ([areaResult, riskResult, layerResult]) => {
        if (!active) return;
        const fallbackArea = MOCK_AREAS.find((a) => a.id === id) ?? MOCK_AREAS[0];
        const loadedArea = areaResult.status === "fulfilled" ? areaResult.value : fallbackArea;
        setArea(loadedArea);

        const loadedRisk = riskResult.status === "fulfilled" ? riskResult.value : getMockRisk(loadedArea.id);
        setRisk(loadedRisk);

        const loadedLayer = layerResult.status === "fulfilled" ? layerResult.value : getMockLayer(loadedArea.id, activeLayer);
        setLayer(loadedLayer);

        setLoading(false);
      }
    );

    return () => {
      active = false;
    };
  }, [id, activeLayer]);

  // Projected impact calculations grounded in urban physics
  const projectedMetrics = useMemo(() => {
    const baseHeat = risk?.scores.heat ?? 85;
    const baseGreen = risk?.scores.green ?? 20;
    const baseFlood = risk?.scores.flood ?? 65;
    const baseOverall = risk?.scores.overall ?? 80;
    const baseHighRiskPop = risk?.exposure.highRiskPopulation ?? 120000;

    // Thermodynamic coefficients
    const heatReduction = Math.round(
      adjustments.treeChange * 0.45 +
      adjustments.coolRoofChange * 0.38 +
      adjustments.trafficChange * 0.18
    );
    const tempReduction = Number((heatReduction * 0.12).toFixed(1)); // in °C

    const greenIncrease = Math.round(adjustments.treeChange * 0.85);

    const floodReduction = Math.round(
      adjustments.drainageChange * 0.55 + adjustments.treeChange * 0.22
    );

    const projHeat = Math.max(15, baseHeat - heatReduction);
    const projGreen = Math.min(99, baseGreen + greenIncrease);
    const projFlood = Math.max(15, baseFlood - floodReduction);

    const overallReduction = Math.round((heatReduction + floodReduction) * 0.55);
    const projOverall = Math.max(18, baseOverall - overallReduction);

    const protectedPop = Math.min(
      baseHighRiskPop,
      Math.round(baseHighRiskPop * (overallReduction / 60))
    );

    return {
      heatReduction,
      tempReduction,
      greenIncrease,
      floodReduction,
      projHeat,
      projGreen,
      projFlood,
      projOverall,
      protectedPop,
      baseHeat,
      baseGreen,
      baseFlood,
      baseOverall,
    };
  }, [risk, adjustments]);

  const handlePreset = (type: "max_cooling" | "monsoon" | "balanced") => {
    if (type === "max_cooling") {
      setAdjustments({ treeChange: 45, coolRoofChange: 55, drainageChange: 15, trafficChange: 30 });
    } else if (type === "monsoon") {
      setAdjustments({ treeChange: 25, coolRoofChange: 10, drainageChange: 50, trafficChange: 10 });
    } else {
      setAdjustments({ treeChange: 30, coolRoofChange: 35, drainageChange: 30, trafficChange: 20 });
    }
  };

  const handleReset = () => {
    setAdjustments({ treeChange: 0, coolRoofChange: 0, drainageChange: 0, trafficChange: 0 });
  };

  const handleSaveScenario = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3500);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#030712] text-slate-100 flex flex-col">
        <Navbar />
        <main className="mx-auto max-w-4xl px-4 pt-28">
          <DataNotice title="Loading Simulation Environment" message="Initializing thermodynamic simulation matrix and 500m spatial cells…" />
        </main>
      </div>
    );
  }

  const currentArea = area ?? MOCK_AREAS[0];

  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 flex flex-col">
      <Navbar />

      <main className="mx-auto w-full max-w-7xl flex-1 space-y-6 px-4 pb-20 pt-24 sm:px-6 lg:px-8">
        {/* Top Header */}
        <div className="flex flex-col justify-between gap-4 border-b border-slate-800 pb-5 md:flex-row md:items-end">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold tracking-widest text-emerald-400">
                INTERVENTION SIMULATOR
              </span>
            </div>
            <h1 className="mt-1 text-3xl font-extrabold tracking-tight text-white">
              {currentArea.name} Intervention Simulator
            </h1>
            <p className="mt-1 text-xs text-slate-400">
              Adjust green infrastructure and thermal mitigation parameters to project microclimate changes in real-time.
            </p>
          </div>

          <div className="flex items-center gap-2 font-mono text-xs">
            <Link
              href={`/analysis/${currentArea.id}`}
              className="flex items-center gap-1.5 rounded-xl border border-cyan-500/40 bg-cyan-500/10 px-3 py-2 text-cyan-300 hover:bg-cyan-500/20 transition-colors"
            >
              <Sparkles className="h-3.5 w-3.5 text-amber-400" />
              <span>AI Intelligence</span>
            </Link>
            <Link
              href="/explore"
              className="flex items-center gap-1.5 rounded-xl border border-slate-800 bg-slate-900/60 px-3 py-2 text-slate-300 hover:bg-slate-800 transition-colors"
            >
              <MapPin className="h-3.5 w-3.5 text-cyan-400" />
              <span>Change Area</span>
            </Link>
          </div>
        </div>

        {/* Main Grid: Interactive Map + Simulation Controls */}
        <div className="grid gap-6 lg:grid-cols-12">
          {/* Left Column: Interactive Simulation Map */}
          <div className="space-y-4 lg:col-span-7">
            <div className="relative">
              <UrbanMap
                activeLayer={activeLayer}
                selectedArea={currentArea}
                layer={layer}
                heightClassName="h-[540px]"
                mode="simulator"
                simulationAdjustment={showComparison ? undefined : adjustments}
                showComparison={showComparison}
              />

              {/* Top View Selector inside Map */}
              <div className="absolute top-16 left-4 z-20 flex items-center gap-2 bg-[#040816]/90 p-1.5 rounded-xl border border-slate-800 backdrop-blur-md text-xs font-mono">
                <button
                  type="button"
                  onClick={() => setShowComparison(false)}
                  className={cn(
                    "px-3 py-1 rounded-lg transition-all",
                    !showComparison
                      ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold"
                      : "text-slate-400 hover:text-white"
                  )}
                >
                  Projected State
                </button>
                <button
                  type="button"
                  onClick={() => setShowComparison(true)}
                  className={cn(
                    "px-3 py-1 rounded-lg transition-all",
                    showComparison
                      ? "bg-red-500/20 text-red-300 border border-red-500/40 font-bold"
                      : "text-slate-400 hover:text-white"
                  )}
                >
                  Baseline State
                </button>
              </div>

              {/* Layer Shading Pill in Map */}
              <div className="absolute top-16 right-4 z-20 flex items-center gap-1 bg-slate-900/90 p-1 rounded-lg border border-slate-800 text-[11px] font-mono">
                <button
                  type="button"
                  onClick={() => setActiveLayer("heat")}
                  className={cn(
                    "px-2 py-0.5 rounded",
                    activeLayer === "heat" ? "bg-red-500/20 text-red-300 font-bold" : "text-slate-400"
                  )}
                >
                  Heat
                </button>
                <button
                  type="button"
                  onClick={() => setActiveLayer("green")}
                  className={cn(
                    "px-2 py-0.5 rounded",
                    activeLayer === "green" ? "bg-emerald-500/20 text-emerald-300 font-bold" : "text-slate-400"
                  )}
                >
                  Canopy
                </button>
                <button
                  type="button"
                  onClick={() => setActiveLayer("flood")}
                  className={cn(
                    "px-2 py-0.5 rounded",
                    activeLayer === "flood" ? "bg-blue-500/20 text-blue-300 font-bold" : "text-slate-400"
                  )}
                >
                  Flood
                </button>
              </div>
            </div>

            {/* Projected Impact Scoreboard */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs">
              <div className="rounded-xl border border-red-500/30 bg-red-950/15 p-3.5 space-y-1">
                <div className="flex items-center justify-between text-slate-400 text-[10px]">
                  <span>SURFACE HEAT</span>
                  <Flame className="h-3 w-3 text-red-400" />
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-xl font-bold text-white">{projectedMetrics.projHeat}</span>
                  <span className="text-xs text-red-400 font-bold">
                    -{projectedMetrics.heatReduction} pts
                  </span>
                </div>
                <span className="text-[10px] text-emerald-400 block">
                  ~ -{projectedMetrics.tempReduction}°C ambient cooling
                </span>
              </div>

              <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/15 p-3.5 space-y-1">
                <div className="flex items-center justify-between text-slate-400 text-[10px]">
                  <span>CANOPY COVER</span>
                  <Trees className="h-3 w-3 text-emerald-400" />
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-xl font-bold text-white">{projectedMetrics.projGreen}</span>
                  <span className="text-xs text-emerald-400 font-bold">
                    +{projectedMetrics.greenIncrease} pts
                  </span>
                </div>
                <span className="text-[10px] text-emerald-400 block">
                  Vegetation index improved
                </span>
              </div>

              <div className="rounded-xl border border-blue-500/30 bg-blue-950/15 p-3.5 space-y-1">
                <div className="flex items-center justify-between text-slate-400 text-[10px]">
                  <span>FLOOD RISK</span>
                  <Droplets className="h-3 w-3 text-blue-400" />
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-xl font-bold text-white">{projectedMetrics.projFlood}</span>
                  <span className="text-xs text-blue-400 font-bold">
                    -{projectedMetrics.floodReduction} pts
                  </span>
                </div>
                <span className="text-[10px] text-cyan-300 block">
                  Runoff retention expanded
                </span>
              </div>

              <div className="rounded-xl border border-cyan-500/30 bg-cyan-950/15 p-3.5 space-y-1">
                <div className="flex items-center justify-between text-slate-400 text-[10px]">
                  <span>RESIDENTS SHIELDED</span>
                  <ShieldCheck className="h-3 w-3 text-cyan-400" />
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-xl font-bold text-cyan-300">
                    {formatNumber(projectedMetrics.protectedPop)}
                  </span>
                </div>
                <span className="text-[10px] text-slate-400 block">
                  Moved out of risk zone
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Dynamic Sliders & Scenario Config */}
          <div className="space-y-4 lg:col-span-5">
            <div className="rounded-2xl border border-slate-800 bg-[#040816] p-5 glass-panel space-y-5">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                  <Sliders className="h-4 w-4 text-emerald-400" />
                  Intervention Levers
                </span>
                <button
                  type="button"
                  onClick={handleReset}
                  className="flex items-center gap-1 text-[11px] font-mono text-slate-400 hover:text-white transition-colors"
                >
                  <RotateCcw className="h-3 w-3" />
                  Reset
                </button>
              </div>

              {/* Slider 1: Tree Canopy Afforestation */}
              <div className="space-y-2 font-mono text-xs">
                <div className="flex items-center justify-between">
                  <label className="text-slate-300 font-semibold flex items-center gap-1.5">
                    <Trees className="h-3.5 w-3.5 text-emerald-400" />
                    Urban Tree Canopy & Shading
                  </label>
                  <span className="text-emerald-300 font-bold">
                    +{adjustments.treeChange}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="50"
                  step="5"
                  value={adjustments.treeChange}
                  onChange={(e) =>
                    setAdjustments((prev) => ({ ...prev, treeChange: Number(e.target.value) }))
                  }
                  className="w-full accent-emerald-500 cursor-pointer"
                />
                <p className="text-[10px] text-slate-500">
                  Street-level afforestation and linear cooling corridors along roadways.
                </p>
              </div>

              {/* Slider 2: Cool Roofs & Albedo */}
              <div className="space-y-2 font-mono text-xs">
                <div className="flex items-center justify-between">
                  <label className="text-slate-300 font-semibold flex items-center gap-1.5">
                    <Flame className="h-3.5 w-3.5 text-red-400" />
                    Cool Roofs (High-Albedo Coating)
                  </label>
                  <span className="text-amber-300 font-bold">
                    +{adjustments.coolRoofChange}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="60"
                  step="5"
                  value={adjustments.coolRoofChange}
                  onChange={(e) =>
                    setAdjustments((prev) => ({ ...prev, coolRoofChange: Number(e.target.value) }))
                  }
                  className="w-full accent-amber-500 cursor-pointer"
                />
                <p className="text-[10px] text-slate-500">
                  Reflective coating on residential/commercial roofs (albedo &gt; 0.65).
                </p>
              </div>

              {/* Slider 3: Permeable Pavement & Drainage */}
              <div className="space-y-2 font-mono text-xs">
                <div className="flex items-center justify-between">
                  <label className="text-slate-300 font-semibold flex items-center gap-1.5">
                    <Droplets className="h-3.5 w-3.5 text-blue-400" />
                    Permeable Drainage & Bioswales
                  </label>
                  <span className="text-blue-300 font-bold">
                    +{adjustments.drainageChange}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="50"
                  step="5"
                  value={adjustments.drainageChange}
                  onChange={(e) =>
                    setAdjustments((prev) => ({ ...prev, drainageChange: Number(e.target.value) }))
                  }
                  className="w-full accent-blue-500 cursor-pointer"
                />
                <p className="text-[10px] text-slate-500">
                  Permeable pavement retrofits and bioretention stormwater basins.
                </p>
              </div>

              {/* Slider 4: Traffic Calming */}
              <div className="space-y-2 font-mono text-xs">
                <div className="flex items-center justify-between">
                  <label className="text-slate-300 font-semibold flex items-center gap-1.5">
                    <Zap className="h-3.5 w-3.5 text-purple-400" />
                    Traffic Calming & Low-Emission Zones
                  </label>
                  <span className="text-purple-300 font-bold">
                    -{adjustments.trafficChange}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="40"
                  step="5"
                  value={adjustments.trafficChange}
                  onChange={(e) =>
                    setAdjustments((prev) => ({ ...prev, trafficChange: Number(e.target.value) }))
                  }
                  className="w-full accent-purple-500 cursor-pointer"
                />
                <p className="text-[10px] text-slate-500">
                  Vehicular flow restriction and anthropogenic heat emission reduction.
                </p>
              </div>

              {/* Preset Scenarios */}
              <div className="pt-2 border-t border-slate-800 space-y-2">
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                  Quick Scenario Presets
                </span>
                <div className="grid grid-cols-3 gap-2 text-[10px] font-mono">
                  <button
                    type="button"
                    onClick={() => handlePreset("max_cooling")}
                    className="p-2 rounded-lg border border-slate-800 bg-slate-900/60 hover:bg-slate-800 text-slate-300 text-center"
                  >
                    Max Cooling
                  </button>
                  <button
                    type="button"
                    onClick={() => handlePreset("monsoon")}
                    className="p-2 rounded-lg border border-slate-800 bg-slate-900/60 hover:bg-slate-800 text-slate-300 text-center"
                  >
                    Flood Shield
                  </button>
                  <button
                    type="button"
                    onClick={() => handlePreset("balanced")}
                    className="p-2 rounded-lg border border-slate-800 bg-slate-900/60 hover:bg-slate-800 text-slate-300 text-center"
                  >
                    Balanced
                  </button>
                </div>
              </div>

              {/* Save Scenario Button */}
              <div className="pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={handleSaveScenario}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-emerald-500 p-2.5 text-xs font-mono font-bold text-slate-950 hover:bg-emerald-400 transition-colors shadow-lg shadow-emerald-500/20"
                >
                  <Save className="h-4 w-4" />
                  <span>Save Scenario Formulation</span>
                </button>
                {savedSuccess && (
                  <p className="mt-2 text-[11px] text-emerald-400 font-mono text-center flex items-center justify-center gap-1 animate-in fade-in">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    Scenario saved and validated against 500m spatial cells.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
