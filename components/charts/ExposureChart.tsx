"use client";

import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { ExposureBreakdown } from "@/types/risk";
import { formatNumber } from "@/lib/utils";

export interface ExposureChartProps {
  data: ExposureBreakdown[];
}

export function ExposureChart({ data }: ExposureChartProps) {
  return (
    <div className="w-full space-y-3">
      <div className="flex items-center justify-between text-xs font-mono text-slate-400">
        <span>POPULATION BRACKETS</span>
        <span className="text-cyan-400">Total 100% Distribution</span>
      </div>

      <div className="w-full h-56">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(56, 189, 248, 0.08)" horizontal={false} />
            <XAxis
              type="number"
              domain={[0, 60]}
              unit="%"
              stroke="#64748b"
              fontSize={11}
              fontFamily="monospace"
              tickLine={false}
            />
            <YAxis
              type="category"
              dataKey="label"
              stroke="#cbd5e1"
              fontSize={11}
              fontFamily="monospace"
              tickLine={false}
              width={110}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const item = payload[0].payload as ExposureBreakdown;
                  return (
                    <div className="bg-slate-900/95 border border-slate-700 p-2.5 rounded-lg shadow-xl font-mono text-xs">
                      <div className="text-white font-bold mb-1">{item.label}</div>
                      <div className="text-cyan-300">Share: {item.percentage}%</div>
                      <div className="text-slate-400">Citizens: {formatNumber(item.population)}</div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar dataKey="percentage" radius={[0, 4, 4, 0]} barSize={18}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
