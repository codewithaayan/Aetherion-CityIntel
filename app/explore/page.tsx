"use client";

import { useEffect, useMemo, useState } from "react";
import { MapPin, Search } from "lucide-react";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { AreaPopup } from "@/components/map/AreaPopup";
import { LayerControls } from "@/components/map/LayerControls";
import { MapPlaceholder } from "@/components/map/MapPlaceholder";
import { RiskLegend } from "@/components/map/RiskLegend";
import { DataNotice } from "@/components/ui/DataNotice";
import { errorMessage, getAreas, getCities, getLayer, getRisk } from "@/lib/api";
import type { Area, City } from "@/types/area";
import type { LayerName, MapLayer, RiskResponse } from "@/types/risk";

export default function ExplorePage() {
  const [cities, setCities] = useState<City[]>([]);
  const [cityId, setCityId] = useState("");
  const [areas, setAreas] = useState<Area[]>([]);
  const [areaId, setAreaId] = useState("");
  const [risk, setRisk] = useState<RiskResponse | null>(null);
  const [layer, setLayer] = useState<MapLayer | null>(null);
  const [activeLayer, setActiveLayer] = useState<LayerName>("heat");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [layerLoading, setLayerLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [layerError, setLayerError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    getCities().then((items) => { if (!active) return; setCities(items); setCityId(items[0]?.id ?? ""); if (items.length === 0) setLoading(false); }).catch((reason) => { if (!active) return; setError(errorMessage(reason)); setLoading(false); });
    return () => { active = false; };
  }, []);

  useEffect(() => {
    if (!cityId) return;
    let active = true;
    getAreas(cityId).then((items) => { if (!active) return; setAreas(items); setAreaId(items[0]?.id ?? ""); setLoading(false); }).catch((reason) => { if (!active) return; setError(errorMessage(reason)); setLoading(false); });
    return () => { active = false; };
  }, [cityId]);

  useEffect(() => {
    if (!areaId) return;
    let active = true;
    Promise.allSettled([getRisk(areaId), getLayer(areaId, activeLayer)]).then(([riskResult, layerResult]) => {
      if (!active) return;
      if (riskResult.status === "fulfilled") setRisk(riskResult.value);
      if (layerResult.status === "fulfilled") setLayer(layerResult.value); else setLayerError(errorMessage(layerResult.reason));
      setLayerLoading(false);
    });
    return () => { active = false; };
  }, [areaId, activeLayer]);

  const selectedCity = cities.find((city) => city.id === cityId);
  const selectedArea = areas.find((area) => area.id === areaId);
  const filteredAreas = useMemo(() => areas.filter((area) => area.name.toLowerCase().includes(search.toLowerCase())), [areas, search]);
  const selectCity = (nextCityId: string) => { setCityId(nextCityId); setAreas([]); setAreaId(""); setRisk(null); setLayer(null); setError(null); setLoading(Boolean(nextCityId)); };
  const selectArea = (nextAreaId: string) => { setAreaId(nextAreaId); setRisk(null); setLayer(null); setLayerError(null); setLayerLoading(Boolean(nextAreaId)); };
  const selectLayer = (nextLayer: LayerName) => { setActiveLayer(nextLayer); setLayer(null); setLayerError(null); setLayerLoading(Boolean(areaId)); };

  return <div className="min-h-screen bg-[#030712] text-slate-100"><Navbar /><main className="mx-auto w-full max-w-7xl space-y-6 px-4 pb-12 pt-24 sm:px-6 lg:px-8">
    <div className="flex flex-col justify-between gap-4 border-b border-slate-800 pb-4 md:flex-row md:items-end"><div><span className="text-xs font-mono font-bold tracking-widest text-cyan-400">SPATIAL EXPLORER</span><h1 className="mt-1 text-3xl font-extrabold text-white">Explore Your City</h1></div><label className="text-xs text-slate-400">City<select value={cityId} onChange={(event) => selectCity(event.target.value)} className="ml-2 rounded-lg border border-cyan-500/30 bg-slate-900 px-3 py-2 text-cyan-300"><option value="">Select a city</option>{cities.map((city) => <option key={city.id} value={city.id}>{city.name}, {city.country}</option>)}</select></label></div>
    {loading ? <DataNotice title="Loading backend data" message="Requesting the available cities and areas." /> : error ? <DataNotice title="Data unavailable" message={error} error /> : cities.length === 0 ? <DataNotice title="No cities available" message="The connected database returned an empty city list." /> : null}
    <div className="grid gap-6 lg:grid-cols-12"><aside className="space-y-6 lg:col-span-4"><div className="space-y-3 rounded-2xl border border-slate-800 p-4 glass-panel"><div className="relative"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search areas" className="w-full rounded-xl border border-slate-700 bg-[#050a1b] py-2 pl-10 pr-3 text-xs text-white" /></div><div className="max-h-64 space-y-1.5 overflow-y-auto">{filteredAreas.map((area) => <button key={area.id} type="button" onClick={() => selectArea(area.id)} className={`flex w-full items-center gap-2 rounded-xl border p-2.5 text-left text-xs ${area.id === areaId ? "border-cyan-500/50 bg-cyan-500/15 text-white" : "border-slate-800 bg-slate-900/40 text-slate-300"}`}><MapPin className="h-3.5 w-3.5" />{area.name}</button>)}{!loading && cityId && filteredAreas.length === 0 ? <p className="p-3 text-xs text-slate-500">No matching areas.</p> : null}</div></div><div className="rounded-2xl border border-slate-800 p-5 glass-panel"><LayerControls activeLayer={activeLayer} onLayerChange={selectLayer} /></div></aside>
      <section className="space-y-4 lg:col-span-8"><div className="relative"><MapPlaceholder activeLayer={activeLayer} selectedArea={selectedArea} layer={layer} layerLoading={layerLoading} layerError={layerError} heightClassName="h-[520px]" />{selectedArea ? <div className="absolute right-4 top-16 z-20 hidden md:block"><AreaPopup area={selectedArea} city={selectedCity} risk={risk} /></div> : null}</div>{selectedArea ? <div className="md:hidden"><AreaPopup area={selectedArea} city={selectedCity} risk={risk} /></div> : null}</section></div><RiskLegend />
  </main><Footer /></div>;
}
