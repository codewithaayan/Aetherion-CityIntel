"use client";

import React, { useState } from "react";
import { Area } from "@/types/area";
import { AI_KNOWLEDGE_BASE, StructuredAIResponse } from "@/lib/mock-data";
import { AIMessage } from "./AIMessage";
import { SuggestedQuestions } from "./SuggestedQuestions";
import { Sparkles, Send, Bot, User, RefreshCw, AlertCircle, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/Button";

export interface AIChatProps {
  area: Area;
}

export function AIChat({ area }: AIChatProps) {
  const [messages, setMessages] = useState<StructuredAIResponse[]>([
    AI_KNOWLEDGE_BASE["why-heat-risk-high"],
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const handleSelectQuestion = (questionKey: string) => {
    const response = AI_KNOWLEDGE_BASE[questionKey];
    if (!response) return;

    setIsTyping(true);
    setTimeout(() => {
      setMessages((prev) => [...prev, response]);
      setIsTyping(false);
    }, 600);
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const query = inputValue.trim().toLowerCase();
    setInputValue("");
    setIsTyping(true);

    // Smart mock response matcher based on query keywords
    let matchedKey = "why-heat-risk-high";
    if (query.includes("concern") || query.includes("worst") || query.includes("big") || query.includes("priority")) {
      matchedKey = "biggest-environmental-concern";
    } else if (query.includes("exposed") || query.includes("people") || query.includes("who") || query.includes("population")) {
      matchedKey = "who-is-most-exposed";
    } else if (query.includes("help") || query.includes("solution") || query.includes("intervention") || query.includes("tree") || query.includes("cool")) {
      matchedKey = "what-interventions-could-help";
    }

    const matchedResponse = { ...AI_KNOWLEDGE_BASE[matchedKey], question: inputValue.trim() };

    setTimeout(() => {
      setMessages((prev) => [...prev, matchedResponse]);
      setIsTyping(false);
    }, 800);
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* AI Analyst Header */}
      <div className="glass-panel p-6 rounded-2xl border-cyan-500/25 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-400/40 flex items-center justify-center text-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.3)] shrink-0">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-white tracking-tight">
                UrbanPulse AI Analyst
              </h2>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 border border-cyan-700 text-cyan-300 font-bold">
                AETHERION-NLP v2
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Ask questions about your city&apos;s environmental intelligence for{" "}
              <span className="text-cyan-300 font-semibold">{area.name}, {area.city}</span>.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setMessages([AI_KNOWLEDGE_BASE["why-heat-risk-high"]])}
          className="flex items-center gap-1.5 text-xs font-mono text-slate-400 hover:text-cyan-300 transition-colors self-start sm:self-center"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Reset Session</span>
        </button>
      </div>

      {/* AI Welcome Message Banner */}
      <div className="glass-panel p-5 rounded-2xl border-slate-800 flex items-start gap-3 text-slate-300 text-xs sm:text-sm leading-relaxed bg-[#050b1a]/80">
        <Sparkles className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold text-white">System Prompt: </span>
          I&apos;m UrbanPulse AI. I analyze environmental risk data, population exposure and urban patterns to help explain what&apos;s happening in your selected area.
        </div>
      </div>

      {/* Suggested Questions Grid */}
      <SuggestedQuestions onSelectQuestion={handleSelectQuestion} disabled={isTyping} />

      {/* Message Feed */}
      <div className="space-y-6 pt-2">
        {messages.map((resp, idx) => (
          <AIMessage key={idx} response={resp} />
        ))}

        {/* Typing Loading Indicator */}
        {isTyping && (
          <div className="glass-panel p-5 rounded-2xl border-cyan-500/30 flex items-center gap-3 font-mono text-xs text-cyan-300">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
            <span>ANALYZING MULTI-SPECTRAL EMISSIONS & CENSUS OVERLAYS...</span>
          </div>
        )}
      </div>

      {/* Prompt Input Form */}
      <form onSubmit={handleCustomSubmit} className="relative pt-2">
        <div className="relative flex items-center">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={`Ask a question about ${area.name}'s environmental telemetry...`}
            className="w-full bg-[#050a1c] border border-cyan-500/30 focus:border-cyan-400 rounded-xl px-4 py-3.5 pr-28 text-sm text-white placeholder:text-slate-500 shadow-xl focus:outline-none focus:ring-1 focus:ring-cyan-400/50 font-sans"
          />
          <div className="absolute right-2">
            <Button
              type="submit"
              variant="glow"
              size="sm"
              disabled={!inputValue.trim() || isTyping}
              rightIcon={<Send className="w-3.5 h-3.5" />}
            >
              Analyze
            </Button>
          </div>
        </div>
        <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 mt-2 px-1">
          <span>Supported: Heat risk, flooding, demographics, interventions</span>
          <span>Prototype Reasoning Engine</span>
        </div>
      </form>
    </div>
  );
}
