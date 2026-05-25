"use client";

import { useOrbitStore } from "@/lib/store";
import { useUser } from "@/context/UserContext";
import { useState } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

export default function DailyBriefing() {
  const { profile } = useUser();
  const { dailyBriefing, setDailyBriefing, memoryEvents } = useOrbitStore();
  const [loading, setLoading] = useState(false);

  const today = new Date().toISOString().split('T')[0];
  const isUpToDate = dailyBriefing?.date === today;

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/ai/daily-brief", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role: profile?.onboardingData?.careerGoal,
          level: profile?.stats?.level,
          streak: profile?.stats?.streak,
          momentum: profile?.stats?.momentumScore,
          recentEvents: memoryEvents.slice(0, 5) // Send last 5 events
        })
      });

      if (res.ok) {
        const data = await res.json();
        setDailyBriefing({ date: today, content: data.briefing });
        toast.success("Daily Briefing active.");
      } else {
        toast.error("Failed to generate briefing.");
      }
    } catch (e) {
      toast.error("Network error during briefing generation.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="premium-card rounded-3xl p-6 h-full flex flex-col justify-between group overflow-hidden relative">
      <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
        <span className="material-symbols-outlined text-6xl text-muted-indigo">memory</span>
      </div>

      <div>
        <div className="flex items-center justify-between mb-4 relative z-10">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[14px] text-muted-indigo">data_exploration</span>
            <p className="text-[10px] font-black text-muted-indigo tracking-[0.35em] uppercase">
              Daily Intelligence
            </p>
          </div>
          {isUpToDate && (
            <span className="text-[10px] font-bold text-green-500 uppercase tracking-widest px-2 py-1 bg-green-500/10 rounded-full">
              Active
            </span>
          )}
        </div>

        <h2 className="text-xl font-extrabold text-primary tracking-tight mb-2">Orbit Briefing</h2>
        
        {!isUpToDate && !loading && (
          <p className="text-on-surface-variant/70 text-sm font-medium mb-6">
            Awaiting telemetry sync for today's trajectory.
          </p>
        )}

        {loading && (
          <div className="py-8 flex flex-col items-center justify-center space-y-4">
             <span className="material-symbols-outlined animate-spin text-muted-indigo text-3xl">sync</span>
             <p className="text-xs font-bold text-muted-indigo uppercase tracking-widest animate-pulse">Syncing Telemetry...</p>
          </div>
        )}

        {isUpToDate && dailyBriefing?.content && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4 relative z-10">
            <div>
              <p className="text-xs font-black text-on-surface-variant/50 uppercase tracking-widest mb-1">Focus</p>
              <p className="text-sm font-semibold text-on-surface">{dailyBriefing.content.focus}</p>
            </div>
            
            <div className="flex gap-4">
              <div className="flex-1 bg-surface-container-low/50 p-3 rounded-xl border border-black/5">
                <span className="material-symbols-outlined text-muted-indigo text-[16px] mb-1">trending_up</span>
                <p className="text-[11px] font-semibold text-on-surface-variant/70 leading-snug">{dailyBriefing.content.momentumAnalysis}</p>
              </div>
              {dailyBriefing.content.warning && dailyBriefing.content.warning !== "null" && (
                <div className="flex-1 bg-error/5 p-3 rounded-xl border border-error/10">
                  <span className="material-symbols-outlined text-error text-[16px] mb-1">warning</span>
                  <p className="text-[11px] font-semibold text-error/80 leading-snug">{dailyBriefing.content.warning}</p>
                </div>
              )}
            </div>

            <div className="bg-muted-indigo/5 p-4 rounded-xl border border-muted-indigo/10 mt-2">
              <p className="text-[10px] font-black text-muted-indigo uppercase tracking-[0.2em] mb-1">Strategic Rec</p>
              <p className="text-sm font-bold text-muted-indigo/90">{dailyBriefing.content.recommendation}</p>
            </div>
          </motion.div>
        )}
      </div>

      {!isUpToDate && !loading && (
        <button
          onClick={handleGenerate}
          className="w-full py-3 mt-4 bg-surface-container-high hover:bg-surface-container-highest border border-outline-variant/30 text-primary font-bold text-sm rounded-xl transition-colors flex items-center justify-center gap-2 relative z-10"
        >
          <span className="material-symbols-outlined text-sm">memory</span>
          Initialize Daily Brief
        </button>
      )}
    </div>
  );
}
