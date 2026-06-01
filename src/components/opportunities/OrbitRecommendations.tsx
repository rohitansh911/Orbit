"use client";

import { motion } from "framer-motion";

interface Recommendation {
  id: string;
  text: string;
  type: "action" | "warning" | "insight";
  icon: string;
}

interface OrbitRecommendationsProps {
  recommendations: Recommendation[];
  loading: boolean;
  aiLoading: boolean;
  onRefresh: () => void;
}

const FALLBACK: Recommendation[] = [
  { id: "f1", text: "Complete 3 missions this week to boost your match scores.", type: "action", icon: "terminal" },
  { id: "f2", text: "Your profile lacks quantified achievements — add impact metrics.", type: "warning", icon: "document_scanner" },
  { id: "f3", text: "Consistent daily activity increases recruiter visibility significantly.", type: "insight", icon: "lightbulb" },
];

export default function OrbitRecommendations({ recommendations, loading, aiLoading, onRefresh }: OrbitRecommendationsProps) {
  const displayRecs = recommendations.length > 0 ? recommendations : FALLBACK;

  return (
    <div className="premium-card rounded-[24px] p-8 h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[18px] text-muted-indigo" style={{ fontVariationSettings: "'FILL' 1" }}>
            psychology
          </span>
          <h2 className="text-xl font-extrabold text-primary tracking-tight">Orbit AI Copilot</h2>
        </div>
        {aiLoading && (
          <span className="w-4 h-4 rounded-full border-2 border-muted-indigo/30 border-t-muted-indigo animate-spin" />
        )}
      </div>

      <div className="space-y-4 flex-1 flex flex-col justify-center">
        {loading
          ? Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="p-4 rounded-xl border border-black/5 flex items-start gap-4 animate-pulse">
                <div className="w-5 h-5 rounded-lg bg-on-surface/5 shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 bg-on-surface/5 rounded-full w-full" />
                  <div className="h-3 bg-on-surface/5 rounded-full w-2/3" />
                </div>
              </div>
            ))
          : displayRecs.map((rec, i) => (
              <motion.div
                key={rec.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 25, delay: i * 0.15 }}
                className={`p-4 rounded-xl border flex items-start gap-4 transition-colors hover:bg-white/60 ${
                  rec.type === "action" ? "bg-muted-indigo/5 border-muted-indigo/15" :
                  rec.type === "warning" ? "bg-error/5 border-error/15" :
                  "bg-soft-lavender/5 border-soft-lavender/15"
                }`}
              >
                <span
                  className={`material-symbols-outlined text-[18px] mt-0.5 ${
                    rec.type === "action" ? "text-muted-indigo" :
                    rec.type === "warning" ? "text-error" :
                    "text-soft-lavender"
                  }`}
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  {rec.icon}
                </span>
                <p className="text-xs font-semibold text-on-surface-variant/80 leading-relaxed">{rec.text}</p>
              </motion.div>
            ))}
      </div>

      <button
        onClick={onRefresh}
        disabled={aiLoading}
        className="w-full mt-6 py-3 bg-[#1a1a1a] text-[#f5f5e8] rounded-xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-[#2a2a2a] active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {aiLoading ? "Generating..." : "Generate More Insights"}
      </button>
    </div>
  );
}
