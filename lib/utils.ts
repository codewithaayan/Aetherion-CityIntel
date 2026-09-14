import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatNumber(value: number): string {
  if (value >= 1000000) {
    return (value / 1000000).toFixed(1) + "M";
  }
  if (value >= 1000) {
    return (value / 1000).toFixed(0) + "K";
  }
  return value.toLocaleString();
}

export function getRiskLevel(score: number): {
  label: "LOW" | "MODERATE" | "ELEVATED" | "HIGH" | "CRITICAL";
  color: string;
  badgeBg: string;
  textColor: string;
  borderColor: string;
} {
  if (score < 40) {
    return {
      label: "LOW",
      color: "#10B981",
      badgeBg: "bg-emerald-500/10",
      textColor: "text-emerald-400",
      borderColor: "border-emerald-500/30",
    };
  }
  if (score < 60) {
    return {
      label: "MODERATE",
      color: "#38BDF8",
      badgeBg: "bg-sky-500/10",
      textColor: "text-sky-400",
      borderColor: "border-sky-500/30",
    };
  }
  if (score < 75) {
    return {
      label: "ELEVATED",
      color: "#F59E0B",
      badgeBg: "bg-amber-500/10",
      textColor: "text-amber-400",
      borderColor: "border-amber-500/30",
    };
  }
  if (score < 85) {
    return {
      label: "HIGH",
      color: "#F97316",
      badgeBg: "bg-orange-500/10",
      textColor: "text-orange-400",
      borderColor: "border-orange-500/30",
    };
  }
  return {
    label: "CRITICAL",
    color: "#EF4444",
    badgeBg: "bg-red-500/10",
    textColor: "text-red-400",
    borderColor: "border-red-500/30",
  };
}
