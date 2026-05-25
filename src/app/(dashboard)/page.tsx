"use client";

import { motion, Variants } from "framer-motion";
import HeroSection from "@/components/dashboard/HeroSection";
import MomentumEngine from "@/components/dashboard/MomentumEngine";
import DailyQuests from "@/components/dashboard/DailyQuests";
import DailyBriefing from "@/components/dashboard/DailyBriefing";
import ReadinessRadar from "@/components/dashboard/ReadinessRadar";
import OrbitCopilot from "@/components/dashboard/OrbitCopilot";
import CareerSignals from "@/components/dashboard/CareerSignals";
import AmbientBackground from "@/components/ui/AmbientBackground";

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

export default function DashboardPage() {
  return (
    <>
      <AmbientBackground />

      <main className="relative z-10 md:ml-64 pt-24 px-8 md:px-12 pb-16 min-h-screen max-w-[1500px] mx-auto">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="space-y-10"
        >
          <motion.div variants={itemVariants}>
            <HeroSection />
          </motion.div>

          <motion.div variants={itemVariants}>
            <DailyBriefing />
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
            {/* Row 1 */}
            <motion.div variants={itemVariants} className="lg:col-span-5">
              <MomentumEngine />
            </motion.div>
            <motion.div variants={itemVariants} className="lg:col-span-7">
              <DailyQuests />
            </motion.div>

            {/* Row 2 */}
            <motion.div variants={itemVariants} className="lg:col-span-8">
              <ReadinessRadar />
            </motion.div>
            <motion.div variants={itemVariants} className="lg:col-span-4">
              <OrbitCopilot />
            </motion.div>

            {/* Row 3 */}
            <motion.div variants={itemVariants} className="lg:col-span-12">
              <CareerSignals />
            </motion.div>
          </div>
        </motion.div>
      </main>
    </>
  );
}
