import React from "react";
import { Info } from "lucide-react";

export function RiskLegend() {
  const intervals = [
    { label: "Low", range: "0 - 39", color: "bg-emerald-500", text: "text-emerald-400" },
    { label: "Moderate", range: "40 - 59", color: "bg-sky-400", text: "text-sky-400" },
    { label: "Elevated", range: "60 - 74", color: "bg-amber-400", text: "text-amber-400" },
    { label: "High", range: "75 - 84", color: "bg-orange-500", text: "text-orange-400" },
    { label: "Critical", range: "85 - 100", color: "bg-red-500", text: "text-red-400" },
  ];

  return (
    <div className="glass-panel p-4 rounded-xl border border-slate-800/80">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        {/* Title */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-300">
            Risk Severity Scale
          </span>
          <span className="text-[11px] font-mono text-slate-500">(0-100 Index)</span>
        </div>

        {/* Color Scale Bar */}
        <div className="w-full sm:w-auto flex-1 max-w-xl">
          {/* Continuous gradient strip */}
          <div className="h-2 w-full rounded-full bg-gradient-to-r from-emerald-500 via-sky-400 via-amber-400 via-orange-500 to-red-500 mb-2 shadow-sm" />

          {/* Level Markers */}
          <div className="grid grid-cols-5 gap-1 text-center font-mono">
            {intervals.map((item) => (
              <div key={item.label} className="flex flex-col items-center">
                <span className={`text-[10px] font-bold ${item.text}`}>
                  {item.label}
                </span>
                <span className="text-[9px] text-slate-500">{item.range}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Calibration Note */}
        <div className="hidden lg:flex items-center gap-1.5 text-[11px] font-mono text-slate-400 shrink-0">
          <Info className="w-3.5 h-3.5 text-cyan-400" />
          <span>Calibrated via Landsat-9 & Sentinel-2B</span>
        </div>
      </div>
    </div>
  );
}
