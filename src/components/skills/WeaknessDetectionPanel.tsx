"use client";

import { motion } from "framer-motion";

export default function WeaknessDetectionPanel() {
  return (
    <div className="premium-card rounded-3xl p-8 h-full">
      <div className="flex items-center gap-2 mb-6">
        <span className="material-symbols-outlined text-[18px] text-error" style={{ fontVariationSettings: "'FILL' 1" }}>
          troubleshoot
        </span>
        <h2 className="text-xl font-extrabold text-primary tracking-tight">Weakness Detection</h2>
      </div>

      <div className="space-y-6">
        <div>
          <p className="text-[10px] font-black text-on-surface-variant/40 tracking-[0.2em] uppercase mb-1">
            Primary Bottleneck
          </p>
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 bg-error/10 text-error text-xs font-bold rounded-lg border border-error/20">Algorithms (50%)</span>
            <p className="text-sm font-semibold text-on-surface-variant/70">
              Dragging overall interview readiness.
            </p>
          </div>
        </div>

        <div className="h-px bg-outline-variant/10" />

        <div>
          <p className="text-[10px] font-black text-on-surface-variant/40 tracking-[0.2em] uppercase mb-2">
            Suggested Improvement Path
          </p>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="mt-1 w-2 h-2 rounded-full bg-muted-indigo" />
              <p className="text-xs font-medium text-on-surface-variant/80">
                Shift focus from full-stack building to foundational graph and dynamic programming patterns.
              </p>
            </div>
            <div className="flex items-start gap-3">
              <div className="mt-1 w-2 h-2 rounded-full bg-muted-indigo" />
              <p className="text-xs font-medium text-on-surface-variant/80">
                Complete 2 daily targeted DSA missions to raise baseline by 15% before next week.
              </p>
            </div>
          </div>
        </div>

        <div className="h-px bg-outline-variant/10" />

        <div className="flex justify-between items-center bg-muted-indigo/5 p-4 rounded-2xl border border-muted-indigo/10">
          <div>
            <p className="text-[10px] font-black text-muted-indigo tracking-[0.1em] uppercase">Est. Interview Impact</p>
            <p className="text-sm font-bold text-on-surface mt-0.5">+22% Pass Rate</p>
          </div>
          <button className="px-4 py-2 bg-muted-indigo text-white text-[11px] font-bold rounded-xl hover:bg-muted-indigo/90 transition-colors shadow-lg shadow-muted-indigo/20">
            Generate Missions
          </button>
        </div>
      </div>
    </div>
  );
}
