"use client";

import React from "react";
import { Layers, Eye, RefreshCw, Compass } from "lucide-react";

export interface MapControlsProps {
  onResetView?: () => void;
}

export function MapControls({ onResetView }: MapControlsProps) {
  return (
    <div className="flex items-center gap-1.5 bg-slate-900/90 border border-slate-800 p-1 rounded-xl backdrop-blur-md">
      <button
        type="button"
        onClick={onResetView}
        className="p-1.5 hover:bg-slate-800 text-slate-400 hover:text-cyan-300 rounded-lg transition-colors"
        title="Reset Viewport"
      >
        <RefreshCw className="w-4 h-4" />
      </button>
      <button
        type="button"
        className="p-1.5 hover:bg-slate-800 text-slate-400 hover:text-cyan-300 rounded-lg transition-colors"
        title="North Orientation"
      >
        <Compass className="w-4 h-4" />
      </button>
      <button
        type="button"
        className="p-1.5 hover:bg-slate-800 text-slate-400 hover:text-cyan-300 rounded-lg transition-colors"
        title="Layer Options"
      >
        <Layers className="w-4 h-4" />
      </button>
    </div>
  );
}
