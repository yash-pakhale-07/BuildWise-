"use client";

import Link from "next/link";
import { Sparkles, LayoutDashboard, Compass, Cpu, Bot } from "lucide-react";

export default function Navbar() {
  return (
    <nav className="glass-panel sticky top-0 z-50 border-b border-border/50 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary via-secondary to-accent flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="text-xl font-bold bg-gradient-to-r from-white via-slate-200 to-indigo-200 bg-clip-text text-transparent">
              BuildWise
            </span>
            <span className="block text-[10px] uppercase tracking-widest text-accent font-semibold">
              Research & Innovation Copilot
            </span>
          </div>
        </Link>

        <div className="flex items-center gap-6 text-sm font-medium text-slate-300">
          <Link href="/" className="flex items-center gap-2 hover:text-white transition-colors">
            <Compass className="w-4 h-4 text-primary" />
            <span>Idea Intake</span>
          </Link>
          <Link href="/dashboard" className="flex items-center gap-2 hover:text-white transition-colors">
            <LayoutDashboard className="w-4 h-4 text-secondary" />
            <span>Dashboard</span>
          </Link>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface/80 border border-border text-xs text-slate-400">
            <Bot className="w-3.5 h-3.5 text-accent animate-pulse" />
            <span>iNSIGHTS Layer 2 Enabled</span>
          </div>
        </div>
      </div>
    </nav>
  );
}
