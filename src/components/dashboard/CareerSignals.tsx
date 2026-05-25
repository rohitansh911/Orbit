"use client";

import { motion } from "framer-motion";

const signals = [
  {
    id: 1,
    icon: "visibility",
    title: "High Profile Visibility",
    desc: "3 recruiters viewed profiles with Docker this week.",
    trend: "up",
    color: "text-muted-indigo",
    bg: "bg-muted-indigo/10",
  },
  {
    id: 2,
    icon: "trending_up",
    title: "Skill Demand Rising",
    desc: "Next.js & Turbopack demand rising 24% in Q3 internships.",
    trend: "up",
    color: "text-green-600",
    bg: "bg-green-500/10",
  },
  {
    id: 3,
    icon: "bolt",
    title: "Market Edge",
    desc: "AI-integrated portfolios currently outperform static resumes by 3x.",
    trend: "neutral",
    color: "text-soft-lavender",
    bg: "bg-soft-lavender/15",
  },
];

export default function CareerSignals() {
  return (
    <div className="premium-card rounded-3xl p-8">
      <div className="flex items-center gap-3 mb-8">
        <div className="relative">
          <span className="material-symbols-outlined text-[20px] text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>
            satellite_alt
          </span>
          <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500 border border-white"></span>
          </span>
        </div>
        <div>
          <h2 className="text-xl font-extrabold text-primary tracking-tight">Career Signals</h2>
          <p className="text-xs font-medium text-on-surface-variant/60">Live recruitment & market telemetry</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {signals.map((signal, i) => (
          <motion.div
            key={signal.id}
            whileHover={{ y: -4, scale: 1.01 }}
            className="p-5 rounded-2xl bg-white/40 border border-black/5 shadow-sm transition-all hover:border-muted-indigo/20 hover:shadow-[0_8px_24px_rgba(99,102,241,0.05)] cursor-default group"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${signal.bg} transition-transform group-hover:scale-110`}>
                <span className={`material-symbols-outlined text-[16px] ${signal.color}`} style={{ fontVariationSettings: "'FILL' 1" }}>
                  {signal.icon}
                </span>
              </div>
              <h3 className="font-bold text-sm text-on-surface leading-tight">{signal.title}</h3>
            </div>
            <p className="text-xs text-on-surface-variant/70 font-medium leading-relaxed">
              {signal.desc}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
