"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Flame, Wind, Droplets, Trees, Activity, Users, ChevronDown, Loader2 } from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface VitalsData {
  overall: number;
  heat: number;
  air: number;
  flood: number;
  green: number;
  exposure: number;
}

interface MetricConfig {
  key: keyof Omit<VitalsData, "overall">;
  icon: React.ElementType;
  label: string;
  color: string;
  glow: string;
  angle: number; // degrees around the circle
}

const metricConfig: MetricConfig[] = [
  { key: "heat", icon: Flame, label: "Heat", color: "text-red-400", glow: "shadow-[0_0_20px_rgba(248,113,113,0.35)]", angle: -60 },
  { key: "air", icon: Wind, label: "Air", color: "text-cyan-300", glow: "shadow-[0_0_20px_rgba(103,232,249,0.3)]", angle: 10 },
  { key: "flood", icon: Droplets, label: "Flood", color: "text-blue-400", glow: "shadow-[0_0_20px_rgba(96,165,250,0.3)]", angle: 80 },
  { key: "green", icon: Trees, label: "Green", color: "text-emerald-400", glow: "shadow-[0_0_20px_rgba(52,211,153,0.3)]", angle: 150 },
  { key: "exposure", icon: Users, label: "Exposure", color: "text-amber-400", glow: "shadow-[0_0_20px_rgba(251,191,36,0.3)]", angle: -150 },
];

/* ------------------------------------------------------------------ */
/*  Countries — demo list. City name is just for the bottom readout.   */
/* ------------------------------------------------------------------ */

const countries = [
  { code: "PK", name: "Pakistan", city: "Karachi" },
  { code: "US", name: "United States", city: "Los Angeles" },
  { code: "GB", name: "United Kingdom", city: "London" },
  { code: "IN", name: "India", city: "Mumbai" },
  { code: "AE", name: "United Arab Emirates", city: "Dubai" },
  { code: "DE", name: "Germany", city: "Berlin" },
  { code: "JP", name: "Japan", city: "Tokyo" },
  { code: "BR", name: "Brazil", city: "São Paulo" },
  { code: "NG", name: "Nigeria", city: "Lagos" },
  { code: "AU", name: "Australia", city: "Sydney" },
];

/* ------------------------------------------------------------------ */
/*  Data source — swap this for a real API call.                       */
/*                                                                      */
/*  Replace the body of this function with something like:              */
/*                                                                      */
/*    const res = await fetch(`/api/vitals?country=${countryCode}`);    */
/*    if (!res.ok) throw new Error("Failed to load vitals");            */
/*    return res.json();                                                */
/*                                                                      */
/*  The returned shape must match VitalsData.                           */
/* ------------------------------------------------------------------ */

function randomBetween(min: number, max: number) {
  return Math.round(min + Math.random() * (max - min));
}

async function fetchCityVitals(countryCode: string): Promise<VitalsData> {
  // Simulated network latency so the loading state is visible.
  await new Promise((resolve) => setTimeout(resolve, 900));

  // TODO: replace with a real API call — see comment block above.
  const heat = randomBetween(35, 92);
  const air = randomBetween(30, 90);
  const flood = randomBetween(20, 85);
  const green = randomBetween(15, 75);
  const exposure = randomBetween(30, 92);
  const overall = Math.round((heat + air + flood + (100 - green) + exposure) / 5);

  return { overall, heat, air, flood, green, exposure };
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                             */
/* ------------------------------------------------------------------ */

function positionFor(angleDeg: number, radius: number) {
  const rad = (angleDeg * Math.PI) / 180;
  return {
    left: `calc(50% + ${Math.cos(rad) * radius}%)`,
    top: `calc(50% + ${Math.sin(rad) * radius}%)`,
  };
}

/* ------------------------------------------------------------------ */
/*  Component                                                           */
/* ------------------------------------------------------------------ */

export function HeroVisual() {
  const [selected, setSelected] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [vitals, setVitals] = useState<VitalsData | null>(null);

  const selectedCountry = countries.find((c) => c.code === selected) ?? null;

  async function handleSelect(code: string) {
    setSelected(code);
    setVitals(null);

    if (!code) return;

    setLoading(true);
    try {
      const data = await fetchCityVitals(code);
      setVitals(data);
    } catch (err) {
      // In production, surface this via a toast / inline error state.
      console.error("Failed to load vitals", err);
    } finally {
      setLoading(false);
    }
  }

  const ready = !loading && vitals !== null;

  return (
    <div className="relative w-full aspect-square max-w-lg mx-auto rounded-2xl glass-panel p-6 overflow-hidden border border-cyan-500/25 shadow-[0_0_50px_rgba(6,182,212,0.12)]">
      {/* Background grid + ambient glow */}
      <div className="absolute inset-0 bg-grid-pattern opacity-40" />
      <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/5 via-transparent to-transparent" />

      {/* Country selector */}
      <div className="relative z-20 flex justify-center">
        <div className="relative">
          <select
            value={selected}
            onChange={(e) => handleSelect(e.target.value)}
            className="appearance-none rounded-full bg-slate-950/90 border border-cyan-500/30 pl-4 pr-9 py-1.5 text-[11px] font-mono text-cyan-200 uppercase tracking-wider outline-none cursor-pointer hover:border-cyan-400/50 transition-colors"
          >
            <option value="" disabled>
              Select a country
            </option>
            {countries.map((c) => (
              <option key={c.code} value={c.code} className="bg-slate-950 text-slate-200">
                {c.name}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-cyan-400/70" />
        </div>
      </div>

      {/* Connecting lines from center to each metric node */}
      {ready && vitals && (
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          {metricConfig.map((m, i) => {
            const rad = (m.angle * Math.PI) / 180;
            const x2 = 50 + Math.cos(rad) * 38;
            const y2 = 50 + Math.sin(rad) * 38;
            return (
              <motion.line
                key={m.key}
                x1="50"
                y1="50"
                x2={x2}
                y2={y2}
                stroke="rgba(56,189,248,0.25)"
                strokeWidth="0.3"
                strokeDasharray="2 2"
                initial={{ opacity: 0 }}
                animate={{ opacity: [0.15, 0.5, 0.15] }}
                transition={{ duration: 3, repeat: Infinity, delay: i * 0.3 }}
              />
            );
          })}
        </svg>
      )}

      {/* Rotating orbital rings */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
        animate={{ rotate: 360 }}
        transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
      >
        <div className="h-[68%] w-[68%] rounded-full border border-dashed border-cyan-500/20" />
      </motion.div>
      <motion.div
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
        animate={{ rotate: -360 }}
        transition={{ duration: 90, repeat: Infinity, ease: "linear" }}
      >
        <div className="h-[46%] w-[46%] rounded-full border border-cyan-500/15" />
      </motion.div>

      {/* Central pulsing core */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative flex items-center justify-center">
          <motion.span
            className={`absolute h-24 w-24 rounded-full blur-xl ${
              ready ? "bg-cyan-400/20" : "bg-slate-600/10"
            }`}
            animate={{ scale: [1, 1.4, 1], opacity: ready ? [0.5, 0.9, 0.5] : [0.3, 0.5, 0.3] }}
            transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className={`relative flex h-20 w-20 items-center justify-center rounded-full bg-slate-950/90 border ${
              ready ? "border-cyan-400/40" : "border-slate-700/50"
            }`}
            animate={{ scale: [1, 1.06, 1] }}
            transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
          >
            {loading ? (
              <Loader2 className="h-6 w-6 text-cyan-300 animate-spin" />
            ) : (
              <Activity className={`h-7 w-7 ${ready ? "text-cyan-300" : "text-slate-500"}`} />
            )}
          </motion.div>
        </div>
      </div>

      {/* Center label */}
      <div className="absolute left-1/2 top-[62%] -translate-x-1/2 text-center w-56">
        {loading && (
          <p className="text-[10px] font-mono tracking-[0.2em] text-cyan-300/80 uppercase animate-pulse">
            Fetching data…
          </p>
        )}
        {!loading && !ready && (
          <p className="text-[10px] font-mono tracking-[0.2em] text-slate-500 uppercase leading-relaxed">
            Select a country to view live vitals
          </p>
        )}
        {ready && vitals && (
          <>
            <p className="text-[10px] font-mono tracking-[0.2em] text-cyan-300/80 uppercase">Urban Priority</p>
            <p className="text-2xl font-bold text-white font-mono">{vitals.overall}</p>
          </>
        )}
      </div>

      {/* Floating metric nodes */}
      <AnimatePresence>
        {ready &&
          vitals &&
          metricConfig.map((m, i) => {
            const pos = positionFor(m.angle, 38);
            const value = vitals[m.key];
            return (
              <motion.div
                key={m.key}
                className={`absolute -translate-x-1/2 -translate-y-1/2 flex items-center gap-2 rounded-full bg-slate-950/90 border border-slate-700/60 px-3 py-1.5 backdrop-blur-md ${m.glow}`}
                style={pos}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1, y: [0, -4, 0] }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{
                  opacity: { duration: 0.5, delay: i * 0.12 },
                  scale: { duration: 0.5, delay: i * 0.12 },
                  y: { duration: 3 + i * 0.3, repeat: Infinity, ease: "easeInOut", delay: i * 0.2 },
                }}
              >
                <m.icon className={`h-3.5 w-3.5 ${m.color}`} />
                <span className="text-[10px] font-mono text-slate-300 whitespace-nowrap">
                  {m.label} <span className={`${m.color} font-semibold`}>{value}</span>
                </span>
              </motion.div>
            );
          })}
      </AnimatePresence>

      {/* Bottom readout strip */}
      <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-[10px] font-mono text-slate-500">
        <span className="flex items-center gap-1.5">
          <span
            className={`h-1.5 w-1.5 rounded-full ${
              ready ? "bg-emerald-400 animate-pulse" : "bg-slate-600"
            }`}
          />
          {ready ? "Live Model Sync" : loading ? "Connecting…" : "Idle"}
        </span>
        <span className="text-slate-600">
          {selectedCountry ? `${selectedCountry.city} · ${selectedCountry.name}` : "No selection"}
        </span>
      </div>
    </div>
  );
}