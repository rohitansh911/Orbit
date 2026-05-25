"use client";

import { useEffect, useRef } from "react";
import ProgressBar from "@/components/ui/ProgressBar";
import { useUser } from "@/context/UserContext";
import Link from "next/link";

export default function HeroSection() {
  const { profile } = useUser();
  const xp = profile?.stats?.xp || 0;
  const level = profile?.stats?.level || 1;
  const role = profile?.onboardingData?.careerGoal || "Engineer";
  const xpInLevel = xp % 1000;
  const progressPct = Math.round((xpInLevel / 1000) * 100);

  const heroFxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = heroFxRef.current;
    if (!container) return;

    const stardustCount = 45;
    const stars: HTMLDivElement[] = [];

    for (let i = 0; i < stardustCount; i++) {
      const star = document.createElement("div");
      star.className = "stardust-premium";
      star.style.left = `${Math.random() * 100}%`;
      star.style.top = `${Math.random() * 100}%`;
      star.style.animationDelay = `${Math.random() * 8}s`;
      star.style.animationDuration = `${4 + Math.random() * 6}s`;
      container.appendChild(star);
      stars.push(star);
    }

    return () => { stars.forEach((s) => s.remove()); };
  }, []);

  return (
    <section className="relative p-14 md:p-16 rounded-3xl overflow-hidden border-none bg-surface-container/40"
      style={{
        background: "linear-gradient(135deg, rgba(239,237,215,0.9) 0%, rgba(239,237,215,0.6) 100%)",
        backdropFilter: "blur(2px)",
        border: "1px solid rgba(0,0,0,0.03)",
        boxShadow: "0 4px 24px rgba(68,42,34,0.04), 0 1px 0 rgba(255,255,255,0.6) inset, 0 24px 80px rgba(99,102,241,0.06)",
      }}
    >
      {/* Orbital bg */}
      <div className="hero-orbital-bg" ref={heroFxRef} id="hero-fx">
        <svg className="orbital-curve w-[900px] h-[900px] opacity-10" viewBox="0 0 100 100">
          <circle cx="50" cy="50" fill="none" r="48" stroke="#6366f1" strokeWidth="0.05" />
          <ellipse cx="50" cy="50" fill="none" rx="45" ry="20" stroke="#6366f1" strokeWidth="0.08" transform="rotate(45 50 50)" />
          <ellipse cx="50" cy="50" fill="none" rx="40" ry="15" stroke="#6366f1" strokeWidth="0.08" transform="rotate(-30 50 50)" />
        </svg>
        <div className="orbital-curve w-[1200px] h-[1200px] opacity-5" style={{ animationDuration: "180s", animationDirection: "reverse" }}>
          <svg className="w-full h-full" viewBox="0 0 100 100">
            <circle cx="50" cy="50" fill="none" r="49.5" stroke="#6366f1" strokeWidth="0.02" />
          </svg>
        </div>
      </div>

      {/* Content — staggered entrance */}
      <div className="relative z-10 flex flex-col items-center text-center space-y-10">
        {/* Level + quote */}
        <div className="space-y-5 hero-content-1">
          <h1 className="text-5xl md:text-6xl font-black text-on-surface tracking-tighter leading-[0.95] heading-glow">
            Level {level} — Aspiring {role.charAt(0).toUpperCase() + role.slice(1)}
          </h1>
          <p className="text-xl text-on-surface-variant/65 font-medium italic max-w-xl mx-auto leading-relaxed tracking-tight">
            &ldquo;Consistency today compounds into opportunities tomorrow.&rdquo;
          </p>
        </div>

        {/* XP Progress */}
        <div className="w-full max-w-2xl space-y-5 pt-2 hero-content-2">
          <div className="flex justify-between items-end px-2">
            <span className="text-[10px] font-bold text-muted-indigo uppercase tracking-[0.25em]">
              EXP Progression
            </span>
            <span className="text-sm font-black text-primary">{xpInLevel} / 1000 XP</span>
          </div>
          <ProgressBar value={progressPct} height="md" shimmer color="indigo" delay={400} />
          <p className="text-[11px] font-semibold text-on-surface-variant/50 tracking-wide">
            APPROACHING:{" "}
            <span className="text-muted-indigo font-bold">LEVEL {level + 1}</span>
          </p>
        </div>

        {/* CTAs */}
        <div className="flex flex-wrap justify-center gap-4 pt-2 hero-content-3">
          <Link href="/opportunities" className="block outline-none">
            <button
              id="hero-resume-audit"
              className="group relative px-12 py-4 bg-primary text-on-primary font-bold text-sm rounded-2xl active:scale-95 transition-all duration-300 shadow-2xl shadow-primary/25 hover:shadow-primary/45 hover:-translate-y-1.5 overflow-hidden"
            >
              <span className="relative z-10">Resume Audit</span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
            </button>
          </Link>
          
          <Link href="/roadmap" className="block outline-none">
            <button
              id="hero-career-roadmap"
              className="px-12 py-4 glass-acc text-primary font-bold text-sm rounded-2xl active:scale-95 transition-all duration-300 hover:bg-white/75 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-primary/10"
            >
              Career Roadmap
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}
