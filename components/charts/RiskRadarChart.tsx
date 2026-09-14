"use client";

import React from "react";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { RiskScores } from "@/types/risk";

export interface RiskRadarChartProps {
  scores: RiskScores;
  cityBenchmark?: RiskScores;
}

export function RiskRadarChart({ scores, cityBenchmark }: RiskRadarChartProps) {
  const radarData = [
    { subject: "Heat Risk", value: scores.heat, benchmark: cityBenchmark?.heat || 65, fullMark: 100 },
    { subject: "Air Pollution", value: scores.air, benchmark: cityBenchmark?.air || 60, fullMark: 100 },
    { subject: "Flood Vulnerability", value: scores.flood, benchmark: cityBenchmark?.flood || 55, fullMark: 100 },
    { subject: "Green Deficit", value: 100 - scores.green, benchmark: cityBenchmark ? 100 - cityBenchmark.green : 50, fullMark: 100 },
    { subject: "Mobility Stress", value: scores.mobility, benchmark: cityBenchmark?.mobility || 58, fullMark: 100 },
    { subject: "Pop Exposure", value: scores.populationExposure, benchmark: cityBenchmark?.populationExposure || 60, fullMark: 100 },
  ];

  return (
    <div className="w-full h-72 flex flex-col justify-between">
      <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-1">
        <span className="flex items-center gap-1.5 text-cyan-300">
          <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 inline-block" />
          Area Assessment
        </span>
        <span className="flex items-center gap-1.5 text-slate-400">
          <span className="w-2.5 h-2.5 rounded-full bg-slate-600 inline-block" />
          Metropolitan Benchmark
        </span>
      </div>

      <div className="w-full h-64">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
            <PolarGrid stroke="rgba(56, 189, 248, 0.15)" />
            <PolarAngleAxis
              dataKey="subject"
              tick={{ fill: "#94a3b8", fontSize: 11, fontFamily: "monospace" }}
            />
            <PolarRadiusAxis
              angle={30}
              domain={[0, 100]}
              stroke="rgba(148, 163, 184, 0.2)"
              tick={{ fill: "#64748b", fontSize: 9 }}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className="bg-slate-900/95 border border-cyan-500/40 p-2.5 rounded-lg shadow-xl text-xs font-mono">
                      <div className="text-white font-bold mb-1">{data.subject}</div>
                      <div className="text-cyan-300">Area Score: {data.value} / 100</div>
                      <div className="text-slate-400">City Avg: {data.benchmark} / 100</div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Radar
              name="Metropolitan Benchmark"
              dataKey="benchmark"
              stroke="#64748b"
              fill="#64748b"
              fillOpacity={0.15}
            />
            <Radar
              name="Area Assessment"
              dataKey="value"
              stroke="#06b6d4"
              fill="#06b6d4"
              fillOpacity={0.35}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
