"use client";

import { useUser } from "@/context/UserContext";
import { useOrbitStore } from "@/lib/store";
import { motion } from "framer-motion";
import { useState } from "react";
import toast from "react-hot-toast";

export default function RoadmapPage() {
  const { profile } = useUser();
  const { careerRoadmap, setCareerRoadmap } = useOrbitStore();
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/ai/roadmap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role: profile?.onboardingData?.careerGoal,
          level: profile?.stats?.level,
          skills: profile?.onboardingData?.skills,
          momentum: profile?.stats?.momentumScore,
          memoryEvents: useOrbitStore.getState().memoryEvents.slice(0, 15) // send recent memory context
        })
      });

      if (res.ok) {
        const data = await res.json();
        setCareerRoadmap(data.roadmap);
        toast.success("Strategic Trajectory Generated");
      } else {
        toast.error("Failed to map trajectory.");
      }
    } catch (e) {
      toast.error("Network error during generation.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-32 pb-24 px-8 md:px-12 md:ml-64 max-w-5xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6"
      >
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight mb-4 text-primary">Trajectory Engine</h1>
          <p className="text-on-surface-variant max-w-xl text-lg">
            Your personalized, adaptive roadmap to reach <strong>{profile?.onboardingData?.careerGoal || "your target role"}</strong>.
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
            <span className="material-symbols-outlined text-sm">explore</span>
          )}
          {careerRoadmap ? "Recalibrate Trajectory" : "Map Trajectory"}
        </button>
      </motion.div>

      {!careerRoadmap && !loading && (
        <div className="p-12 text-center border border-dashed border-outline-variant/50 rounded-3xl mt-12">
          <span className="material-symbols-outlined text-5xl text-on-surface-variant/30 mb-4 block">
            map
          </span>
          <p className="text-on-surface-variant font-medium text-lg mb-2">No active trajectory mapped.</p>
          <p className="text-on-surface-variant/60 text-sm">Click the button above to generate your strategic roadmap.</p>
        </div>
      )}

      {loading && (
        <div className="py-24 flex flex-col items-center justify-center space-y-6">
          <div className="relative w-24 h-24">
            <div className="absolute inset-0 rounded-full border-4 border-muted-indigo/20 border-t-muted-indigo animate-spin" />
            <div className="absolute inset-2 rounded-full border-4 border-soft-lavender/30 border-b-soft-lavender animate-spin-slow" />
            <span className="absolute inset-0 flex items-center justify-center material-symbols-outlined text-muted-indigo text-[32px] animate-pulse">
              radar
            </span>
          </div>
          <p className="text-lg font-bold text-primary">Calculating Vector...</p>
        </div>
      )}

      {careerRoadmap && !loading && (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="space-y-12"
        >
          <div className="p-6 rounded-2xl bg-muted-indigo/5 border border-muted-indigo/20">
            <h3 className="text-xs font-black text-muted-indigo uppercase tracking-[0.2em] mb-2">Executive Summary</h3>
            <p className="text-on-surface font-semibold text-lg leading-relaxed">{careerRoadmap.summary}</p>
          </div>

          <div className="relative">
            {/* Connecting line */}
            <div className="absolute left-6 top-8 bottom-8 w-px bg-gradient-to-b from-primary/50 via-primary/20 to-transparent hidden md:block" />

            <div className="space-y-12">
              {careerRoadmap.phases?.map((phase: any, idx: number) => (
                <div key={idx} className="relative flex flex-col md:flex-row gap-8">
                  
                  {/* Phase Marker */}
                  <div className="hidden md:flex flex-col items-center z-10 shrink-0 pt-6">
                    <div className="w-12 h-12 rounded-full bg-surface-container-high border-4 border-background flex items-center justify-center shadow-lg">
                      <span className="text-primary font-black text-lg">{idx + 1}</span>
                    </div>
                  </div>

                  <div className="flex-1 premium-card p-8 rounded-3xl group hover:-translate-y-1 transition-transform">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <span className="text-[10px] font-black text-muted-indigo uppercase tracking-widest">{phase.duration}</span>
                        <h2 className="text-2xl font-extrabold text-on-surface mt-1">{phase.title}</h2>
                      </div>
                    </div>
                    
                    <p className="text-on-surface-variant font-medium mb-8 leading-relaxed">
                      {phase.focus}
                    </p>

                    <div className="space-y-4">
                      <h4 className="text-xs font-black text-on-surface-variant/50 uppercase tracking-widest">Key Milestones</h4>
                      <ul className="space-y-3">
                        {phase.milestones?.map((milestone: string, mIdx: number) => (
                          <li key={mIdx} className="flex items-start gap-3 p-3 rounded-xl bg-surface-container-low/50 border border-black/5">
                            <span className="material-symbols-outlined text-green-500 text-sm mt-0.5">check_circle</span>
                            <span className="text-sm font-semibold text-on-surface/80">{milestone}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
