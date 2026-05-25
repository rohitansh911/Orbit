"use client";

import { motion, Variants } from "framer-motion";
import { Mission, categoryStyles, difficultyStyles } from "./data";

interface AIRecommendedProps {
  missions: Mission[];
  onAdd: (mission: Mission) => void;
  addedIds: Set<string>;
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 300, damping: 25 },
  },
};

export default function AIRecommended({ missions, onAdd, addedIds }: AIRecommendedProps) {
  return (
    <div className="space-y-6">
      {/* Section header */}
      <div className="flex items-end justify-between">
        <div>
          <div className="flex items-center gap-2.5 mb-2">
            <span className="ai-tag">Orbit AI</span>
          </div>
          <h2 className="text-2xl font-extrabold text-primary">Recommended for you</h2>
          <p className="text-sm text-on-surface-variant/50 font-medium mt-1">
            Calibrated to your goals, skill gaps, and internship readiness.
          </p>
        </div>
      </div>

      {/* AI Mission cards */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-3 gap-5"
      >
        {missions.map((mission) => {
          const cat  = categoryStyles[mission.category];
          const diff = difficultyStyles[mission.difficulty];
          const added = addedIds.has(mission.id);

          return (
            <motion.div
              key={mission.id}
              variants={cardVariants}
              whileHover={{ y: -4, scale: 1.01 }}
              className="relative rounded-2xl overflow-hidden mission-card-active"
              style={{
                background: "rgba(255,255,255,0.45)",
                border: "1.5px solid rgba(212,195,190,0.38)",
                boxShadow: "0 2px 8px rgba(68,42,34,0.02), inset 0 1px 0 rgba(255,255,255,0.6)",
              }}
            >
              {/* AI indicator stripe */}
              <div className="h-0.5 w-full bg-gradient-to-r from-transparent via-muted-indigo/40 to-transparent" />

              <div className="p-7 space-y-5">
                {/* Category + difficulty */}
                <div className="flex items-center justify-between">
                  <span className={`cat-badge ${cat.bg} ${cat.text}`}>{mission.category}</span>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3].map((d) => (
                      <div key={d} className={`w-1.5 h-1.5 rounded-full ${d <= diff.dots ? diff.color : "bg-outline-variant/20"}`} />
                    ))}
                  </div>
                </div>

                {/* Title */}
                <div className="space-y-2">
                  <h3 className="font-extrabold text-base leading-snug text-on-surface">{mission.title}</h3>
                  <p className="text-[12px] leading-relaxed font-medium text-on-surface-variant/55">{mission.description}</p>
                </div>

                {/* AI reason chip */}
                {mission.aiReason && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    transition={{ delay: 0.2, duration: 0.4 }}
                    className="flex items-start gap-2.5 p-3 rounded-xl bg-muted-indigo/5 border border-muted-indigo/10 overflow-hidden"
                  >
                    <span className="material-symbols-outlined text-[14px] text-muted-indigo mt-0.5 shrink-0" style={{ fontVariationSettings: "'FILL' 1" }}>
                      auto_awesome
                    </span>
                    <p className="text-[11px] text-muted-indigo font-semibold leading-snug">{mission.aiReason}</p>
                  </motion.div>
                )}

                {/* Footer */}
                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-center gap-3 text-[11px] font-semibold text-on-surface-variant/40">
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">schedule</span>
                      {mission.time}
                    </span>
                    <span className="w-1 h-1 rounded-full bg-outline-variant/40" />
                    <span className="badge-xp px-2.5 py-0.5 rounded-lg text-[10px] font-black">+{mission.xp} XP</span>
                  </div>

                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => !added && onAdd(mission)}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-[11px] font-black transition-colors duration-200 ${
                      added
                        ? "bg-muted-indigo/10 text-muted-indigo border border-muted-indigo/20 cursor-default"
                        : "bg-muted-indigo text-white shadow-lg shadow-muted-indigo/20 hover:shadow-muted-indigo/35"
                    }`}
                  >
                    <motion.span
                      animate={{ rotate: added ? 360 : 0 }}
                      className="material-symbols-outlined text-[14px]"
                      style={{ fontVariationSettings: `'FILL' ${added ? 1 : 0}` }}
                    >
                      {added ? "check" : "add"}
                    </motion.span>
                    {added ? "Added" : "Add to today"}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}
