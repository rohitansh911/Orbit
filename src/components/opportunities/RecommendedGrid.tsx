"use client";

import { motion } from "framer-motion";

const recommendations = [
  {
    id: 1,
    company: "Vercel",
    role: "Product Engineering Intern",
    badge: "Remote",
    stipend: "$8k - $10k/mo",
    match: 92,
    urgency: "High",
    gap: "Docker deployment experience",
    reason: "Your React proficiency and recent open-source contributions make this a high-probability target.",
    url: "https://vercel.com/careers",
  },
  {
    id: 2,
    company: "Stripe",
    role: "Frontend Engineer Intern",
    badge: "Hybrid",
    stipend: "$9k/mo",
    match: 88,
    urgency: "Medium",
    gap: "Payment API patterns",
    reason: "Stripe prioritizes deep component architecture knowledge, matching your recent skill velocity.",
    url: "https://stripe.com/jobs",
  },
  {
    id: 3,
    company: "Linear",
    role: "Full-Stack Intern",
    badge: "Remote",
    stipend: "$7.5k/mo",
    match: 85,
    urgency: "Very High",
    gap: "GraphQL integration",
    reason: "Linear values high-craft UI and animation physics—your current active projects align perfectly.",
    url: "https://linear.app/careers",
  },
];

export default function RecommendedGrid() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 px-2">
        <span className="material-symbols-outlined text-[18px] text-muted-indigo" style={{ fontVariationSettings: "'FILL' 1" }}>
          recommend
        </span>
        <h2 className="text-xl font-extrabold text-primary tracking-tight">Curated Opportunities</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recommendations.map((job, i) => (
          <motion.div
            key={job.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 350, damping: 25, delay: i * 0.1 }}
            whileHover={{ y: -4, scale: 1.01 }}
            className="group relative bg-white/40 border border-black/5 rounded-[24px] p-6 flex flex-col justify-between overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.02)] hover:border-soft-lavender/30 hover:shadow-[0_12px_32px_rgba(167,139,250,0.1)] transition-all cursor-default"
          >
            {/* Shimmer sweep */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] pointer-events-none" />

            <div>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-[10px] font-black text-on-surface-variant/50 uppercase tracking-[0.2em] mb-1">{job.company}</h3>
                  <h4 className="text-base font-bold text-on-surface leading-snug">{job.role}</h4>
                </div>
                <div className="w-10 h-10 rounded-xl bg-muted-indigo/5 border border-muted-indigo/10 flex items-center justify-center shrink-0">
                  <span className="text-sm font-black text-muted-indigo">{job.match}%</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-5">
                <span className="px-2.5 py-1 bg-on-surface/5 text-on-surface-variant/70 text-[10px] font-bold rounded-lg border border-black/5">{job.badge}</span>
                <span className="px-2.5 py-1 bg-green-500/10 text-green-700 text-[10px] font-bold rounded-lg border border-green-500/15">{job.stipend}</span>
                {job.urgency === "Very High" && (
                  <span className="px-2.5 py-1 bg-error/10 text-error text-[10px] font-bold rounded-lg border border-error/15 flex items-center gap-1">
                    <span className="w-1 h-1 rounded-full bg-error animate-pulse" /> Urgency
                  </span>
                )}
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex items-start gap-2.5">
                  <span className="material-symbols-outlined text-[14px] text-error mt-0.5">radar</span>
                  <div>
                    <p className="text-[9px] font-bold text-on-surface-variant/40 uppercase tracking-widest">Skill Gap</p>
                    <p className="text-xs font-semibold text-on-surface-variant/80 leading-tight">{job.gap}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="material-symbols-outlined text-[14px] text-muted-indigo mt-0.5" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
                  <div>
                    <p className="text-[9px] font-bold text-on-surface-variant/40 uppercase tracking-widest">Why This Match</p>
                    <p className="text-[11px] font-medium text-on-surface-variant/70 leading-relaxed">{job.reason}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-4 border-t border-outline-variant/10">
              <a 
                href={job.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex-1"
              >
                <button className="w-full py-2.5 bg-muted-indigo text-white text-[11px] font-bold rounded-xl shadow-lg shadow-muted-indigo/20 hover:bg-muted-indigo/90 active:scale-95 transition-all">
                  Quick Apply
                </button>
              </a>
              <button className="w-10 h-10 flex items-center justify-center rounded-xl bg-on-surface/5 text-on-surface-variant/60 hover:text-muted-indigo hover:bg-muted-indigo/10 active:scale-95 transition-all">
                <span className="material-symbols-outlined text-[18px]">bookmark</span>
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
