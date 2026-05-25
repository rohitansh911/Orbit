"use client";

import { useCallback, useState } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { DAILY_MISSIONS, AI_MISSIONS, Mission } from "./data";
import MissionsHero from "./MissionsHero";
import DailyMissions from "./DailyMissions";
import ProgressionPanel from "./ProgressionPanel";
import AIRecommended from "./AIRecommended";
import AmbientBackground from "@/components/ui/AmbientBackground";

interface XPBurst {
  id: number;
  xp: number;
  x: number;
  y: number;
}

const BASE_TOTAL_XP = 740; // user's existing XP before today
const STREAK = 12;

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 300, damping: 24 },
  },
};

export default function MissionsPage() {
  const [missions, setMissions] = useState<Mission[]>(DAILY_MISSIONS);
  const [addedAI, setAddedAI] = useState<Set<string>>(new Set());
  const [bursts, setBursts] = useState<XPBurst[]>([]);
  const [burstCounter, setBurstCounter] = useState(0);
  const [earnedXP, setEarnedXP] = useState(0);

  const handleComplete = useCallback((id: string, xp: number, rect: DOMRect) => {
    // Mark mission complete
    setMissions((prev) =>
      prev.map((m) => (m.id === id ? { ...m, completed: true } : m))
    );

    // Accumulate XP
    setEarnedXP((prev) => prev + xp);

    // Spawn XP burst — position relative to card center
    const burstId = burstCounter;
    setBurstCounter((c) => c + 1);
    setBursts((prev) => [
      ...prev,
      {
        id: burstId,
        xp,
        x: rect.left + rect.width / 2 - 30,
        y: rect.top + rect.height / 2 - 20,
      },
    ]);

    // Remove burst after animation
    setTimeout(() => {
      setBursts((prev) => prev.filter((b) => b.id !== burstId));
    }, 1500);
  }, [burstCounter]);

  const handleAddAI = useCallback((mission: Mission) => {
    setAddedAI((prev) => new Set([...prev, mission.id]));
    setMissions((prev) => [...prev, { ...mission, id: `added-${mission.id}` }]);
  }, []);

  const completedCount = missions.filter((m) => m.completed).length;
  const totalXP = BASE_TOTAL_XP + earnedXP;

  return (
    <>
      <AmbientBackground />

      {/* XP burst portals — fixed over entire viewport using framer motion */}
      <AnimatePresence>
        {bursts.map((burst) => (
          <motion.div
            key={burst.id}
            initial={{ opacity: 0, y: burst.y, scale: 0.5, x: burst.x }}
            animate={{ opacity: [0, 1, 1, 0], y: burst.y - 80, scale: [0.5, 1.2, 1, 0.8] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="fixed z-50 text-[14px] font-black text-muted-indigo whitespace-nowrap pointer-events-none drop-shadow-[0_0_12px_rgba(99,102,241,0.6)]"
          >
            +{burst.xp} XP ✦
          </motion.div>
        ))}
      </AnimatePresence>

      <main className="relative z-10 md:ml-64 pt-24 px-8 md:px-12 pb-20 min-h-screen max-w-[1500px] mx-auto">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="space-y-12"
        >
          {/* Hero */}
          <motion.div variants={itemVariants}>
            <MissionsHero
              totalXP={totalXP}
              earnedXP={earnedXP}
              streak={STREAK}
              completedCount={completedCount}
              totalCount={missions.length}
            />
          </motion.div>

          {/* Main content grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Left — missions */}
            <div className="lg:col-span-8 space-y-14">
              <motion.div variants={itemVariants}>
                <DailyMissions missions={missions} onComplete={handleComplete} />
              </motion.div>

              {/* Divider */}
              <motion.div variants={itemVariants} className="relative">
                <div className="h-px bg-gradient-to-r from-transparent via-outline-variant/30 to-transparent" />
              </motion.div>

              <motion.div variants={itemVariants}>
                <AIRecommended missions={AI_MISSIONS} onAdd={handleAddAI} addedIds={addedAI} />
              </motion.div>
            </div>

            {/* Right — progression panel */}
            <motion.div variants={itemVariants} className="lg:col-span-4">
              <div className="sticky top-24">
                <ProgressionPanel
                  totalXP={totalXP}
                  earnedXP={earnedXP}
                  streak={STREAK}
                  completedToday={completedCount}
                />
              </div>
            </motion.div>
          </div>
        </motion.div>
      </main>
    </>
  );
}
