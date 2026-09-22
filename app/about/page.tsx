import React from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { TEAM_MEMBERS } from "@/lib/content";
import { Sparkles, Layers, Cpu, Database, Globe, ArrowDown, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";

export const metadata = {
  title: "About UrbanPulse — Team Aetherion",
  description: "Mission, team architecture, and system integration pipeline for UrbanPulse.",
};

export default function AboutPage() {
  const teamPipeline = [
    { role: "DATA PIPELINE", owner: "HENRI", desc: "Multi-satellite ingestion, cloud filtering & feature extraction", icon: Database },
    { role: "ENVIRONMENTAL MODEL", owner: "CHIP", desc: "Thermodynamic equations, UHI metrics & microclimate transfers", icon: Cpu },
    { role: "BACKEND API", owner: "ABD", desc: "High-throughput geospatial routing, Redis caching & database APIs", icon: Layers },
    { role: "FRONTEND", owner: "MUHAMMAD AAYAN", desc: "Component boundaries, reactive simulation states & telemetry UI", icon: Sparkles },
    { role: "GIS VISUALIZATION", owner: "BENJAMIN YOU", desc: "WebGL rasterization, vector layers & dynamic cartography", icon: Globe },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#030712] text-slate-100 selection:bg-cyan-500/30 selection:text-cyan-200">
      <Navbar />

      <main className="flex-1 pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-16">
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <Badge variant="cyan" size="sm">
            THE URBANPULSE VISION
          </Badge>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            About UrbanPulse
          </h1>
          <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-normal">
            Cities already generate enormous amounts of environmental information. However, this information is often scattered across satellites, weather models, geographic databases and population datasets.
          </p>
          <p className="text-sm text-cyan-300 font-mono">
            UrbanPulse brings these sources together into one interactive intelligence platform.
          </p>
        </div>

        {/* Mission Banner */}
        <div className="glass-panel p-10 rounded-3xl border-cyan-500/30 text-center space-y-4 bg-gradient-to-r from-[#050b1e] via-[#091535] to-[#050b1e] shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
          <span className="text-xs font-mono font-bold tracking-widest text-cyan-400 uppercase">
            CORE PLATFORM MISSION
          </span>
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight max-w-2xl mx-auto leading-tight">
            From scattered data to actionable urban intelligence.
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-lg mx-auto">
            Empowering municipal leaders, environmental scientists, and civic engineers to pinpoint compound vulnerability and test mitigation policy in code.
          </p>
        </div>

        {/* Team Section */}
        <div className="space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <Badge variant="neutral" size="sm">
              ENGINEERING CONSORTIUM
            </Badge>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Meet Team Aetherion
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Multidisciplinary specialists uniting aerospace observation, computational physics, and modern web systems.
            </p>
          </div>

          {/* 6 Team Member Cards with Abstract Generative Gradient Avatars */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {TEAM_MEMBERS.map((member) => (
              <Card
                key={member.name}
                interactive
                className="p-6 border-slate-800 flex flex-col justify-between space-y-5"
              >
                <div className="space-y-4">
                  {/* Abstract Gradient Avatar (Strictly no real people!) */}
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${member.gradient} flex items-center justify-center font-mono font-bold text-lg text-white shadow-lg border border-white/20`}
                    >
                      {member.initials}
                    </div>

                    <div>
                      <h3 className="text-lg font-bold text-white tracking-tight">
                        {member.name}
                      </h3>
                      <span className="text-xs font-mono text-cyan-400 font-semibold block">
                        {member.role}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-400 leading-relaxed">
                    {member.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-800 text-[11px] font-mono text-slate-400 flex items-center justify-between">
                  <span className="text-slate-500">Domain:</span>
                  <span className="text-slate-300 font-medium truncate max-w-[190px]">
                    {member.specialty}
                  </span>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Critical Team Integration Architecture Flow */}
        <div className="glass-panel p-8 rounded-2xl border-cyan-500/20 space-y-8 bg-[#040818]">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h3 className="text-xl font-bold text-white tracking-tight">
              Cross-Team Architecture Integration Pipeline
            </h3>
            <p className="text-xs text-slate-400">
              Clean modular component boundaries facilitating seamless handoff across engineering tracks.
            </p>
          </div>

          <div className="max-w-4xl mx-auto space-y-4 font-mono">
            {teamPipeline.map((step, idx) => {
              const Icon = step.icon;
              return (
                <div key={step.role} className="space-y-3">
                  <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-cyan-500/40 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0">
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white">
                          {step.role}
                        </div>
                        <div className="text-[11px] text-slate-400 font-sans">
                          {step.desc}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-start sm:self-center">
                      <span className="text-[10px] text-slate-500">LEAD:</span>
                      <span className="text-xs font-bold text-cyan-300 px-2 py-0.5 rounded bg-cyan-950/70 border border-cyan-800">
                        {step.owner}
                      </span>
                    </div>
                  </div>

                  {idx < teamPipeline.length - 1 && (
                    <div className="flex justify-center text-cyan-500/50">
                      <ArrowDown className="w-4 h-4" />
                    </div>
                  )}
                </div>
              );
            })}

            {/* Final Outcome Box */}
            <div className="flex justify-center text-cyan-500/50">
              <ArrowDown className="w-4 h-4" />
            </div>

            <div className="p-5 rounded-2xl bg-gradient-to-r from-cyan-950/40 via-blue-950/40 to-indigo-950/40 border border-cyan-400/50 text-center shadow-lg">
              <div className="flex items-center justify-center gap-2 text-cyan-300 font-bold text-sm">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>FINAL URBANPULSE PRODUCT</span>
              </div>
              <p className="text-xs text-slate-400 font-sans mt-1">
                Unified climate-tech intelligence engine ready for stakeholder deployment.
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
