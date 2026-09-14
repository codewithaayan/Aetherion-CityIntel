"use client";

import React, { useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { HistoricalTrendPoint } from "@/types/risk";

export interface TrendChartProps {
  data: HistoricalTrendPoint[];
}

export function TrendChart({ data }: TrendChartProps) {
  const [activeMetric, setActiveMetric] = useState<"heat" | "air" | "flood" | "overall">("heat");

  const metricConfig = {
    heat: { label: "Heat Risk", stroke: "#ef4444", fill: "#ef4444", desc: "Summer peak exceeding 90 index in Jun" },
    air: { label: "Air Pollution", stroke: "#f59e0b", fill: "#f59e0b", desc: "Winter thermal inversion peak in Dec/Jan" },
    flood: { label: "Flood Risk", stroke: "#38bdf8", fill: "#38bdf8", desc: "Monsoon surge peak in Jul/Aug" },
    overall: { label: "Composite Risk", stroke: "#06b6d4", fill: "#06b6d4", desc: "Integrated weighted risk index" },
  };

  const current = metricConfig[activeMetric];

  return (
    <div className="w-full space-y-4">
      {/* Metric Selector Pills */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 bg-slate-950/80 p-1 rounded-lg border border-slate-800">
          {(Object.keys(metricConfig) as Array<keyof typeof metricConfig>).map((key) => {
            const config = metricConfig[key];
            const isSelected = activeMetric === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => setActiveMetric(key)}
                className={`px-2.5 py-1 rounded-md text-xs font-mono transition-colors ${
                  isSelected
                    ? "bg-slate-800 text-white font-semibold border border-slate-700 shadow-sm"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                {config.label}
              </button>
            );
          })}
        </div>

        <span className="text-[11px] font-mono text-slate-400">
          {current.desc}
        </span>
      </div>

      {/* Chart Canvas */}
      <div className="w-full h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id={`gradient-${activeMetric}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={current.fill} stopOpacity={0.4} />
                <stop offset="95%" stopColor={current.fill} stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(56, 189, 248, 0.08)" />
            <XAxis
              dataKey="month"
              stroke="#64748b"
              fontSize={11}
              fontFamily="monospace"
              tickLine={false}
            />
            <YAxis
              domain={[0, 100]}
              stroke="#64748b"
              fontSize={11}
              fontFamily="monospace"
              tickLine={false}
            />
            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-slate-900/95 border border-cyan-500/30 p-2.5 rounded-lg shadow-xl font-mono text-xs">
                      <div className="text-slate-400 font-bold mb-1">{label} 2025/2026</div>
                      <div className="flex items-center gap-2" style={{ color: current.stroke }}>
                        <span className="font-semibold">{current.label}:</span>
                        <span className="font-bold text-white">{payload[0].value} / 100</span>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Area
              type="monotone"
              dataKey={activeMetric}
              stroke={current.stroke}
              strokeWidth={2}
              fillOpacity={1}
              fill={`url(#gradient-${activeMetric})`}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
