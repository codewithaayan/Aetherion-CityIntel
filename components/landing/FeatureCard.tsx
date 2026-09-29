import Link from "next/link";
import { ArrowUpRight, Grid, Satellite, SlidersHorizontal, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Card, CardDescription, CardTitle } from "@/components/ui/Card";

const CAPABILITIES = [
  { title: "Environmental Sources", tagline: "Approved source connections.", description: "Connects the approved catalogs and passes raw responses into the team pipeline.", icon: Satellite, metric: "Raw source connections", href: "/methodology" },
  { title: "Neighbourhood Analysis", tagline: "Backend-supplied area data.", description: "Displays areas, supplied scores, population records, and available GeoJSON layers.", icon: Grid, metric: "Area and layer routes", href: "/explore" },
  { title: "AI Insights", tagline: "Owner connection pending.", description: "Reserved for Arjun's structured analysis adapter after its request and response schema is agreed.", icon: Sparkles, metric: "Schema pending", href: "/explore" },
  { title: "Future Simulation", tagline: "Owner connection pending.", description: "Reserved for the team intervention model and its agreed request and response contract.", icon: SlidersHorizontal, metric: "Model pending", href: "/explore" },
];

export function FeatureCards() {
  return <section className="relative bg-[#040817] py-20"><div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"><div className="mx-auto mb-14 max-w-2xl space-y-3 text-center"><Badge variant="cyan" size="sm">CORE CAPABILITIES</Badge><h2 className="text-3xl font-bold text-white sm:text-4xl">Urban Data Connections</h2><p className="text-sm text-slate-400"></p></div><div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">{CAPABILITIES.map((item) => { const Icon = item.icon; return <Link key={item.title} href={item.href} className="group"><Card interactive className="flex h-full flex-col justify-between border-slate-800/90 p-6"><div className="space-y-4"><div className="flex justify-between"><div className="flex h-10 w-10 items-center justify-center rounded-xl border border-cyan-500/30 bg-cyan-500/10 text-cyan-400"><Icon className="h-5 w-5" /></div><ArrowUpRight className="h-4 w-4 text-slate-500" /></div><div><CardTitle className="text-lg text-white">{item.title}</CardTitle><p className="mt-1 text-xs font-mono text-cyan-400">{item.tagline}</p></div><CardDescription className="text-xs text-slate-400">{item.description}</CardDescription></div><div className="mt-4 flex justify-between border-t border-slate-800 pt-5 text-[11px] font-mono text-slate-400"><span>Capability</span><span className="text-cyan-300">{item.metric}</span></div></Card></Link>; })}</div></div></section>;
}
