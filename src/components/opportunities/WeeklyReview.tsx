"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Application } from "@/hooks/useOpportunities";
import { useUser } from "@/context/UserContext";

interface WeeklyReviewProps {
  applications: Application[];
}

interface ReviewData {
  headline: string;
  momentum: "accelerating" | "steady" | "stalling" | "stuck";
  wins: string[];
  concerns: string[];
  pattern: string;
  next_week_focus: string;
  conversion_rate: number;
  verdict: string;
}

const CACHE_KEY = "orbit_weekly_review";
const CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

const MOMENTUM_STYLES = {
  accelerating: { bg: "bg-green-50", border: "border-green-200", text: "text-green-700", icon: "rocket_launch", dot: "bg-green-400" },
  steady:       { bg: "bg-blue-50",  border: "border-blue-200",  text: "text-blue-700",  icon: "trending_up",   dot: "bg-blue-400" },
  stalling:     { bg: "bg-amber-50", border: "border-amber-200", text: "text-amber-700", icon: "trending_flat",  dot: "bg-amber-400" },
  stuck:        { bg: "bg-red-50",   border: "border-red-200",   text: "text-red-700",   icon: "trending_down",  dot: "bg-red-400" },
};

// FIX #5: Safe JSON parse helper
function safeParseReview(raw: unknown): ReviewData | null {
  try {
    if (!raw) return null;
    if (typeof raw === "object" && raw !== null && "headline" in raw) return raw as ReviewData;
    if (typeof raw === "string") return JSON.parse(raw) as ReviewData;
    return null;
  } catch {
    return null;
  }
}

// FIX #5: Load from localStorage cache
function loadCache(uid?: string): { review: ReviewData; ts: number } | null {
  if (!uid || typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(`${CACHE_KEY}_${uid}`);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (Date.now() - parsed.ts < CACHE_TTL_MS) return parsed;
    localStorage.removeItem(`${CACHE_KEY}_${uid}`);
    return null;
  } catch { return null; }
}

function saveCache(uid: string, review: ReviewData) {
  try {
    localStorage.setItem(`${CACHE_KEY}_${uid}`, JSON.stringify({ review, ts: Date.now() }));
  } catch {}
}

export default function WeeklyReview({ applications }: WeeklyReviewProps) {
  const { profile } = useUser();
  const uid = profile?.uid;

  // FIX #5: Initialize from cache immediately — no flash
  const [review, setReview] = useState<ReviewData | null>(() => loadCache(uid)?.review ?? null);
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [lastGenerated, setLastGenerated] = useState<Date | null>(() => {
    const c = loadCache(uid);
    return c ? new Date(c.ts) : null;
  });

  // FIX #16 (from QA): cooldown ref to prevent spam
  const cooldownRef = useRef(false);

  // FIX #5: Auto-generate only if no cache and 2+ apps
  useEffect(() => {
    if (applications.length >= 2 && !review && !loading) {
      handleGenerate();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [applications.length]);

  const handleGenerate = useCallback(async (forced = false) => {
    if (cooldownRef.current && !forced) return;
    if (loading) return;
    cooldownRef.current = true;
    setTimeout(() => { cooldownRef.current = false; }, 30_000); // 30s cooldown

    setLoading(true);
    try {
      const res = await fetch("/api/ai/weekly-review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ applications, profile }),
      });
      const data = await res.json();

      // FIX #1: Safe JSON parse — won't crash on malformed AI response
      const parsed = safeParseReview(data.review);
      if (parsed) {
        setReview(parsed);
        setLastGenerated(new Date());
        setExpanded(true);
        if (uid) saveCache(uid, parsed);
      }
    } catch (e) {
      console.error("Weekly review failed:", e);
      // Silently fail — don't crash the component
    } finally {
      setLoading(false);
    }
  }, [applications, profile, uid, loading]);

  const style = review ? (MOMENTUM_STYLES[review.momentum] ?? MOMENTUM_STYLES.stalling) : MOMENTUM_STYLES.stalling;

  // Stats from applications
  const oneWeekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
  const thisWeekApps = applications.filter(a => new Date(a.created_at).getTime() > oneWeekAgo);
  const thisWeekApplied = thisWeekApps.filter(a => a.status === "applied").length;
  const totalInterviewing = applications.filter(a => a.status === "interviewing").length;
  const totalRejected = applications.filter(a => a.status === "rejected").length;
  const totalOffers = applications.filter(a => a.status === "offer").length;

  // FIX #9: Escape key closes expanded view
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") setExpanded(false); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="premium-card rounded-[24px] p-8 space-y-5"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[18px] text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>
            analytics
          </span>
          <div>
            <h2 className="text-xl font-extrabold text-primary tracking-tight">Weekly Review</h2>
            {lastGenerated && (
              <p className="text-[10px] text-on-surface-variant/40 font-medium">
                Updated {lastGenerated.toLocaleDateString("en-US", { month: "short", day: "numeric" })} · {lastGenerated.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
                <span className="ml-1 opacity-60">(cached 24h)</span>
              </p>
            )}
          </div>
        </div>
        <button onClick={() => handleGenerate(true)} disabled={loading}
          className="px-4 py-2 bg-[#1a1a1a] text-[#f5f5e8] text-[10px] font-bold rounded-xl hover:bg-[#2a2a2a] active:scale-95 transition-all disabled:opacity-50 flex items-center gap-1.5">
          <span className={`material-symbols-outlined text-[13px] ${loading ? "animate-spin" : ""}`}>
            {loading ? "sync" : "refresh"}
          </span>
          {loading ? "Analyzing..." : "Refresh"}
        </button>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Applied this week", value: thisWeekApplied, icon: "send" },
          { label: "Interviewing",      value: totalInterviewing, icon: "groups",      highlight: totalInterviewing > 0 },
          { label: "Offers",            value: totalOffers,       icon: "celebration", highlight: totalOffers > 0 },
          { label: "Rejected",          value: totalRejected,     icon: "cancel",      warn: totalRejected > 0 && totalRejected > totalInterviewing },
        ].map(s => (
          <div key={s.label}
            className={`p-3 rounded-xl border text-center ${(s as any).highlight ? "bg-green-50 border-green-200" : (s as any).warn && s.value > 0 ? "bg-red-50/50 border-red-200/50" : "bg-black/3 border-black/5"}`}>
            <p className={`text-2xl font-black ${(s as any).highlight ? "text-green-700" : (s as any).warn && s.value > 0 ? "text-red-600" : "text-on-surface"}`}>{s.value}</p>
            <p className="text-[9px] font-bold text-on-surface-variant/50 mt-0.5 leading-tight">{s.label}</p>
          </div>
        ))}
      </div>

      {/* AI Review */}
      {loading && (
        <div className="flex items-center gap-3 p-4 bg-black/3 rounded-xl">
          <div className="w-5 h-5 border-2 border-[#1a1a1a] border-t-transparent rounded-full animate-spin shrink-0" />
          <p className="text-[12px] text-on-surface-variant/60 font-medium">Analyzing your search patterns...</p>
        </div>
      )}

      {!loading && !review && applications.length < 2 && (
        <div className="text-center py-6 space-y-2">
          <span className="material-symbols-outlined text-3xl text-on-surface-variant/20 block">analytics</span>
          <p className="text-[12px] text-on-surface-variant/40 font-medium">Apply to 2+ jobs to unlock weekly insights</p>
        </div>
      )}

      {review && !loading && (
        <div className={`rounded-xl border p-4 space-y-3 ${style.bg} ${style.border}`}>
          {/* Momentum header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className={`material-symbols-outlined text-[18px] ${style.text}`} style={{ fontVariationSettings: "'FILL' 1" }}>
                {style.icon}
              </span>
              <p className={`text-sm font-extrabold ${style.text}`}>{review.headline}</p>
            </div>
            <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-1 rounded-lg ${style.bg} ${style.text} border ${style.border}`}>
              {review.momentum}
            </span>
          </div>

          <AnimatePresence>
            {expanded && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
                className="space-y-3 overflow-hidden">

                {/* Conversion rate */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] font-bold text-on-surface-variant/60">
                    <span>Interview conversion rate</span>
                    <span className={style.text}>{Math.min(review.conversion_rate, 100)}%</span>
                  </div>
                  <div className="h-1.5 bg-black/10 rounded-full overflow-hidden">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${Math.min(review.conversion_rate, 100)}%` }} transition={{ duration: 0.8, delay: 0.2 }}
                      className="h-full bg-[#1a1a1a] rounded-full" />
                  </div>
                </div>

                {review.wins.length > 0 && (
                  <div className="space-y-1">
                    <p className="text-[9px] font-bold text-on-surface-variant/50 uppercase tracking-wider">This week's wins</p>
                    {review.wins.map((w, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <span className="text-green-600 text-[11px] shrink-0 mt-0.5">✓</span>
                        <p className="text-[11px] text-on-surface-variant/70 font-medium">{w}</p>
                      </div>
                    ))}
                  </div>
                )}

                {review.concerns.length > 0 && (
                  <div className="space-y-1">
                    <p className="text-[9px] font-bold text-on-surface-variant/50 uppercase tracking-wider">Watch out</p>
                    {review.concerns.map((c, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <span className="text-amber-600 text-[11px] shrink-0 mt-0.5">⚠</span>
                        <p className="text-[11px] text-on-surface-variant/70 font-medium">{c}</p>
                      </div>
                    ))}
                  </div>
                )}

                <div className="p-3 bg-white/60 rounded-xl border border-black/5">
                  <p className="text-[9px] font-bold text-on-surface-variant/50 uppercase tracking-wider mb-1">Pattern detected</p>
                  <p className="text-[11px] font-semibold text-on-surface/80">{review.pattern}</p>
                </div>

                <div className="p-3 bg-[#1a1a1a] rounded-xl">
                  <p className="text-[9px] font-bold text-[#f5f5e8]/50 uppercase tracking-wider mb-1">Next week: focus on</p>
                  <p className="text-[12px] font-bold text-[#f5f5e8]">{review.next_week_focus}</p>
                </div>

                <p className="text-[11px] text-on-surface-variant/60 italic text-center">{review.verdict}</p>
              </motion.div>
            )}
          </AnimatePresence>

          <button onClick={() => setExpanded(e => !e)}
            className="w-full flex items-center justify-center gap-1 text-[9px] font-bold text-on-surface-variant/40 hover:text-on-surface-variant/60 transition-all pt-1">
            <span className="material-symbols-outlined text-[13px]">{expanded ? "expand_less" : "expand_more"}</span>
            {expanded ? "Collapse" : "See full analysis"}
          </button>
        </div>
      )}
    </motion.div>
  );
}
