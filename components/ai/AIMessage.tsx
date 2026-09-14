import React from "react";
import { Sparkles, AlertCircle, ShieldAlert, CheckCircle2, Info } from "lucide-react";
import { StructuredAIResponse } from "@/lib/mock-data";

export interface AIMessageProps {
  response: StructuredAIResponse;
}

export function AIMessage({ response }: AIMessageProps) {
  return (
    <div className="glass-panel p-6 rounded-2xl border-cyan-500/30 space-y-6 shadow-xl">
      {/* Question echoed */}
      <div className="flex items-center gap-2 pb-3 border-b border-slate-800 text-xs font-mono text-cyan-400">
        <Sparkles className="w-4 h-4" />
        <span className="font-semibold uppercase tracking-wider">
          QUERY: {response.question}
        </span>
      </div>

      {/* 1. PRIMARY ISSUE */}
      <div className="space-y-1.5">
        <span className="text-[11px] font-mono font-bold tracking-widest text-red-400 uppercase flex items-center gap-1.5">
          <ShieldAlert className="w-3.5 h-3.5" />
          PRIMARY ISSUE
        </span>
        <h3 className="text-lg font-bold text-white tracking-tight">
          {response.primaryIssue}
        </h3>
      </div>

      {/* 2. WHY IT MATTERS */}
      <div className="space-y-1.5">
        <span className="text-[11px] font-mono font-bold tracking-widest text-cyan-400 uppercase flex items-center gap-1.5">
          <Info className="w-3.5 h-3.5" />
          WHY IT MATTERS
        </span>
        <p className="text-sm text-slate-300 leading-relaxed font-normal">
          {response.whyItMatters}
        </p>
      </div>

      {/* 3. EVIDENCE */}
      <div className="space-y-2">
        <span className="text-[11px] font-mono font-bold tracking-widest text-amber-400 uppercase flex items-center gap-1.5">
          <AlertCircle className="w-3.5 h-3.5" />
          EVIDENCE & METRIC SIGNALS
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          {response.evidence.map((item, idx) => (
            <div
              key={idx}
              className="bg-slate-950/70 p-3 rounded-xl border border-slate-800/80 flex items-center justify-between font-mono text-xs"
            >
              <span className="text-slate-400">{item.label}:</span>
              <span
                className={`font-bold ${
                  item.status === "alert"
                    ? "text-red-400"
                    : item.status === "warning"
                    ? "text-amber-400"
                    : "text-cyan-300"
                }`}
              >
                {item.value}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 4. RECOMMENDED ACTIONS */}
      <div className="space-y-2">
        <span className="text-[11px] font-mono font-bold tracking-widest text-emerald-400 uppercase flex items-center gap-1.5">
          <CheckCircle2 className="w-3.5 h-3.5" />
          RECOMMENDED ACTIONS
        </span>
        <div className="space-y-2 pt-1">
          {response.recommendedActions.map((action, idx) => (
            <div
              key={idx}
              className="flex items-start gap-3 p-3 rounded-xl bg-slate-900/40 border border-slate-800/80"
            >
              <span className="w-5 h-5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center text-[10px] font-mono font-bold shrink-0 mt-0.5">
                {idx + 1}
              </span>
              <span className="text-xs text-slate-200 leading-relaxed">
                {action}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Disclaimer */}
      <div className="pt-4 border-t border-slate-800/80 flex items-start gap-2 text-[11px] font-mono text-slate-400">
        <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
        <div>
          <span>AI explanations are based on available environmental data and UrbanPulse modelling.</span>
          {response.scientificNote && (
            <div className="text-slate-400 mt-1">Source: {response.scientificNote}</div>
          )}
        </div>
      </div>
    </div>
  );
}
