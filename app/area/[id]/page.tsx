"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Activity } from "lucide-react";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { PopulationCard } from "@/components/dashboard/PopulationCard";
import { RiskCard } from "@/components/dashboard/RiskCard";
import { ScoreCard } from "@/components/dashboard/ScoreCard";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { MapPlaceholder } from "@/components/map/MapPlaceholder";
import { DataNotice } from "@/components/ui/DataNotice";
import { errorMessage, getArea, getCities, getLayer, getPopulation, getRisk } from "@/lib/api";
import type { Area, City } from "@/types/area";
import type { MapLayer, PopulationResponse, RiskResponse } from "@/types/risk";

export default function AreaPage() {
  const id = String(useParams<{ id: string }>().id);
  const [area, setArea] = useState<Area | null>(null);
  const [city, setCity] = useState<City>();
  const [risk, setRisk] = useState<RiskResponse | null>(null);
  const [population, setPopulation] = useState<PopulationResponse | null>(null);
  const [layer, setLayer] = useState<MapLayer | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [secondaryErrors, setSecondaryErrors] = useState<string[]>([]);

  useEffect(() => {
    let active = true;
    Promise.allSettled([getArea(id), getCities(), getRisk(id), getPopulation(id), getLayer(id, "heat")]).then((results) => {
      if (!active) return;
      const [areaResult, citiesResult, riskResult, populationResult, layerResult] = results;
      if (areaResult.status === "rejected") { setError(errorMessage(areaResult.reason)); return; }
      setArea(areaResult.value);
      if (citiesResult.status === "fulfilled") setCity(citiesResult.value.find((item) => item.id === areaResult.value.cityId));
      if (riskResult.status === "fulfilled") setRisk(riskResult.value);
      if (populationResult.status === "fulfilled") setPopulation(populationResult.value);
      if (layerResult.status === "fulfilled") setLayer(layerResult.value);
      const missing = [riskResult, populationResult, layerResult].filter((result) => result.status === "rejected").map((result) => errorMessage((result as PromiseRejectedResult).reason));
      setSecondaryErrors([...new Set(missing)]);
    });
    return () => { active = false; };
  }, [id]);

  if (error) return <div className="min-h-screen bg-[#030712] text-slate-100"><Navbar /><main className="mx-auto max-w-4xl px-4 pt-28"><DataNotice title="Area unavailable" message={error} error /></main></div>;
  if (!area) return <div className="min-h-screen bg-[#030712] text-slate-100"><Navbar /><main className="mx-auto max-w-4xl px-4 pt-28"><DataNotice title="Loading area" message="Requesting the area and its available datasets." /></main></div>;

  const scores = risk?.scores;
  return <div className="min-h-screen bg-[#030712] text-slate-100"><Navbar /><main className="mx-auto w-full max-w-7xl space-y-10 px-4 pb-20 pt-24 sm:px-6 lg:px-8"><DashboardHeader area={area} city={city} />{secondaryErrors.map((message) => <DataNotice key={message} title="Some data is unavailable" message={message} error />)}<ScoreCard risk={risk} />
    <section className="space-y-4"><h3 className="flex items-center gap-2 text-base font-bold text-white"><Activity className="h-4 w-4 text-cyan-400" />Environmental risk indicators</h3><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6"><RiskCard title="Heat" score={scores?.heat ?? null} iconType="heat" /><RiskCard title="Air" score={scores?.air ?? null} iconType="air" /><RiskCard title="Flood" score={scores?.flood ?? null} iconType="flood" /><RiskCard title="Green" score={scores?.green ?? null} iconType="green" /><RiskCard title="Mobility" score={scores?.mobility ?? null} iconType="mobility" /><RiskCard title="Population exposure" score={scores?.populationExposure ?? null} iconType="population" /></div></section>
    <MapPlaceholder activeLayer="heat" selectedArea={area} layer={layer} layerError={layer ? null : "Heat layer is unavailable."} heightClassName="h-[440px]" /><PopulationCard area={area} population={population} risk={risk} />
    <div className="grid gap-4 md:grid-cols-2"><DataNotice title="Historical trends not connected" message="The backend has no agreed history route or time-series contract yet." /><DataNotice title="Diagnostic insights not connected" message="AI analysis stays unavailable until Arjun supplies the request and response models." /></div>
  </main><Footer /></div>;
}
