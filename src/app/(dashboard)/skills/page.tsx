"use client";

import { motion } from "framer-motion";
import SkillsHero from "@/components/skills/SkillsHero";
import SkillRadarCard from "@/components/skills/SkillRadarCard";
import SkillCalibrationGrid from "@/components/skills/SkillCalibrationGrid";
import WeaknessDetectionPanel from "@/components/skills/WeaknessDetectionPanel";
import MarketSignalsPanel from "@/components/skills/MarketSignalsPanel";
import LearningTrajectory from "@/components/skills/LearningTrajectory";

export default function SkillsPage() {
  return (
    <>
      {/* Ambient Background for consistency */}
      <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden bg-[#fbfbe2]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(99,102,241,0.03)_0%,transparent_70%)]" />
      </div>

      <main className="relative z-10 md:ml-64 pt-24 px-8 md:px-12 pb-24 min-h-screen max-w-[1500px] mx-auto space-y-8">
        
        {/* Section 1: Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
        >
          <SkillsHero />
        </motion.div>

        {/* Section 2: Core Telemetry Grid (Radar + Calibrations) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 25, delay: 0.1 }}
            className="lg:col-span-4"
          >
            <SkillRadarCard />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 25, delay: 0.2 }}
            className="lg:col-span-8 flex flex-col justify-center"
          >
            <SkillCalibrationGrid />
          </motion.div>
        </div>

        {/* Section 3: Intelligence & Growth Panels */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 25, delay: 0.3 }}
          >
            <WeaknessDetectionPanel />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 25, delay: 0.4 }}
          >
            <LearningTrajectory />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 25, delay: 0.5 }}
          >
            <MarketSignalsPanel />
          </motion.div>
        </div>
        
      </main>
    </>
  );
}
