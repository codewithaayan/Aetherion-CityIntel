import React from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/landing/Hero";
import { FeatureCards } from "@/components/landing/FeatureCard";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { DataSources } from "@/components/landing/DataSources";
import { CTA } from "@/components/landing/CTA";

export const metadata = {
  title: "Aetherion CityIntel —Turning Urban Data into Smarter Decisions",
  description:
    "NASA Earth Observation × Modern Climate-Tech Startup × AI Intelligence Platform. Actionable neighbourhood-level environmental risk assessment.",
};

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#030712] text-slate-100 selection:bg-cyan-500/30 selection:text-cyan-200">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <FeatureCards />
        <HowItWorks />
        <DataSources />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}
