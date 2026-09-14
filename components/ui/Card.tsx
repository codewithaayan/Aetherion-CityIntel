import React from "react";
import { cn } from "@/lib/utils";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  interactive?: boolean;
  glow?: "none" | "cyan" | "emerald" | "amber" | "rose";
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, interactive = false, glow = "none", children, ...props }, ref) => {
    const glowClasses = {
      none: "",
      cyan: "hover:shadow-[0_0_25px_rgba(6,182,212,0.2)] hover:border-cyan-500/40",
      emerald: "hover:shadow-[0_0_25px_rgba(16,185,129,0.2)] hover:border-emerald-500/40",
      amber: "hover:shadow-[0_0_25px_rgba(245,158,11,0.2)] hover:border-amber-500/40",
      rose: "hover:shadow-[0_0_25px_rgba(239,68,68,0.2)] hover:border-rose-500/40",
    };

    return (
      <div
        ref={ref}
        className={cn(
          interactive ? "glass-panel-interactive" : "glass-panel",
          "rounded-2xl p-5 text-slate-100 relative overflow-hidden transition-all duration-300",
          glowClasses[glow],
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = "Card";

export function CardHeader({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("flex flex-col space-y-1.5 pb-4", className)} {...props}>
      {children}
    </div>
  );
}

export function CardTitle({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn("text-base font-semibold tracking-tight text-white flex items-center gap-2", className)}
      {...props}
    >
      {children}
    </h3>
  );
}

export function CardDescription({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={cn("text-xs text-slate-400 leading-relaxed", className)} {...props}>
      {children}
    </p>
  );
}

export function CardContent({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("pt-0", className)} {...props}>{children}</div>;
}

export function CardFooter({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("flex items-center pt-4 border-t border-slate-800/80 mt-4", className)} {...props}>
      {children}
    </div>
  );
}
