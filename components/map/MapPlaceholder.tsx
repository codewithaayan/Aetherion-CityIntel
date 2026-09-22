"use client";

import Link from "next/link";
import { Globe2, Layers } from "lucide-react";
import type { Area } from "@/types/area";
import type { LayerName, MapLayer } from "@/types/risk";

export function MapPlaceholder({ activeLayer = "heat", selectedArea, layer, layerLoading = false, layerError, heightClassName = "h-[580px]" }: { activeLayer?: LayerName; selectedArea?: Area; layer?: MapLayer | null; layerLoading?: boolean; layerError?: string | null; heightClassName?: string }) {
  const drawable = layer?.features.filter((feature) => feature.geometry !== null).length ?? 0;
  return (
    <div className={`relative flex w-full ${heightClassName} flex-col justify-between overflow-hidden rounded-2xl border border-cyan-500/20 bg-[#040816]`}>
      <div className="absolute inset-0 bg-grid-pattern opacity-40" />
      <div className="relative z-10 flex items-center justify-between p-4 text-xs font-mono">
        <span className="flex items-center gap-2 rounded-lg border border-cyan-500/30 bg-slate-900/90 px-3 py-1.5 text-cyan-300"><Layers className="h-3.5 w-3.5" />{activeLayer.toUpperCase()} LAYER</span>
        <span className="text-slate-400">{selectedArea?.geometry ? "Area geometry available" : "Area geometry unavailable"}</span>
      </div>
      <div className="relative z-10 mx-auto max-w-md space-y-4 px-6 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-cyan-500/40 bg-cyan-500/10 text-cyan-400"><Globe2 className="h-8 w-8" /></div>
        <h4 className="text-sm font-mono font-bold tracking-widest text-cyan-300">MAP VIEW RESERVED FOR INFINITY</h4>
        {layerLoading ? <p className="text-xs text-slate-400">Loading the selected layer…</p> : layerError ? <p className="text-xs text-red-300">{layerError}</p> : layer ? <p className="text-xs text-slate-300">Received {layer.features.length} features; {drawable} include drawable geometry. Rendering remains Infinity&apos;s connection point.</p> : <p className="text-xs text-slate-400">Select an area to load its raw GeoJSON layer.</p>}
        {selectedArea ? <Link href={`/area/${selectedArea.id}`} className="inline-flex rounded-lg border border-cyan-500/40 bg-cyan-500/20 px-3 py-1.5 text-xs text-cyan-300">Inspect {selectedArea.name}</Link> : null}
      </div>
      <div className="relative z-10 border-t border-slate-900 bg-[#030712]/80 p-4 text-[11px] font-mono text-slate-400">{layer ? `${layer.incompleteGridCellIds.length} incomplete grid cells reported` : "No layer loaded"}</div>
    </div>
  );
}
