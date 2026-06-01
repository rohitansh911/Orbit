"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { Opportunity, Application } from "@/hooks/useOpportunities";

const INTENSITY_STYLES: Record<string, string> = {
  very_high: "bg-green-500/10 text-green-700 border-green-500/15",
  high: "bg-amber-500/10 text-amber-700 border-amber-500/15",
  medium: "bg-blue-500/10 text-blue-700 border-blue-500/15",
  low: "bg-on-surface/5 text-on-surface-variant border-black/5",
};

const DIFFICULTY_LABELS: Record<string, string> = {
  elite: "🔥 Elite",
  hard: "⚡ Hard",
  medium: "◎ Medium",
  accessible: "✓ Accessible",
};

const GROWTH_LABELS: Record<string, string> = {
  hypergrowth: "Hypergrowth",
  fast: "Fast Growing",
  steady: "Established",
  established: "Established",
};

interface RecommendedGridProps {
  opportunities: Opportunity[];
  applications: Application[];
  loading: boolean;
  aiLoading: boolean;
  onApply: (opp: Opportunity) => void;
  onSave: (opp: Opportunity) => void;
}

const URGENCY_COLORS: Record<string, string> = {
  "Very High": "bg-error/10 text-error border-error/15",
  "High": "bg-amber-500/10 text-amber-700 border-amber-500/15",
  "Medium": "bg-blue-500/10 text-blue-700 border-blue-500/15",
  "Low": "bg-on-surface/5 text-on-surface-variant border-black/5",
};

function SkeletonCard() {
  return (
    <div className="bg-white/40 border border-black/5 rounded-[24px] p-6 flex flex-col gap-4 animate-pulse">
      <div className="flex justify-between">
        <div className="space-y-2">
          <div className="h-2.5 w-16 bg-on-surface/5 rounded-full" />
          <div className="h-4 w-36 bg-on-surface/8 rounded-full" />
        </div>
        <div className="w-10 h-10 rounded-xl bg-on-surface/5" />
      </div>
      <div className="flex gap-2">
        <div className="h-5 w-16 rounded-lg bg-on-surface/5" />
        <div className="h-5 w-20 rounded-lg bg-on-surface/5" />
      </div>
      <div className="space-y-2">
        <div className="h-3 w-full bg-on-surface/5 rounded-full" />
        <div className="h-3 w-3/4 bg-on-surface/5 rounded-full" />
      </div>
      <div className="flex gap-3 pt-2 border-t border-outline-variant/10">
        <div className="flex-1 h-9 rounded-xl bg-muted-indigo/10" />
        <div className="w-10 h-9 rounded-xl bg-on-surface/5" />
      </div>
    </div>
  );
}

export default function RecommendedGrid({ opportunities, applications, loading, aiLoading, onApply, onSave }: RecommendedGridProps) {
  const [appliedIds, setAppliedIds] = useState<Set<string>>(new Set());
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set(
    applications.filter(a => a.status === "saved").map(a => a.opportunity_id)
  ));

  const handleApply = (opp: Opportunity) => {
    setAppliedIds(prev => new Set([...prev, opp.id]));
    onApply(opp);
  };

  const handleSave = (opp: Opportunity) => {
    setSavedIds(prev => {
      const next = new Set(prev);
      if (next.has(opp.id)) next.delete(opp.id); else next.add(opp.id);
      return next;
    });
    onSave(opp);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[18px] text-muted-indigo" style={{ fontVariationSettings: "'FILL' 1" }}>
            recommend
          </span>
          <h2 className="text-xl font-extrabold text-primary tracking-tight">Curated Opportunities</h2>
          {aiLoading && (
            <span className="flex items-center gap-1 px-2 py-0.5 bg-muted-indigo/10 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-muted-indigo animate-pulse" />
              <span className="text-[9px] font-bold text-muted-indigo uppercase tracking-wider">AI Scoring</span>
            </span>
          )}
        </div>
        <span className="text-[10px] font-bold text-on-surface-variant/40 uppercase tracking-wider">
          {opportunities.length} matches
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading
          ? Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)
          : opportunities.slice(0, 6).map((job, i) => {
              const isApplied = appliedIds.has(job.id) || applications.some(a => a.opportunity_id === job.id && a.status === "applied");
              const isSaved = savedIds.has(job.id);
              const urgencyClass = URGENCY_COLORS[job.urgency || "Low"] || URGENCY_COLORS["Low"];

              return (
                <motion.div
                  key={job.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ type: "spring", stiffness: 350, damping: 25, delay: i * 0.08 }}
                  whileHover={{ y: -4, scale: 1.01 }}
                  className="group relative bg-white/40 border border-black/5 rounded-[24px] p-6 flex flex-col justify-between overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.02)] hover:border-soft-lavender/30 hover:shadow-[0_12px_32px_rgba(167,139,250,0.1)] transition-all"
                >
                  {/* Shimmer sweep */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] pointer-events-none" />

                  <div>
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-[10px] font-black text-on-surface-variant/50 uppercase tracking-[0.2em] mb-1">{job.company}</h3>
                        <h4 className="text-base font-bold text-on-surface leading-snug">{job.role}</h4>
                      </div>
                      <div className="w-10 h-10 rounded-xl bg-muted-indigo/5 border border-muted-indigo/10 flex items-center justify-center shrink-0">
                        {job.match_score ? (
                          <span className="text-sm font-black text-muted-indigo">{job.match_score}%</span>
                        ) : aiLoading ? (
                          <span className="w-4 h-4 rounded-full border-2 border-muted-indigo/30 border-t-muted-indigo animate-spin" />
                        ) : (
                          <span className="text-sm font-black text-on-surface-variant/30">—</span>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-5">
                        <span className="px-2.5 py-1 bg-on-surface/5 text-on-surface-variant/70 text-[10px] font-bold rounded-lg border border-black/5 capitalize">
                          {job.remote_type}
                        </span>
                        {job.salary_range && (
                          <span className="px-2.5 py-1 bg-green-500/10 text-green-700 text-[10px] font-bold rounded-lg border border-green-500/15">
                            {job.salary_range}
                          </span>
                        )}
                        {job.urgency && job.urgency !== "Low" && (
                          <span className={`px-2.5 py-1 text-[10px] font-bold rounded-lg border flex items-center gap-1 ${urgencyClass}`}>
                            {job.urgency === "Very High" && <span className="w-1 h-1 rounded-full bg-error animate-pulse" />}
                            {job.urgency}
                          </span>
                        )}
                        {job.hiringIntensity && job.hiringIntensity !== "low" && (
                          <span className={`px-2.5 py-1 text-[10px] font-bold rounded-lg border ${INTENSITY_STYLES[job.hiringIntensity] || INTENSITY_STYLES["medium"]}`}>
                            {job.hiringIntensity === "very_high" ? "🔥 Hiring Now" : "Actively Hiring"}
                          </span>
                        )}
                      </div>

                    <div className="space-y-3 mb-6">
                      {job.skill_gap && (
                        <div className="flex items-start gap-2.5">
                          <span className="material-symbols-outlined text-[14px] text-error mt-0.5">radar</span>
                          <div>
                            <p className="text-[9px] font-bold text-on-surface-variant/40 uppercase tracking-widest">Skill Gap</p>
                            <p className="text-xs font-semibold text-on-surface-variant/80 leading-tight">{job.skill_gap}</p>
                          </div>
                        </div>
                      )}
                      {job.why_match && (
                        <div className="flex items-start gap-2.5">
                          <span className="material-symbols-outlined text-[14px] text-muted-indigo mt-0.5" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
                          <div>
                            <p className="text-[9px] font-bold text-on-surface-variant/40 uppercase tracking-widest">Why This Match</p>
                            <p className="text-[11px] font-medium text-on-surface-variant/70 leading-relaxed">{job.why_match}</p>
                          </div>
                        </div>
                      )}
                      {!job.skill_gap && !job.why_match && (
                        <div className="flex items-center gap-2 py-2">
                          <span className="w-3 h-3 rounded-full border-2 border-muted-indigo/30 border-t-muted-indigo animate-spin" />
                          <span className="text-[10px] text-on-surface-variant/50 font-medium">Analyzing match...</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 pt-4 border-t border-outline-variant/10">
                    {isApplied ? (
                      <div className="flex-1 py-2.5 bg-green-500/10 border border-green-500/20 text-green-700 text-[11px] font-bold rounded-xl text-center">
                        ✓ Applied
                      </div>
                    ) : (
                      <button
                        onClick={() => handleApply(job)}
                        className="flex-1 py-2.5 bg-[#1a1a1a] text-[#f5f5e8] text-[11px] font-bold rounded-xl hover:bg-[#2a2a2a] active:scale-95 transition-all shadow-sm flex items-center justify-center gap-1.5"
                      >
                        <span className="material-symbols-outlined text-[13px]" style={{ fontVariationSettings: "'FILL' 1" }}>open_in_new</span>
                        Apply & Track
                      </button>
                    )}
                    <button
                      onClick={() => handleSave(job)}
                      className={`w-10 h-10 flex items-center justify-center rounded-xl border transition-all active:scale-95 ${
                        isSaved
                          ? "bg-[#1a1a1a] text-[#f5f5e8] border-[#1a1a1a]"
                          : "bg-transparent text-on-surface-variant/50 border-black/10 hover:border-[#1a1a1a]/30 hover:text-[#1a1a1a]"
                      }`}
                    >
                      <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: isSaved ? "'FILL' 1" : "'FILL' 0" }}>
                        bookmark
                      </span>
                    </button>
                  </div>
                </motion.div>
              );
            })}
      </div>

      {!loading && opportunities.length === 0 && (
        <div className="text-center py-16 text-on-surface-variant/40">
          <span className="material-symbols-outlined text-[48px] block mb-3">search_off</span>
          <p className="text-sm font-semibold">No opportunities found yet. Complete your onboarding profile to get matched.</p>
        </div>
      )}
    </div>
  );
}
