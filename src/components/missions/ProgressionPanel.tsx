"use client";

import { useEffect, useRef } from "react";
import { WEEKLY_DATA } from "./data";

interface ProgressionPanelProps {
  totalXP: number;
  earnedXP: number;
  streak: number;
  completedToday: number;
}

const LEVEL_XP = [0, 250, 600, 1100, 1800, 2800];
const LEVEL_NAMES = ["Initiate", "Explorer", "Builder", "Craftsman", "Architect", "Visionary"];

function getCurrentLevel(xp: number) {
  for (let i = LEVEL_XP.length - 1; i >= 0; i--) {
    if (xp >= LEVEL_XP[i]) return i;
  }
  return 0;
}

export default function ProgressionPanel({ totalXP, earnedXP, streak, completedToday }: ProgressionPanelProps) {
  const barRef = useRef<HTMLDivElement>(null);
  const level = getCurrentLevel(totalXP);
  const nextLevelXP = LEVEL_XP[level + 1] ?? LEVEL_XP[level] + 1000;
  const prevLevelXP = LEVEL_XP[level];
  const pct = Math.round(((totalXP - prevLevelXP) / (nextLevelXP - prevLevelXP)) * 100);
  const velocity = WEEKLY_DATA.filter((d) => d.status === "done").length;

  useEffect(() => {
    const el = barRef.current;
    if (!el) return;
    el.style.width = "0%";
    el.style.transition = "none";
    const raf = requestAnimationFrame(() => {
      setTimeout(() => {
        el.style.transition = "width 1.4s cubic-bezier(0.23,1,0.32,1)";
        el.style.width = `${pct}%`;
      }, 300);
    });
    return () => cancelAnimationFrame(raf);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [totalXP]);

  return (
    <div className="premium-card rounded-3xl p-10 space-y-10 relative overflow-hidden card-enter-2">
      {/* Ambient orb */}
      <div
        className="ambient-orb w-48 h-48 bg-muted-indigo/6 -top-8 -right-8"
        style={{ "--drift-dur": "20s", "--drift-delay": "2s" } as React.CSSProperties}
      />

      {/* Header */}
      <div className="relative z-10">
        <p className="text-[10px] font-black text-muted-indigo tracking-[0.35em] uppercase mb-1.5">Progression</p>
        <h2 className="text-xl font-extrabold text-primary">Growth Engine</h2>
      </div>

      {/* Level + XP */}
      <div className="relative z-10 space-y-5">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-3xl font-black text-on-surface tracking-tight">
              Lv. {level + 1}
            </p>
            <p className="text-[11px] font-bold text-muted-indigo uppercase tracking-[0.2em] mt-0.5">
              {LEVEL_NAMES[level]}
            </p>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-bold text-on-surface-variant/40 uppercase tracking-widest">Next level</p>
            <p className="text-base font-black text-on-surface/60">{nextLevelXP - totalXP} XP away</p>
          </div>
        </div>

        {/* XP bar */}
        <div className="space-y-2">
          <div className="h-2 bg-outline-variant/10 rounded-full overflow-hidden">
            <div
              ref={barRef}
              className="h-full bg-muted-indigo rounded-full"
              style={{
                width: 0,
                boxShadow: "0 0 12px rgba(99,102,241,0.4)",
              }}
            />
          </div>
          <div className="flex justify-between text-[10px] font-bold text-on-surface-variant/35 uppercase tracking-widest">
            <span>{totalXP} XP</span>
            <span>{pct}% to Lv. {level + 2}</span>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-outline-variant/20 relative z-10" />

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-3 relative z-10">
        {[
          { label: "Streak",       value: `${streak}d`,         icon: "local_fire_department", accent: true },
          { label: "Today's XP",   value: `+${earnedXP}`,       icon: "bolt",                  accent: false },
          { label: "Velocity",     value: `${velocity}/7 days`, icon: "trending_up",           accent: false },
          { label: "Completed",    value: `${completedToday} today`,icon: "check_circle",      accent: false },
        ].map((stat) => (
          <div key={stat.label} className="p-4 rounded-2xl bg-white/35 border border-[rgba(0,0,0,0.03)] hover:border-muted-indigo/20 hover:bg-white/55 transition-all duration-200 group flex flex-col justify-between overflow-hidden">
            <div className="flex items-center gap-1.5 mb-1.5">
              <span
                className={`material-symbols-outlined text-[14px] shrink-0 ${stat.accent ? "text-muted-indigo" : "text-on-surface-variant/50"}`}
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                {stat.icon}
              </span>
              <span className="text-[8px] font-black text-on-surface-variant/40 uppercase tracking-[0.15em] truncate">{stat.label}</span>
            </div>
            <p className={`text-lg font-black tracking-tight truncate ${stat.accent ? "text-muted-indigo" : "text-on-surface"}`}>
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* Divider */}
      <div className="h-px bg-outline-variant/20 relative z-10" />

      {/* Weekly consistency heatmap */}
      <div className="relative z-10 space-y-5">
        <p className="text-[10px] font-black text-on-surface-variant/40 uppercase tracking-[0.3em]">Weekly Consistency</p>
        <div className="flex items-end gap-2">
          {WEEKLY_DATA.map((d) => {
            const maxH = 48;
            const minH = 8;
            const h = d.status === "today"   ? minH :
                      d.status === "done"    ? minH + Math.round((d.xp / 310) * (maxH - minH)) :
                      d.status === "partial" ? minH + 10 : minH;
            const bg =
              d.status === "today"   ? "bg-muted-indigo/15 border border-muted-indigo/25" :
              d.status === "done"    ? "bg-muted-indigo" :
              d.status === "partial" ? "bg-muted-indigo/35" :
                                       "bg-outline-variant/15";
            return (
              <div key={d.day} className="flex-1 flex flex-col items-center gap-2">
                <div
                  className={`week-cell w-full rounded-md ${bg}`}
                  style={{ height: h }}
                  title={`${d.day}: ${d.xp > 0 ? d.xp + " XP" : d.status === "today" ? "today" : "missed"}`}
                />
                <span className="text-[9px] font-bold text-on-surface-variant/30 uppercase">{d.day[0]}</span>
              </div>
            );
          })}
        </div>
        <div className="flex items-center gap-3 text-[9px] font-bold text-on-surface-variant/30 uppercase tracking-widest">
          <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-muted-indigo" />Done</span>
          <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-muted-indigo/35" />Partial</span>
          <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-outline-variant/25" />Missed</span>
        </div>
      </div>

      {/* Milestone teaser */}
      <div className="relative z-10 p-5 rounded-2xl bg-muted-indigo/5 border border-muted-indigo/12">
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-[20px] text-muted-indigo breathing-core" style={{ fontVariationSettings: "'FILL' 1" }}>
            flag
          </span>
          <div>
            <p className="text-[11px] font-extrabold text-muted-indigo">Next milestone</p>
            <p className="text-[11px] text-on-surface-variant/50 font-medium mt-0.5">
              7-day streak → unlock Internship Readiness badge
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
