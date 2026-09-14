"use client";

import React, { useState } from "react";
import { Layers, Compass, ZoomIn, ZoomOut, Maximize2, Radio, Globe2, ShieldAlert } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Area } from "@/types/area";
import Link from "next/link";

export interface MapPlaceholderProps {
  activeLayer?: string;
  selectedArea?: Area;
  showComparisonMode?: boolean;
  modelState?: "current" | "modelled";
  heightClassName?: string;
  onSelectArea?: (area: Area) => void;
}

export function MapPlaceholder({
  activeLayer = "overall",
  selectedArea,
  showComparisonMode = false,
  modelState = "current",
  heightClassName = "h-[580px]",
  onSelectArea,
}: MapPlaceholderProps) {
  const [zoomLevel, setZoomLevel] = useState(13);
  const [gridOverlay, setGridOverlay] = useState(true);

  const layerLabels: Record<string, { label: string; color: string; desc: string }> = {
    overall: { label: "Overall Environmental Risk", color: "text-amber-400", desc: "Multi-factor composite weighted vulnerability" },
    heat: { label: "Heat Risk & LST Anomaly", color: "text-red-400", desc: "Thermal Infrared radiant surface temperature" },
    air: { label: "Air Quality & PM2.5", color: "text-amber-400", desc: "Atmospheric aerosol particulate dispersion" },
    flood: { label: "Flood Vulnerability", color: "text-sky-400", desc: "Topographic slope & precipitation accumulation" },
    green: { label: "Green Canopy Infrastructure", color: "text-emerald-400", desc: "Sentinel-2 NDVI vegetation deficiency" },
    population: { label: "Population Exposure Density", color: "text-purple-400", desc: "Gridded census demographic intersection" },
  };

  const currentLayerInfo = layerLabels[activeLayer] || layerLabels.overall;

  return (
    <div
      className={`relative w-full ${heightClassName} rounded-2xl bg-[#040816] border border-cyan-500/20 overflow-hidden flex flex-col justify-between shadow-[0_0_40px_rgba(4,8,22,0.8)]`}
    >
      {/* Background Interactive Spatial Grid Pattern */}
      <div
        className={`absolute inset-0 bg-grid-pattern transition-opacity duration-300 ${
          gridOverlay ? "opacity-70" : "opacity-15"
        }`}
      />
      <div className="absolute inset-0 bg-radial from-transparent via-[#040816]/30 to-[#040816]/90 pointer-events-none" />

      {/* Top Map Bar: Telemetry, Active Layer & Coordinates */}
      <div className="relative z-20 p-4 flex flex-wrap items-center justify-between gap-3 bg-gradient-to-b from-[#030712]/90 to-transparent">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900/90 border border-cyan-500/30 font-mono text-xs text-cyan-300">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            <span className="font-semibold uppercase">GIS MODULE ACTIVE</span>
          </div>
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900/80 border border-slate-800 text-xs font-mono text-slate-300">
            <span className="text-slate-500">Layer:</span>
            <span className={`font-semibold ${currentLayerInfo.color}`}>
              {currentLayerInfo.label}
            </span>
          </div>
        </div>

        {/* Dynamic Telemetry Coordinates */}
        <div className="flex items-center gap-2 text-[11px] font-mono text-slate-400 bg-slate-900/80 border border-slate-800 px-3 py-1.5 rounded-lg">
          <span className="text-slate-500">COORDS:</span>
          <span className="text-cyan-400 font-semibold">
            {selectedArea ? `${selectedArea.coordinates.lat}° N, ${selectedArea.coordinates.lng}° E` : "24.8607° N, 67.0011° E"}
          </span>
          <span className="text-slate-600 hidden md:inline">|</span>
          <span className="text-slate-300 hidden md:inline">DATUM: WGS-84</span>
        </div>
      </div>

      {/* Center Scientific Reservation Box & Spatial Mock Visual */}
      <div className="relative z-10 flex flex-col items-center justify-center p-6 text-center my-auto">
        {/* Subtle SVG Grid Compass Lattice */}
        <div className="w-full max-w-lg aspect-[16/9] relative rounded-xl border border-cyan-500/20 bg-[#060c20]/60 backdrop-blur-sm p-6 flex flex-col items-center justify-center space-y-4">
          <div className="relative">
            <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shadow-[0_0_25px_rgba(6,182,212,0.25)]">
              <Globe2 className="w-8 h-8 animate-pulse" />
            </div>
            <span className="absolute -bottom-1 -right-1 px-1.5 py-0.5 rounded bg-cyan-900 text-[9px] font-mono text-cyan-200 border border-cyan-600 font-bold">
              GIS
            </span>
          </div>

          <div className="space-y-1 max-w-sm">
            <h4 className="text-sm font-mono font-bold tracking-widest text-cyan-300 uppercase">
              INTERACTIVE CITY MAP
            </h4>
            <p className="text-xs font-mono text-slate-300">
              GIS MODULE INTEGRATION
            </p>
            <div className="py-1">
              <span className="inline-block px-3 py-1 rounded bg-cyan-950/80 border border-cyan-500/50 text-[11px] font-mono font-bold text-cyan-400 tracking-wider">
                RESERVED FOR INFINITY
              </span>
            </div>
          </div>

          <p className="text-[11px] text-slate-400 max-w-xs leading-relaxed">
            High-performance WebGL rasterizer with vector tile overlays, heat-stress contours, and 100m² grid rasterization.
          </p>

          {/* Quick link to explore this area in detail */}
          {selectedArea && (
            <div className="pt-2">
              <Link
                href={`/area/${selectedArea.id}`}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/40 text-xs font-mono text-cyan-300 transition-colors"
              >
                Inspect {selectedArea.name} Dossier →
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Controls Bar */}
      <div className="relative z-20 p-4 bg-gradient-to-t from-[#030712]/95 to-transparent flex flex-wrap items-center justify-between gap-3 border-t border-slate-900">
        {/* Left Status Tag */}
        <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          <span>STATUS: REAL-TIME READY</span>
          {showComparisonMode && (
            <Badge variant={modelState === "modelled" ? "low" : "elevated"} size="sm">
              MODE: {modelState.toUpperCase()}
            </Badge>
          )}
        </div>

        {/* Right Map Interaction Controls */}
        <div className="flex items-center gap-2">
          {/* Grid Toggle */}
          <button
            type="button"
            onClick={() => setGridOverlay(!gridOverlay)}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-mono transition-colors border ${
              gridOverlay
                ? "bg-cyan-500/20 text-cyan-300 border-cyan-500/40"
                : "bg-slate-900 text-slate-400 border-slate-800"
            }`}
            title="Toggle Spatial Grid Lines"
          >
            Grid 100m²
          </button>

          {/* Zoom Controls */}
          <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg overflow-hidden">
            <button
              type="button"
              onClick={() => setZoomLevel((z) => Math.min(18, z + 1))}
              className="p-1.5 hover:bg-slate-800 text-slate-300 hover:text-white"
              title="Zoom In"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <span className="px-2 text-[10px] font-mono text-slate-400 select-none">
              z{zoomLevel}
            </span>
            <button
              type="button"
              onClick={() => setZoomLevel((z) => Math.max(8, z - 1))}
              className="p-1.5 hover:bg-slate-800 text-slate-300 hover:text-white"
              title="Zoom Out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
