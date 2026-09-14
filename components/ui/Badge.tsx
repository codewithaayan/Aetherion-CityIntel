import React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "low" | "moderate" | "elevated" | "high" | "critical" | "cyan" | "neutral" | "outline";
  size?: "sm" | "md";
  dot?: boolean;
}

export function Badge({
  className,
  variant = "neutral",
  size = "md",
  dot = false,
  children,
  ...props
}: BadgeProps) {
  const variantStyles = {
    low: "bg-emerald-500/10 text-emerald-300 border-emerald-500/25",
    moderate: "bg-sky-500/10 text-sky-300 border-sky-500/25",
    elevated: "bg-amber-500/10 text-amber-300 border-amber-500/25",
    high: "bg-orange-500/10 text-orange-300 border-orange-500/30",
    critical: "bg-red-500/15 text-red-300 border-red-500/35 animate-pulse",
    cyan: "bg-cyan-500/10 text-cyan-300 border-cyan-500/30",
    neutral: "bg-slate-800/60 text-slate-300 border-slate-700/60",
    outline: "bg-transparent text-slate-300 border-slate-700",
  };

  const dotColors = {
    low: "bg-emerald-400",
    moderate: "bg-sky-400",
    elevated: "bg-amber-400",
    high: "bg-orange-400",
    critical: "bg-red-400",
    cyan: "bg-cyan-400",
    neutral: "bg-slate-400",
    outline: "bg-slate-400",
  };

  const sizeStyles = {
    sm: "text-[10px] px-2 py-0.5 tracking-wider font-mono uppercase",
    md: "text-xs px-2.5 py-1 tracking-wide font-medium",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border select-none font-mono",
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      {...props}
    >
      {dot && <span className={cn("w-1.5 h-1.5 rounded-full shrink-0", dotColors[variant])} />}
      {children}
    </span>
  );
}
