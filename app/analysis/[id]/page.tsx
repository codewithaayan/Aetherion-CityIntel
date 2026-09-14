import React from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { AIChat } from "@/components/ai/AIChat";
import { getAreaById } from "@/lib/mock-data";
import { ArrowLeft, Sparkles, Sliders } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function AIAnalysisPage({ params }: PageProps) {
  const { id } = await params;
  const area = getAreaById(id);

  return (
    <div className="min-h-screen flex flex-col bg-[#030712] text-slate-100 selection:bg-cyan-500/30 selection:text-cyan-200">
      <Navbar />

      <main className="flex-1 pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-6">
        {/* Navigation Breadcrumb Bar */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs font-mono">
          <Link
            href={`/area/${area.id}`}
            className="flex items-center gap-1.5 text-slate-400 hover:text-cyan-300 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to {area.name} Dossier</span>
          </Link>

          <Link href={`/simulate/${area.id}`}>
            <Button
              variant="outline"
              size="sm"
              leftIcon={<Sliders className="w-3.5 h-3.5 text-cyan-400" />}
            >
              Intervention Simulator
            </Button>
          </Link>
        </div>

        {/* AI Chat Interface */}
        <AIChat area={area} />
      </main>

      <Footer />
    </div>
  );
}
