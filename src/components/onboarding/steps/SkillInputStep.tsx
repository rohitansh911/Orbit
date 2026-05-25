"use client";

import { useState } from "react";
import ProgressDots from "../ProgressDots";

interface SkillInputStepProps {
  onNext: (skills: string[]) => void;
  step: number;
  totalSteps: number;
}

const skillGroups = [
  {
    label: "Languages",
    skills: ["JavaScript", "TypeScript", "Python", "Go", "Rust", "Java", "C++", "Swift", "Kotlin"],
  },
  {
    label: "Frontend",
    skills: ["React", "Next.js", "Vue", "Svelte", "Tailwind CSS", "Three.js", "Framer Motion"],
  },
  {
    label: "Backend",
    skills: ["Node.js", "Express", "FastAPI", "Django", "Prisma", "GraphQL", "tRPC"],
  },
  {
    label: "Cloud & Infra",
    skills: ["AWS", "GCP", "Docker", "Kubernetes", "Terraform", "Vercel", "Supabase", "Firebase"],
  },
  {
    label: "AI / ML",
    skills: ["PyTorch", "TensorFlow", "LangChain", "OpenAI API", "HuggingFace", "Pandas", "NumPy"],
  },
  {
    label: "Tools",
    skills: ["Git", "Figma", "Linear", "Notion", "Postman", "VS Code", "Vim"],
  },
];

export default function SkillInputStep({ onNext, step, totalSteps }: SkillInputStepProps) {
  const [selected, setSelected] = useState<string[]>([]);
  const [query, setQuery] = useState("");

  const toggle = (skill: string) => {
    setSelected((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  };

  const filtered = query.trim()
    ? skillGroups
        .flatMap((g) => g.skills)
        .filter((s) => s.toLowerCase().includes(query.toLowerCase()))
    : null;

  return (
    <div className="step-enter flex flex-col min-h-screen px-6 pt-16 pb-12">
      <div className="max-w-2xl mx-auto w-full flex flex-col flex-1">
        {/* Header */}
        <div className="mb-8 space-y-3">
          <ProgressDots total={totalSteps} current={step} />
          <p className="text-[10px] font-bold text-muted-indigo tracking-[0.3em] uppercase mt-4">
            Your Arsenal
          </p>
          <h2 className="text-4xl md:text-5xl font-black text-on-surface tracking-tighter leading-tight">
            What&rsquo;s in your<br />tech stack?
          </h2>
          <p className="text-base text-on-surface-variant/55 font-medium">
            Select what you know or are learning.{" "}
            <span className="text-muted-indigo font-semibold">Pick freely.</span>
          </p>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant/40 text-[20px]">search</span>
          <input
            type="text"
            placeholder="Search skills, tools, frameworks…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3.5 bg-white/50 border border-outline-variant/40 rounded-xl text-sm font-medium text-on-surface placeholder:text-on-surface-variant/35 focus:outline-none focus:border-muted-indigo/50 focus:bg-white/80 transition-all"
          />
        </div>

        {/* Selected count */}
        {selected.length > 0 && (
          <div className="flex items-center gap-2 mb-5">
            <span className="badge-xp px-3 py-1 rounded-full text-[10px] font-black">
              {selected.length} selected
            </span>
            <button
              onClick={() => setSelected([])}
              className="text-[11px] text-on-surface-variant/40 hover:text-error transition-colors font-medium"
            >
              clear all
            </button>
          </div>
        )}

        {/* Skills */}
        <div className="flex-1 space-y-6 overflow-y-auto pr-1">
          {filtered ? (
            <div className="flex flex-wrap gap-2.5">
              {filtered.map((skill) => (
                <button
                  key={skill}
                  onClick={() => toggle(skill)}
                  className={`ob-tag px-4 py-2 rounded-xl text-sm font-semibold ${selected.includes(skill) ? "selected" : "text-on-surface-variant/70"}`}
                >
                  {skill}
                </button>
              ))}
              {filtered.length === 0 && (
                <p className="text-sm text-on-surface-variant/40 font-medium py-4">
                  No matches — that&apos;s okay, we&apos;ll add it to your roadmap.
                </p>
              )}
            </div>
          ) : (
            skillGroups.map((group) => (
              <div key={group.label}>
                <p className="text-[10px] font-black text-on-surface-variant/40 uppercase tracking-[0.25em] mb-3">
                  {group.label}
                </p>
                <div className="flex flex-wrap gap-2.5">
                  {group.skills.map((skill) => (
                    <button
                      key={skill}
                      onClick={() => toggle(skill)}
                      className={`ob-tag px-4 py-2 rounded-xl text-sm font-semibold ${selected.includes(skill) ? "selected" : "text-on-surface-variant/70"}`}
                    >
                      {skill}
                    </button>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Continue */}
        <div className="mt-8 flex justify-between items-center">
          <button
            onClick={() => onNext([])}
            className="text-sm text-on-surface-variant/40 hover:text-on-surface-variant/70 transition-colors font-medium"
          >
            Skip for now
          </button>
          <button
            onClick={() => onNext(selected)}
            className="px-10 py-3.5 bg-primary text-on-primary font-bold text-sm rounded-xl transition-all shadow-xl shadow-primary/15 hover:shadow-primary/35 hover:-translate-y-0.5 active:scale-95"
          >
            Continue →
          </button>
        </div>
      </div>
    </div>
  );
}
