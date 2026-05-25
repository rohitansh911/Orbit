"use client";

import { motion } from "framer-motion";

const signals = [
  { id: 1, text: "Next.js demand up 24%", icon: "trending_up", color: "text-green-600", bg: "bg-green-500/10" },
  { id: 2, text: "System Design interviews increasing", icon: "architecture", color: "text-muted-indigo", bg: "bg-muted-indigo/10" },
  { id: 3, text: "AI portfolios outperform static resumes", icon: "bolt", color: "text-soft-lavender", bg: "bg-soft-lavender/15" },
  { id: 4, text: "Communication skills valued higher", icon: "forum", color: "text-primary", bg: "bg-primary/10" },
];

export default function MarketSignalsStrip() {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2 px-2">
        <span className="material-symbols-outlined text-[14px] text-muted-indigo" style={{ fontVariationSettings: "'FILL' 1" }}>
          insights
        </span>
        <h3 className="text-[10px] font-black text-muted-indigo tracking-[0.2em] uppercase">Live Market Telemetry</h3>
      </div>
      
      <div className="flex overflow-x-auto hide-scrollbar gap-4 pb-2 snap-x">
        {signals.map((signal, i) => (
          <motion.div
            key={signal.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ type: "spring", stiffness: 350, damping: 25, delay: i * 0.1 }}
            whileHover={{ y: -2, scale: 1.01 }}
            className="flex-shrink-0 snap-center w-72 p-4 bg-white/40 border border-black/5 rounded-2xl flex items-center gap-4 hover:border-muted-indigo/20 transition-colors shadow-[0_2px_8px_rgba(0,0,0,0.015)] cursor-default"
          >
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${signal.bg}`}>
              <span className={`material-symbols-outlined text-[16px] ${signal.color}`} style={{ fontVariationSettings: "'FILL' 1" }}>
                {signal.icon}
              </span>
            </div>
            <p className="text-xs font-semibold text-on-surface leading-snug">
              {signal.text}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
