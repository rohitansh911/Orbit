"use client";

import { motion } from "framer-motion";

const marketData = [
  { id: 1, title: "Next.js demand up 24%", type: "rising", icon: "trending_up", color: "text-green-600", bg: "bg-green-500/10" },
  { id: 2, title: "Docker in 68% of internships", type: "standard", icon: "anchor", color: "text-muted-indigo", bg: "bg-muted-indigo/10" },
  { id: 3, title: "System Design interviews increasing for Junior roles", type: "trend", icon: "architecture", color: "text-soft-lavender", bg: "bg-soft-lavender/15" },
];

export default function MarketSignalsPanel() {
  return (
    <div className="premium-card rounded-3xl p-8 h-full">
      <div className="flex items-center gap-2 mb-6">
        <span className="material-symbols-outlined text-[18px] text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>
          cell_tower
        </span>
        <h2 className="text-xl font-extrabold text-primary tracking-tight">Market Signals</h2>
      </div>

      <div className="space-y-4">
        {marketData.map((signal, i) => (
          <motion.div
            key={signal.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1, type: "spring", damping: 20 }}
            className="flex items-center gap-4 p-4 rounded-2xl bg-white/40 border border-black/5 shadow-sm"
          >
            <div className={`w-10 h-10 shrink-0 rounded-xl flex items-center justify-center ${signal.bg}`}>
              <span className={`material-symbols-outlined text-[18px] ${signal.color}`} style={{ fontVariationSettings: "'FILL' 1" }}>
                {signal.icon}
              </span>
            </div>
            <p className="text-sm font-semibold text-on-surface leading-snug">
              {signal.title}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
