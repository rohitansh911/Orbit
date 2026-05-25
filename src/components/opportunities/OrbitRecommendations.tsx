"use client";

import { motion } from "framer-motion";

const aiRecommendations = [
  { id: 1, text: "Complete Docker basics to unlock 14 more opportunities.", type: "action", icon: "terminal" },
  { id: 2, text: "Resume lacks quantified frontend metrics. Focus on adding payload size reductions.", type: "warning", icon: "document_scanner" },
  { id: 3, text: "Communication strength compensates for lower DSA confidence—emphasize collaborative projects.", type: "insight", icon: "lightbulb" },
];

export default function OrbitRecommendations() {
  return (
    <div className="premium-card rounded-[24px] p-8 h-full flex flex-col">
      <div className="flex items-center gap-2 mb-6">
        <span className="material-symbols-outlined text-[18px] text-muted-indigo" style={{ fontVariationSettings: "'FILL' 1" }}>
          psychology
        </span>
        <h2 className="text-xl font-extrabold text-primary tracking-tight">Orbit AI Copilot</h2>
      </div>

      <div className="space-y-4 flex-1 flex flex-col justify-center">
        {aiRecommendations.map((rec, i) => (
          <motion.div
            key={rec.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 25, delay: i * 0.15 }}
            className={`p-4 rounded-xl border flex items-start gap-4 transition-colors hover:bg-white/60 ${
              rec.type === "action" ? "bg-muted-indigo/5 border-muted-indigo/15" :
              rec.type === "warning" ? "bg-error/5 border-error/15" :
              "bg-soft-lavender/5 border-soft-lavender/15"
            }`}
          >
            <span className={`material-symbols-outlined text-[18px] mt-0.5 ${
              rec.type === "action" ? "text-muted-indigo" :
              rec.type === "warning" ? "text-error" :
              "text-soft-lavender"
            }`} style={{ fontVariationSettings: "'FILL' 1" }}>
              {rec.icon}
            </span>
            <p className="text-xs font-semibold text-on-surface-variant/80 leading-relaxed">
              {rec.text}
            </p>
          </motion.div>
        ))}
      </div>
      
      <button className="w-full mt-6 py-3 border border-dashed border-black/10 rounded-xl text-on-surface-variant/50 text-[10px] font-black uppercase tracking-[0.2em] hover:text-muted-indigo hover:border-muted-indigo/30 transition-all hover:bg-muted-indigo/5">
        Generate More Insights
      </button>
    </div>
  );
}
