"use client";

import { useEffect, useRef, useState } from "react";
import { MOTIVATIONAL_MESSAGES, WEEKLY_DATA } from "./data";

interface MissionsHeroProps {
  totalXP: number;
  earnedXP: number;
  streak: number;
  completedCount: number;
  totalCount: number;
}

const DAILY_TARGET = 500;
const R = 52;
const CIRCUMFERENCE = 2 * Math.PI * R;

export default function MissionsHero({
  totalXP,
  earnedXP,
  streak,
  completedCount,
  totalCount,
}: MissionsHeroProps) {
  const [msgIdx, setMsgIdx] = useState(0);
  const [msgKey, setMsgKey] = useState(0);
  const fillRef = useRef<SVGCircleElement>(null);

  // Rotate motivational messages every 4s
  useEffect(() => {
    const t = setInterval(() => {
      setMsgIdx((i) => (i + 1) % MOTIVATIONAL_MESSAGES.length);
      setMsgKey((k) => k + 1);
    }, 4000);
    return () => clearInterval(t);
  }, []);

  // Animate progress ring on mount + earnedXP change
  useEffect(() => {
    const el = fillRef.current;
    if (!el) return;
    const pct = Math.min(earnedXP / DAILY_TARGET, 1);
    el.style.strokeDashoffset = String(CIRCUMFERENCE * (1 - pct));
  }, [earnedXP]);

  // Set initial dasharray
  useEffect(() => {
    const el = fillRef.current;
    if (!el) return;
    el.style.strokeDasharray = String(CIRCUMFERENCE);
    el.style.strokeDashoffset = String(CIRCUMFERENCE); // start at 0%
    // Animate in after paint
    const raf = requestAnimationFrame(() => {
      setTimeout(() => {
        const pct = Math.min(earnedXP / DAILY_TARGET, 1);
        el.style.strokeDashoffset = String(CIRCUMFERENCE * (1 - pct));
      }, 200);
    });
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const pct = Math.round((earnedXP / DAILY_TARGET) * 100);

  return (
    <section className="relative rounded-3xl overflow-hidden px-10 py-12 md:px-16 md:py-14 hero-content-1"
      style={{
        background: "linear-gradient(135deg, rgba(239,237,215,0.95) 0%, rgba(239,237,215,0.7) 100%)",
        border: "1px solid rgba(212,195,190,0.4)",
        boxShadow: "0 4px 24px rgba(68,42,34,0.04), inset 0 1px 0 rgba(255,255,255,0.65), 0 0 60px rgba(99,102,241,0.05)",
      }}
    >
      {/* Orbital rings bg (just gradient, SVG lines moved to target ring) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="hero-orbital-bg" />
      </div>

      <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-10">
        {/* Left — headline + message */}
        <div className="space-y-5 flex-1">
          <div>
            <p className="text-[10px] font-black text-muted-indigo tracking-[0.35em] uppercase mb-3">
              Daily Trajectory
            </p>
            <h1 className="text-5xl md:text-6xl font-black text-on-surface tracking-tighter leading-[0.92] heading-glow">
              Today&apos;s<br />
              <span className="text-muted-indigo">trajectory.</span>
            </h1>
          </div>
          <p className="text-base text-on-surface-variant/55 font-medium max-w-xs leading-relaxed">
            Small missions compound into big opportunities.
          </p>

          {/* Rotating orbit message */}
          <div className="flex items-center gap-3 pt-1">
            <div className="w-1.5 h-1.5 rounded-full bg-muted-indigo breathing-core" />
            <p key={msgKey} className="msg-swap text-sm font-bold text-muted-indigo">
              {MOTIVATIONAL_MESSAGES[msgIdx]}
            </p>
          </div>

          {/* Stats row */}
          <div className="flex items-center gap-8 pt-4">
            {/* Streak */}
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px] text-muted-indigo" style={{ fontVariationSettings: "'FILL' 1" }}>local_fire_department</span>
                <span className="text-2xl font-black text-primary">{streak}</span>
              </div>
              <p className="text-[10px] font-bold text-on-surface-variant/40 uppercase tracking-widest">Day Streak</p>
            </div>

            <div className="w-px h-10 bg-outline-variant/30" />

            {/* XP earned today */}
            <div className="space-y-0.5">
              <p className="text-2xl font-black text-primary">{earnedXP}<span className="text-base font-semibold text-on-surface-variant/40"> / {DAILY_TARGET}</span></p>
              <p className="text-[10px] font-bold text-on-surface-variant/40 uppercase tracking-widest">XP Today</p>
            </div>

            <div className="w-px h-10 bg-outline-variant/30" />

            {/* Missions done */}
            <div className="space-y-0.5">
              <p className="text-2xl font-black text-primary">{completedCount}<span className="text-base font-semibold text-on-surface-variant/40"> / {totalCount}</span></p>
              <p className="text-[10px] font-bold text-on-surface-variant/40 uppercase tracking-widest">Missions</p>
            </div>
          </div>
        </div>

        {/* Right — Progress ring */}
        <div className="flex flex-col items-center gap-6 shrink-0">
          <div className="relative flex items-center justify-center">
            {/* Centered atmospheric orbital lines */}
            <svg className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] h-[340px] opacity-[0.035] hero-ring-pulse pointer-events-none" viewBox="0 0 100 100">
              <circle cx="50" cy="50" fill="none" r="48" stroke="#6366f1" strokeWidth="0.08" />
              <ellipse cx="50" cy="50" fill="none" rx="48" ry="20" stroke="#6366f1" strokeWidth="0.08" transform="rotate(20 50 50)" />
              <ellipse cx="50" cy="50" fill="none" rx="36" ry="14" stroke="#a78bfa" strokeWidth="0.06" transform="rotate(-40 50 50)" />
              
              {/* Subtle floating particles */}
              <circle cx="50" cy="2" r="0.6" fill="#6366f1" opacity="0.6" />
              <circle cx="8" cy="65" r="0.4" fill="#a78bfa" opacity="0.4" />
              <circle cx="92" cy="40" r="0.5" fill="#6366f1" opacity="0.5" />
              <circle cx="35" cy="90" r="0.7" fill="#a78bfa" opacity="0.3" />
            </svg>

            {/* Outer glow ring */}
            <div className="absolute inset-0 rounded-full bg-muted-indigo/5 scale-110 blur-[24px] pointer-events-none" />

            <svg width="140" height="140" viewBox="0 0 140 140" className="relative z-10">
              {/* Track */}
              <circle className="progress-ring-track" cx="70" cy="70" r={R} strokeWidth="8" />
              {/* Fill */}
              <circle
                ref={fillRef}
                className="progress-ring-fill"
                cx="70"
                cy="70"
                r={R}
                strokeWidth="8"
                strokeDasharray={CIRCUMFERENCE}
                strokeDashoffset={CIRCUMFERENCE}
              />
              {/* Center content */}
              <text x="70" y="62" textAnchor="middle" className="text-primary" style={{ fill: "#1b1d0e", fontFamily: "Geist, sans-serif", fontSize: "22px", fontWeight: 900 }}>
                {pct}%
              </text>
              <text x="70" y="80" textAnchor="middle" style={{ fill: "rgba(80,68,65,0.45)", fontFamily: "Geist, sans-serif", fontSize: "9px", fontWeight: 700, letterSpacing: "0.15em" }}>
                DAILY TARGET
              </text>
            </svg>
          </div>

          {/* Weekly mini-heatmap */}
          <div className="flex items-end gap-1.5">
            {WEEKLY_DATA.map((d) => {
              const maxXP = 310;
              const h = d.status === "today" ? 20 : d.xp > 0 ? 8 + Math.round((d.xp / maxXP) * 20) : 8;
              const bg =
                d.status === "today"    ? "bg-muted-indigo/20 border border-muted-indigo/30" :
                d.status === "done"     ? "bg-muted-indigo" :
                d.status === "partial"  ? "bg-muted-indigo/40" :
                                          "bg-outline-variant/20";
              return (
                <div key={d.day} className="flex flex-col items-center gap-1.5">
                  <div className={`week-cell w-6 rounded-sm ${bg}`} style={{ height: h }} title={`${d.day}: ${d.xp} XP`} />
                  <span className="text-[9px] font-bold text-on-surface-variant/30 uppercase">{d.day[0]}</span>
                </div>
              );
            })}
          </div>
          <p className="text-[9px] font-bold text-on-surface-variant/30 uppercase tracking-widest -mt-2">This week</p>
        </div>
      </div>
    </section>
  );
}
