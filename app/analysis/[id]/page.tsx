"use client";

import { useEffect, useState, useMemo } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  Sparkles,
  Flame,
  Droplets,
  Trees,
  Send,
  Bot,
  Layers,
  MapPin,
  AlertTriangle,
} from "lucide-react";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { UrbanMap, type IntelligenceHotspot } from "@/components/map/UrbanMap";
import { DataNotice } from "@/components/ui/DataNotice";
import { getArea, getLayer, getRisk } from "@/lib/api";
import {
  MOCK_AREAS,
  getMockRisk,
  getMockLayer,
} from "@/lib/mockData";
import type { Area } from "@/types/area";
import type { MapLayer, RiskResponse } from "@/types/risk";
import { formatNumber, cn } from "@/lib/utils";

export default function AnalysisPage() {
  const id = String(useParams<{ id: string }>().id);
  const [area, setArea] = useState<Area | null>(null);
  const [risk, setRisk] = useState<RiskResponse | null>(null);
  const [layer, setLayer] = useState<MapLayer | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedHotspot, setSelectedHotspot] = useState<IntelligenceHotspot | null>(null);
  const [activeTab, setActiveTab] = useState<"findings" | "telemetry" | "countermeasures">("findings");
  const [chatPrompt, setChatPrompt] = useState("");
  const [chatLog, setChatLog] = useState<Array<{ role: "user" | "ai"; message: string }>>([
    {
      role: "ai",
      message:
        "UrbanPulse AI Diagnostic engine initialized. Satellite telemetry from Landsat-9 TIRS and Copernicus Sentinel-2 MSI ingested. Ask a question regarding microclimate vulnerabilities or select a spatial anomaly pin on the map.",
    },
  ]);
  const [isAiResponding, setIsAiResponding] = useState(false);

  useEffect(() => {
    let active = true;
    Promise.allSettled([getArea(id), getRisk(id), getLayer(id, "heat")]).then(
      ([areaResult, riskResult, layerResult]) => {
        if (!active) return;
        const fallbackArea = MOCK_AREAS.find((a) => a.id === id) ?? MOCK_AREAS[0];
        const loadedArea = areaResult.status === "fulfilled" ? areaResult.value : fallbackArea;
        setArea(loadedArea);

        const loadedRisk = riskResult.status === "fulfilled" ? riskResult.value : getMockRisk(loadedArea.id);
        setRisk(loadedRisk);

        const loadedLayer = layerResult.status === "fulfilled" ? layerResult.value : getMockLayer(loadedArea.id, "heat");
        setLayer(loadedLayer);

        setLoading(false);
      }
    );

    return () => {
      active = false;
    };
  }, [id]);

  // Generate dynamic AI spatial hotspots for this specific area
  const hotspots: IntelligenceHotspot[] = useMemo(() => {
    if (!area) return [];
    const geom = area.geometry?.coordinates as unknown;

    const ring: Array<[number, number]> =
      Array.isArray(geom) && Array.isArray(geom[0])
        ? (geom[0] as Array<[number, number]>)
        : [];

    const centerLon =
      ring.length >= 2
        ? (ring[0][0] + ring[1][0]) / 2
        : 67.01;

    const centerLat =
      ring.length >= 3
        ? (ring[0][1] + ring[2][1]) / 2
        : 24.86;

    return [
      {
        id: "hotspot-1",
        name: "ANOMALY-01",
        type: "thermal",
        cellId: `${area.id}-001`,
        coordinates: [centerLon - 0.005, centerLat + 0.003],
        title: "Severe Urban Heat Island Sink",
        description: "Surface temperature exceeds the 7-day municipal average by +6.4°C due to dense masonry and absence of vegetative cooling.",
        score: risk?.scores.heat ?? 88,
      },
      {
        id: "hotspot-2",
        name: "ANOMALY-02",
        type: "flood",
        cellId: `${area.id}-002`,
        coordinates: [centerLon + 0.006, centerLat - 0.004],
        title: "Low-Elevation Runoff Accumulation",
        description: "Topographical depression with 92% impervious surface cover, creating high-probability flash flood choke points during monsoon events.",
        score: risk?.scores.flood ?? 72,
      },
      {
        id: "hotspot-3",
        name: "ANOMALY-03",
        type: "canopy_deficit",
        cellId: `${area.id}-003`,
        coordinates: [centerLon + 0.002, centerLat + 0.005],
        title: "Vegetative Cover Deficit Zone",
        description: "NDVI falls below 0.08 with tree canopy coverage under 4%, leaving localized pedestrians directly exposed to solar radiation.",
        score: 100 - (risk?.scores.green ?? 20),
      },
    ];
  }, [area, risk]);

  const handleSendPrompt = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!chatPrompt.trim()) return;

    const query = chatPrompt.trim();
    setChatLog((prev) => [...prev, { role: "user", message: query }]);
    setChatPrompt("");
    setIsAiResponding(true);

    setTimeout(() => {
      let reply = "";
      const lower = query.toLowerCase();

      if (lower.includes("heat") || lower.includes("temp")) {
        reply = `Based on Landsat-9 Band 10 thermal telemetry, ${area?.name} exhibits severe microclimate heat traps, with localized surface temperatures reaching up to 43.8°C. The primary causes are high thermal mass building materials and only ${risk?.scores.green ?? 22}% canopy density. Prioritize cool roofs and street tree planting to reduce thermal load by an estimated 3.8°C.`;
      } else if (lower.includes("flood") || lower.includes("rain") || lower.includes("drain")) {
        reply = `Hydrological modeling in ${area?.name} highlights elevated risk in lower-elevation sectors (elevation < 12m), where impervious pavements prevent stormwater infiltration. Implementing permeable retention trenches along major avenues could alleviate up to 40% of flash flood accumulation.`;
      } else if (lower.includes("recommend") || lower.includes("action") || lower.includes("solution")) {
        reply = `Key recommended interventions for ${area?.name}: 1) Rapid deployment of high-albedo coatings on industrial and commercial rooftops. 2) Creation of bioswale drainage channels. 3) Establishment of a 2.5km linear cooling corridor connecting public parks. Estimated population risk reduction: ~${formatNumber(Math.round((risk?.exposure.highRiskPopulation ?? 100000) * 0.28))} citizens.`;
      } else {
        reply = `Diagnostic analysis for ${area?.name}: The overall environmental resilience index is ${risk?.scores.overall ?? 78}/100. Multi-criteria modeling indicates that thermal stress and storm runoff are the two dominant risk vectors. Select an anomaly marker on the map to inspect localized grid telemetry.`;
      }

      setChatLog((prev) => [...prev, { role: "ai", message: reply }]);
      setIsAiResponding(false);
    }, 800);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#030712] text-slate-100 flex flex-col">
        <Navbar />
        <main className="mx-auto max-w-4xl px-4 pt-28">
          <DataNotice title="Loading Intelligence Workspace" message="Ingesting multi-sensor telemetry and spatial grid cells…" />
        </main>
      </div>
    );
  }

  const currentArea = area ?? MOCK_AREAS[0];

  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 flex flex-col">
      <Navbar />

      <main className="mx-auto w-full max-w-7xl flex-1 space-y-6 px-4 pb-20 pt-24 sm:px-6 lg:px-8">
        {/* Header Breadcrumbs & Controls */}
        <div className="flex flex-col justify-between gap-4 border-b border-slate-800 pb-5 md:flex-row md:items-end">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold tracking-widest text-cyan-400">
                PLANETARY AI INTELLIGENCE
              </span>
              <span className="rounded bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 text-[10px] font-mono text-amber-300 flex items-center gap-1">
                <Sparkles className="h-3 w-3" />
                Autonomous Diagnostics
              </span>
            </div>
            <h1 className="mt-1 text-3xl font-extrabold tracking-tight text-white">
              {currentArea.name} Spatial AI Diagnostic
            </h1>
            <p className="mt-1 text-xs text-slate-400">
              Satellite multi-spectral anomaly detection, vulnerability clustering, and grounded resilience pathways.
            </p>
          </div>

          <div className="flex items-center gap-2 font-mono text-xs">
            <Link
              href={`/simulate/${currentArea.id}`}
              className="flex items-center gap-1.5 rounded-xl border border-cyan-500/40 bg-cyan-500/10 px-3 py-2 text-cyan-300 hover:bg-cyan-500/20 transition-colors"
            >
              <Layers className="h-3.5 w-3.5 text-emerald-400" />
              <span>Open in Simulator</span>
            </Link>
            <Link
              href="/explore"
              className="flex items-center gap-1.5 rounded-xl border border-slate-800 bg-slate-900/60 px-3 py-2 text-slate-300 hover:bg-slate-800 transition-colors"
            >
              <MapPin className="h-3.5 w-3.5 text-cyan-400" />
              <span>Explore All Areas</span>
            </Link>
          </div>
        </div>

        {/* Spatial Intelligence Map Section */}
        <div className="grid gap-6 lg:grid-cols-12">
          {/* Main Map Viewport with Hotspots */}
          <div className="space-y-4 lg:col-span-8">
            <div className="relative">
              <UrbanMap
                activeLayer="intelligence"
                selectedArea={currentArea}
                layer={layer}
                heightClassName="h-[520px]"
                mode="intelligence"
                hotspots={hotspots}
                selectedHotspotId={selectedHotspot?.id}
                onSelectHotspot={(spot) => setSelectedHotspot(spot)}
              />

              {/* Hotspot Floating Insight Card */}
              {selectedHotspot && (
                <div className="absolute top-16 left-4 z-20 max-w-sm rounded-xl border border-amber-500/50 bg-[#040816]/95 p-4 font-mono text-xs shadow-2xl backdrop-blur-xl animate-in fade-in">
                  <div className="flex items-center justify-between border-b border-amber-500/30 pb-2">
                    <span className="font-bold text-amber-300 flex items-center gap-1.5">
                      <AlertTriangle className="h-3.5 w-3.5 text-amber-400" />
                      {selectedHotspot.name}: {selectedHotspot.title}
                    </span>
                    <button
                      type="button"
                      onClick={() => setSelectedHotspot(null)}
                      className="text-slate-400 hover:text-white"
                    >
                      ✕
                    </button>
                  </div>
                  <p className="mt-2 text-[11px] text-slate-300 leading-relaxed">
                    {selectedHotspot.description}
                  </p>
                  <div className="mt-3 flex items-center justify-between pt-2 border-t border-slate-900 text-[10px]">
                    <span className="text-slate-500">ANOMALY SEVERITY:</span>
                    <span className="font-bold text-red-400">{selectedHotspot.score}/100</span>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Hotspot Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {hotspots.map((spot) => (
                <button
                  key={spot.id}
                  type="button"
                  onClick={() => setSelectedHotspot(spot)}
                  className={cn(
                    "flex flex-col text-left p-3 rounded-xl border font-mono text-xs transition-all",
                    selectedHotspot?.id === spot.id
                      ? "border-amber-500/60 bg-amber-500/15 text-white shadow-[0_0_12px_rgba(245,158,11,0.2)]"
                      : "border-slate-800 bg-slate-900/40 text-slate-300 hover:bg-slate-800/60"
                  )}
                >
                  <span className="text-[10px] text-amber-400 font-bold tracking-wider">
                    {spot.name}
                  </span>
                  <span className="font-semibold text-white mt-0.5 line-clamp-1">
                    {spot.title}
                  </span>
                  <span className="text-[10px] text-slate-400 mt-1">Severity: {spot.score}/100</span>
                </button>
              ))}
            </div>
          </div>

          {/* Right Column: AI Diagnostic & Grounded Assistant */}
          <div className="space-y-4 lg:col-span-4 flex flex-col">
            {/* Risk Indicators Bar */}
            <div className="grid grid-cols-2 gap-2 font-mono text-xs">
              <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3">
                <span className="text-[10px] text-slate-400 block">OVERALL RISK SCORE</span>
                <span className="text-2xl font-bold text-white mt-1 block">
                  {risk?.scores.overall ?? "—"}/100
                </span>
                <span className="text-[10px] text-red-400 mt-0.5 block">High Vulnerability</span>
              </div>
              <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3">
                <span className="text-[10px] text-slate-400 block">EXPOSED RESIDENTS</span>
                <span className="text-2xl font-bold text-cyan-300 mt-1 block">
                  {formatNumber(risk?.exposure.highRiskPopulation)}
                </span>
                <span className="text-[10px] text-slate-400 mt-0.5 block">
                  of {formatNumber(currentArea.population)}
                </span>
              </div>
            </div>

            {/* AI Analyst Terminal */}
            <div className="flex-1 rounded-2xl border border-slate-800 bg-[#040817] p-4 glass-panel flex flex-col justify-between space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                <span className="text-xs font-mono font-semibold text-cyan-300 flex items-center gap-1.5">
                  <Bot className="h-4 w-4 text-cyan-400" />
                  Climate AI Analyst
                </span>
                <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Grounded
                </span>
              </div>

              {/* Chat Messages Log */}
              <div className="max-h-72 overflow-y-auto space-y-2.5 pr-1 font-mono text-xs">
                {chatLog.map((msg, i) => (
                  <div
                    key={i}
                    className={cn(
                      "p-3 rounded-xl border text-[11px] leading-relaxed",
                      msg.role === "ai"
                        ? "border-cyan-500/20 bg-cyan-950/20 text-slate-200"
                        : "border-slate-700 bg-slate-800/60 text-white ml-4"
                    )}
                  >
                    <span className="text-[9px] font-bold uppercase tracking-wider block mb-1 text-cyan-400">
                      {msg.role === "ai" ? "UrbanPulse AI" : "User"}
                    </span>
                    {msg.message}
                  </div>
                ))}
                {isAiResponding && (
                  <div className="p-2.5 rounded-xl border border-cyan-500/20 bg-cyan-950/20 text-cyan-300 text-xs font-mono animate-pulse flex items-center gap-2">
                    <Sparkles className="h-3.5 w-3.5" />
                    <span>Synthesizing multi-satellite telemetry…</span>
                  </div>
                )}
              </div>

              {/* Input Form */}
              <form onSubmit={handleSendPrompt} className="space-y-2 pt-2 border-t border-slate-900">
                <div className="flex items-center gap-2">
                  <input
                    value={chatPrompt}
                    onChange={(e) => setChatPrompt(e.target.value)}
                    placeholder="Ask about heat, flood, or solutions…"
                    className="flex-1 rounded-xl border border-slate-800 bg-[#050a1c] px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
                  />
                  <button
                    type="submit"
                    disabled={isAiResponding || !chatPrompt.trim()}
                    className="rounded-xl bg-cyan-500 p-2 text-slate-950 hover:bg-cyan-400 disabled:opacity-50 transition-colors"
                  >
                    <Send className="h-4 w-4" />
                  </button>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      setChatPrompt("What is the primary driver of extreme heat in this area?");
                    }}
                    className="text-[10px] rounded-lg border border-slate-800 bg-slate-900/60 px-2 py-1 text-slate-400 hover:text-cyan-300 transition-colors"
                  >
                    Heat driver?
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setChatPrompt("Which interventions yield highest flood reduction?");
                    }}
                    className="text-[10px] rounded-lg border border-slate-800 bg-slate-900/60 px-2 py-1 text-slate-400 hover:text-cyan-300 transition-colors"
                  >
                    Flood mitigation?
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setChatPrompt("Give me key recommendations with estimated risk impact.");
                    }}
                    className="text-[10px] rounded-lg border border-slate-800 bg-slate-900/60 px-2 py-1 text-slate-400 hover:text-cyan-300 transition-colors"
                  >
                    Recommendations?
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Detailed AI Findings & Countermeasures Tabs */}
        <div className="rounded-2xl border border-slate-800 bg-[#040816] p-6 glass-panel space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300">
                Diagnostic Synthesis
              </span>
            </div>

            <div className="flex items-center gap-2 font-mono text-xs">
              <button
                type="button"
                onClick={() => setActiveTab("findings")}
                className={cn(
                  "px-3 py-1.5 rounded-lg border transition-all",
                  activeTab === "findings"
                    ? "border-cyan-500/50 bg-cyan-500/20 text-cyan-300"
                    : "border-slate-800 bg-slate-900/40 text-slate-400 hover:text-white"
                )}
              >
                Core Findings
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("countermeasures")}
                className={cn(
                  "px-3 py-1.5 rounded-lg border transition-all",
                  activeTab === "countermeasures"
                    ? "border-cyan-500/50 bg-cyan-500/20 text-cyan-300"
                    : "border-slate-800 bg-slate-900/40 text-slate-400 hover:text-white"
                )}
              >
                Intervention Strategy
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("telemetry")}
                className={cn(
                  "px-3 py-1.5 rounded-lg border transition-all",
                  activeTab === "telemetry"
                    ? "border-cyan-500/50 bg-cyan-500/20 text-cyan-300"
                    : "border-slate-800 bg-slate-900/40 text-slate-400 hover:text-white"
                )}
              >
                Data Provenance
              </button>
            </div>
          </div>

          {activeTab === "findings" && (
            <div className="grid gap-6 md:grid-cols-3 font-mono text-xs">
              <div className="rounded-xl border border-red-500/30 bg-red-950/10 p-4 space-y-2">
                <span className="text-red-400 font-bold flex items-center gap-1.5 text-sm">
                  <Flame className="h-4 w-4" />
                  Thermal Trapping
                </span>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  Urban microclimate models indicate high nocturnal thermal retention. Masonry and asphalt release absorbed solar radiation throughout the night, causing minimum temperatures to remain above 29.5°C.
                </p>
              </div>

              <div className="rounded-xl border border-blue-500/30 bg-blue-950/10 p-4 space-y-2">
                <span className="text-blue-400 font-bold flex items-center gap-1.5 text-sm">
                  <Droplets className="h-4 w-4" />
                  Monsoon Runoff Vulnerability
                </span>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  Severe drainage impedance combined with low elevation leads to surface ponding exceeding 0.35m in heavy precipitation events (&gt;50mm/day).
                </p>
              </div>

              <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/10 p-4 space-y-2">
                <span className="text-emerald-400 font-bold flex items-center gap-1.5 text-sm">
                  <Trees className="h-4 w-4" />
                  Vegetative Cooling Deficit
                </span>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  Calculated Normalized Difference Vegetation Index (NDVI) is 0.14, significantly lower than the WHO recommended urban green space threshold for climate mitigation.
                </p>
              </div>
            </div>
          )}

          {activeTab === "countermeasures" && (
            <div className="space-y-3 font-mono text-xs">
              <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4 flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <span className="text-cyan-300 font-bold">1. High-Albedo Cool Roof Program</span>
                  <p className="text-slate-400 text-[11px]">
                    Coat 40% of residential and commercial rooftops with solar reflective paint (albedo &gt; 0.65). Projected to reduce neighborhood ambient temperature by 1.8°C to 2.5°C.
                  </p>
                </div>
                <span className="rounded-lg bg-emerald-500/20 px-2.5 py-1 text-emerald-300 border border-emerald-500/30 shrink-0 font-bold">
                  HIGH IMPACT
                </span>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4 flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <span className="text-cyan-300 font-bold">2. Permeable Urban Drainage & Bioswales</span>
                  <p className="text-slate-400 text-[11px]">
                    Retrofit low-elevation road corridors with permeable pavers and vegetation swales to absorb initial 30mm rainfall pulses.
                  </p>
                </div>
                <span className="rounded-lg bg-emerald-500/20 px-2.5 py-1 text-emerald-300 border border-emerald-500/30 shrink-0 font-bold">
                  MODERATE IMPACT
                </span>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4 flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <span className="text-cyan-300 font-bold">3. Native Canopy Afforestation</span>
                  <p className="text-slate-400 text-[11px]">
                    Plant Conocarpus and Neem tree canopies along transport corridors to establish shading buffers and lower radiant ground heat.
                  </p>
                </div>
                <span className="rounded-lg bg-cyan-500/20 px-2.5 py-1 text-cyan-300 border border-cyan-500/30 shrink-0 font-bold">
                  LONG-TERM SHIELD
                </span>
              </div>
            </div>
          )}

          {activeTab === "telemetry" && (
            <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-4 font-mono text-xs">
              <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3.5 space-y-1">
                <span className="text-slate-500 text-[10px] block">THERMAL INFRARED</span>
                <span className="text-white font-bold block">NASA Landsat-9 TIRS</span>
                <span className="text-slate-400 text-[10px]">30m spatial resolution</span>
              </div>
              <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3.5 space-y-1">
                <span className="text-slate-500 text-[10px] block">VEGETATION SPECTRUM</span>
                <span className="text-white font-bold block">Copernicus Sentinel-2</span>
                <span className="text-slate-400 text-[10px]">10m multispectral MSI</span>
              </div>
              <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3.5 space-y-1">
                <span className="text-slate-500 text-[10px] block">WEATHER & AIR QUALITY</span>
                <span className="text-white font-bold block">Open-Meteo API</span>
                <span className="text-slate-400 text-[10px]">Hourly telemetry feeds</span>
              </div>
              <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3.5 space-y-1">
                <span className="text-slate-500 text-[10px] block">POPULATION DENSITY</span>
                <span className="text-white font-bold block">WorldPop High-Res</span>
                <span className="text-slate-400 text-[10px]">100m demographic grid</span>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
