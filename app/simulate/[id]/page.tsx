"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { InterventionControls } from "@/components/simulator/InterventionControls";
import { ComparisonCard } from "@/components/simulator/ComparisonCard";
import { SimulationResults } from "@/components/simulator/SimulationResults";
import { AssumptionsPanel } from "@/components/simulator/AssumptionsPanel";
import { MapPlaceholder } from "@/components/map/MapPlaceholder";
import { getAreaById, calculateSimulation } from "@/lib/mock-data";
import { SimulationScenario } from "@/types/simulation";
import { Sliders, ArrowLeft, Layers, Sparkles, MapPin, Eye } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

export default function SimulatorPage() {
  const params = useParams();
  const id = typeof params?.id === "string" ? params.id : "gulshan-iqbal";
  const area = getAreaById(id);

  // Intervention Scenario State
  const initialScenario: SimulationScenario = {
    treeCoverage: 45, // 30% -> 50%
    coolRoofs: 30, // 0% -> 40%
    drainage: 60, // Low -> High
    trafficReduction: 20, // 0% -> 30%
    greenCorridors: true,
  };

  const [scenario, setScenario] = useState<SimulationScenario>(initialScenario);
  const [mapTab, setMapTab] = useState<"current" | "modelled">("modelled");

  // Recalculate simulation deltas reactively
  const simulationResults = useMemo(() => {
    return calculateSimulation(area.scores, scenario);
  }, [area.scores, scenario]);

  const handleReset = () => {
    setScenario({
      treeCoverage: 30,
      coolRoofs: 0,
      drainage: 20,
      trafficReduction: 0,
      greenCorridors: false,
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#030712] text-slate-100 selection:bg-cyan-500/30 selection:text-cyan-200">
      <Navbar />

      <main className="flex-1 pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-8">
        {/* Navigation Breadcrumb & Back button */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs font-mono">
          <Link
            href={`/area/${area.id}`}
            className="flex items-center gap-1.5 text-slate-400 hover:text-cyan-300 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to {area.name} Dossier</span>
          </Link>

          <div className="flex items-center gap-2">
            <span className="text-slate-500">TARGET:</span>
            <span className="text-cyan-300 font-semibold">{area.name}</span>
          </div>
        </div>

        {/* Page Header */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold tracking-widest text-cyan-400 uppercase">
              CLIMATE MITIGATION LAB
            </span>
            <Badge variant="cyan" size="sm">
              THERMODYNAMIC DELTAS
            </Badge>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Urban Intervention Simulator
          </h1>
          <p className="text-sm text-slate-400 max-w-2xl leading-relaxed">
            Explore how potential civic interventions like cool roofs, afforestation, drainage bioswales, and traffic calming could influence environmental conditions in {area.name}.
          </p>
        </div>

        {/* Top Highlight: Impact Metrics (Temp reduction, runoff absorption, co2) */}
        <SimulationResults results={simulationResults} />

        {/* 2-Column Split: Controls Deck + Comparison & Map */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left: Parameter Sliders */}
          <div className="lg:col-span-5 space-y-6">
            <InterventionControls
              scenario={scenario}
              onChange={setScenario}
              onReset={handleReset}
            />

            {/* Scientific Assumptions Collapsible Box */}
            <AssumptionsPanel />
          </div>

          {/* Right: Before vs After Delta Card & Dual-Tab Map Placeholder */}
          <div className="lg:col-span-7 space-y-6">
            {/* Before vs After Comparison Card */}
            <ComparisonCard results={simulationResults} />

            {/* Map Comparison Placeholder with Tabs */}
            <div className="glass-panel p-5 rounded-2xl border-slate-800 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
                <div>
                  <h3 className="text-sm font-mono font-bold tracking-wider text-white uppercase flex items-center gap-2">
                    <Layers className="w-4 h-4 text-cyan-400" />
                    <span>Spatial Simulation Comparison</span>
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Dual-state raster preview reserved for Infinity GIS module.
                  </p>
                </div>

                {/* Tabs: [ CURRENT STATE ] vs [ MODELLED FUTURE ] */}
                <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800 shrink-0 font-mono text-xs">
                  <button
                    type="button"
                    onClick={() => setMapTab("current")}
                    className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer select-none ${
                      mapTab === "current"
                        ? "bg-slate-800 text-white font-bold border border-slate-700 shadow-sm"
                        : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    CURRENT STATE
                  </button>

                  <button
                    type="button"
                    onClick={() => setMapTab("modelled")}
                    className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer select-none flex items-center gap-1.5 ${
                      mapTab === "modelled"
                        ? "bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40 shadow-sm"
                        : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    <Sparkles className="w-3 h-3 text-cyan-400" />
                    <span>MODELLED FUTURE</span>
                  </button>
                </div>
              </div>

              {/* Map Placeholder Render */}
              <MapPlaceholder
                activeLayer="heat"
                selectedArea={area}
                showComparisonMode
                modelState={mapTab}
                heightClassName="h-[360px]"
              />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
