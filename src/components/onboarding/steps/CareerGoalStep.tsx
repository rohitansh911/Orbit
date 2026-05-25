"use client";

import { useState } from "react";
import ProgressDots from "../ProgressDots";

interface CareerGoalStepProps {
  onNext: (value: string) => void;
  step: number;
  totalSteps: number;
}

const goals = [
  { id: "swe",      icon: "terminal",       label: "Software Engineer",  sub: "Build products people love" },
  { id: "pe",       icon: "hub",            label: "Product Engineer",   sub: "Bridge code and vision" },
  { id: "aiml",     icon: "auto_awesome",   label: "AI / ML Engineer",   sub: "Shape the intelligent future" },
  { id: "founder",  icon: "rocket_launch",  label: "Startup Founder",    sub: "Zero to one and beyond" },
  { id: "design",   icon: "palette",        label: "UI / UX Designer",   sub: "Craft experiences that resonate" },
  { id: "security", icon: "shield",         label: "Cybersecurity",      sub: "Defend what matters" },
  { id: "data",     icon: "bar_chart",      label: "Data Science",       sub: "Turn signals into insight" },
];

export default function CareerGoalStep({ onNext, step, totalSteps }: CareerGoalStepProps) {
  const [selected, setSelected] = useState("");

  return (
    <div className="step-enter flex flex-col min-h-screen px-6 pt-16 pb-12">
      <div className="max-w-3xl mx-auto w-full flex flex-col flex-1">
        {/* Header */}
        <div className="mb-10 space-y-3">
          <ProgressDots total={totalSteps} current={step} />
          <p className="text-[10px] font-bold text-muted-indigo tracking-[0.3em] uppercase mt-4">
            Career Direction
          </p>
          <h2 className="text-4xl md:text-5xl font-black text-on-surface tracking-tighter leading-tight">
            What are you<br />aiming for?
          </h2>
          <p className="text-base text-on-surface-variant/55 font-medium">
            Orbit will calibrate every mission to your destination.
          </p>
        </div>

        {/* Goal cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 flex-1">
          {goals.map((goal) => (
            <button
              key={goal.id}
              id={`goal-${goal.id}`}
              onClick={() => setSelected(goal.id)}
              className={`ob-card rounded-2xl p-6 text-left group cursor-pointer ${selected === goal.id ? "selected" : ""}`}
            >
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-4 transition-all duration-300 ${
                selected === goal.id
                  ? "bg-muted-indigo text-on-primary shadow-lg shadow-muted-indigo/30"
                  : "bg-on-surface/5 text-on-surface-variant/60 group-hover:bg-muted-indigo/10 group-hover:text-muted-indigo"
              }`}>
                <span className="material-symbols-outlined text-[22px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                  {goal.icon}
                </span>
              </div>
              <p className={`font-bold text-base mb-1 transition-colors ${selected === goal.id ? "text-muted-indigo" : "text-on-surface group-hover:text-muted-indigo"}`}>
                {goal.label}
              </p>
              <p className="text-[13px] text-on-surface-variant/50 font-medium leading-snug">
                {goal.sub}
              </p>
              {selected === goal.id && (
                <div className="absolute top-4 right-4 w-5 h-5 bg-muted-indigo rounded-full flex items-center justify-center">
                  <span className="material-symbols-outlined text-[12px] text-white">check</span>
                </div>
              )}
            </button>
          ))}
        </div>

        <div className="mt-8 flex justify-end">
          <button
            onClick={() => {
              if (selected) {
                const label = goals.find(g => g.id === selected)?.label || selected;
                onNext(label);
              }
            }}
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
