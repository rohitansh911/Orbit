"use client";

import { motion } from "framer-motion";
import { useUser } from "@/context/UserContext";
import { useOrbitStore } from "@/lib/store";
import { useState } from "react";
import toast from "react-hot-toast";
import AmbientBackground from "@/components/ui/AmbientBackground";
import EvolutionVisualizer from "@/components/report/EvolutionVisualizer";

export default function ReportPage() {
  const { profile } = useUser();
  const { weeklyReports, addWeeklyReport, memoryEvents } = useOrbitStore();
  const [loading, setLoading] = useState(false);

  const latestReport = weeklyReports[0];

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/ai/weekly-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role: profile?.onboardingData?.careerGoal,
          level: profile?.stats?.level,
          xpGained: 450, // mock delta
          missionsCompleted: memoryEvents.filter(e => e.type === 'mission_completed').length,
          memoryEvents: memoryEvents.slice(0, 20)
        })
      });

      if (res.ok) {
        const data = await res.json();
        addWeeklyReport({
          date: new Date().toISOString(),
          content: data.report
        });
        toast.success("Evolution Report Generated");
      } else {
        toast.error("Failed to map evolution.");
      }
    } catch (e) {
      toast.error("Network error during generation.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <AmbientBackground />
      <div className="min-h-screen pt-32 pb-24 px-8 md:px-12 md:ml-64 max-w-5xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6"
        >
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight mb-4 text-primary">Evolution Report</h1>
            <p className="text-on-surface-variant max-w-xl text-lg">
              Cinematic analysis of your weekly trajectory and skill progression.
            </p>
          </div>
          
          <button
            onClick={handleGenerate}
            disabled={loading}
            className="px-6 py-3 bg-primary text-white font-bold rounded-xl shadow-lg shadow-primary/20 hover:shadow-primary/40 active:scale-95 transition-all disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2"
          >
            {loading ? (
              <span className="material-symbols-outlined animate-spin text-sm">sync</span>
            ) : (
              <span className="material-symbols-outlined text-sm">auto_graph</span>
            )}
            Compile Report
          </button>
        </motion.div>

        {!latestReport && !loading && (
          <div className="p-12 text-center border border-dashed border-outline-variant/50 rounded-3xl mt-12">
            <span className="material-symbols-outlined text-5xl text-on-surface-variant/30 mb-4 block">
              analytics
            </span>
            <p className="text-on-surface-variant font-medium text-lg mb-2">No weekly data compiled.</p>
            <p className="text-on-surface-variant/60 text-sm">Click the button above to generate your first evolution report.</p>
          </div>
        )}

        {loading && (
          <div className="py-24 flex flex-col items-center justify-center space-y-6">
            <div className="relative w-24 h-24">
              <div className="absolute inset-0 rounded-full border-4 border-muted-indigo/20 border-t-muted-indigo animate-spin" />
              <span className="absolute inset-0 flex items-center justify-center material-symbols-outlined text-muted-indigo text-[32px] animate-pulse">
                insights
              </span>
            </div>
            <p className="text-lg font-bold text-primary">Synthesizing telemetry...</p>
          </div>
        )}

        {latestReport && !loading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <div className="p-8 rounded-3xl bg-surface-container-high border border-outline-variant/30 shadow-2xl shadow-primary/5">
              <h3 className="text-xs font-black text-muted-indigo uppercase tracking-[0.2em] mb-4">Executive Summary</h3>
              <p className="text-on-surface font-semibold text-2xl leading-tight">
                {latestReport.content.executiveSummary}
              </p>
            </div>

            <EvolutionVisualizer data={latestReport.content} />

            <div className="premium-card p-8 rounded-3xl">
              <h3 className="text-xs font-black text-muted-indigo uppercase tracking-[0.2em] mb-6">Strategic Observations</h3>
              <ul className="space-y-4">
                {latestReport.content.observations?.map((obs: string, idx: number) => (
                  <li key={idx} className="flex items-start gap-4 p-4 rounded-2xl bg-surface-container-low/50 border border-black/5">
                    <span className="material-symbols-outlined text-primary mt-0.5">psychology</span>
                    <span className="text-base font-medium text-on-surface/90 leading-relaxed">{obs}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        )}
      </div>
    </>
  );
}
