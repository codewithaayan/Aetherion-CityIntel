import React from "react";
import Link from "next/link";
import { Satellite, Grid, Sparkles, SlidersHorizontal, ArrowUpRight } from "lucide-react";
import { Card, CardTitle, CardDescription } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

const CAPABILITIES = [
  {
    title: "Environmental Intelligence",
    tagline: "Satellite and climate data.",
    description:
      "Continuous radiance, surface temperature, and atmospheric assimilation from Landsat 9, Sentinel-2, and NASA GPM orbits.",
    icon: Satellite,
    badge: "Telemetry Engine",
    color: "cyan",
    href: "/methodology",
    metrics: "12-Band Spectral Synthesis",
  },
  {
    title: "Neighbourhood Analysis",
    tagline: "Grid-level environmental understanding.",
    description:
      "High-precision 250m² grid cell decomposition mapping thermal islands, canopy gaps, drainage vulnerability, and traffic stress.",
    icon: Grid,
    badge: "Spatial Resolution",
    color: "emerald",
    href: "/area/gulshan-iqbal",
    metrics: "250m² Cell Granularity",
  },
  {
    title: "AI Insights",
    tagline: "Complex data explained clearly.",
    description:
      "Translates multivariate geospatial indicators into structured diagnostic rationales, pinpointing compound risks and vulnerable communities.",
    icon: Sparkles,
    badge: "Reasoning Model",
    color: "cyan",
    href: "/analysis/gulshan-iqbal",
    metrics: "Diagnostic Rationale Engine",
  },
  {
    title: "Future Simulation",
    tagline: "Explore potential interventions.",
    description:
      "Predictive thermodynamic scenario modeling for cool roofs, urban afforestation, drainage bioswales, and mobility zoning.",
    icon: SlidersHorizontal,
    badge: "Scenario Lab",
    color: "amber",
    href: "/simulate/gulshan-iqbal",
    metrics: "Real-time Delta Projections",
  },
];

export function FeatureCards() {
  return (
    <section className="py-20 relative bg-[#040817]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
          <Badge variant="cyan" size="sm">
            CORE CAPABILITIES
          </Badge>
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Live Urban Intelligence Infrastructure
          </h2>
          <p className="text-sm text-slate-400 leading-relaxed">
            Four specialized scientific layers designed to turn vast satellite observations into targeted civic interventions.
          </p>
        </div>

        {/* 4 Premium Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {CAPABILITIES.map((cap) => {
            const Icon = cap.icon;
            return (
              <Link key={cap.title} href={cap.href} className="group">
                <Card
                  interactive
                  className="h-full flex flex-col justify-between p-6 border-slate-800/90 group-hover:border-cyan-500/40"
                >
                  <div className="space-y-4">
                    {/* Top row: Icon + Link arrow */}
                    <div className="flex items-center justify-between">
                      <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 group-hover:bg-cyan-500/20 group-hover:scale-105 transition-all">
                        <Icon className="w-5 h-5" />
                      </div>
                      <ArrowUpRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 transition-colors" />
                    </div>

                    {/* Title and Tagline */}
                    <div>
                      <CardTitle className="text-lg text-white group-hover:text-cyan-200 transition-colors">
                        {cap.title}
                      </CardTitle>
                      <p className="text-xs font-mono font-medium text-cyan-400/90 mt-1">
                        {cap.tagline}
                      </p>
                    </div>

                    <CardDescription className="text-xs text-slate-400 line-clamp-3">
                      {cap.description}
                    </CardDescription>
                  </div>

                  {/* Bottom Metric Tag */}
                  <div className="pt-5 mt-4 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-slate-400">
                    <span className="text-slate-500">Capability</span>
                    <span className="text-cyan-300 font-medium">{cap.metrics}</span>
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
