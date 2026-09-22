import Link from "next/link";
import { ArrowRight, Flame, Trees, Users } from "lucide-react";
import { formatNumber } from "@/lib/utils";
import type { Area, City } from "@/types/area";
import type { RiskResponse } from "@/types/risk";

const score = (value: number | null | undefined) => value === null || value === undefined ? "—" : `${value}`;

export function AreaPopup({ area, city, risk }: { area: Area; city?: City; risk?: RiskResponse | null }) {
  return (
    <div className="w-80 space-y-3 rounded-xl border-cyan-500/30 p-4 shadow-2xl glass-panel">
      <div><span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">{city ? `${city.name}, ${city.country}` : "City details unavailable"}</span><h3 className="text-base font-bold text-white">{area.name}</h3></div>
      <div className="grid grid-cols-2 gap-2 rounded-lg border border-slate-800 bg-slate-950/60 p-2.5 font-mono text-xs">
        <div><span className="block text-[10px] text-slate-500">OVERALL SCORE</span><span className="text-lg font-bold text-white">{score(risk?.scores.overall)}</span></div>
        <div><span className="block text-[10px] text-slate-500">POPULATION</span><span className="text-lg font-bold text-cyan-300">{formatNumber(area.population)}</span></div>
      </div>
      <div className="space-y-1.5 text-xs text-slate-400">
        <p className="flex justify-between"><span className="flex gap-1"><Flame className="h-3.5 w-3.5 text-red-400" />Heat score</span><strong className="font-mono text-slate-200">{score(risk?.scores.heat)}</strong></p>
        <p className="flex justify-between"><span className="flex gap-1"><Trees className="h-3.5 w-3.5 text-emerald-400" />Green score</span><strong className="font-mono text-slate-200">{score(risk?.scores.green)}</strong></p>
        <p className="flex justify-between"><span className="flex gap-1"><Users className="h-3.5 w-3.5 text-purple-400" />High-risk population</span><strong className="font-mono text-slate-200">{formatNumber(risk?.exposure.highRiskPopulation)}</strong></p>
      </div>
      <Link href={`/area/${area.id}`} className="flex w-full items-center justify-center gap-2 rounded-lg bg-cyan-500 px-3 py-2 text-xs font-semibold text-slate-950 hover:bg-cyan-400">Open area report <ArrowRight className="h-3.5 w-3.5" /></Link>
    </div>
  );
}
