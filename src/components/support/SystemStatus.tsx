"use client";

import { motion } from "framer-motion";

export default function SystemStatus() {
  const systems = [
    { name: "AI Intelligence Engine", status: "Operational", color: "green-500" },
    { name: "Opportunity Ingestion", status: "Operational", color: "green-500" },
    { name: "Resume Analysis Pipeline", status: "Stable", color: "green-500" },
    { name: "Telemetry Sync", status: "Operational", color: "green-500" },
  ];

  return (
    <div className="premium-card rounded-3xl p-8 relative overflow-hidden h-full">
      <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
        <span className="material-symbols-outlined text-8xl text-muted-indigo">memory</span>
      </div>

      <div className="flex items-center gap-2 mb-6 relative z-10">
        <span className="material-symbols-outlined text-muted-indigo">dns</span>
        <h2 className="text-xl font-extrabold text-primary tracking-tight">System Status</h2>
      </div>

      <div className="space-y-4 relative z-10">
        {systems.map((sys, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="flex items-center justify-between p-4 bg-surface-container-low/50 rounded-2xl border border-black/5 hover:border-black/10 transition-colors"
          >
            <span className="text-sm font-bold text-on-surface">{sys.name}</span>
            <div className="flex items-center gap-2">
              <span className={`text-[10px] font-bold text-${sys.color} uppercase tracking-widest`}>
                {sys.status}
              </span>
              <div className="relative flex h-2 w-2">
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full bg-${sys.color} opacity-75`} />
                <span className={`relative inline-flex rounded-full h-2 w-2 bg-${sys.color}`} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-8 pt-6 border-t border-outline-variant/30 flex items-center justify-between text-[11px] font-bold text-on-surface-variant/50 uppercase tracking-widest relative z-10">
        <span>Orbit API v2.4.1</span>
        <span>All Systems Nominal</span>
      </div>
    </div>
  );
}
