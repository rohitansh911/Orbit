"use client";

import { useUser } from "@/context/UserContext";
import { useOrbitStore } from "@/lib/store";
import { motion } from "framer-motion";
import ShareableCard from "@/components/ui/ShareableCard";

export default function TimelinePage() {
  const { profile } = useUser();
  const { milestones } = useOrbitStore();

  const safeMilestones = milestones || [];

  return (
    <div className="min-h-screen pt-32 pb-24 px-8 max-w-3xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-16"
      >
        <h1 className="text-4xl font-extrabold tracking-tight mb-4">Trajectory History</h1>
        <p className="text-on-surface-variant max-w-xl text-lg">
          Your persistent record of milestones, achievements, and career evolution.
        </p>
      </motion.div>

      {safeMilestones.length === 0 ? (
        <div className="p-12 text-center border border-dashed border-outline-variant/50 rounded-3xl">
          <span className="material-symbols-outlined text-4xl text-on-surface-variant/30 mb-4 block">
            history
          </span>
          <p className="text-on-surface-variant font-medium">Your timeline is stabilizing. Unlock your first milestone to begin.</p>
        </div>
      ) : (
        <div className="space-y-8">
          {safeMilestones.map((milestone, idx) => (
            <ShareableCard key={milestone.id} filename={`orbit-milestone-${milestone.id}`}>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="flex gap-8 relative p-8 premium-card rounded-3xl"
              >
                {/* Timeline Line (decorative) */}
                <div className="absolute left-[3.25rem] top-24 bottom-[-2rem] w-px bg-gradient-to-b from-black/10 to-transparent hidden md:block" />
                
                <div className="w-10 h-10 shrink-0 rounded-full bg-surface-container-high border-4 border-background flex items-center justify-center relative z-10 hidden md:flex">
                  <span className="w-2 h-2 rounded-full bg-primary" />
                </div>

                <div className="flex-1">
                  <p className="text-xs font-bold uppercase tracking-widest text-on-surface-variant/50 mb-2">
                    {new Date(milestone.unlockedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                  </p>
                  <h3 className="text-2xl font-black tracking-tight mb-2 text-primary">{milestone.label}</h3>
                  <p className="text-on-surface-variant font-medium leading-relaxed">
                    {milestone.description}
                  </p>
                  
                  {/* Orbit branding for export */}
                  <div className="mt-8 pt-6 border-t border-black/5 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-md bg-black flex items-center justify-center">
                        <span className="text-white font-black text-[8px]">O</span>
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant/50">Orbit</span>
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">
                      Lvl {profile?.stats?.level}
                    </span>
                  </div>
                </div>
              </motion.div>
            </ShareableCard>
          ))}
        </div>
      )}
    </div>
  );
}
