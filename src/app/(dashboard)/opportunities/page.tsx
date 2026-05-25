"use client";

import { motion } from "framer-motion";
import OpportunitiesHero from "@/components/opportunities/OpportunitiesHero";
import MarketSignalsStrip from "@/components/opportunities/MarketSignalsStrip";
import RecommendedGrid from "@/components/opportunities/RecommendedGrid";
import ResumeAnalyzer from "@/components/opportunities/ResumeAnalyzer";
import ApplicationPipeline from "@/components/opportunities/ApplicationPipeline";
import MomentumAnalytics from "@/components/opportunities/MomentumAnalytics";
import OrbitRecommendations from "@/components/opportunities/OrbitRecommendations";

export default function OpportunitiesPage() {
  return (
    <>
      {/* Ambient Background for consistency */}
      <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden bg-[#fbfbe2]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(167,139,250,0.03)_0%,transparent_70%)]" />
      </div>

      <main className="relative z-10 md:ml-64 pt-24 px-8 md:px-12 pb-24 min-h-screen max-w-[1500px] mx-auto space-y-10">
        
        {/* Section 1: Hero Intelligence Panel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
        >
          <OpportunitiesHero />
        </motion.div>

        {/* Section 1.5: Resume Intelligence */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 25, delay: 0.1 }}
        >
          <ResumeAnalyzer />
        </motion.div>

        {/* Section 2: Market Signals Strip */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 25, delay: 0.15 }}
        >
          <MarketSignalsStrip />
        </motion.div>

        {/* Section 3: Recommended Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 25, delay: 0.2 }}
        >
          <RecommendedGrid />
        </motion.div>

        {/* Section 4: Momentum Analytics Strip */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 25, delay: 0.3 }}
        >
          <MomentumAnalytics />
        </motion.div>

        {/* Section 5: Bottom Pipeline & AI Recommendations */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 25, delay: 0.4 }}
            className="lg:col-span-8"
          >
            <ApplicationPipeline />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 25, delay: 0.5 }}
            className="lg:col-span-4"
          >
            <OrbitRecommendations />
          </motion.div>
        </div>

      </main>
    </>
  );
}
