"use client";

import { useState } from "react";
import ProgressDots from "../ProgressDots";

interface BiggestStruggleStepProps {
  onNext: (values: string[]) => void;
  step: number;
  totalSteps: number;
}

const struggles = [
  { id: "no-roadmap",    icon: "map",              label: "No roadmap",         sub: "I don't know what to learn next or in what order." },
  { id: "resume",        icon: "description",      label: "Resume confusion",   sub: "Not sure if mine is good enough to get noticed." },
  { id: "no-internship", icon: "work_off",         label: "No internships",     sub: "I keep applying but hear nothing back." },
  { id: "networking",    icon: "groups",           label: "Networking fear",    sub: "Cold messaging people feels awkward and forced." },
  { id: "consistency",   icon: "repeat",           label: "Inconsistency",      sub: "I start strong but keep losing momentum." },
  { id: "overwhelmed",   icon: "sentiment_stressed", label: "Too overwhelmed",  sub: "Too many resources, too many choices, no clarity." },
  { id: "no-guidance",   icon: "person_search",    label: "No real guidance",   sub: "Figuring it all out alone, no mentor or community." },
];

export default function BiggestStruggleStep({ onNext, step, totalSteps }: BiggestStruggleStepProps) {
  const [selected, setSelected] = useState<string[]>([]);

  const toggle = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  return (
    <div className="step-enter flex flex-col min-h-screen px-6 pt-16 pb-12">
      <div className="max-w-2xl mx-auto w-full flex flex-col flex-1">
        {/* Header */}
        <div className="mb-10 space-y-3">
          <ProgressDots total={totalSteps} current={step} />
          <p className="text-[10px] font-bold text-muted-indigo tracking-[0.3em] uppercase mt-4">
            Pain Points
          </p>
          <h2 className="text-4xl md:text-5xl font-black text-on-surface tracking-tighter leading-tight">
            What&rsquo;s slowing you<br />down right now?
          </h2>
          <p className="text-base text-on-surface-variant/55 font-medium">
            Be honest — Orbit uses this to build missions that actually help.
            <span className="text-muted-indigo font-semibold"> Pick all that apply.</span>
          </p>
        </div>

        {/* Struggle cards */}
        <div className="flex flex-col gap-3 flex-1">
          {struggles.map((s) => {
            const isSelected = selected.includes(s.id);
            return (
              <button
                key={s.id}
                id={`struggle-${s.id}`}
                onClick={() => toggle(s.id)}
                className={`ob-card rounded-2xl p-5 text-left flex items-center gap-5 cursor-pointer w-full ${isSelected ? "selected" : ""}`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-all duration-300 ${
                  isSelected
                    ? "bg-muted-indigo text-white shadow-lg shadow-muted-indigo/30"
                    : "bg-on-surface/5 text-on-surface-variant/50"
                }`}>
                  <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                    {s.icon}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`font-bold text-[15px] transition-colors ${isSelected ? "text-muted-indigo" : "text-on-surface"}`}>
                    {s.label}
                  </p>
                  <p className="text-[12px] text-on-surface-variant/45 mt-0.5 leading-snug">
                    {s.sub}
                  </p>
                </div>
                <div className={`w-5 h-5 rounded-full border-2 shrink-0 flex items-center justify-center transition-all ${
                  isSelected
                    ? "bg-muted-indigo border-muted-indigo"
                    : "border-outline-variant/40"
                }`}>
                  {isSelected && (
                    <span className="material-symbols-outlined text-[12px] text-white">check</span>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Continue */}
        <div className="mt-8 flex justify-end">
          <button
            onClick={() => selected.length > 0 && onNext(selected)}
            disabled={selected.length === 0}
            className="px-10 py-3.5 bg-primary text-on-primary font-bold text-sm rounded-xl transition-all shadow-xl shadow-primary/15 hover:shadow-primary/35 hover:-translate-y-0.5 active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed disabled:transform-none"
          >
            Continue →
          </button>
        </div>
      </div>
    </div>
  );
}
