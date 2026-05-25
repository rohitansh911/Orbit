"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useOrbitStore } from "@/lib/store";

const faqs = [
  {
    q: "How are Career Roadmaps generated?",
    a: "Orbit analyzes your target role, current skills, and recent completion velocity (momentum). It then queries our AI pipeline to construct a 3-phase strategic path tailored specifically to your weak points."
  },
  {
    q: "Why did my Readiness Score drop?",
    a: "Readiness scores decay over time if you remain inactive or repeatedly skip missions in a specific category (e.g., Algorithms). Completing targeted missions will rebuild your score."
  },
  {
    q: "Where do Curated Opportunities come from?",
    a: "Orbit curates jobs based on an intersection of your onboarding target role, your current skill competency, and your active streak. The higher your momentum, the more premium opportunities unlock."
  }
];

export default function HelpCenter() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const { setCopilotOpen } = useOrbitStore();

  return (
    <div className="space-y-6">
      <div className="premium-card rounded-3xl p-8">
        <h2 className="text-xl font-extrabold text-primary tracking-tight mb-6">Common Inquiries</h2>
        
        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div 
                key={idx} 
                className={`border border-black/5 rounded-2xl overflow-hidden transition-colors ${isOpen ? 'bg-surface-container-low/50' : 'bg-transparent hover:bg-black/[0.02]'}`}
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full text-left p-4 flex items-center justify-between"
                >
                  <span className="text-sm font-bold text-on-surface pr-4">{faq.q}</span>
                  <span className={`material-symbols-outlined text-muted-indigo transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
                    expand_more
                  </span>
                </button>
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <p className="px-4 pb-4 text-xs font-medium text-on-surface-variant/80 leading-relaxed">
                        {faq.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>

      <div className="premium-card rounded-3xl p-8 relative overflow-hidden bg-primary text-white">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-muted-indigo/80" />
        <div className="absolute top-0 right-0 p-8 opacity-20 pointer-events-none">
          <span className="material-symbols-outlined text-8xl">smart_toy</span>
        </div>
        
        <div className="relative z-10 flex flex-col items-start space-y-4">
          <h3 className="text-xl font-extrabold tracking-tight">Need specific help?</h3>
          <p className="text-sm font-medium text-white/80 max-w-sm">
            Orbit Copilot has deep knowledge of your trajectory and can answer personalized questions about your account.
          </p>
          <button
            onClick={() => setCopilotOpen(true)}
            className="mt-2 px-6 py-3 bg-white text-primary font-bold text-sm rounded-xl hover:shadow-xl hover:shadow-white/20 active:scale-95 transition-all flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-[18px]">chat_bubble</span>
            Ask Orbit Copilot
          </button>
        </div>
      </div>
    </div>
  );
}
