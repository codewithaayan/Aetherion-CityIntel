import { ArrowDown, Database, Download, Plug, ShieldAlert } from "lucide-react";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { Badge } from "@/components/ui/Badge";
import { Card, CardDescription, CardTitle } from "@/components/ui/Card";
import { DATA_SOURCES } from "@/lib/content";

export const metadata = { title: "Methodology & Pipeline — Aetherion CityIntel", description: "Current data boundaries and integration pipeline." };

const stages = [
  { title: "External source request", description: "Abdullahs adapters request only a caller-selected source and retain the raw response.", icon: Download },
  { title: "Owner processing", description: "Henri and the scientific owners choose products, interpret fields, align data, and calculate results.", icon: Plug },
  { title: "Validated database records", description: "The prepared records are validated before the existing importer writes them to PostGIS.", icon: Database },
  { title: "Backend routes", description: "The frontend reads areas, risk, population, and the three supported map layers.", icon: ShieldAlert },
];

export default function MethodologyPage() {
  return <div className="min-h-screen bg-[#030712] text-slate-100"><Navbar /><main className="mx-auto w-full max-w-7xl space-y-16 px-4 pb-20 pt-24 sm:px-6 lg:px-8"><header className="mx-auto max-w-3xl space-y-3 text-center"><Badge variant="cyan" size="sm">CURRENT DATA BOUNDARY</Badge><h1 className="text-4xl font-extrabold text-white">How Aetherion CityIntel Connects Data</h1><p className="text-sm leading-relaxed text-slate-400">This page describes the implemented scientific models, formulas, thresholds, interpretation methods, and model assumptions used by CityIntel. These components are integrated into the system and are used to generate the environmental and urban intelligence results presented throughout the platform.</p></header>
    <section className="space-y-6"><h2 className="text-center text-xl font-bold text-white">Data flow</h2><div className="mx-auto max-w-3xl space-y-3">{stages.map((stage, index) => { const Icon = stage.icon; return <div key={stage.title}><div className="flex gap-4 rounded-xl border border-slate-800 bg-slate-950/70 p-5"><div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-cyan-500/30 bg-cyan-500/10 text-cyan-400"><Icon className="h-5 w-5" /></div><div><h3 className="text-sm font-bold text-white">{stage.title}</h3><p className="mt-1 text-xs leading-relaxed text-slate-400">{stage.description}</p></div></div>{index < stages.length - 1 ? <ArrowDown className="mx-auto my-2 h-4 w-4 text-cyan-500/50" /> : null}</div>; })}</div></section>
    <section id="sources" className="space-y-6"><div className="text-center"><Badge variant="neutral" size="sm">BLUEPRINT SOURCES</Badge><h2 className="mt-3 text-2xl font-bold text-white">Approved source catalog</h2><p className="mt-2 text-xs text-slate-400">Availability and resolution depend on the exact product selected by the data owner.</p></div><div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">{DATA_SOURCES.map((source) => <Card key={source.name} className="border-slate-800 p-5"><Badge variant="cyan" size="sm">{source.badge}</Badge><CardTitle className="mt-3 text-base text-white">{source.name}</CardTitle><p className="mt-1 text-[10px] font-mono text-slate-500">{source.agency}</p><CardDescription className="mt-3 text-xs text-slate-400">{source.description}</CardDescription><p className="mt-4 border-t border-slate-800 pt-3 text-[11px] font-mono text-cyan-300">{source.resolution}</p></Card>)}</div></section>
    <section className="rounded-2xl border border-amber-500/30 bg-amber-950/10 p-8"><h2 className="text-lg font-bold text-white">Scientific and AI disclosure</h2><p className="mt-3 text-sm leading-relaxed text-slate-300">Aetherion CityIntel is currently a research and demonstration prototype. The platform’s backend data pipeline and live data integrations are not fully operational, and the environmental and urban datasets currently presented within the platform are simulated or placeholder data created for demonstration purposes.

The risk assessments, environmental insights, and visualizations are therefore generated from this provided dataset rather than from live or externally validated measurements. The simulation system and AI-assisted analysis operate on this dataset as intended, demonstrating how the platform can process data, model potential scenarios, and generate contextual insights.

The scientific models, risk thresholds, formula weights, simulation coefficients, and assumptions implemented by the Aetherion team are prototype-level and have not been externally validated. Consequently, the results should be interpreted as demonstrations of the platform’s capabilities and should not be used for real-world planning, environmental assessment, or other consequential decisions without validated data, appropriate scientific review, and further development of the underlying models.

AI-generated interpretations may also contain inaccuracies. Users should consider the underlying dataset, model assumptions, and simulation parameters when interpreting the platform’s results.
.</p><p className="mt-3 text-sm leading-relaxed text-slate-300">
</p></section>
  </main><Footer /></div>;
}
