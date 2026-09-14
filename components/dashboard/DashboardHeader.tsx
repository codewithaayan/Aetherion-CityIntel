import React from "react";
import Link from "next/link";
import { Area } from "@/types/area";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ShieldCheck, Sparkles, Sliders, Share2, Download, Calendar, Satellite } from "lucide-react";

export interface DashboardHeaderProps {
  area: Area;
}

export function DashboardHeader({ area }: DashboardHeaderProps) {
  return (
    <div className="space-y-4 pb-6 border-b border-slate-800">
      {/* Breadcrumb & Live Confidence Badge */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
        <div className="flex items-center gap-2 text-slate-400">
          <Link href="/explore" className="hover:text-cyan-400 transition-colors">
            {area.city}
          </Link>
          <span className="text-slate-600">/</span>
          <span className="text-cyan-300 font-semibold">{area.name}</span>
          <span className="text-slate-600">/</span>
          <span className="text-slate-500">Urban Intelligence Dossier</span>
        </div>

        {/* Data Confidence Badge */}
        <div className="flex items-center gap-2">
          <Badge variant="cyan" size="sm">
            <ShieldCheck className="w-3.5 h-3.5 mr-1 text-cyan-400" />
            {area.dataConfidence}% DATA CONFIDENCE
          </Badge>
          <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-[10px] text-slate-400">
            <Satellite className="w-3 h-3 text-cyan-400" />
            Multi-Constellation Validated
          </span>
        </div>
      </div>

      {/* Main Title & Action Buttons */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight">
            {area.name} Intelligence Report
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 flex items-center gap-3">
            <span>Environmental and population risk analysis.</span>
            <span className="text-slate-600 hidden sm:inline">•</span>
            <span className="font-mono text-[11px] text-slate-500 hidden sm:inline-flex items-center gap-1">
              <Calendar className="w-3 h-3 text-slate-400" />
              Latest Pass: {area.satellitePassDate}
            </span>
          </p>
        </div>

        {/* Action CTAs: Ask AI & Simulator */}
        <div className="flex flex-wrap items-center gap-2.5">
          <Link href={`/analysis/${area.id}`}>
            <Button
              variant="secondary"
              size="sm"
              leftIcon={<Sparkles className="w-4 h-4 text-cyan-400" />}
            >
              Ask AI Analyst
            </Button>
          </Link>

          <Link href={`/simulate/${area.id}`}>
            <Button
              variant="glow"
              size="sm"
              leftIcon={<Sliders className="w-4 h-4 text-slate-950" />}
            >
              Run Intervention Simulation
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
