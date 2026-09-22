"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { DataNotice } from "@/components/ui/DataNotice";
import { errorMessage, getArea } from "@/lib/api";
import type { Area } from "@/types/area";

export default function AnalysisPage() {
  const id = String(useParams<{ id: string }>().id);
  const [area, setArea] = useState<Area | null>(null);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => { let active = true; getArea(id).then((value) => { if (active) setArea(value); }).catch((reason) => { if (active) setError(errorMessage(reason)); }); return () => { active = false; }; }, [id]);
  return <div className="min-h-screen bg-[#030712] text-slate-100"><Navbar /><main className="mx-auto max-w-4xl space-y-6 px-4 pb-20 pt-28"><div><span className="text-xs font-mono text-cyan-400">AI ANALYSIS</span><h1 className="mt-2 text-3xl font-extrabold text-white">{area ? `${area.name} analysis` : "Area analysis"}</h1></div>{error ? <DataNotice title="Area unavailable" message={error} error /> : !area ? <DataNotice title="Loading area" message="Requesting area details." /> : <DataNotice title="AI connection pending" message="The backend route exists, but Arjun has not supplied the agreed question and response models. No generated answer is shown until that contract and adapter are connected." />}</main><Footer /></div>;
}
