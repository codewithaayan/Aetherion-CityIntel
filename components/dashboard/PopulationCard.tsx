import { AlertCircle, Database, Users } from "lucide-react";
import { formatNumber } from "@/lib/utils";
import type { Area } from "@/types/area";
import type { PopulationResponse, RiskResponse } from "@/types/risk";

export function PopulationCard({ area, population, risk }: { area: Area; population: PopulationResponse | null; risk: RiskResponse | null }) {
  const total = population?.exposure.population ?? area.population;
  const items = [{ label: "Total population", value: formatNumber(total), icon: Users }, { label: "High-risk population", value: formatNumber(risk?.exposure.highRiskPopulation), icon: AlertCircle }, { label: "Grid records", value: population ? String(population.gridPopulation.length) : "—", icon: Database }];
  return <div className="space-y-4"><h3 className="flex items-center gap-2 text-base font-bold text-white"><Users className="h-4 w-4 text-cyan-400" />Population data</h3><div className="grid gap-4 sm:grid-cols-3">{items.map(({ label, value, icon: Icon }) => <div key={label} className="rounded-2xl border border-slate-800 p-5 glass-panel"><div className="flex justify-between text-xs font-mono text-slate-400"><span>{label.toUpperCase()}</span><Icon className="h-4 w-4" /></div><div className="mt-2 text-3xl font-extrabold font-mono text-white">{value}</div></div>)}</div></div>;
}
