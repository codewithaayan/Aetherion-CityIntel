"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { MapPlaceholder } from "@/components/map/MapPlaceholder";
import { LayerControls } from "@/components/map/LayerControls";
import { RiskLegend } from "@/components/map/RiskLegend";
import { AreaPopup } from "@/components/map/AreaPopup";
import { MOCK_AREAS } from "@/lib/mock-data";
import { Area } from "@/types/area";
import { Search, MapPin, ChevronDown, ArrowRight, ShieldCheck, Filter } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { formatNumber, getRiskLevel } from "@/lib/utils";

export default function ExplorePage() {
  const [activeLayer, setActiveLayer] = useState("overall");
  const [selectedCity, setSelectedCity] = useState("Karachi, Pakistan");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedArea, setSelectedArea] = useState<Area>(MOCK_AREAS[0]);

  // Filter areas based on user query
  const filteredAreas = MOCK_AREAS.filter((area) =>
    area.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col bg-[#030712] text-slate-100 selection:bg-cyan-500/30 selection:text-cyan-200">
      <Navbar />

      <main className="flex-1 pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-6">
        {/* Top Header Bar */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold tracking-widest text-cyan-400 uppercase">
                SPATIAL EXPLORER
              </span>
              <Badge variant="cyan" size="sm">
                AETHERION GIS READY
              </Badge>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
              Explore Your City
            </h1>
          </div>

          {/* City Selector Dropdown */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900/90 border border-cyan-500/30 text-xs font-mono text-cyan-300 shadow-md">
                <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                <span className="font-semibold">{selectedCity}</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
              </div>
            </div>
            <span className="text-xs font-mono text-slate-500 hidden sm:inline">
              5 Primary Zones Mapped
            </span>
          </div>
        </div>

        {/* 2-Column Split: Left Sidebar + Right Map Area */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Sidebar: Search, Neighbourhoods, Environmental Layers */}
          <div className="lg:col-span-4 space-y-6">
            {/* Search Input Box */}
            <div className="glass-panel p-4 rounded-2xl border-slate-800 space-y-3">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search neighbourhood..."
                  className="w-full bg-[#050a1b] border border-slate-700/80 focus:border-cyan-400 rounded-xl pl-10 pr-3 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-400/50 font-sans"
                />
              </div>

              {/* Neighbourhood Selection List */}
              <div className="space-y-1.5 pt-1">
                <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block">
                  Select Area:
                </span>
                <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
                  {filteredAreas.map((area) => {
                    const isSelected = selectedArea.id === area.id;
                    const risk = getRiskLevel(area.scores.overall);

                    return (
                      <button
                        key={area.id}
                        type="button"
                        onClick={() => setSelectedArea(area)}
                        className={`w-full text-left p-2.5 rounded-xl border transition-all flex items-center justify-between gap-2 select-none cursor-pointer ${
                          isSelected
                            ? "bg-cyan-500/15 border-cyan-500/50 text-white shadow-md shadow-cyan-500/10"
                            : "bg-slate-900/40 border-slate-800/80 hover:bg-slate-800/50 text-slate-300"
                        }`}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <MapPin
                            className={`w-3.5 h-3.5 shrink-0 ${
                              isSelected ? "text-cyan-400" : "text-slate-500"
                            }`}
                          />
                          <span className="text-xs font-semibold truncate">
                            {area.name}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 shrink-0 font-mono text-[11px]">
                          <span className={risk.textColor}>
                            {area.scores.overall}
                          </span>
                          <span
                            className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                              isSelected ? "bg-cyan-950 border border-cyan-600 text-cyan-200" : "bg-slate-800 text-slate-400"
                            }`}
                          >
                            {risk.label}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Environmental Layer Controller */}
            <div className="glass-panel p-5 rounded-2xl border-slate-800">
              <LayerControls
                activeLayer={activeLayer}
                onLayerChange={(layer) => setActiveLayer(layer)}
              />
            </div>
          </div>

          {/* Right Column: GIS Map Placeholder Viewport & Selected Area Floating Card */}
          <div className="lg:col-span-8 space-y-4">
            <div className="relative">
              <MapPlaceholder
                activeLayer={activeLayer}
                selectedArea={selectedArea}
                heightClassName="h-[520px]"
              />

              {/* Floating Area Inspector Card Overlay */}
              <div className="absolute top-16 right-4 z-30 hidden md:block">
                <AreaPopup area={selectedArea} />
              </div>
            </div>

            {/* Mobile Area Popup (visible below map on small screens) */}
            <div className="md:hidden">
              <AreaPopup area={selectedArea} />
            </div>
          </div>
        </div>

        {/* Bottom Full-Width Risk Legend */}
        <div className="pt-2">
          <RiskLegend />
        </div>
      </main>

      <Footer />
    </div>
  );
}
