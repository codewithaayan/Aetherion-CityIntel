"use client";

import { CloudRain, Flame, Trees } from "lucide-react";
import { cn } from "@/lib/utils";
import type { LayerName } from "@/types/risk";

const LAYERS = [
  { id: "heat", label: "Heat", description: "Supplied temperature and heat-score fields", icon: Flame, accent: "text-red-400 border-red-500/40 bg-red-500/10" },
  { id: "green", label: "Green", description: "Supplied NDVI, green percentage and score fields", icon: Trees, accent: "text-emerald-400 border-emerald-500/40 bg-emerald-500/10" },
  { id: "flood", label: "Flood", description: "Supplied rainfall, terrain and flood-score fields", icon: CloudRain, accent: "text-sky-400 border-sky-500/40 bg-sky-500/10" },
] satisfies Array<{ id: LayerName; label: string; description: string; icon: typeof Flame; accent: string }>;

export function LayerControls({ activeLayer, onLayerChange }: { activeLayer: LayerName; onLayerChange: (layer: LayerName) => void }) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
        <h4 className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-300">Available layers</h4>
        <span className="text-[10px] font-mono text-cyan-400">3 API routes</span>
      </div>
      <div className="space-y-2">
        {LAYERS.map((layer) => {
          const Icon = layer.icon;
          const active = layer.id === activeLayer;
          return (
            <button key={layer.id} type="button" onClick={() => onLayerChange(layer.id)} className={cn("w-full rounded-xl border p-3 text-left transition-colors", active ? layer.accent : "border-slate-800 bg-slate-900/50 text-slate-300 hover:bg-slate-800/60")}>
              <div className="flex items-start gap-3">
                <Icon className="mt-0.5 h-4 w-4 shrink-0" />
                <div><p className="text-xs font-semibold text-white">{layer.label}</p><p className="mt-0.5 text-[11px] text-slate-400">{layer.description}</p></div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
