import React from "react";
import Link from "next/link";
import { ArrowRight, Sparkles, Sliders } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function CTA() {
  return (
    <section className="py-28 relative bg-gradient-to-b from-[#040817] via-[#060e24] to-[#02050e] overflow-hidden border-t border-slate-800/80">
      {/* Background glowing rings */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[200px] bg-blue-600/15 rounded-full blur-2xl pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-8">
        {/* Subtitle tag */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-xs font-mono text-cyan-300">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>SCIENTIFIC CLIMATE SIMULATION LAB</span>
        </div>

        {/* Large Statement */}
        <div className="space-y-3">
          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight">
            Don&apos;t just see what your city looks like today.
          </h2>
          <p className="text-2xl sm:text-4xl lg:text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-sky-300 to-emerald-400 tracking-tight">
            Simulate what it could look like tomorrow.
          </p>
        </div>

        {/* Supporting description */}
        <p className="text-slate-300 max-w-xl mx-auto text-sm sm:text-base leading-relaxed">
          Test the thermodynamic and demographic impact of cool roofs, urban forests, and mobility policies on neighbourhood heat and flood exposure before committing public capital.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link href="/explore">
            <Button
              variant="glow"
              size="lg"
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Explore UrbanPulse
            </Button>
          </Link>

          <Link href="/simulate/gulshan-iqbal">
            <Button
              variant="secondary"
              size="lg"
              leftIcon={<Sliders className="w-4 h-4 text-cyan-400" />}
            >
              Launch Simulator
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
