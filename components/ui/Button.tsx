import React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger" | "glow";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      fullWidth = false,
      leftIcon,
      rightIcon,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "relative inline-flex items-center justify-center font-medium transition-all duration-200 rounded-lg select-none disabled:opacity-50 disabled:pointer-events-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-cyan-400/40";

    const variants = {
      primary:
        "bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-lg shadow-cyan-500/20 border border-cyan-400/30 active:scale-[0.98]",
      secondary:
        "bg-slate-900/80 hover:bg-slate-800/90 text-cyan-300 border border-cyan-500/25 hover:border-cyan-400/50 shadow-md backdrop-blur-sm active:scale-[0.98]",
      outline:
        "bg-transparent hover:bg-cyan-950/30 text-slate-200 hover:text-white border border-slate-700/80 hover:border-cyan-500/40",
      ghost:
        "bg-transparent hover:bg-slate-800/50 text-slate-300 hover:text-cyan-300 border-none",
      danger:
        "bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/40 active:scale-[0.98]",
      glow:
        "bg-cyan-500 text-slate-950 font-semibold shadow-[0_0_20px_rgba(6,182,212,0.6)] hover:shadow-[0_0_30px_rgba(6,182,212,0.85)] hover:bg-cyan-400 border border-cyan-200 active:scale-[0.98]",
    };

    const sizes = {
      sm: "text-xs px-3 py-1.5 gap-1.5 rounded-md",
      md: "text-sm px-4 py-2 gap-2 rounded-lg",
      lg: "text-base px-6 py-3 gap-2.5 rounded-xl font-semibold",
    };

    return (
      <button
        ref={ref}
        className={cn(
          baseStyles,
          variants[variant],
          sizes[size],
          fullWidth && "w-full",
          className
        )}
        disabled={disabled}
        {...props}
      >
        {leftIcon && <span className="inline-flex shrink-0">{leftIcon}</span>}
        <span>{children}</span>
        {rightIcon && <span className="inline-flex shrink-0">{rightIcon}</span>}
      </button>
    );
  }
);

Button.displayName = "Button";
