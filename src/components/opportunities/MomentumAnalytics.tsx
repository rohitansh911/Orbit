"use client";

import { motion } from "framer-motion";

export default function MomentumAnalytics() {
  return (
    <div className="bg-white/40 border border-black/5 rounded-[24px] p-6 shadow-sm flex flex-col md:flex-row gap-6 md:gap-10 items-center justify-between w-full relative overflow-hidden">
      {/* Ambient background accent */}
      <div className="absolute top-0 right-0 w-64 h-full bg-[radial-gradient(ellipse_at_top_right,rgba(99,102,241,0.05)_0%,transparent_70%)] pointer-events-none" />

      <div className="flex items-center gap-3 shrink-0">
        <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center border border-primary/10">
          <span className="material-symbols-outlined text-[20px] text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>
            monitoring
          </span>
        </div>
        <div>
          <h3 className="text-sm font-bold text-on-surface">Momentum Analytics</h3>
          <p className="text-[10px] font-bold text-on-surface-variant/50 uppercase tracking-[0.1em]">Trailing 7 Days</p>
        </div>
      </div>

      <div className="w-px h-10 bg-outline-variant/20 hidden md:block" />

      <div className="flex-1 grid grid-cols-2 lg:grid-cols-4 gap-6 w-full">
        <div>
          <div className="flex justify-between items-baseline mb-2">
            <span className="text-[10px] font-bold text-on-surface-variant/60 tracking-wider">APPS / WK</span>
            <span className="text-[10px] font-black text-green-600">+2</span>
          </div>
          <div className="flex items-end gap-2">
            <span className="text-2xl font-black text-on-surface leading-none">14</span>
            <div className="h-1.5 flex-1 bg-outline-variant/10 rounded-full overflow-hidden mb-1">
              <motion.div initial={{ width: 0 }} animate={{ width: "70%" }} transition={{ duration: 1 }} className="h-full bg-muted-indigo rounded-full" />
            </div>
          </div>
        </div>

        <div>
          <div className="flex justify-between items-baseline mb-2">
            <span className="text-[10px] font-bold text-on-surface-variant/60 tracking-wider">RESPONSE RATE</span>
            <span className="text-[10px] font-black text-muted-indigo">TOP 10%</span>
          </div>
          <div className="flex items-end gap-2">
            <span className="text-2xl font-black text-on-surface leading-none">28<span className="text-xs text-on-surface-variant/50">%</span></span>
            <div className="h-4 w-full flex items-end gap-0.5 mb-0.5 opacity-60">
              {/* Sparkline approximation */}
              <motion.div initial={{ height: "20%" }} animate={{ height: "40%" }} transition={{ delay: 0.1 }} className="flex-1 bg-muted-indigo/40 rounded-sm" />
              <motion.div initial={{ height: "20%" }} animate={{ height: "60%" }} transition={{ delay: 0.2 }} className="flex-1 bg-muted-indigo/60 rounded-sm" />
              <motion.div initial={{ height: "20%" }} animate={{ height: "30%" }} transition={{ delay: 0.3 }} className="flex-1 bg-muted-indigo/40 rounded-sm" />
              <motion.div initial={{ height: "20%" }} animate={{ height: "80%" }} transition={{ delay: 0.4 }} className="flex-1 bg-muted-indigo rounded-sm" />
            </div>
          </div>
        </div>

        <div>
          <div className="flex justify-between items-baseline mb-2">
            <span className="text-[10px] font-bold text-on-surface-variant/60 tracking-wider">VISIBILITY</span>
            <span className="text-[10px] font-black text-green-600">+12%</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-2xl font-black text-on-surface leading-none">842</span>
            <span className="text-[10px] font-semibold text-on-surface-variant/50 leading-tight">recruiter<br/>impressions</span>
          </div>
        </div>

        <div>
          <div className="flex justify-between items-baseline mb-2">
            <span className="text-[10px] font-bold text-on-surface-variant/60 tracking-wider">VELOCITY</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded-full border border-soft-lavender/30 flex items-center justify-center">
              <span className="w-2 h-2 rounded-full bg-soft-lavender animate-pulse" />
            </div>
            <span className="text-[11px] font-bold text-on-surface-variant/70">Moving rapidly through screening</span>
          </div>
        </div>
      </div>
    </div>
  );
}
