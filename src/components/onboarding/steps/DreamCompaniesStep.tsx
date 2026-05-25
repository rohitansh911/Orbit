"use client";

import { useState } from "react";
import ProgressDots from "../ProgressDots";

interface DreamCompaniesStepProps {
  onNext: (companies: string[]) => void;
  step: number;
  totalSteps: number;
}

const suggestions = [
  { name: "Google",      type: "FAANG" },
  { name: "Meta",        type: "FAANG" },
  { name: "Apple",       type: "FAANG" },
  { name: "Amazon",      type: "FAANG" },
  { name: "Microsoft",   type: "FAANG" },
  { name: "OpenAI",      type: "AI Lab" },
  { name: "Anthropic",   type: "AI Lab" },
  { name: "Stripe",      type: "Fintech" },
  { name: "Vercel",      type: "Dev Tools" },
  { name: "Linear",      type: "Dev Tools" },
  { name: "Notion",      type: "Productivity" },
  { name: "Figma",       type: "Design" },
  { name: "Airbnb",      type: "Platform" },
  { name: "Spotify",     type: "Media" },
  { name: "Netflix",     type: "Media" },
  { name: "Databricks",  type: "Data" },
  { name: "Cloudflare",  type: "Infra" },
  { name: "Shopify",     type: "Commerce" },
];

export default function DreamCompaniesStep({ onNext, step, totalSteps }: DreamCompaniesStepProps) {
  const [selected, setSelected] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState("");

  const toggle = (name: string) => {
    setSelected((prev) =>
      prev.includes(name) ? prev.filter((c) => c !== name) : [...prev, name]
    );
  };

  const addCustom = () => {
    const val = inputValue.trim();
    if (val && !selected.includes(val)) {
      setSelected((prev) => [...prev, val]);
      setInputValue("");
    }
  };

  return (
    <div className="step-enter flex flex-col min-h-screen px-6 pt-16 pb-12">
      <div className="max-w-2xl mx-auto w-full flex flex-col flex-1">
        {/* Header */}
        <div className="mb-8 space-y-3">
          <ProgressDots total={totalSteps} current={step} />
          <p className="text-[10px] font-bold text-muted-indigo tracking-[0.3em] uppercase mt-4">
            Dream Destination
          </p>
          <h2 className="text-4xl md:text-5xl font-black text-on-surface tracking-tighter leading-tight">
            Where do you want<br />to work someday?
          </h2>
          <p className="text-base text-on-surface-variant/55 font-medium">
            Orbit reverse-engineers the skills you need to get there.
          </p>
        </div>

        {/* Custom input */}
        <div className="flex gap-3 mb-6">
          <div className="relative flex-1">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant/40 text-[20px]">apartment</span>
            <input
              type="text"
              placeholder="Add a company…"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addCustom()}
              className="w-full pl-11 pr-4 py-3.5 bg-white/50 border border-outline-variant/40 rounded-xl text-sm font-medium text-on-surface placeholder:text-on-surface-variant/35 focus:outline-none focus:border-muted-indigo/50 focus:bg-white/80 transition-all"
            />
          </div>
          <button
            onClick={addCustom}
            disabled={!inputValue.trim()}
            className="px-5 py-3 bg-muted-indigo/10 text-muted-indigo font-bold text-sm rounded-xl border border-muted-indigo/20 hover:bg-muted-indigo hover:text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          >
            Add
          </button>
        </div>

        {/* Selected chips */}
        {selected.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6 p-4 bg-white/30 rounded-2xl border border-outline-variant/20">
            {selected.map((c) => (
              <button
                key={c}
                onClick={() => toggle(c)}
                className="flex items-center gap-1.5 px-3.5 py-1.5 bg-muted-indigo/8 border border-muted-indigo/30 text-muted-indigo rounded-xl text-[13px] font-semibold hover:bg-error/10 hover:border-error/30 hover:text-error transition-all group"
              >
                {c}
                <span className="material-symbols-outlined text-[13px] opacity-50 group-hover:opacity-100">close</span>
              </button>
            ))}
          </div>
        )}

        {/* Suggested grid */}
        <div className="flex-1">
          <p className="text-[10px] font-black text-on-surface-variant/40 uppercase tracking-[0.25em] mb-4">
            Suggested
          </p>
          <div className="flex flex-wrap gap-2.5">
            {suggestions
              .filter((c) => !selected.includes(c.name))
              .map((company) => (
                <button
                  key={company.name}
                  onClick={() => toggle(company.name)}
                  className="ob-tag flex items-center gap-2 px-4 py-2.5 rounded-xl group"
                >
                  <span className="text-sm font-semibold text-on-surface-variant/70 group-hover:text-on-surface transition-colors">
                    {company.name}
                  </span>
                  <span className="text-[10px] font-bold text-on-surface-variant/30 group-hover:text-muted-indigo/50 transition-colors">
                    {company.type}
                  </span>
                </button>
              ))}
          </div>
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
