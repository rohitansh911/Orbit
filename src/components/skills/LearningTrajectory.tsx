"use client";

import { motion } from "framer-motion";

export default function LearningTrajectory() {
  const milestones = [
    { label: "Current Level", title: "L4 Aspiring Engineer", date: "Now", active: true },
    { label: "Milestone", title: "DSA Baseline Met", date: "Est. 2 weeks", active: false },
    { label: "Projected", title: "L5 Junior Architect", date: "Est. 2 months", active: false },
  ];

  return (
    <div className="premium-card rounded-3xl p-8 h-full flex flex-col">
      <div className="flex items-center gap-2 mb-8">
        <span className="material-symbols-outlined text-[18px] text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>
          timeline
        </span>
        <h2 className="text-xl font-extrabold text-primary tracking-tight">Learning Trajectory</h2>
      </div>

      <div className="relative flex-1 flex flex-col justify-center px-4">
        {/* Track Line */}
        <div className="absolute left-[27px] top-4 bottom-4 w-px bg-outline-variant/10" />
        <motion.div
          initial={{ height: 0 }}
          animate={{ height: "40%" }}
          transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 }}
          className="absolute left-[27px] top-4 w-px bg-gradient-to-b from-muted-indigo to-transparent drop-shadow-[0_0_8px_rgba(99,102,241,0.5)]"
        />

        <div className="space-y-8">
          {milestones.map((m, i) => (
            <div key={i} className="relative flex items-center gap-6 group">
              {/* Node */}
              <div className="relative flex items-center justify-center w-6 h-6 z-10 shrink-0">
                {m.active ? (
                  <>
                    <div className="absolute inset-0 rounded-full bg-muted-indigo/20 animate-ping" />
                    <div className="w-3 h-3 rounded-full bg-muted-indigo shadow-[0_0_12px_rgba(99,102,241,0.6)] border-2 border-white" />
                  </>
                ) : (
                  <div className="w-2.5 h-2.5 rounded-full bg-outline-variant/30 border-2 border-white group-hover:bg-muted-indigo/40 transition-colors" />
                )}
              </div>

              {/* Content */}
              <motion.div
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + i * 0.15 }}
              >
                <div className="flex items-baseline gap-3 mb-0.5">
                  <span className="text-[10px] font-black tracking-widest uppercase text-muted-indigo">{m.label}</span>
                  <span className="text-[10px] font-bold text-on-surface-variant/40">{m.date}</span>
                </div>
                <h3 className={`text-sm font-bold ${m.active ? "text-on-surface" : "text-on-surface-variant/60"}`}>
                  {m.title}
                </h3>
              </motion.div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
