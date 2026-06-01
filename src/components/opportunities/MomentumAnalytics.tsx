"use client";

import { motion } from "framer-motion";
import { MomentumData } from "@/hooks/useOpportunities";

interface MomentumAnalyticsProps {
  momentum?: MomentumData;
  loading?: boolean;
}

const DEFAULT: MomentumData = {
  appsThisWeek: 0, appsLastWeek: 0, responseRate: 0,
  visibilityScore: 0, velocityLabel: "Pipeline not yet active",
  savedCount: 0, appliedCount: 0, interviewCount: 0, offerCount: 0,
};

export default function MomentumAnalytics({ momentum = DEFAULT, loading }: MomentumAnalyticsProps) {
  const weekDelta = momentum.appsThisWeek - momentum.appsLastWeek;
  const weekDeltaLabel = weekDelta > 0 ? `+${weekDelta}` : `${weekDelta}`;
  const barWidth = Math.min((momentum.appsThisWeek / 10) * 100, 100);
  const responseBarWidth = Math.min(momentum.responseRate, 100);

  return (
    <div className="bg-white/40 border border-black/5 rounded-[24px] p-6 shadow-sm flex flex-col md:flex-row gap-6 md:gap-10 items-center justify-between w-full relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-full bg-[radial-gradient(ellipse_at_top_right,rgba(99,102,241,0.05)_0%,transparent_70%)] pointer-events-none" />

      <div className="flex items-center gap-3 shrink-0">
        <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center border border-primary/10">
          <span className="material-symbols-outlined text-[20px] text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>monitoring</span>
        </div>
        <div>
          <h3 className="text-sm font-bold text-on-surface">Momentum Analytics</h3>
          <p className="text-[10px] font-bold text-on-surface-variant/50 uppercase tracking-[0.1em]">Trailing 7 Days</p>
        </div>
      </div>

      <div className="w-px h-10 bg-outline-variant/20 hidden md:block" />

      <div className="flex-1 grid grid-cols-2 lg:grid-cols-4 gap-6 w-full">
        {/* Apps / Week */}
        <div>
          <div className="flex justify-between items-baseline mb-2">
            <span className="text-[10px] font-bold text-on-surface-variant/60 tracking-wider">APPS / WK</span>
            {!loading && weekDelta !== 0 && (
              <span className={`text-[10px] font-black ${weekDelta > 0 ? "text-green-600" : "text-error"}`}>{weekDeltaLabel}</span>
            )}
          </div>
          <div className="flex items-end gap-2">
            {loading ? (
              <div className="h-7 w-8 bg-on-surface/5 rounded-lg animate-pulse" />
            ) : (
              <span className="text-2xl font-black text-on-surface leading-none">{momentum.appsThisWeek}</span>
            )}
            <div className="h-1.5 flex-1 bg-outline-variant/10 rounded-full overflow-hidden mb-1">
              <motion.div initial={{ width: 0 }} animate={{ width: `${barWidth}%` }} transition={{ duration: 1 }} className="h-full bg-muted-indigo rounded-full" />
            </div>
          </div>
        </div>

        {/* Response Rate */}
        <div>
          <div className="flex justify-between items-baseline mb-2">
            <span className="text-[10px] font-bold text-on-surface-variant/60 tracking-wider">RESPONSE RATE</span>
            {!loading && momentum.responseRate > 20 && (
              <span className="text-[10px] font-black text-muted-indigo">TOP 10%</span>
            )}
          </div>
          <div className="flex items-end gap-2">
            {loading ? (
              <div className="h-7 w-12 bg-on-surface/5 rounded-lg animate-pulse" />
            ) : (
              <span className="text-2xl font-black text-on-surface leading-none">
                {momentum.responseRate}<span className="text-xs text-on-surface-variant/50">%</span>
              </span>
            )}
            <div className="h-4 w-full flex items-end gap-0.5 mb-0.5 opacity-60">
              {[0.4, 0.6, 0.3, responseBarWidth / 100].map((h, i) => (
                <motion.div key={i} initial={{ height: "20%" }} animate={{ height: `${h * 100}%` }} transition={{ delay: i * 0.1 }} className="flex-1 bg-muted-indigo/60 rounded-sm" />
              ))}
            </div>
          </div>
        </div>

        {/* Visibility Score */}
        <div>
          <div className="flex justify-between items-baseline mb-2">
            <span className="text-[10px] font-bold text-on-surface-variant/60 tracking-wider">VISIBILITY</span>
            {!loading && momentum.visibilityScore > 100 && (
              <span className="text-[10px] font-black text-green-600">Active</span>
            )}
          </div>
          <div className="flex items-center gap-3">
            {loading ? (
              <div className="h-7 w-14 bg-on-surface/5 rounded-lg animate-pulse" />
            ) : (
              <>
                <span className="text-2xl font-black text-on-surface leading-none">{momentum.visibilityScore}</span>
                <span className="text-[10px] font-semibold text-on-surface-variant/50 leading-tight">recruiter<br />score</span>
              </>
            )}
          </div>
        </div>

        {/* Velocity */}
        <div>
          <div className="flex justify-between items-baseline mb-2">
            <span className="text-[10px] font-bold text-on-surface-variant/60 tracking-wider">VELOCITY</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded-full border border-soft-lavender/30 flex items-center justify-center shrink-0">
              <span className="w-2 h-2 rounded-full bg-soft-lavender animate-pulse" />
            </div>
            {loading ? (
              <div className="h-4 w-24 bg-on-surface/5 rounded-full animate-pulse" />
            ) : (
              <span className="text-[11px] font-bold text-on-surface-variant/70">{momentum.velocityLabel}</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
