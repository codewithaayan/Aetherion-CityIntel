import Link from "next/link";
import { Sliders, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";
import type { Area, City } from "@/types/area";

export function DashboardHeader({ area, city }: { area: Area; city?: City }) {
  return (
    <div className="space-y-4 border-b border-slate-800 pb-6">
      <div className="text-xs font-mono text-slate-400"><Link href="/explore" className="hover:text-cyan-400">{city?.name ?? "Explore"}</Link><span className="mx-2 text-slate-600">/</span><span className="text-cyan-300">{area.name}</span></div>
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
        <div><h1 className="text-3xl font-extrabold text-white">{area.name} Intelligence Report</h1><p className="mt-1 text-sm text-slate-400">Environmental and population data supplied by the backend.</p></div>
        <div className="flex flex-wrap gap-2.5"><Link href={`/analysis/${area.id}`}><Button variant="secondary" size="sm" leftIcon={<Sparkles className="h-4 w-4 text-cyan-400" />}>AI analysis</Button></Link><Link href={`/simulate/${area.id}`}><Button variant="glow" size="sm" leftIcon={<Sliders className="h-4 w-4" />}>Simulation</Button></Link></div>
      </div>
    </div>
  );
}
