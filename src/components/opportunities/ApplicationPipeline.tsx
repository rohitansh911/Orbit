"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { Application } from "@/hooks/useOpportunities";

interface ApplicationPipelineProps {
  applications: Application[];
  loading: boolean;
  onMoveStage: (id: string, status: Application["status"]) => void;
}

const COLUMNS: { id: Application["status"]; title: string; dot: string }[] = [
  { id: "saved", title: "Saved", dot: "bg-outline-variant/40" },
  { id: "applied", title: "Applied", dot: "bg-muted-indigo/60" },
  { id: "interviewing", title: "Interview", dot: "bg-soft-lavender" },
  { id: "offer", title: "Offer", dot: "bg-green-500" },
];

const NEXT_STAGE: Partial<Record<Application["status"], Application["status"]>> = {
  saved: "applied",
  applied: "interviewing",
  interviewing: "offer",
};

export default function ApplicationPipeline({ applications, loading, onMoveStage }: ApplicationPipelineProps) {
  const grouped = COLUMNS.reduce((acc, col) => {
    acc[col.id] = applications.filter(a => a.status === col.id);
    return acc;
  }, {} as Record<string, Application[]>);

  return (
    <div className="premium-card rounded-[24px] p-8 h-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-extrabold text-primary tracking-tight">Active Pipeline</h2>
        <span className="text-[10px] font-bold text-on-surface-variant/40 uppercase tracking-[0.1em]">
          {applications.length} total
        </span>
      </div>

      <div className="grid grid-cols-4 gap-4 flex-1">
        {COLUMNS.map((col, i) => {
          const colApps = grouped[col.id] || [];
          return (
            <motion.div
              key={col.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 350, damping: 25, delay: 0.2 + i * 0.1 }}
              className="flex flex-col h-full bg-surface-container/20 border border-black/5 rounded-[20px] p-3"
            >
              <div className="flex items-center justify-between px-1 mb-3">
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${col.dot}`} />
                  <span className="text-[11px] font-bold text-on-surface-variant/70 uppercase tracking-wider">{col.title}</span>
                </div>
                <span className="text-[10px] font-black text-on-surface-variant/40 bg-white/50 px-2 py-0.5 rounded-md border border-black/5">
                  {loading ? "—" : colApps.length}
                </span>
              </div>

              <div className="space-y-2 flex-1">
                {loading
                  ? Array.from({ length: i === 0 ? 2 : 1 }).map((_, j) => (
                      <div key={j} className="h-10 bg-white/60 border border-outline-variant/15 rounded-xl animate-pulse" />
                    ))
                  : colApps.map((app) => {
                      const next = NEXT_STAGE[app.status];
                      return (
                        <motion.div
                          key={app.id}
                          whileHover={{ y: -2, scale: 1.02 }}
                          className="group px-3 py-2.5 bg-white border border-outline-variant/15 rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.02)] hover:border-muted-indigo/20 hover:shadow-md transition-all"
                        >
                          <p className="text-xs font-semibold text-on-surface leading-tight truncate">{app.company || "Company"}</p>
                          <p className="text-[10px] text-on-surface-variant/50 font-medium truncate">{app.role || "Role"}</p>
                          {next && (
                            <button
                              onClick={() => onMoveStage(app.id, next)}
                              className="mt-1.5 text-[9px] font-bold text-muted-indigo/60 hover:text-muted-indigo uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              → Move to {NEXT_STAGE[app.status]}
                            </button>
                          )}
                        </motion.div>
                      );
                    })}
              </div>

              {/* Drop zone */}
              {!loading && colApps.length === 0 && (
                <div className="mt-2 h-10 border border-dashed border-black/10 rounded-xl flex items-center justify-center">
                  <span className="text-[9px] text-on-surface-variant/30 font-medium">Empty</span>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
