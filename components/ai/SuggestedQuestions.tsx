"use client";

import React from "react";
import { HelpCircle, ArrowRight, Flame, AlertTriangle, Users, Sliders } from "lucide-react";

export interface SuggestedQuestionsProps {
  onSelectQuestion: (questionKey: string) => void;
  disabled?: boolean;
}

export const SUGGESTED_QUESTIONS = [
  {
    key: "why-heat-risk-high",
    question: "Why is heat risk high here?",
    icon: Flame,
    color: "text-red-400 border-red-500/30 bg-red-500/10",
    tag: "Thermal Island",
  },
  {
    key: "biggest-environmental-concern",
    question: "What is the biggest environmental concern?",
    icon: AlertTriangle,
    color: "text-amber-400 border-amber-500/30 bg-amber-500/10",
    tag: "Compound Risk",
  },
  {
    key: "who-is-most-exposed",
    question: "Who is most exposed?",
    icon: Users,
    color: "text-purple-400 border-purple-500/30 bg-purple-500/10",
    tag: "Demographics",
  },
  {
    key: "what-interventions-could-help",
    question: "What interventions could help?",
    icon: Sliders,
    color: "text-emerald-400 border-emerald-500/30 bg-emerald-500/10",
    tag: "Remediation",
  },
];

export function SuggestedQuestions({ onSelectQuestion, disabled }: SuggestedQuestionsProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
        <HelpCircle className="w-3.5 h-3.5 text-cyan-400" />
        <span className="uppercase tracking-wider">Suggested Inquiries</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {SUGGESTED_QUESTIONS.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.key}
              type="button"
              disabled={disabled}
              onClick={() => onSelectQuestion(item.key)}
              className="p-3.5 rounded-xl glass-panel-interactive border-slate-800/80 hover:border-cyan-500/40 text-left flex items-start justify-between gap-3 group transition-all select-none disabled:opacity-50 cursor-pointer"
            >
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center gap-2">
                  <span className={`w-5 h-5 rounded-md flex items-center justify-center border text-xs ${item.color}`}>
                    <Icon className="w-3 h-3" />
                  </span>
                  <span className="text-[10px] font-mono text-slate-500 uppercase">
                    {item.tag}
                  </span>
                </div>
                <div className="text-xs font-semibold text-slate-200 group-hover:text-cyan-300 transition-colors">
                  {item.question}
                </div>
              </div>

              <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-cyan-400 group-hover:translate-x-0.5 transition-all shrink-0 mt-2" />
            </button>
          );
        })}
      </div>
    </div>
  );
}
