"use client";

import { motion } from "framer-motion";

const columns = [
  { id: "saved", title: "Saved", count: 12, dot: "bg-outline-variant/40", jobs: ["Vercel", "Stripe", "Linear"] },
  { id: "applied", title: "Applied", count: 8, dot: "bg-muted-indigo/60", jobs: ["Google", "Notion"] },
  { id: "interview", title: "Interview", count: 2, dot: "bg-soft-lavender", jobs: ["Netflix", "OpenAI"] },
  { id: "offer", title: "Offer", count: 1, dot: "bg-green-500", jobs: ["Anthropic"] },
];

export default function ApplicationPipeline() {
  return (
    <div className="premium-card rounded-[24px] p-8 h-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-extrabold text-primary tracking-tight">Active Pipeline</h2>
        <button className="text-[10px] font-bold text-muted-indigo uppercase tracking-[0.1em] hover:opacity-70 transition-opacity">
          View Board &rarr;
        </button>
      </div>

      <div className="grid grid-cols-4 gap-4 flex-1">
        {columns.map((col, i) => (
          <motion.div
            key={col.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 350, damping: 25, delay: 0.2 + (i * 0.1) }}
            className="flex flex-col h-full bg-surface-container/20 border border-black/5 rounded-[20px] p-3"
          >
            <div className="flex items-center justify-between px-1 mb-3">
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${col.dot}`} />
                <span className="text-[11px] font-bold text-on-surface-variant/70 uppercase tracking-wider">{col.title}</span>
              </div>
              <span className="text-[10px] font-black text-on-surface-variant/40 bg-white/50 px-2 py-0.5 rounded-md border border-black/5">{col.count}</span>
            </div>

            <div className="space-y-2 flex-1">
              {col.jobs.map((job, j) => (
                <motion.div
                  key={`${col.id}-${j}`}
                  whileHover={{ y: -2, scale: 1.02 }}
                  className="px-3 py-2.5 bg-white border border-outline-variant/15 rounded-xl text-xs font-semibold text-on-surface shadow-[0_2px_8px_rgba(0,0,0,0.02)] hover:border-muted-indigo/20 hover:shadow-md transition-all cursor-grab active:cursor-grabbing"
                >
                  {job}
                </motion.div>
              ))}
            </div>
            
            {/* Subtle empty state dashed slot indicator */}
            <div className="mt-2 h-10 border border-dashed border-black/10 rounded-xl" />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
