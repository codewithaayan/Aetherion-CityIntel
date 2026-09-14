"use client";

import React from "react";
import { ShieldAlert, Flame, Wind, CloudRain, Trees, Users } from "lucide-react";
import { cn } from "@/lib/utils";

export interface LayerControlsProps {
  activeLayer: string;
  onLayerChange: (layer: string) => void;
}

export const LAYERS = [
  {
    id: "overall",
    label: "Overall Risk",
    description: "Multivariate composite priority score",
    icon: ShieldAlert,
    accent: "text-cyan-400 border-cyan-500/40 bg-cyan-500/10",
    dotColor: "bg-cyan-400",
  },
  {
    id: "heat",
    label: "Heat Risk",
    description: "Surface temperature & thermal island anomaly",
    icon: Flame,
    accent: "text-red-400 border-red-500/40 bg-red-500/10",
    dotColor: "bg-red-400",
  },
  {
    id: "air",
    label: "Air Quality",
    description: "Atmospheric particulate matter & smog density",
    icon: Wind,
    accent: "text-amber-400 border-amber-500/40 bg-amber-500/10",
    dotColor: "bg-amber-400",
  },
  {
    id: "flood",
    label: "Flood Vulnerability",
    description: "Low-elevation drainage & stormwater runoff",
    icon: CloudRain,
    accent: "text-sky-400 border-sky-500/40 bg-sky-500/10",
    dotColor: "bg-sky-400",
  },
  {
    id: "green",
    label: "Green Space",
    description: "Sentinel-2 NDVI canopy & vegetative deficit",
    icon: Trees,
    accent: "text-emerald-400 border-emerald-500/40 bg-emerald-500/10",
    dotColor: "bg-emerald-400",
  },
  {
    id: "population",
    label: "Population Exposure",
    description: "Gridded census density & demographic vulnerability",
    icon: Users,
    accent: "text-purple-400 border-purple-500/40 bg-purple-500/10",
    dotColor: "bg-purple-400",
  },
];

export function LayerControls({ activeLayer, onLayerChange }: LayerControlsProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between pb-2 border-b border-slate-800">
        <h4 className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-300">
          Environmental Layers
        </h4>
        <span className="text-[10px] font-mono text-cyan-400">
          {LAYERS.length} Raster Layers
        </span>
      </div>

      <div className="space-y-2">
        {LAYERS.map((layer) => {
          const Icon = layer.icon;
          const isActive = activeLayer === layer.id;

          return (
            <button
              key={layer.id}
              type="button"
              onClick={() => onLayerChange(layer.id)}
              className={cn(
                "w-full text-left p-3 rounded-xl border transition-all duration-200 flex items-start gap-3 select-none cursor-pointer",
                isActive
                  ? `${layer.accent} shadow-md shadow-black/40`
                  : "bg-slate-900/50 border-slate-800/80 hover:bg-slate-800/60 hover:border-slate-700 text-slate-300"
              )}
            >
              <div
                className={cn(
                  "w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border mt-0.5",
                  isActive
                    ? layer.accent
                    : "bg-slate-800/60 border-slate-700 text-slate-400"
                )}
              >
                <Icon className="w-4 h-4" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span
                    className={cn(
                      "text-xs font-semibold tracking-tight",
                      isActive ? "text-white" : "text-slate-200"
                    )}
                  >
                    {layer.label}
                  </span>
                  <span
                    className={cn(
                      "w-2 h-2 rounded-full",
                      isActive ? layer.dotColor : "bg-slate-600"
                    )}
                  />
                </div>
                <p className="text-[11px] text-slate-400 truncate mt-0.5">
                  {layer.description}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
