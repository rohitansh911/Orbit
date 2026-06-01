"use client";

import { motion } from "framer-motion";

interface Signal {
  id: number;
  text: string;
  icon: string;
  trend?: "up" | "down" | "neutral";
}

interface MarketSignalsStripProps {
  signals?: Signal[];
  loading?: boolean;
}

const FALLBACK_SIGNALS: Signal[] = [
  { id: 1, text: "Remote engineering roles up 18% this month", icon: "trending_up", trend: "up" },
  { id: 2, text: "System design depth increasingly prioritized", icon: "architecture", trend: "up" },
  { id: 3, text: "AI-integrated portfolios outperform static resumes", icon: "bolt", trend: "up" },
  { id: 4, text: "Full-stack demand remains consistently high", icon: "code", trend: "neutral" },
];

const SIGNAL_STYLES: Record<string, { color: string; bg: string }> = {
  trending_up: { color: "text-green-600", bg: "bg-green-500/10" },
  architecture: { color: "text-muted-indigo", bg: "bg-muted-indigo/10" },
  bolt: { color: "text-soft-lavender", bg: "bg-soft-lavender/15" },
  forum: { color: "text-primary", bg: "bg-primary/10" },
  code: { color: "text-muted-indigo", bg: "bg-muted-indigo/10" },
  school: { color: "text-green-600", bg: "bg-green-500/10" },
  work: { color: "text-primary", bg: "bg-primary/10" },
};

export default function MarketSignalsStrip({ signals, loading }: MarketSignalsStripProps) {
  const displaySignals = signals && signals.length > 0 ? signals : FALLBACK_SIGNALS;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2 px-2">
        <span className="material-symbols-outlined text-[14px] text-muted-indigo" style={{ fontVariationSettings: "'FILL' 1" }}>
          insights
        </span>
        <h3 className="text-[10px] font-black text-muted-indigo tracking-[0.2em] uppercase">Live Market Telemetry</h3>
        {loading && (
          <span className="flex items-center gap-1 ml-2">
            <span className="w-1.5 h-1.5 rounded-full bg-muted-indigo animate-pulse" />
            <span className="text-[9px] text-muted-indigo/60 font-bold uppercase tracking-wider">Calibrating</span>
          </span>
        )}
      </div>

      <div className="flex overflow-x-auto hide-scrollbar gap-4 pb-2 snap-x">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex-shrink-0 w-72 h-[64px] bg-white/40 border border-black/5 rounded-2xl animate-pulse" />
            ))
          : displaySignals.map((signal, i) => {
              const style = SIGNAL_STYLES[signal.icon] || { color: "text-primary", bg: "bg-primary/10" };
              return (
                <motion.div
                  key={signal.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ type: "spring", stiffness: 350, damping: 25, delay: i * 0.1 }}
                  whileHover={{ y: -2, scale: 1.01 }}
                  className="flex-shrink-0 snap-center w-72 p-4 bg-white/40 border border-black/5 rounded-2xl flex items-center gap-4 hover:border-muted-indigo/20 transition-colors shadow-[0_2px_8px_rgba(0,0,0,0.015)] cursor-default"
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${style.bg}`}>
                    <span className={`material-symbols-outlined text-[16px] ${style.color}`} style={{ fontVariationSettings: "'FILL' 1" }}>
                      {signal.icon}
                    </span>
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-semibold text-on-surface leading-snug">{signal.text}</p>
                    {signal.trend === "up" && (
                      <span className="text-[9px] font-bold text-green-600 uppercase tracking-wider">↑ Trending</span>
                    )}
                  </div>
                </motion.div>
              );
            })}
      </div>
    </div>
  );
}
