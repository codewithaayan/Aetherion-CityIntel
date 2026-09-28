"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { MapPin, ArrowRight, Thermometer, Droplets, Trees, Zap } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { getAreas, getCities } from "@/lib/api";
import { MOCK_AREAS, getMockRisk } from "@/lib/mockData";
import type { Area } from "@/types/area";

export default function SimulatorOverviewPage() {
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
              PHYSICS-GROUNDED CLIMATE MODELING
            </span>
          </div>
          <h1 className="mt-2 text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            Microclimate Intervention Simulator
          </h1>
          <p className="mt-2 text-sm text-slate-400 max-w-3xl">
            Simulate the thermodynamic impact of urban greening, cool roof coatings, permeable drainage, and traffic reduction directly onto high-resolution 500m spatial grid cells.
          </p>
        </div>

        {/* Areas Selection Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {areas.map((area) => {
            const risk = getMockRisk(area.id);
            return (
              <div
                key={area.id}
                className="group relative flex flex-col justify-between rounded-2xl border border-slate-800 bg-[#040817]/80 p-6 glass-panel transition-all hover:border-emerald-500/40 hover:shadow-[0_0_25px_rgba(16,185,129,0.12)]"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono text-slate-400 flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5 text-cyan-400" />
                      Karachi Target Sector
                    </span>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      ACTIVE GRID
                    </span>
                  </div>

                  <h3 className="mt-3 text-xl font-bold text-white group-hover:text-emerald-300 transition-colors">
                    {area.name}
                  </h3>

                  <p className="mt-2 text-xs text-slate-400 leading-relaxed">
                    Test countermeasure scenarios and project surface cooling, runoff infiltration, and population risk reduction.
                  </p>

                  <div className="mt-5 grid grid-cols-3 gap-2 border-t border-slate-800/80 pt-4 text-center font-mono">
                    <div className="rounded-lg bg-slate-950/60 p-2 border border-slate-800/60">
                      <Thermometer className="h-3.5 w-3.5 text-red-400 mx-auto" />
                      <span className="text-[10px] text-slate-500 block mt-1">BASE HEAT</span>
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
                    href={`/simulate/${area.id}`}
                    className="flex w-full items-center justify-center gap-2 rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-4 py-2.5 text-xs font-semibold text-emerald-300 group-hover:bg-emerald-500 group-hover:text-slate-950 transition-all font-mono"
                  >
                    <span>Launch Simulator</span>
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
