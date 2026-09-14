import React from "react";
import { Area } from "@/types/area";
import { getRiskLevel } from "@/lib/utils";
import { Sparkles, ShieldAlert, TrendingUp, AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/Badge";

export interface ScoreCardProps {
  area: Area;
}

export function ScoreCard({ area }: ScoreCardProps) {
  const score = area.scores.overall;
  const risk = getRiskLevel(score);

  // SVG Circular Gauge calculation
  const radius = 58;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="relative rounded-2xl glass-panel p-6 border-cyan-500/30 overflow-hidden shadow-2xl">
      {/* Background ambient radial glow */}
      <div className="absolute top-0 right-1/4 w-80 h-40 bg-gradient-to-br from-amber-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Left: Circular Gauge & Score Value */}
        <div className="lg:col-span-4 flex items-center justify-center lg:justify-start gap-6 border-b lg:border-b-0 lg:border-r border-slate-800 pb-6 lg:pb-0 lg:pr-6">
          <div className="relative w-32 h-32 flex items-center justify-center shrink-0">
            {/* SVG Progress Circle */}
            <svg className="w-full h-full -rotate-90" viewBox="0 0 140 140">
              <circle
                cx="70"
                cy="70"
                r={radius}
                className="stroke-slate-800"
                strokeWidth="10"
                fill="transparent"
              />
              <circle
                cx="70"
                cy="70"
                r={radius}
                stroke={risk.color}
                strokeWidth="10"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="transparent"
                className="transition-all duration-1000 ease-out"
              />
            </svg>

            {/* Score Text in Center */}
            <div className="absolute flex flex-col items-center justify-center text-center">
              <span className="text-3xl font-extrabold font-mono text-white tracking-tight">
                {score}
              </span>
              <span className="text-[10px] font-mono text-slate-400 -mt-1">
                / 100
              </span>
            </div>
          </div>

          <div className="space-y-1.5">
            <span className="text-[11px] font-mono uppercase tracking-widest text-slate-400 block font-semibold">
              URBAN PRIORITY SCORE
            </span>
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold tracking-tight text-white">
                {risk.label} PRIORITY
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-amber-400 font-mono">
              <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
              <span>Immediate Policy Focus</span>
            </div>
          </div>
        </div>

        {/* Right: AI-Style Diagnostic Summary */}
        <div className="lg:col-span-8 space-y-3">
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400">
            <Sparkles className="w-3.5 h-3.5" />
            <span className="font-semibold uppercase tracking-wider">
              AI-SYNTHESIZED DIAGNOSTIC SUMMARY
            </span>
          </div>

          <p className="text-sm sm:text-base text-slate-200 leading-relaxed font-normal">
            {area.summary}
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3 text-xs text-slate-400 font-mono">
            <span className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
              Primary Driver: Thermal Radiance (+4.2°C)
            </span>
            <span className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
              Population Vulnerability: {area.exposedPercentage}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
