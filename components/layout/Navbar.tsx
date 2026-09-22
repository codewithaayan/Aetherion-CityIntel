"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Activity, Menu, X, Globe, Sparkles, ArrowRight, Layers, Sliders } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

export function Navbar() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Explore", href: "/explore", icon: Globe },
    { name: "Intelligence", href: "/explore", icon: Layers },
    { name: "Simulator", href: "/explore", icon: Sliders },
    { name: "AI Analyst", href: "/explore", icon: Sparkles },
    { name: "Methodology", href: "/methodology" },
    { name: "About", href: "/about" },
  ];

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b",
        isScrolled
          ? "bg-[#050914]/85 backdrop-blur-xl border-cyan-500/20 shadow-lg shadow-black/40 py-3"
          : "bg-[#030712]/60 backdrop-blur-md border-slate-800/60 py-4"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="relative flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500/20 via-blue-600/30 to-indigo-900/40 border border-cyan-400/40 group-hover:border-cyan-400 transition-all shadow-[0_0_15px_rgba(6,182,212,0.25)]">
              <Activity className="w-5 h-5 text-cyan-400 transition-transform group-hover:scale-110" />
              <span className="absolute -top-1 -right-1 flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
              </span>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="text-lg font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-100 to-cyan-200">
                  UrbanPulse
                </span>
                <span className="text-[9px] font-mono font-bold tracking-wider px-1.5 py-0.5 rounded bg-cyan-500/15 border border-cyan-500/30 text-cyan-300">
                  v2.4
                </span>
              </div>
              <span className="text-[10px] tracking-wider text-slate-400 font-mono uppercase">
                Climate Intelligence
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-900/40 border border-slate-800/80 rounded-full px-3 py-1 backdrop-blur-md">
            {navLinks.map((link) => {
              const isActive =
                link.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(link.href.split("/")[1] ? `/${link.href.split("/")[1]}` : link.href);

              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={cn(
                    "px-3.5 py-1.5 rounded-full text-xs font-medium transition-all duration-200 flex items-center gap-1.5",
                    isActive
                      ? "bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 shadow-[0_0_12px_rgba(6,182,212,0.15)]"
                      : "text-slate-300 hover:text-white hover:bg-slate-800/60"
                  )}
                >
                  {link.icon && <link.icon className="w-3.5 h-3.5 text-cyan-400/80" />}
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Action CTA & Mobile Menu Toggle */}
          <div className="flex items-center gap-3">
            <Link href="/explore" className="hidden sm:inline-flex">
              <Button
                variant="primary"
                size="sm"
                rightIcon={<ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />}
              >
                Explore Your City
              </Button>
            </Link>

            {/* Mobile hamburger */}
            <button
              type="button"
              className="md:hidden p-2 text-slate-400 hover:text-white rounded-lg bg-slate-900/80 border border-slate-800"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-800 bg-[#060b19]/95 backdrop-blur-2xl px-4 pt-3 pb-5 space-y-2 animate-in slide-in-from-top-3 duration-200">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className={cn(
                "flex items-center gap-2.5 px-3.5 py-2 rounded-lg text-sm font-medium transition-colors",
                pathname === link.href
                  ? "bg-cyan-500/15 text-cyan-300 border border-cyan-500/30"
                  : "text-slate-300 hover:bg-slate-800/70 hover:text-white"
              )}
            >
              {link.icon && <link.icon className="w-4 h-4 text-cyan-400" />}
              <span>{link.name}</span>
            </Link>
          ))}
          <div className="pt-2">
            <Link href="/explore" onClick={() => setMobileMenuOpen(false)}>
              <Button variant="primary" fullWidth size="sm">
                Explore Your City →
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
