"use client";

import { motion } from "framer-motion";
import { useEffect, useRef } from "react";

const R = 44;
const CIRCUMFERENCE = 2 * Math.PI * R;

export default function SkillsHero() {
  const heroFxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = heroFxRef.current;
    if (!container) return;

    const particleCount = 20;
    const particles: HTMLDivElement[] = [];

    for (let i = 0; i < particleCount; i++) {
      const p = document.createElement("div");
      p.className = "absolute w-1 h-1 rounded-full bg-muted-indigo opacity-20";
      p.style.left = `${Math.random() * 100}%`;
      p.style.top = `${Math.random() * 100}%`;
      p.style.animation = `shimmer ${3 + Math.random() * 4}s infinite linear`;
      p.style.animationDelay = `${Math.random() * 4}s`;
      p.style.filter = "blur(1px)";
      container.appendChild(p);
      particles.push(p);
    }

    return () => { particles.forEach((p) => p.remove()); };
  }, []);

  const readinessScore = 68;
  const pct = Math.min(readinessScore / 100, 1);
  const targetOffset = CIRCUMFERENCE * (1 - pct);

  return (
    <section className="relative px-10 py-12 md:px-14 md:py-14 rounded-3xl overflow-hidden border-none bg-surface-container/40"
      style={{
        background: "linear-gradient(135deg, rgba(239,237,215,0.9) 0%, rgba(239,237,215,0.6) 100%)",
        backdropFilter: "blur(2px)",
        border: "1px solid rgba(0,0,0,0.03)",
        boxShadow: "0 4px 24px rgba(68,42,34,0.04), 0 1px 0 rgba(255,255,255,0.8) inset, 0 24px 80px rgba(99,102,241,0.04)",
      }}
    >
      {/* Orbital bg */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" ref={heroFxRef}>
        <div className="hero-orbital-bg opacity-70" />
        <svg className="absolute top-1/2 right-0 -translate-y-1/2 translate-x-1/4 w-[600px] h-[600px] opacity-[0.03] hero-ring-pulse" viewBox="0 0 100 100">
          <circle cx="50" cy="50" fill="none" r="48" stroke="#6366f1" strokeWidth="0.05" />
          <ellipse cx="50" cy="50" fill="none" rx="48" ry="20" stroke="#6366f1" strokeWidth="0.08" transform="rotate(20 50 50)" />
          <ellipse cx="50" cy="50" fill="none" rx="36" ry="14" stroke="#a78bfa" strokeWidth="0.06" transform="rotate(-40 50 50)" />
        </svg>
      </div>

      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
        <div className="space-y-4 flex-1">
          <div>
            <p className="text-[10px] font-black text-muted-indigo tracking-[0.35em] uppercase mb-3">
              Capability Analysis
            </p>
            <h1 className="text-4xl md:text-5xl font-black text-on-surface tracking-tighter leading-[0.95] heading-glow">
              Skill Intelligence
            </h1>
          </div>
          
          <div className="flex items-start gap-3 mt-4 p-4 bg-muted-indigo/5 border border-muted-indigo/10 rounded-2xl max-w-lg">
            <span className="material-symbols-outlined text-[18px] text-muted-indigo mt-0.5" style={{ fontVariationSettings: "'FILL' 1" }}>
              auto_awesome
            </span>
            <p className="text-sm font-semibold text-muted-indigo leading-relaxed">
              Frontend systems are compounding steadily. Algorithms remain your lowest confidence zone.
            </p>
          </div>
        </div>

        {/* Confidence Ring */}
        <div className="flex flex-col items-center gap-3 shrink-0 mr-4">
          <div className="relative w-32 h-32 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full bg-muted-indigo/5 blur-xl scale-110 pointer-events-none" />
            
            <svg width="128" height="128" viewBox="0 0 100 100" className="relative z-10 drop-shadow-[0_0_12px_rgba(99,102,241,0.2)] -rotate-90">
              <defs>
                <linearGradient id="heroScoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="rgba(167,139,250,0.9)" />
                  <stop offset="100%" stopColor="rgba(99,102,241,1)" />
                </linearGradient>
              </defs>
              <circle cx="50" cy="50" r={R} fill="none" stroke="rgba(212,195,190,0.15)" strokeWidth="6" />
              <motion.circle
                cx="50"
                cy="50"
                r={R}
                fill="none"
                stroke="url(#heroScoreGradient)"
                strokeWidth="6"
                strokeLinecap="round"
                strokeDasharray={CIRCUMFERENCE}
                initial={{ strokeDashoffset: CIRCUMFERENCE }}
                animate={{ strokeDashoffset: targetOffset }}
                transition={{ duration: 1.5, ease: "easeOut", type: "spring", damping: 20 }}
              />
            </svg>
            
            <div className="absolute inset-0 flex flex-col items-center justify-center pt-1 z-20">
              <motion.span
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring", damping: 20, delay: 0.2 }}
                className="text-4xl font-black text-on-surface tracking-tighter leading-none"
              >
                {readinessScore}
              </motion.span>
              <span className="text-[9px] font-bold text-on-surface-variant/40 tracking-[0.1em] mt-1 uppercase">Readiness</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
