import React from "react";
import Link from "next/link";
import { Activity, ShieldCheck, Database, Satellite, Cpu } from "lucide-react";

export function Footer() {
  return (
    <footer className="relative bg-[#02050e] border-t border-slate-800/80 pt-16 pb-12 overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-24 bg-gradient-to-b from-cyan-500/5 to-transparent pointer-events-none blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10 pb-12 border-b border-slate-800/80">
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-400/40 text-cyan-400">
                <Activity className="w-4 h-4" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white">
                UrbanPulse
              </span>
            </div>
            <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
              NASA Earth Observation × Modern Climate-Tech × AI Intelligence. Transforming satellite, environmental, and demographic data into actionable neighbourhood-level intelligence.
            </p>
            <div className="flex items-center gap-2 text-[11px] font-mono text-cyan-400/90 bg-cyan-950/40 border border-cyan-800/50 rounded-md px-2.5 py-1.5 w-fit">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>LIVE TELEMETRY: SENTINEL-2B & LANDSAT 9 CALIBRATED</span>
            </div>
          </div>

          {/* Platform Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-300">
              Platform
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <Link href="/explore" className="hover:text-cyan-400 transition-colors">
                  City Explorer
                </Link>
              </li>
              <li>
                <Link href="/area/gulshan-iqbal" className="hover:text-cyan-400 transition-colors">
                  Area Dashboard
                </Link>
              </li>
              <li>
                <Link href="/simulate/gulshan-iqbal" className="hover:text-cyan-400 transition-colors">
                  Intervention Simulator
                </Link>
              </li>
              <li>
                <Link href="/analysis/gulshan-iqbal" className="hover:text-cyan-400 transition-colors">
                  AI Analyst
                </Link>
              </li>
            </ul>
          </div>

          {/* Science & Methods */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-300">
              Science & Verification
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <Link href="/methodology" className="hover:text-cyan-400 transition-colors">
                  Data Pipeline & Model
                </Link>
              </li>
              <li>
                <Link href="/methodology#sources" className="hover:text-cyan-400 transition-colors">
                  Satellite Constellations
                </Link>
              </li>
              <li>
                <Link href="/methodology#limitations" className="hover:text-cyan-400 transition-colors">
                  Uncertainty Bounds
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-cyan-400 transition-colors">
                  Team Aetherion
                </Link>
              </li>
            </ul>
          </div>

          {/* Real-time Telemetry Specs */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-300">
              System Telemetry
            </h4>
            <div className="space-y-2 text-[11px] font-mono text-slate-400">
              <div className="flex items-center justify-between border-b border-slate-800/60 pb-1">
                <span className="text-slate-500">Spatial Grid:</span>
                <span className="text-slate-300">100m² Res</span>
              </div>
              <div className="flex items-center justify-between border-b border-slate-800/60 pb-1">
                <span className="text-slate-500">Confidence:</span>
                <span className="text-emerald-400">94.2% Multi-Source</span>
              </div>
              <div className="flex items-center justify-between border-b border-slate-800/60 pb-1">
                <span className="text-slate-500">Engine:</span>
                <span className="text-cyan-400">Aetherion-V2</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Coverage:</span>
                <span className="text-slate-300">Karachi Metropolitan</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 font-mono">
          <div className="flex items-center gap-2">
            <span>© 2026 UrbanPulse Intelligence System.</span>
            <span className="hidden sm:inline text-slate-700">•</span>
            <span className="text-slate-400">Engineered by Team Aetherion</span>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              Scientific Open Standards
            </span>
            <span className="flex items-center gap-1.5">
              <Satellite className="w-3.5 h-3.5 text-cyan-400" />
              Public Earth Observation Data
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
