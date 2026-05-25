"use client";

import { useUser } from "@/context/UserContext";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function MomentumEngine() {
  const { profile } = useUser();
  const momentumScore = profile?.stats?.momentumScore || 0;
  // Compute energy state simply based on momentum
  const energyState = momentumScore > 60 ? "hyper" : momentumScore > 30 ? "flow" : "calm";
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  // Animate the orb dashoffset based on energy state
  const R = 75;
  const CIRCUMFERENCE = 2 * Math.PI * R;
  const pct = Math.min(momentumScore / 100, 1);
  const targetOffset = CIRCUMFERENCE * (1 - pct);

  const ringVariants: any = {
    calm: { strokeDashoffset: targetOffset, transition: { duration: 1.5, ease: "easeOut" } },
    flow: { strokeDashoffset: targetOffset, transition: { duration: 1.2, ease: "easeOut" } },
    hyper: { strokeDashoffset: targetOffset, transition: { duration: 0.8, ease: "easeOut", type: "spring", damping: 15 } },
  };

  if (!mounted) return null;

  return (
    <div className="premium-card rounded-3xl p-8 space-y-8 relative overflow-hidden h-full flex flex-col justify-between">
      {/* Background Glow */}
      <div className="absolute top-[-50%] right-[-10%] w-[150%] h-[150%] bg-gradient-to-br from-transparent via-muted-indigo/5 to-transparent rotate-12 pointer-events-none" />

      {/* Header */}
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-2">
          <p className="text-[10px] font-black text-muted-indigo tracking-[0.35em] uppercase">
            Orbit Engine
          </p>
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              {energyState === "hyper" && (
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-muted-indigo opacity-75"></span>
              )}
              <span className={`relative inline-flex rounded-full h-2 w-2 ${energyState === "hyper" ? "bg-muted-indigo" : energyState === "flow" ? "bg-soft-lavender" : "bg-outline-variant/40"}`}></span>
            </span>
            <span className="text-[10px] font-bold text-on-surface-variant/60 uppercase tracking-widest">
              {energyState} state
            </span>
          </div>
        </div>
        <h2 className="text-2xl font-extrabold text-primary tracking-tight">Career Momentum</h2>
      </div>

      {/* Circular Momentum Orb */}
      <div className="relative flex-1 flex items-center justify-center mt-4">
        <div className="relative w-48 h-48 flex items-center justify-center">
          {/* Subtle background glow */}
          <div className="absolute inset-0 rounded-full bg-muted-indigo/5 blur-xl scale-110" />
          
          <svg width="192" height="192" viewBox="0 0 160 160" className="relative z-10 drop-shadow-[0_0_12px_rgba(99,102,241,0.25)] -rotate-90">
            <defs>
              <linearGradient id="orbGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="rgba(167,139,250,0.9)" />
                <stop offset="100%" stopColor="rgba(99,102,241,1)" />
              </linearGradient>
            </defs>
            {/* Track */}
            <circle cx="80" cy="80" r={R} fill="none" stroke="rgba(212,195,190,0.15)" strokeWidth="8" />
            {/* Animated Fill */}
            <motion.circle
              cx="80"
              cy="80"
              r={R}
              fill="none"
              stroke="url(#orbGradient)"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={CIRCUMFERENCE}
              initial={{ strokeDashoffset: CIRCUMFERENCE }}
              animate={energyState}
              variants={ringVariants}
            />
          </svg>
          
          {/* Centered Score */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pt-1 z-20">
            <motion.span
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", damping: 20 }}
              className="text-5xl font-black text-on-surface tracking-tighter leading-none"
            >
              {momentumScore}
            </motion.span>
          </div>
        </div>
      </div>

      {/* Footer Insight */}
      <div className="relative z-10 pt-4 border-t border-black/5 flex items-center gap-3">
        <span className="material-symbols-outlined text-[18px] text-muted-indigo" style={{ fontVariationSettings: "'FILL' 1" }}>
          insights
        </span>
        <p className="text-xs font-medium text-on-surface-variant/70 leading-snug">
          Execution trajectory is <span className="font-bold text-muted-indigo">accelerating</span>.
          Keep shipping.
        </p>
      </div>
    </div>
  );
}
