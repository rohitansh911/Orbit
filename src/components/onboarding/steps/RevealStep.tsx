"use client";

import { OnboardingData } from "../types";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/UserContext";
import { useState } from "react";

interface RevealStepProps {
  data: OnboardingData;
}

const goalLabels: Record<string, string> = {
  swe: "Software Engineer",
  pe: "Product Engineer",
  aiml: "AI / ML Engineer",
  founder: "Startup Founder",
  design: "UI / UX Designer",
  security: "Cybersecurity",
  data: "Data Science",
};

const levelXP: Record<string, number> = {
  beginner: 0,
  fundamentals: 150,
  projects: 400,
  "intern-hunt": 750,
  "interview-prep": 1200,
};

const roadmapItems = [
  { icon: "description", label: "Resume audit mission", done: false },
  { icon: "hub", label: "Network expansion quest", done: false },
  { icon: "code", label: "Portfolio project sprint", done: false },
  { icon: "school", label: "Skill calibration check", done: false },
];

export default function RevealStep({ data }: RevealStepProps) {
  const router = useRouter();
  const { completeOnboarding } = useUser();
  const [saving, setSaving] = useState(false);

  const goalLabel = goalLabels[data.careerGoal] ?? "Engineer";
  const xp = levelXP[data.currentLevel] ?? 0;
  const level = Math.floor(xp / 250) + 1;
  const topCompany = data.dreamCompanies[0] ?? "your dream company";

  const handleEnterOrbit = async () => {
    setSaving(true);
    await completeOnboarding(data);
    router.push("/");
  };

  return (
    <div className="step-enter flex flex-col items-center justify-center min-h-screen px-6 py-16 relative overflow-hidden">
      {/* Subtle orbital bg */}
      <div className="absolute inset-0 pointer-events-none hero-orbital-bg opacity-60" />

      <div className="relative z-10 w-full max-w-2xl mx-auto space-y-8">
        {/* Header reveal */}
        <div className="text-center space-y-3 pop-in-1">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-muted-indigo/8 border border-muted-indigo/20 rounded-full mb-2">
            <span className="material-symbols-outlined text-[14px] text-muted-indigo" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
            <span className="text-[10px] font-black text-muted-indigo tracking-[0.25em] uppercase">Your orbit is ready</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-on-surface tracking-tighter leading-tight heading-glow">
            Your personalized<br />
            <span className="text-muted-indigo">launch sequence</span><br />
            is live.
          </h2>
        </div>

        {/* XP + Level card */}
        <div className="pop-in-2 premium-card rounded-3xl p-8 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-black text-on-surface-variant/40 uppercase tracking-[0.3em] mb-1">Starting Level</p>
            <p className="text-3xl font-black text-primary tracking-tight">Level {level} — Aspiring {goalLabel}</p>
            <p className="text-sm text-on-surface-variant/55 mt-1 font-medium">
              Charting course toward <span className="text-muted-indigo font-semibold">{topCompany}</span>
            </p>
          </div>
          <div className="xp-reveal text-right shrink-0 ml-6">
            <span className="text-5xl font-black text-muted-indigo tracking-tighter">{xp}</span>
            <p className="text-[10px] font-bold text-on-surface-variant/40 uppercase tracking-widest">Starting XP</p>
          </div>
        </div>

        {/* Roadmap preview */}
        <div className="pop-in-3 premium-card rounded-3xl p-8 space-y-5">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h3 className="text-lg font-extrabold text-primary">First Missions</h3>
              <p className="text-[12px] text-on-surface-variant/50 font-medium mt-0.5">Generated from your profile</p>
            </div>
            <span className="badge-xp px-3.5 py-1.5 rounded-xl text-[10px] font-black">4 queued</span>
          </div>
          <div className="space-y-3">
            {roadmapItems.map((item, i) => (
              <div key={i} className="flex items-center gap-4 p-4 rounded-2xl bg-white/30 border border-outline-variant/20">
                <div className="w-9 h-9 bg-muted-indigo/8 border border-muted-indigo/15 rounded-xl flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[18px] text-muted-indigo">{item.icon}</span>
                </div>
                <span className="text-sm font-semibold text-on-surface">{item.label}</span>
                <div className="ml-auto w-4 h-4 rounded-full border-2 border-outline-variant/30" />
              </div>
            ))}
          </div>
        </div>

        {/* Skill calibration teaser */}
        <div className="pop-in-4 premium-card rounded-3xl p-8 space-y-5">
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-lg font-extrabold text-primary">Skill Calibration</h3>
            <span className="text-[10px] font-bold text-on-surface-variant/35 uppercase tracking-widest">Initializing…</span>
          </div>
          <div className="space-y-3">
            {(data.skills.slice(0, 4).length > 0 ? data.skills.slice(0, 4) : ["React", "TypeScript", "System Design", "Networking"]).map((skill) => (
              <div key={skill} className="space-y-2">
                <div className="flex justify-between text-[11px] font-bold text-on-surface-variant/50 uppercase tracking-widest">
                  <span>{skill}</span>
                  <span className="text-muted-indigo">Calibrating</span>
                </div>
                <div className="h-1.5 bg-outline-variant/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-muted-indigo/40 rounded-full shimmer"
                    style={{ width: `${30 + Math.random() * 50}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="pop-in-5 text-center pt-2">
          <button
            onClick={handleEnterOrbit}
            disabled={saving}
            id="enter-orbit-btn"
            className="inline-flex items-center gap-3 px-14 py-4.5 bg-primary text-on-primary font-bold text-sm rounded-2xl transition-all shadow-2xl shadow-primary/25 hover:shadow-primary/45 hover:-translate-y-1 active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
          >
            <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>rocket_launch</span>
            {saving ? "Saving Profile..." : "Enter your Orbit"}
          </button>
          <p className="text-[11px] text-on-surface-variant/35 mt-4 font-medium">
            Your dashboard is waiting — let&rsquo;s go.
          </p>
        </div>
      </div>
    </div>
  );
}
