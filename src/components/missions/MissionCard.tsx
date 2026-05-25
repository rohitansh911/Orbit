"use client";

import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mission, categoryStyles, difficultyStyles } from "./data";

interface MissionCardProps {
  mission: Mission;
  onComplete: (id: string, xp: number, rect: DOMRect) => void;
  enterClass?: string;
}

export default function MissionCard({ mission, onComplete, enterClass = "" }: MissionCardProps) {
  const [justCompleted, setJustCompleted] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const cat = categoryStyles[mission.category];
  const diff = difficultyStyles[mission.difficulty];

  const handleComplete = () => {
    if (mission.completed || justCompleted) return;
    setJustCompleted(true);

    const rect = cardRef.current?.getBoundingClientRect();
    if (rect) {
      onComplete(mission.id, mission.xp, rect);
    }
  };

  const isDone = mission.completed || justCompleted;

  return (
    <motion.div
      ref={cardRef}
      layout
      whileHover={!isDone ? { y: -2, scale: 1.01 } : {}}
      whileTap={!isDone ? { scale: 0.99 } : {}}
      transition={{ type: "spring", stiffness: 350, damping: 25 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`relative rounded-2xl overflow-hidden ${enterClass}
        ${isDone ? "" : "cursor-pointer"}
        ${justCompleted ? "mission-complete-ring complete-sweep" : ""}
      `}
      style={{
        backgroundColor: isDone
          ? "rgba(239,237,215,0.5)"
          : cat.cardBg, // using soft category tint
        border: `1px solid ${isDone ? "rgba(212,195,190,0.15)" : "rgba(212,195,190,0.25)"}`,
        boxShadow: isDone
          ? "none"
          : "0 2px 8px rgba(0,0,0,0.015), inset 0 1px 0 rgba(255,255,255,0.8)",
        opacity: isDone ? 0.6 : 1,
        filter: isDone ? "saturate(0.5)" : "none",
      }}
      onClick={handleComplete}
    >
      {/* Hover top-glow line */}
      {!isDone && (
        <motion.div
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-muted-indigo/30 to-transparent"
        />
      )}

      <div className="p-7 space-y-5">
        {/* Top row: category + difficulty dots */}
        <div className="flex items-center justify-between">
          <span className={`cat-badge ${cat.bg} ${cat.text}`}>
            {mission.category}
          </span>
          <div className="flex items-center gap-1">
            {[1, 2, 3].map((d) => (
              <motion.div
                key={d}
                initial={false}
                animate={{
                  backgroundColor: d <= diff.dots ? "rgba(99,102,241,0.7)" : "rgba(212,195,190,0.2)",
                  scale: d <= diff.dots ? 1 : 0.8,
                }}
                className={`w-1.5 h-1.5 rounded-full ${d <= diff.dots ? diff.color : "bg-outline-variant/20"}`}
              />
            ))}
          </div>
        </div>

        {/* Title */}
        <motion.div layout className="space-y-2">
          <motion.h3
            layout
            className={`font-extrabold text-base leading-snug transition-colors duration-300 ${
              isDone ? "line-through text-on-surface/40" : "text-on-surface"
            }`}
          >
            {mission.title}
          </motion.h3>
          <motion.p
            layout
            className={`text-[12px] leading-relaxed font-medium transition-all ${
              isDone ? "text-on-surface-variant/25" : "text-on-surface-variant/55"
            }`}
          >
            {mission.description}
          </motion.p>
        </motion.div>

        {/* AI reason chip */}
        {mission.aiReason && (
          <motion.div
            layout
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            transition={{ delay: 0.1, duration: 0.4 }}
            className={`flex items-start gap-2.5 p-3 rounded-xl border overflow-hidden transition-all duration-300 ${isDone ? 'bg-black/[0.02] border-black/5' : 'bg-muted-indigo/5 border-muted-indigo/10'}`}
          >
            <span className={`material-symbols-outlined text-[14px] mt-0.5 shrink-0 ${isDone ? 'text-on-surface-variant/40' : 'text-muted-indigo'}`} style={{ fontVariationSettings: "'FILL' 1" }}>
              auto_awesome
            </span>
            <p className={`text-[11px] font-semibold leading-snug ${isDone ? 'text-on-surface-variant/40' : 'text-muted-indigo'}`}>
              {mission.aiReason}
            </p>
          </motion.div>
        )}

        {/* Bottom row */}
        <motion.div layout className="flex items-center justify-between pt-1">
          {/* Time + difficulty label */}
          <div className="flex items-center gap-3 text-[11px] font-semibold text-on-surface-variant/40">
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">schedule</span>
              {mission.time}
            </span>
            <span className="w-1 h-1 rounded-full bg-outline-variant/40" />
            <span>{mission.difficulty}</span>
          </div>

          {/* XP badge + check */}
          <div className="flex items-center gap-3">
            <motion.span
              layout
              className={`badge-xp px-3 py-1 rounded-lg text-[10px] font-black transition-all ${
                isDone ? "opacity-40" : ""
              }`}
            >
              +{mission.xp} XP
            </motion.span>

            {/* Completion circle */}
            <motion.div
              layout
              className={`w-7 h-7 rounded-full border flex items-center justify-center transition-all duration-400 ${
                isDone
                  ? "bg-muted-indigo border-muted-indigo shadow-[0_0_12px_rgba(99,102,241,0.4)]"
                  : "border-black/10 hover:border-muted-indigo/50"
              }`}
            >
              <AnimatePresence>
                {isDone && (
                  <motion.span
                    initial={{ scale: 0, rotate: -45 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", stiffness: 500, damping: 20 }}
                    className="material-symbols-outlined text-[14px] text-white"
                    style={{ fontVariationSettings: "'FILL' 1,'wght' 600" }}
                  >
                    check
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
