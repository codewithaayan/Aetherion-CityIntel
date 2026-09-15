import React from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { DATA_SOURCES } from "@/lib/mock-data";
import {
  Satellite,
  Cpu,
  Grid,
  ShieldAlert,
  Users,
  Sparkles,
  Sliders,
  ChevronDown,
  Info,
  Layers,
  AlertTriangle,
  Flame,
  Wind,
  CloudRain,
  Trees,
  Car,
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Card, CardTitle, CardDescription } from "@/components/ui/Card";

export const metadata = {
  title: "Methodology & Pipeline — UrbanPulse",
  description: "Scientific documentation of data ingestion, geospatial grid models, and thermodynamic simulation.",
};

export default function MethodologyPage() {
  const pipelineStages = [
    { name: "SATELLITE DATA", desc: "Multi-spectral radiance from Landsat 9, Sentinel-2, and NASA GPM.", icon: Satellite, step: "01" },
    { name: "ENVIRONMENTAL PROCESSING", desc: "LST calculation, NDVI index extraction, and atmospheric corrections.", icon: Cpu, step: "02" },
    { name: "GEOSPATIAL GRID", desc: "250m² metric pixel decomposition aligned with OpenStreetMap vectors.", icon: Grid, step: "03" },
    { name: "RISK MODELLING", desc: "Multi-Criteria Decision Analysis (MCDA) weighting environmental dimensions.", icon: ShieldAlert, step: "04" },
    { name: "POPULATION EXPOSURE", desc: "WorldPop gridded demographic overlay to quantify citizens at risk.", icon: Users, step: "05" },
    { name: "AI INTERPRETATION", desc: "Structured diagnostic reasoning and actionable civic recommendations.", icon: Sparkles, step: "06" },
    { name: "INTERVENTION SIMULATION", desc: "Micro-climate sensitivity modeling projecting policy deltas.", icon: Sliders, step: "07" },
  ];

  const limitations = [
    {
      title: "Satellite Spatial Resolution Limitations",
      text: "Thermal infrared sensors (Landsat TIRS) have a native pixel resolution of 100m resampled to 30m. Micro-scale rooftop thermal variability within smaller informal parcels may be averaged.",
    },
    {
      title: "Air Quality Sensor Coverage",
      text: "Atmospheric reanalysis and chemical transport models reflect regional atmospheric boundary layers. Localized street-level exhaust canyons may experience sharp localized variances.",
    },
    {
      title: "Flood Vulnerability vs Real-time Prediction",
      text: "Our models quantify structural terrain vulnerability based on slope, depression depth, and soil imperviability. It does NOT replace real-time meteorological flood warnings.",
    },
    {
      title: "Population Estimates Uncertainty",
      text: "WorldPop demographic rasters use top-down statistical disaggregation of national census figures. Highly transient unmapped informal settlements may carry marginal uncertainty bounds.",
    },
    {
      title: "Simulations are Scenarios, Not Guarantees",
      text: "Intervention deltas are modelled sensitivity calculations based on thermodynamic transfer literature, not guaranteed empirical forecasts for future weather events.",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#030712] text-slate-100 selection:bg-cyan-500/30 selection:text-cyan-200">
      <Navbar />

      <main className="flex-1 pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-16">
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <Badge variant="cyan" size="sm">
            SCIENTIFIC PROTOCOL
          </Badge>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            How UrbanPulse Works
          </h1>
          <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
            A transparent architectural breakdown of how raw spaceborne observations transform into street-level environmental intelligence and civic policy scenarios.
          </p>
        </div>

        {/* 1. Visual Pipeline Section */}
        <div className="space-y-6">
          <div className="text-center space-y-1">
            <h2 className="text-xl font-bold text-white tracking-tight">
              End-to-End Analytical Processing Pipeline
            </h2>
            <p className="text-xs text-slate-400 font-mono">
              7 Discrete Computational Stages
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-7 gap-3 relative">
            {pipelineStages.map((stage, idx) => {
              const Icon = stage.icon;
              return (
                <div
                  key={stage.name}
                  className="glass-panel p-4 rounded-xl border-slate-800 flex flex-col justify-between space-y-3 group hover:border-cyan-500/40 transition-all text-center relative"
                >
                  <div className="flex flex-col items-center">
                    <span className="text-[10px] font-mono font-bold text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800 mb-2">
                      {stage.step}
                    </span>
                    <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center text-cyan-400 group-hover:border-cyan-400 transition-colors">
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>

                  <div>
                    <h4 className="text-[11px] font-mono font-bold text-white uppercase tracking-tight">
                      {stage.name}
                    </h4>
                    <p className="text-[10px] text-slate-400 mt-1 line-clamp-3 leading-tight">
                      {stage.desc}
                    </p>
                  </div>

                  {idx < 6 && (
                    <div className="hidden md:block absolute -right-2 top-1/2 -translate-y-1/2 z-20 text-cyan-500/40 text-xs font-mono">
                      →
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* 2. Mathematical Risk Model Visualization */}
        <div className="glass-panel p-8 rounded-2xl border-cyan-500/30 space-y-8 bg-gradient-to-b from-[#060c22] to-[#040816]">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-2xl font-bold text-white tracking-tight">
              The UrbanPulse Composite Risk Formulation
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Mathematical synthesis integrating multi-hazard indices with fine-scale spatial demographics.
            </p>
          </div>

          {/* Equation Graphic Flow */}
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Top Components Box */}
            <div className="p-6 rounded-2xl bg-slate-950/80 border border-slate-800 flex flex-wrap items-center justify-center gap-3 font-mono text-xs">
              <span className="px-3 py-2 rounded-lg bg-red-500/10 border border-red-500/30 text-red-300 flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5" /> HEAT (30%)
              </span>
              <span className="text-slate-500 font-bold text-lg">+</span>
              <span className="px-3 py-2 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 flex items-center gap-1.5">
                <Wind className="w-3.5 h-3.5" /> AIR (20%)
              </span>
              <span className="text-slate-500 font-bold text-lg">+</span>
              <span className="px-3 py-2 rounded-lg bg-sky-500/10 border border-sky-500/30 text-sky-300 flex items-center gap-1.5">
                <CloudRain className="w-3.5 h-3.5" /> FLOOD (15%)
              </span>
              <span className="text-slate-500 font-bold text-lg">+</span>
              <span className="px-3 py-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 flex items-center gap-1.5">
                <Trees className="w-3.5 h-3.5" /> GREEN DEFICIT (15%)
              </span>
              <span className="text-slate-500 font-bold text-lg">+</span>
              <span className="px-3 py-2 rounded-lg bg-blue-500/10 border border-blue-500/30 text-blue-300 flex items-center gap-1.5">
                <Car className="w-3.5 h-3.5" /> MOBILITY (10%)
              </span>
            </div>

            {/* Down Arrow */}
            <div className="flex justify-center">
              <div className="w-8 h-8 rounded-full bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
                ↓
              </div>
            </div>

            {/* Environmental Risk Level */}
            <div className="p-4 rounded-xl bg-cyan-950/40 border border-cyan-700/60 text-center font-mono">
              <span className="text-xs text-cyan-400 uppercase tracking-widest block">Stage 1 Output</span>
              <span className="text-xl font-bold text-white">ENVIRONMENTAL RISK INDEX (0 - 100)</span>
            </div>

            {/* Multiply with Population */}
            <div className="flex justify-center items-center gap-3 font-mono text-sm text-slate-400">
              <div className="w-8 h-8 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center text-cyan-300 font-bold">
                ×
              </div>
              <span className="px-3 py-1.5 rounded-lg bg-purple-950/40 border border-purple-800 text-purple-300 flex items-center gap-1.5">
                <Users className="w-4 h-4" /> WORLDPOP GRIDDED DEMOGRAPHICS
              </span>
            </div>

            {/* Down Arrow */}
            <div className="flex justify-center">
              <div className="w-8 h-8 rounded-full bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
                ↓
              </div>
            </div>

            {/* Final Target Output */}
            <div className="p-6 rounded-2xl bg-gradient-to-r from-red-950/40 via-amber-950/30 to-purple-950/40 border border-cyan-400/50 text-center font-mono shadow-xl space-y-1">
              <span className="text-xs text-amber-400 uppercase tracking-widest block font-bold">
                FINAL POLICY PRIORITY METRIC
              </span>
              <span className="text-2xl font-extrabold text-white tracking-wide">
                POPULATION EXPOSURE SCORE & URBAN PRIORITY
              </span>
              <p className="text-xs text-slate-400 pt-1 font-sans">
                Quantifies the absolute number of vulnerable citizens exposed to multi-stress thresholds.
              </p>
            </div>
          </div>
        </div>

        {/* 3. Data Source Cards Section */}
        <div id="sources" className="space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <Badge variant="neutral" size="sm">
              INPUT CATALOG
            </Badge>
            <h2 className="text-2xl font-bold text-white tracking-tight">
              Integrated Spaceborne & Open Geospatial Repositories
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Every data layer is referenced with exact orbital cadence and spatial resolution.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {DATA_SOURCES.slice(0, 6).map((source) => (
              <Card key={source.name} className="p-5 border-slate-800 flex flex-col justify-between">
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <Badge variant="cyan" size="sm">
                      {source.badge}
                    </Badge>
                    <span className="text-[10px] font-mono text-slate-500">{source.agency}</span>
                  </div>
                  <CardTitle className="text-base text-white">{source.name}</CardTitle>
                  <CardDescription className="text-xs text-slate-400">{source.description}</CardDescription>
                </div>
                <div className="pt-3 mt-4 border-t border-slate-800 text-[11px] font-mono text-slate-400 flex items-center justify-between">
                  <span className="text-slate-500">Cadence:</span>
                  <span className="text-cyan-300 font-semibold">{source.resolution}</span>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* 4. Limitations & Scientific Disclosures Section */}
        <div id="limitations" className="glass-panel p-8 rounded-2xl border-slate-800 space-y-6">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-400" />
            <h3 className="text-lg font-bold text-white tracking-tight">
              Scientific Boundaries & Limitations
            </h3>
          </div>

          <p className="text-xs text-slate-400 leading-relaxed">
            In accordance with best practices for environmental modeling, UrbanPulse explicitly bounds all calculations with the following known system constraints:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
            {limitations.map((item, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/90 space-y-2">
                <h5 className="text-xs font-semibold text-slate-200 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                  {item.title}
                </h5>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
