import React from "react";
import { DATA_SOURCES } from "@/lib/content";
import { Badge } from "@/components/ui/Badge";
import { Card, CardTitle, CardDescription } from "@/components/ui/Card";
import { Satellite, Globe, Layers, CloudRain, Wind, Users, MapPin } from "lucide-react";

export function DataSources() {
  const iconMap: Record<string, React.ElementType> = {
    Satellite,
    Globe,
    Layers,
    CloudRain,
    Wind,
    Users,
    MapPin,
  };

  return (
    <section className="py-24 relative bg-[#040817] border-t border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <Badge variant="neutral" size="sm">
            DATA INGESTION
          </Badge>
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Powered by Global Environmental Intelligence
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
            Aetherion CityIntel ingests openly accessible scientific data from leading space agencies, meteorological institutes, and open geospatial consortia.
          </p>
          <div className="pt-1">
            <span className="text-[11px] font-mono text-slate-500">
              * Independent data pipeline integration. Not an official agency endorsement or partnership.
            </span>
          </div>
        </div>

        {/* 7 Data Source Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {DATA_SOURCES.map((source) => {
            const Icon = iconMap[source.icon] || Satellite;
            return (
              <Card
                key={source.name}
                interactive
                className="p-5 border-slate-800/80 hover:border-cyan-500/35 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-9 h-9 rounded-lg bg-cyan-500/10 border border-cyan-500/25 flex items-center justify-center text-cyan-400">
                      <Icon className="w-4 h-4" />
                    </div>
                    <Badge variant="cyan" size="sm">
                      {source.badge}
                    </Badge>
                  </div>

                  <div>
                    <CardTitle className="text-base text-white">
                      {source.name}
                    </CardTitle>
                    <span className="text-[11px] font-mono text-slate-400">
                      {source.agency}
                    </span>
                  </div>

                  <CardDescription className="text-xs text-slate-400 line-clamp-2">
                    {source.description}
                  </CardDescription>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800/70 flex items-center justify-between text-[11px] font-mono text-slate-400">
                  <span className="text-slate-500">Resolution:</span>
                  <span className="text-slate-300 font-semibold">{source.resolution}</span>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
