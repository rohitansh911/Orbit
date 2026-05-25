"use client";

import { motion } from "framer-motion";
import AmbientBackground from "@/components/ui/AmbientBackground";
import SystemStatus from "@/components/support/SystemStatus";
import HelpCenter from "@/components/support/HelpCenter";
import IssueReporter from "@/components/support/IssueReporter";

export default function SupportPage() {
  return (
    <>
      <AmbientBackground />
      <div className="min-h-screen pt-32 pb-24 px-8 md:px-12 md:ml-64 max-w-[1500px] mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="flex items-center gap-3 mb-2">
            <span className="material-symbols-outlined text-muted-indigo">support_agent</span>
            <p className="text-[10px] font-black tracking-[0.25em] uppercase text-muted-indigo">
              Command Center
            </p>
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-primary">Support & Systems</h1>
          <p className="text-on-surface-variant max-w-xl text-lg mt-2">
            Orbit help resources, system telemetry, and dedicated feedback channels.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
          {/* Left Column: Help Center & Copilot */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-7 space-y-gutter"
          >
            <HelpCenter />
          </motion.div>

          {/* Right Column: Status & Reporting */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-5 flex flex-col space-y-gutter"
          >
            <div className="flex-1">
              <SystemStatus />
            </div>
            <div className="flex-1">
              <IssueReporter />
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
}
