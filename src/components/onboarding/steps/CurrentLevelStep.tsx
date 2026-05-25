"use client";

import { useState } from "react";
import ProgressDots from "../ProgressDots";

interface CurrentLevelStepProps {
  onNext: (value: string) => void;
  step: number;
  totalSteps: number;
}

const levels = [
  {
    id: "beginner",
    badge: "01",
    label: "Beginner",
    sub: "Just starting my engineering journey",
    xp: "0 XP",
  },
  {
    id: "fundamentals",
    badge: "02",
    label: "Learning Fundamentals",
    sub: "Building core CS knowledge and first languages",
    xp: "150 XP",
  },
  {
    id: "projects",
    badge: "03",
    label: "Building Projects",
    sub: "Shipping real things and learning from them",
    xp: "400 XP",
  },
  {
    id: "intern-hunt",
    badge: "04",
    label: "Internship Hunting",
    sub: "Targeting companies, polishing applications",
    xp: "750 XP",
  },
  {
    id: "interview-prep",
    badge: "05",
    label: "Interview Preparing",
    sub: "DSA, system design, mock interviews — locked in",
    xp: "1200 XP",
  },
];

export default function CurrentLevelStep({ onNext, step, totalSteps }: CurrentLevelStepProps) {
  const [selected, setSelected] = useState("");

  return (
    <div className="step-enter flex flex-col min-h-screen px-6 pt-16 pb-12">
      <div className="max-w-2xl mx-auto w-full flex flex-col flex-1">
        {/* Header */}
        <div className="mb-10 space-y-3">
          <ProgressDots total={totalSteps} current={step} />
          <p className="text-[10px] font-bold text-muted-indigo tracking-[0.3em] uppercase mt-4">
            Current Position
          </p>
          <h2 className="text-4xl md:text-5xl font-black text-on-surface tracking-tighter leading-tight">
            Where are you<br />right now?
          </h2>
          <p className="text-base text-on-surface-variant/55 font-medium">
            No judgment — your starting orbit is just calibration data.
          </p>
        </div>

        {/* Timeline */}
        <div className="flex flex-col gap-4 flex-1">
          {levels.map((level, idx) => {
            const isSelected = selected === level.id;
            const isPast = levels.findIndex((l) => l.id === selected) > idx;

            return (
              <div
                key={level.id}
                className="ob-level flex items-start gap-5"
                onClick={() => setSelected(level.id)}
              >
                {/* Timeline node */}
                <div className="flex flex-col items-center shrink-0" style={{ width: 42 }}>
                  <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center text-[11px] font-black transition-all duration-300 ${
                    isSelected
                      ? "bg-muted-indigo border-muted-indigo text-white shadow-lg shadow-muted-indigo/30 scale-110"
                      : isPast
                      ? "bg-muted-indigo/15 border-muted-indigo/40 text-muted-indigo/60"
                      : "bg-white/60 border-outline-variant/50 text-on-surface-variant/40"
                  }`}>
                    {isPast ? (
                      <span className="material-symbols-outlined text-[14px]">check</span>
                    ) : (
                      level.badge
                    )}
                  </div>
                  {/* connector line */}
                  {idx < levels.length - 1 && (
                    <div className={`w-0.5 h-8 mt-1 rounded-full transition-colors ${
                      isPast ? "bg-muted-indigo/30" : "bg-outline-variant/25"
                    }`} />
                  )}
                </div>

                {/* Card */}
                <div className={`flex-1 ob-card rounded-2xl p-5 mb-2 cursor-pointer ${isSelected ? "selected" : ""}`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className={`font-bold text-base transition-colors ${isSelected ? "text-muted-indigo" : "text-on-surface"}`}>
                        {level.label}
                      </p>
                      <p className="text-[13px] text-on-surface-variant/50 mt-0.5 leading-snug">
                        {level.sub}
                      </p>
                    </div>
                    <span className={`text-[11px] font-black px-3 py-1 rounded-full transition-all ${
                      isSelected
                        ? "bg-muted-indigo/10 text-muted-indigo border border-muted-indigo/20"
                        : "text-on-surface-variant/30 border border-outline-variant/20"
                    }`}>
                      {level.xp}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Continue */}
        <div className="mt-8 flex justify-end">
          <button
            onClick={() => selected && onNext(selected)}
            disabled={!selected}
            className="px-10 py-3.5 bg-primary text-on-primary font-bold text-sm rounded-xl transition-all shadow-xl shadow-primary/15 hover:shadow-primary/35 hover:-translate-y-0.5 active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed disabled:transform-none"
          >
            Continue →
          </button>
        </div>
      </div>
    </div>
  );
}
