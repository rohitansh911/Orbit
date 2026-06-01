"use client";

import { motion } from "framer-motion";
import { useEffect, useRef } from "react";
import { useUser } from "@/context/UserContext";
import { useOrbitStore } from "@/lib/store";

interface OpportunitiesHeroProps {
  marketSignals?: any[];
  aiLoading?: boolean;
}

export default function OpportunitiesHero({ marketSignals, aiLoading }: OpportunitiesHeroProps) {
  const heroFxRef = useRef<HTMLDivElement>(null);
  const { profile } = useUser();
  const { missions } = useOrbitStore();

  useEffect(() => {
    const container = heroFxRef.current;
    if (!container) return;
    const particleCount = 15;
    const particles: HTMLDivElement[] = [];
    for (let i = 0; i < particleCount; i++) {
      const p = document.createElement("div");
      p.className = "absolute w-1 h-1 rounded-full bg-soft-lavender opacity-30";
      p.style.left = `${Math.random() * 100}%`;
      p.style.top = `${Math.random() * 100}%`;
      p.style.animation = `shimmer ${4 + Math.random() * 5}s infinite linear`;
      p.style.animationDelay = `${Math.random() * 3}s`;
      p.style.filter = "blur(1.5px)";
      container.appendChild(p);
      particles.push(p);
    }
    return () => { particles.forEach((p) => p.remove()); };
  }, []);

  // Compute real readiness from profile + mission activity
  const stats = profile?.stats;
  const completedMissions = missions.filter((m: any) => m.status === "completed").length;
  const streak = stats?.streak || 0;
  const momentumScore = stats?.momentumScore || 0;
  const level = stats?.level || 1;

  // Readiness: blend of streak, missions, level, momentum (0–100)
  const readiness = Math.min(
    Math.round((streak * 3) + (completedMissions * 4) + (level * 5) + (momentumScore * 0.3) + 20),
    99
  );

  // Weekly momentum delta from XP
  const xp = stats?.xp || 0;
  const weeklyMomentum = Math.min(Math.round(xp / 50), 99);

  // Dynamic insight from first market signal or profile
  const targetRole = profile?.onboardingData?.careerGoal || "Software Engineer";
  const primarySkill = profile?.onboardingData?.skills?.[0] || "Engineering";
  const topSignal = marketSignals?.[0];

  const insightText = topSignal
    ? `${topSignal.text}. Your ${primarySkill} trajectory aligns strongly with current hiring demand for ${targetRole} roles.`
    : `${primarySkill} + AI hybrid internships continue to surge. Your trajectory as a ${targetRole} aligns with current market demand.`;

  // Orbital labels from user's skills
  const skills = profile?.onboardingData?.skills || ["FRONTEND", "AI", "PRODUCT"];
  const orbitLabels = [skills[0] || "FRONTEND", skills[1] || "AI", skills[2] || "PRODUCT"].map((s: string) =>
    s.toUpperCase().substring(0, 8)
  );

  return (
    <section className="relative px-10 py-12 md:px-14 md:py-14 rounded-3xl overflow-hidden border-none bg-surface-container/40"
      style={{
        background: "linear-gradient(135deg, rgba(239,237,215,0.9) 0%, rgba(239,237,215,0.6) 100%)",
        backdropFilter: "blur(2px)",
        border: "1px solid rgba(0,0,0,0.05)",
        boxShadow: "0 4px 24px rgba(68,42,34,0.04), 0 1px 0 rgba(255,255,255,0.8) inset, 0 24px 80px rgba(167,139,250,0.05)",
      }}
    >
      <div className="absolute inset-0 pointer-events-none overflow-hidden" ref={heroFxRef}>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(167,139,250,0.08)_0%,transparent_60%)]" />
      </div>

      <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12">
        {/* LEFT COLUMN */}
        <div className="space-y-6 flex-1 max-w-2xl">
          <div>
            <p className="text-[10px] font-black text-soft-lavender tracking-[0.35em] uppercase mb-3">
              Predictive Scouting
            </p>
            <h1 className="text-4xl md:text-5xl font-black text-on-surface tracking-tighter leading-[0.95] drop-shadow-sm">
              Market Opportunities
            </h1>
          </div>

          <div className="flex items-start gap-4 p-5 bg-white/40 border border-black/5 rounded-2xl shadow-sm">
            <span className="material-symbols-outlined text-[22px] text-muted-indigo mt-0.5" style={{ fontVariationSettings: "'FILL' 1" }}>
              satellite_alt
            </span>
            {aiLoading ? (
              <div className="flex-1 space-y-2">
                <div className="h-3 bg-on-surface/5 rounded-full w-3/4 animate-pulse" />
                <div className="h-3 bg-on-surface/5 rounded-full w-1/2 animate-pulse" />
              </div>
            ) : (
              <p className="text-sm font-semibold text-on-surface-variant/80 leading-relaxed">{insightText}</p>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-6 pt-2">
            <div>
              <p className="text-3xl font-black text-on-surface leading-none">
                {readiness}<span className="text-lg text-on-surface-variant/40">%</span>
              </p>
              <p className="text-[9px] font-bold text-on-surface-variant/40 uppercase tracking-[0.1em] mt-1">Opportunity Readiness</p>
            </div>
            <div className="w-px h-10 bg-outline-variant/20" />
            <div>
              <p className="text-3xl font-black text-green-600 leading-none drop-shadow-[0_0_8px_rgba(22,163,74,0.3)]">
                +{weeklyMomentum}<span className="text-lg text-green-600/50">%</span>
              </p>
              <p className="text-[9px] font-bold text-on-surface-variant/40 uppercase tracking-[0.1em] mt-1">Weekly Momentum</p>
            </div>
            <div className="w-px h-10 bg-outline-variant/20" />
            <div>
              <p className="text-3xl font-black text-muted-indigo leading-none">{level}</p>
              <p className="text-[9px] font-bold text-on-surface-variant/40 uppercase tracking-[0.1em] mt-1">Career Level</p>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN - Orbital Visualization with real skill labels */}
        <div className="relative w-64 h-64 md:w-80 md:h-80 flex items-center justify-center shrink-0">
          <div className="absolute inset-0 rounded-full bg-soft-lavender/5 blur-[32px] scale-125 pointer-events-none" />
          <svg className="absolute w-full h-full opacity-60" viewBox="0 0 200 200">
            <circle cx="100" cy="100" r="10" fill="rgba(167,139,250,0.2)" className="animate-ping" style={{ animationDuration: "3s" }} />
            <circle cx="100" cy="100" r="4" fill="rgba(99,102,241,1)" />
            {/* Orbit 1 */}
            <circle cx="100" cy="100" r="45" fill="none" stroke="rgba(167,139,250,0.3)" strokeWidth="1" strokeDasharray="4 4" />
            <motion.g animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }} style={{ originX: "100px", originY: "100px" }}>
              <circle cx="145" cy="100" r="3" fill="#6366f1" className="drop-shadow-[0_0_4px_#6366f1]" />
              <text x="152" y="102" fontSize="7" fontWeight="bold" fill="rgba(68,42,34,0.6)" letterSpacing="1">{orbitLabels[0]}</text>
            </motion.g>
            {/* Orbit 2 */}
            <circle cx="100" cy="100" r="70" fill="none" stroke="rgba(99,102,241,0.2)" strokeWidth="1" />
            <motion.g animate={{ rotate: -360 }} transition={{ duration: 30, repeat: Infinity, ease: "linear" }} style={{ originX: "100px", originY: "100px" }}>
              <circle cx="100" cy="30" r="4" fill="#a78bfa" className="drop-shadow-[0_0_6px_#a78bfa]" />
              <text x="108" y="32" fontSize="7" fontWeight="bold" fill="rgba(68,42,34,0.6)" letterSpacing="1">{orbitLabels[1]}</text>
            </motion.g>
            {/* Orbit 3 */}
            <circle cx="100" cy="100" r="90" fill="none" stroke="rgba(167,139,250,0.15)" strokeWidth="0.5" />
            <motion.g animate={{ rotate: 360 }} transition={{ duration: 40, repeat: Infinity, ease: "linear" }} style={{ originX: "100px", originY: "100px" }}>
              <circle cx="10" cy="100" r="2.5" fill="#6366f1" />
              <text x="16" y="102" fontSize="7" fontWeight="bold" fill="rgba(68,42,34,0.4)" letterSpacing="1">{orbitLabels[2]}</text>
            </motion.g>
          </svg>
        </div>
      </div>
    </section>
  );
}
