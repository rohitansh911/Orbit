"use client";

import { useUser } from "@/context/UserContext";
import { useOrbitStore } from "@/lib/store";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function WeeklyReportCard() {
  const { profile } = useUser();
  const { memoryEvents } = useOrbitStore();
  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app, this would hit an API endpoint that looks at memoryEvents
    // and generates a report using the LLM. For now, we simulate the intelligence
    // based on local state to avoid massive LLM calls on every load.

    setTimeout(() => {
      const safeEvents = memoryEvents || [];
      const completed = safeEvents.filter(e => e.type === 'mission_completed').length;
      const skipped = safeEvents.filter(e => e.type === 'mission_skipped').length;
      const momentum = profile?.stats?.momentumScore || 0;

      let insight = "Your telemetry is stabilizing. Awaiting more behavioral data.";
      let tone = "neutral";

      if (completed > 3 && skipped === 0) {
        insight = "Exceptional consistency. Your execution vector is heavily accelerating.";
        tone = "positive";
      } else if (skipped > completed) {
        insight = "High avoidance rate detected. We are recalibrating mission difficulty.";
        tone = "negative";
      } else if (momentum > 50) {
        insight = "Momentum is building. You are compounding XP effectively.";
        tone = "positive";
      }

      setReport({
        completedCount: completed,
        skippedCount: skipped,
        insight,
        tone
      });
      setLoading(false);
    }, 1500);

  }, [memoryEvents, profile]);

  if (loading) {
    return (
      <div className="p-8 rounded-3xl bg-surface-container-low/30 border border-black/5 animate-pulse flex flex-col gap-4">
        <div className="w-1/3 h-4 bg-muted-indigo/20 rounded-md"></div>
        <div className="w-2/3 h-6 bg-muted-indigo/10 rounded-md"></div>
      </div>
    );
  }

  return (
    <Link href="/report" className="block outline-none">
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-8 rounded-3xl premium-card overflow-hidden relative group hover:scale-[1.01] transition-transform cursor-pointer"
      >
      {/* Background glow based on tone */}
      <div className={`absolute top-0 right-0 w-64 h-64 rounded-full blur-[80px] opacity-20 -translate-y-1/2 translate-x-1/4 transition-colors duration-1000 ${
        report?.tone === 'positive' ? 'bg-green-500' : report?.tone === 'negative' ? 'bg-red-500' : 'bg-muted-indigo'
      }`} />

      <div className="relative z-10 flex flex-col gap-6">
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-muted-indigo" style={{ fontVariationSettings: "'FILL' 1" }}>
            summarize
          </span>
          <h3 className="text-sm font-black uppercase tracking-widest text-primary">Intelligence Report</h3>
        </div>

        <p className="text-xl md:text-2xl font-extrabold text-on-surface leading-tight tracking-tight">
          &ldquo;{report?.insight}&rdquo;
        </p>

        <div className="flex items-center gap-6 pt-4 border-t border-black/5">
          <div>
            <p className="text-xs font-bold text-on-surface-variant/50 uppercase tracking-widest">Completed</p>
            <p className="text-xl font-black text-primary">{report?.completedCount}</p>
          </div>
          <div>
            <p className="text-xs font-bold text-on-surface-variant/50 uppercase tracking-widest">Skipped</p>
            <p className="text-xl font-black text-primary">{report?.skippedCount}</p>
          </div>
          <div>
            <p className="text-xs font-bold text-on-surface-variant/50 uppercase tracking-widest">Momentum</p>
            <p className={`text-xl font-black ${profile?.stats?.momentumScore > 50 ? 'text-green-600' : 'text-primary'}`}>
              {profile?.stats?.momentumScore || 0}%
            </p>
          </div>
        </div>
      </div>
      </motion.div>
    </Link>
  );
}
