import React from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { ScoreCard } from "@/components/dashboard/ScoreCard";
import { RiskCard } from "@/components/dashboard/RiskCard";
import { PopulationCard } from "@/components/dashboard/PopulationCard";
import { InsightCard } from "@/components/dashboard/InsightCard";
import { RiskRadarChart } from "@/components/charts/RiskRadarChart";
import { TrendChart } from "@/components/charts/TrendChart";
import { ExposureChart } from "@/components/charts/ExposureChart";
import { MapPlaceholder } from "@/components/map/MapPlaceholder";
import { getAreaById } from "@/lib/mock-data";
import { Sparkles, Sliders, BarChart2, Activity, Globe, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function AreaDashboardPage({ params }: PageProps) {
  const { id } = await params;
  const area = getAreaById(id);

  return (
    <div className="min-h-screen flex flex-col bg-[#030712] text-slate-100 selection:bg-cyan-500/30 selection:text-cyan-200">
      <Navbar />

      <main className="flex-1 pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-10">
        {/* 1. Header with Breadcrumbs and Actions */}
        <DashboardHeader area={area} />

        {/* 2. Primary Score Card (72/100 HIGH PRIORITY + AI Summary) */}
        <ScoreCard area={area} />

        {/* 3. 6 Reusable Risk Cards Grid */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
              <Activity className="w-4 h-4 text-cyan-400" />
              <span>Multi-Dimensional Environmental Risk Indicators</span>
            </h3>
            <span className="text-[11px] font-mono text-slate-400">
              Composite Vector Scoring
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
            <RiskCard
              id="heat"
              title="Heat Risk"
              score={area.scores.heat}
              levelLabel="HIGH"
              iconType="heat"
              description="LST thermal anomaly"
            />
            <RiskCard
              id="air"
              title="Air Quality"
              score={area.scores.air}
              levelLabel="ELEVATED"
              iconType="air"
              description="Aerosol & PM2.5 load"
            />
            <RiskCard
              id="flood"
              title="Flood Vulnerability"
              score={area.scores.flood}
              levelLabel="MOD-HIGH"
              iconType="flood"
              description="Topographic runoff pooling"
            />
            <RiskCard
              id="green"
              title="Green Infrastructure"
              score={area.scores.green}
              levelLabel="LOW COVERAGE"
              unit="%"
              iconType="green"
              description="Vegetative canopy deficit"
              isDeficitMetric
            />
            <RiskCard
              id="mobility"
              title="Mobility Pressure"
              score={area.scores.mobility}
              levelLabel="MODERATE"
              iconType="mobility"
              description="Corridor congestion load"
            />
            <RiskCard
              id="population"
              title="Population Exposure"
              score={area.scores.populationExposure}
              levelLabel="HIGH"
              iconType="population"
              description="Demographic overlap"
            />
          </div>
        </div>

        {/* 4. Data Visualizations: Radar Chart & Historical Trend Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Radar Chart: Dimension Comparison */}
          <div className="lg:col-span-5 glass-panel p-6 rounded-2xl border-slate-800 space-y-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-mono font-bold tracking-wider text-white uppercase flex items-center gap-2">
                  <BarChart2 className="w-4 h-4 text-cyan-400" />
                  <span>Risk Profile Radar</span>
                </h3>
                <span className="text-[10px] font-mono text-cyan-400">
                  6 DIMENSIONS
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Area performance indexed against the greater metropolitan baseline.
              </p>
            </div>

            <RiskRadarChart scores={area.scores} />
          </div>

          {/* 12-Month Multi-Variable Historical Trend Chart */}
          <div className="lg:col-span-7 glass-panel p-6 rounded-2xl border-slate-800 space-y-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-mono font-bold tracking-wider text-white uppercase flex items-center gap-2">
                  <Activity className="w-4 h-4 text-cyan-400" />
                  <span>12-Month Historical Environmental Trends</span>
                </h3>
                <span className="text-[10px] font-mono text-cyan-400">
                  OCT 2025 – SEP 2026
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Multi-satellite time-series assimilation tracking seasonal oscillations.
              </p>
            </div>

            <TrendChart data={area.historicalTrends} />
          </div>
        </div>

        {/* 5. GIS Map Section (Reserved for Infinity) */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
              <Globe className="w-4 h-4 text-cyan-400" />
              <span>ENVIRONMENTAL RISK MAP</span>
            </h3>
            <span className="text-[11px] font-mono text-cyan-400">
              RESERVED FOR INFINITY GIS MODULE
            </span>
          </div>

          <MapPlaceholder
            activeLayer="overall"
            selectedArea={area}
            heightClassName="h-[440px]"
          />
        </div>

        {/* 6. Population Exposure & Distribution Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7">
            <PopulationCard area={area} />
          </div>

          <div className="lg:col-span-5 glass-panel p-6 rounded-2xl border-slate-800 flex flex-col justify-between">
            <div>
              <h4 className="text-sm font-mono font-bold uppercase tracking-wider text-white">
                Exposure Demographics
              </h4>
              <p className="text-xs text-slate-400 mt-1">
                Proportion of residents living inside acute compound risk grids.
              </p>
            </div>

            <ExposureChart data={area.exposureDistribution} />
          </div>
        </div>

        {/* 7. Key Diagnostic Insights */}
        <InsightCard insights={area.keyInsights} />

        {/* 8. Bottom Action CTAs */}
        <div className="glass-panel p-8 rounded-2xl border-cyan-500/30 flex flex-col sm:flex-row items-center justify-between gap-6 bg-gradient-to-r from-[#04091a] via-[#091330] to-[#04091a]">
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="text-xl font-bold text-white tracking-tight">
              Ready to take action in {area.name}?
            </h3>
            <p className="text-xs sm:text-sm text-slate-300">
              Consult the AI Analyst for deeper diagnostics or simulate urban interventions to reduce risk scores.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Link href={`/analysis/${area.id}`}>
              <Button
                variant="secondary"
                size="md"
                leftIcon={<Sparkles className="w-4 h-4 text-cyan-400" />}
              >
                Ask AI Analyst
              </Button>
            </Link>

            <Link href={`/simulate/${area.id}`}>
              <Button
                variant="glow"
                size="md"
                leftIcon={<Sliders className="w-4 h-4 text-slate-950" />}
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                Run Intervention Simulation
              </Button>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
