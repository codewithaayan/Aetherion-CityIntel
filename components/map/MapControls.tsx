"use client";

import React from "react";
import { ZoomIn, ZoomOut, RotateCcw, Grid } from "lucide-react";
import { cn } from "@/lib/utils";

export interface MapControlsProps {
  onResetView?: () => void;
  onZoomIn?: () => void;
  onZoomOut?: () => void;
  gridMinimized?: boolean;
  onToggleGridMinimize?: () => void;
}

export function MapControls({
  onResetView,
  onZoomIn,
  onZoomOut,
  gridMinimized = false,
  onToggleGridMinimize,
}: MapControlsProps) {
  return (
    <div className="flex items-center gap-1.5 bg-slate-900/90 border border-slate-800 p-1 rounded-xl backdrop-blur-md shadow-lg shadow-black/40">
      {onZoomIn && (
        <button
          type="button"
          onClick={onZoomIn}
          className="p-1.5 hover:bg-slate-800 text-slate-400 hover:text-cyan-300 rounded-lg transition-colors"
          title="Zoom In"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
      )}
      {onZoomOut && (
        <button
          type="button"
          onClick={onZoomOut}
          className="p-1.5 hover:bg-slate-800 text-slate-400 hover:text-cyan-300 rounded-lg transition-colors"
          title="Zoom Out"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
      )}
      {onResetView && (
        <button
          type="button"
          onClick={onResetView}
          className="p-1.5 hover:bg-slate-800 text-slate-400 hover:text-cyan-300 rounded-lg transition-colors"
          title="Reset Viewport"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      )}
      {onToggleGridMinimize && (
        <button
          type="button"
          onClick={onToggleGridMinimize}
          className={cn(
            "p-1.5 rounded-lg transition-colors flex items-center gap-1 text-xs",
            gridMinimized
              ? "text-amber-300 bg-amber-500/20 hover:bg-amber-500/30"
              : "text-slate-400 hover:text-cyan-300 hover:bg-slate-800"
          )}
          title={gridMinimized ? "Expand Grid Cells" : "Minimize Grid Overlay"}
        >
          <Grid className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
