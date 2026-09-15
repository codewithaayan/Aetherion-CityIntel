"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Satellite, ShieldCheck, Sparkles, Compass } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { HeroVisual } from "./HeroVisual";

export function Hero() {
  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden bg-grid-pattern">
      {/* Radial Ambient Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-cyan-500/10 via-blue-600/10 to-indigo-900/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-20 right-10 w-72 h-72 bg-cyan-500/5 rounded-full blur-2xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Text Column */}
          <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
            {/* Mission Tag / Status Pill */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/90 border border-cyan-500/30 text-xs text-cyan-300 font-mono shadow-[0_0_15px_rgba(6,182,212,0.15)]">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <span>NASA EARTH OBSERVATION × CLIMATE-TECH AI</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.1]">
              Understand Your City.{" "}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-500">
                Shape Its Future.
              </span>
            </h1>

            {/* Supporting Subtext */}
            <p className="text-base sm:text-lg text-slate-300 max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
              UrbanPulse transforms satellite, environmental, geographic and population data into actionable neighbourhood-level intelligence.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <Link href="/explore">
                <Button
                  variant="glow"
                  size="lg"
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                >
                  Explore Urban Intelligence
                </Button>
              </Link>

              <a href="#how-it-works">
                <Button
                  variant="secondary"
                  size="lg"
                  leftIcon={<Compass className="w-4 h-4 text-cyan-400" />}
                >
                  See How It Works
                </Button>
              </a>
            </div>

            {/* Scientific Credentials Bar */}
            <div className="pt-6 border-t border-slate-800/80 grid grid-cols-3 gap-4 text-left">
              <div>
                <div className="text-xl font-bold font-mono text-white flex items-baseline gap-1">
                  250<span className="text-xs text-cyan-400 font-normal">m²</span>
                </div>
                <div className="text-[11px] text-slate-400 font-mono uppercase tracking-wider">
                  Grid Resolution
                </div>
              </div>
              <div>
                <div className="text-xl font-bold font-mono text-white flex items-baseline gap-1">
                  7<span className="text-xs text-cyan-400 font-normal">Sats</span>
                </div>
                <div className="text-[11px] text-slate-400 font-mono uppercase tracking-wider">
                  Global Constellations
                </div>
              </div>
              <div>
                <div className="text-xl font-bold font-mono text-emerald-400 flex items-baseline gap-1">
                  94.2<span className="text-xs text-emerald-300 font-normal">%</span>
                </div>
                <div className="text-[11px] text-slate-400 font-mono uppercase tracking-wider">
                  Model Confidence
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Generative Futuristic Visual */}
          <div className="lg:col-span-6 flex items-center justify-center">
            <HeroVisual />
          </div>
        </div>
      </div>
    </section>
  );
}
