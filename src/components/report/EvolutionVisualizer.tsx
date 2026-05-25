"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function EvolutionVisualizer({ data }: { data: any }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  // Mock data for the curve based on the current streak/momentum
  const points = [20, 35, 30, 50, 75, 60, 90]; 
  const max = 100;
  
  const width = 400;
  const height = 150;
  
  const generatePath = () => {
    return points.map((p, i) => {
      const x = (i / (points.length - 1)) * width;
      const y = height - (p / max) * height;
      return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
    }).join(" ");
  };

  return (
    <div className="space-y-6">
      <div className="premium-card p-8 rounded-3xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-5">
          <span className="material-symbols-outlined text-8xl text-muted-indigo">monitoring</span>
        </div>
        
        <h3 className="text-xs font-black text-muted-indigo uppercase tracking-[0.2em] mb-2">Readiness Evolution</h3>
        <p className="text-3xl font-extrabold text-on-surface mb-8">{data?.readinessDelta || "+0% Technical Depth"}</p>
        
        <div className="relative h-[150px] w-full flex items-end border-b border-outline-variant/30 pb-2">
          <svg className="w-full h-full overflow-visible" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
            <defs>
              <linearGradient id="curveGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="rgba(99,102,241,0.2)" />
                <stop offset="100%" stopColor="rgba(99,102,241,0)" />
              </linearGradient>
            </defs>
            <motion.path
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 2, ease: "easeInOut" }}
              d={generatePath()}
              fill="none"
              stroke="rgba(99,102,241,0.8)"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="drop-shadow-[0_4px_12px_rgba(99,102,241,0.3)]"
            />
            {points.map((p, i) => {
              const x = (i / (points.length - 1)) * width;
              const y = height - (p / max) * height;
              return (
                <motion.circle
                  key={i}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 1 + (i * 0.1), type: "spring" }}
                  cx={x}
                  cy={y}
                  r="4"
                  fill="#fff"
                  stroke="rgba(99,102,241,1)"
                  strokeWidth="2"
                />
              )
            })}
          </svg>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="premium-card p-6 rounded-3xl bg-green-500/5 border border-green-500/10">
          <div className="flex items-center justify-between mb-4">
             <span className="material-symbols-outlined text-green-500">trending_up</span>
             <span className="text-[10px] font-bold text-green-500 uppercase tracking-widest">Strongest Growth</span>
          </div>
          <p className="text-xl font-bold text-on-surface">{data?.strongestGrowth || "System Design"}</p>
        </div>

        <div className="premium-card p-6 rounded-3xl bg-error/5 border border-error/10">
          <div className="flex items-center justify-between mb-4">
             <span className="material-symbols-outlined text-error">trending_down</span>
             <span className="text-[10px] font-bold text-error uppercase tracking-widest">Weakest Decay</span>
          </div>
          <p className="text-xl font-bold text-on-surface">{data?.weakestDecay || "Algorithms"}</p>
        </div>
      </div>
    </div>
  );
}
