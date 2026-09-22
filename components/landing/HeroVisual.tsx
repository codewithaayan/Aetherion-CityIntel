"use client";

import { useEffect, useState } from "react";
import { Activity, CloudRain, Flame, Trees, Users, Wind } from "lucide-react";
import { errorMessage, getAreas, getCities, getRisk } from "@/lib/api";
import type { Area, City } from "@/types/area";
import type { RiskResponse } from "@/types/risk";

const METRICS = [
  { key: "heat", label: "Heat", icon: Flame, color: "text-red-400" },
  { key: "air", label: "Air", icon: Wind, color: "text-cyan-300" },
  { key: "flood", label: "Flood", icon: CloudRain, color: "text-blue-400" },
  { key: "green", label: "Green", icon: Trees, color: "text-emerald-400" },
  { key: "populationExposure", label: "Exposure", icon: Users, color: "text-amber-400" },
] as const;

export function HeroVisual() {
  const [cities, setCities] = useState<City[]>([]);
  const [cityId, setCityId] = useState("");
  const [area, setArea] = useState<Area | null>(null);
  const [risk, setRisk] = useState<RiskResponse | null>(null);
  const [message, setMessage] = useState("Loading cities…");

  useEffect(() => {
    let active = true;
    getCities().then((items) => { if (!active) return; setCities(items); setCityId(items[0]?.id ?? ""); setMessage(items.length ? "Loading area data…" : "No cities are available."); }).catch((reason) => { if (active) setMessage(errorMessage(reason)); });
    return () => { active = false; };
  }, []);

  useEffect(() => {
    if (!cityId) return;
    let active = true;
    getAreas(cityId).then(async (areas) => {
      if (!active) return;
      const firstArea = areas[0];
      if (!firstArea) { setMessage("This city has no areas yet."); return; }
      setArea(firstArea);
      try { const result = await getRisk(firstArea.id); if (active) { setRisk(result); setMessage(""); } } catch (reason) { if (active) setMessage(errorMessage(reason)); }
    }).catch((reason) => { if (active) setMessage(errorMessage(reason)); });
    return () => { active = false; };
  }, [cityId]);

  return <div className="relative mx-auto aspect-square w-full max-w-lg overflow-hidden rounded-2xl border border-cyan-500/25 p-6 glass-panel">
    <div className="absolute inset-0 bg-grid-pattern opacity-40" />
    <div className="relative z-10 flex justify-center"><select value={cityId} onChange={(event) => { setCityId(event.target.value); setArea(null); setRisk(null); setMessage("Loading area data…"); }} className="rounded-full border border-cyan-500/30 bg-slate-950/90 px-4 py-1.5 text-[11px] font-mono text-cyan-200"><option value="">Select a city</option>{cities.map((city) => <option key={city.id} value={city.id}>{city.name}, {city.country}</option>)}</select></div>
    <div className="absolute inset-0 flex items-center justify-center"><div className="text-center"><div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-cyan-400/40 bg-slate-950/90"><Activity className="h-7 w-7 text-cyan-300" /></div><p className="mt-3 text-[10px] font-mono uppercase tracking-[0.2em] text-cyan-300/80">Overall score</p><p className="text-2xl font-bold font-mono text-white">{risk?.scores.overall ?? "—"}</p><p className="mt-1 max-w-48 text-[10px] text-slate-500">{area?.name ?? message}</p></div></div>
    <div className="absolute bottom-8 left-6 right-6 grid grid-cols-2 gap-2 sm:grid-cols-5">{METRICS.map(({ key, label, icon: Icon, color }) => <div key={key} className="rounded-lg border border-slate-800 bg-slate-950/85 p-2 text-center"><Icon className={`mx-auto h-3.5 w-3.5 ${color}`} /><p className="mt-1 text-[9px] text-slate-500">{label}</p><p className={`text-xs font-bold font-mono ${color}`}>{risk?.scores[key] ?? "—"}</p></div>)}</div>
  </div>;
}
