import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function CTA() {
  return <section className="relative overflow-hidden border-t border-slate-800/80 bg-gradient-to-b from-[#040817] via-[#060e24] to-[#02050e] py-28"><div className="absolute left-1/2 top-1/2 h-[350px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-500/10 blur-3xl" /><div className="relative z-10 mx-auto max-w-4xl space-y-8 px-4 text-center"><div className="space-y-3"><h2 className="text-3xl font-extrabold text-white sm:text-5xl">Explore the data available today.</h2><p className="bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-2xl font-extrabold text-transparent sm:text-4xl"></p></div><p className="mx-auto max-w-xl text-sm leading-relaxed text-slate-300"></p><Link href="/explore"><Button variant="glow" size="lg" rightIcon={<ArrowRight className="h-4 w-4" />}>Explore Aetherion CityIntel</Button></Link></div></section>;
}
