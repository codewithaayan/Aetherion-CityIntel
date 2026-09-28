"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Sparkles, MapPin, ArrowRight, Thermometer, Droplets, Trees } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { getAreas, getCities } from "@/lib/api";
import { MOCK_AREAS, getMockRisk } from "@/lib/mockData";
import type { Area } from "@/types/area";

export default function IntelligenceOverviewPage() {
  const [areas, setAreas] = useState<Area[]>([]);

  useEffect(() => {
    getCities()
      .then(async (cities) => {
        if (cities.length > 0) {
          const areaList = await getAreas(cities[0].id);
          setAreas(areaList.length > 0 ? areaList : MOCK_AREAS);
        } else {
          setAreas(MOCK_AREAS);
        }
      })
      .catch(() => {
        setAreas(MOCK_AREAS);
      });
  }, []);

  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 flex flex-col">
      <Navbar />

      <main className="mx-auto w-full max-w-7xl flex-1 space-y-8 px-4 pb-20 pt-24 sm:px-6 lg:px-8">
        <div className="border-b border-slate-800 pb-5">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold tracking-widest text-cyan-400">
              PLANETARY AI INTELLIGENCE
            </span>
          </div>
          <h1 className="mt-2 text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            Spatial AI Risk Intelligence
          </h1>
          <p className="mt-2 text-sm text-slate-400 max-w-3xl">
            Select a target municipal area to inspect AI-synthesized microclimate anomalies, multi-satellite thermal readings, demographic vulnerability clusters, and physics-grounded intervention strategies.
          </p>
        </div>

        {/* Areas Selection Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {areas.map((area) => {
            const risk = getMockRisk(area.id);
            return (
              <div
                key={area.id}
                className="group relative flex flex-col justify-between rounded-2xl border border-slate-800 bg-[#040817]/80 p-6 glass-panel transition-all hover:border-cyan-500/40 hover:shadow-[0_0_25px_rgba(6,182,212,0.12)]"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono text-slate-400 flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5 text-cyan-400" />
                      Karachi Municipal Area
                    </span>
                    <span
                      className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                        (risk.scores.overall ?? 0) > 75
                          ? "bg-red-500/20 text-red-300 border border-red-500/40"
                          : "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                      }`}
                    >
                      RISK INDEX {risk.scores.overall ?? "—"}
                    </span>
                  </div>

                  <h3 className="mt-3 text-xl font-bold text-white group-hover:text-cyan-300 transition-colors">
                    {area.name}
                  </h3>

                  <p className="mt-2 text-xs text-slate-400 leading-relaxed">
                    Evaluated against thermal infrared passes and 500m spatial risk grid.
                  </p>

                  <div className="mt-5 grid grid-cols-3 gap-2 border-t border-slate-800/80 pt-4 text-center font-mono">
                    <div className="rounded-lg bg-slate-950/60 p-2 border border-slate-800/60">
                      <Thermometer className="h-3.5 w-3.5 text-red-400 mx-auto" />
                      <span className="text-[10px] text-slate-500 block mt-1">HEAT</span>
                      <span className="text-xs font-bold text-white">{risk.scores.heat ?? "—"}</span>
                    </div>
                    <div className="rounded-lg bg-slate-950/60 p-2 border border-slate-800/60">
                      <Trees className="h-3.5 w-3.5 text-emerald-400 mx-auto" />
                      <span className="text-[10px] text-slate-500 block mt-1">CANOPY</span>
                      <span className="text-xs font-bold text-white">{risk.scores.green ?? "—"}</span>
                    </div>
                    <div className="rounded-lg bg-slate-950/60 p-2 border border-slate-800/60">
                      <Droplets className="h-3.5 w-3.5 text-blue-400 mx-auto" />
                      <span className="text-[10px] text-slate-500 block mt-1">FLOOD</span>
                      <span className="text-xs font-bold text-white">{risk.scores.flood ?? "—"}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-3 border-t border-slate-900">
                  <Link
                    href={`/analysis/${area.id}`}
                    className="flex w-full items-center justify-center gap-2 rounded-xl border border-cyan-500/40 bg-cyan-500/10 px-4 py-2.5 text-xs font-semibold text-cyan-300 group-hover:bg-cyan-500 group-hover:text-slate-950 transition-all"
                  >
                    <span>Launch AI Diagnostic</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      <Footer />
    </div>
  );
}
