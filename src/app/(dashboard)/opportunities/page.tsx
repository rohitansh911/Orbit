"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useOpportunities, Application } from "@/hooks/useOpportunities";
import OpportunitiesHero from "@/components/opportunities/OpportunitiesHero";
import MarketSignalsStrip from "@/components/opportunities/MarketSignalsStrip";
import RecommendedGrid from "@/components/opportunities/RecommendedGrid";
import ResumeAnalyzer from "@/components/opportunities/ResumeAnalyzer";
import ApplicationPipeline from "@/components/opportunities/ApplicationPipeline";
import MomentumAnalytics from "@/components/opportunities/MomentumAnalytics";
import OrbitRecommendations from "@/components/opportunities/OrbitRecommendations";
import NetworkingTracker from "@/components/opportunities/NetworkingTracker";
import WeeklyReview from "@/components/opportunities/WeeklyReview";
import CoverLetterModal from "@/components/opportunities/CoverLetterModal";

export default function OpportunitiesPage() {
  const {
    opportunities, applications, momentum, aiData, loading, aiLoading,
    saveJob, applyJob, moveStage, deleteApplication, updateNotes,
    updateApplication, rejectApplication, refetchAI,
  } = useOpportunities();

  const [coverLetterApp, setCoverLetterApp] = useState<Application | null>(null);

  const handleSaveCoverLetter = (appId: string, text: string) => {
    updateApplication(appId, { cover_letter: text });
  };

  return (
    <>
      {/* Cover Letter Modal */}
      <AnimatePresence>
        {coverLetterApp && (
          <CoverLetterModal
            app={coverLetterApp}
            onClose={() => setCoverLetterApp(null)}
            onSave={handleSaveCoverLetter}
          />
        )}
      </AnimatePresence>

      {/* Ambient Background */}
      <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden bg-[#fbfbe2]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(167,139,250,0.03)_0%,transparent_70%)]" />
      </div>

      <main className="relative z-10 md:ml-64 pt-24 px-8 md:px-12 pb-24 min-h-screen max-w-[1500px] mx-auto space-y-10">

        {/* Section 1: Hero */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}>
          <OpportunitiesHero marketSignals={aiData.marketSignals} aiLoading={aiLoading} />
        </motion.div>

        {/* Section 2: Resume Analyzer */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 25, delay: 0.08 }}>
          <ResumeAnalyzer />
        </motion.div>

        {/* Section 3: Market Signals */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 25, delay: 0.12 }}>
          <MarketSignalsStrip signals={aiData.marketSignals} loading={aiLoading && aiData.marketSignals.length === 0} />
        </motion.div>

        {/* Section 4: Recommended Grid */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 25, delay: 0.18 }}>
          <RecommendedGrid
            opportunities={opportunities} applications={applications}
            loading={loading} aiLoading={aiLoading}
            onApply={applyJob} onSave={saveJob}
          />
        </motion.div>

        {/* Section 5: Momentum Analytics */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 25, delay: 0.24 }}>
          <MomentumAnalytics momentum={momentum} loading={loading} />
        </motion.div>

        {/* Section 6: Weekly Review */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 25, delay: 0.28 }}>
          <WeeklyReview applications={applications} />
        </motion.div>

        {/* Section 7: Pipeline + AI Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 25, delay: 0.32 }}
            className="lg:col-span-8">
            <ApplicationPipeline
              applications={applications}
              loading={loading}
              onMoveStage={moveStage}
              onDelete={deleteApplication}
              onUpdateNotes={updateNotes}
              onUpdateApplication={updateApplication}
              onReject={rejectApplication}
              onGenerateCoverLetter={(app) => setCoverLetterApp(app)}
            />
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 25, delay: 0.38 }}
            className="lg:col-span-4">
            <OrbitRecommendations
              recommendations={aiData.recommendations}
              loading={loading} aiLoading={aiLoading}
              onRefresh={refetchAI}
            />
          </motion.div>
        </div>

        {/* Section 8: Networking Tracker */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 25, delay: 0.42 }}>
          <NetworkingTracker />
        </motion.div>

      </main>
    </>
  );
}
