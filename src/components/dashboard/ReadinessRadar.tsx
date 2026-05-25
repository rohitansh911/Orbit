"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useEnergy } from "@/context/EnergyContext";

// Simple utility to map polar coordinates to SVG cartesian
function polarToCartesian(centerX: number, centerY: number, radius: number, angleInDegrees: number) {
  const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
  return {
    x: centerX + (radius * Math.cos(angleInRadians)),
    y: centerY + (radius * Math.sin(angleInRadians))
  };
}

export default function ReadinessRadar() {
  const { energyState } = useEnergy();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  // 5 axes: [System Design, Frontend, Backend, Algorithms, Communication]
  const skills = [
    { label: "Sys Design", value: 45 },
    { label: "Frontend", value: 85 },
    { label: "Backend", value: 60 },
    { label: "Algorithms", value: 50 },
    { label: "Comm.", value: 90 },
  ];

  const size = 260;
  const center = size / 2;
  const maxRadius = (size / 2) - 40;

  // Generate path string for the radar shape
  const generateRadarPath = (values: number[], scaleMultiplier = 1) => {
    return values.map((val, i) => {
      const angle = (i * 360) / values.length;
      const r = (val / 100) * maxRadius * scaleMultiplier;
      const pt = polarToCartesian(center, center, r, angle);
      return `${i === 0 ? 'M' : 'L'} ${pt.x} ${pt.y}`;
    }).join(" ") + " Z";
  };

  const currentPath = generateRadarPath(skills.map(s => s.value));
  
  // Create a slightly "breathing" state based on momentum
  const breathingPath = generateRadarPath(skills.map(s => s.value), energyState === "hyper" ? 1.05 : energyState === "flow" ? 1.02 : 1);

  if (!mounted) return null;

  return (
    <div className="premium-card rounded-3xl p-8 h-full flex flex-col justify-between">
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="material-symbols-outlined text-[14px] text-muted-indigo">radar</span>
            <p className="text-[10px] font-black text-muted-indigo tracking-[0.35em] uppercase">
              Calibration
            </p>
          </div>
          <h2 className="text-2xl font-extrabold text-primary tracking-tight">Readiness Radar</h2>
        </div>
        
        {/* Confidence Score */}
        <div className="text-right">
          <p className="text-3xl font-black text-on-surface">66<span className="text-lg text-on-surface-variant/40">%</span></p>
          <p className="text-[10px] font-bold text-on-surface-variant/50 uppercase tracking-[0.1em]">Confidence</p>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center relative mt-4">
        <svg width={size} height={size} className="overflow-visible">
          {/* Background Web / Axes */}
          {[20, 40, 60, 80, 100].map((level) => (
            <path
              key={`web-${level}`}
              d={generateRadarPath([level, level, level, level, level])}
              fill="none"
              stroke="rgba(212,195,190,0.2)"
              strokeWidth="1"
            />
          ))}

          {/* Radiating lines */}
          {skills.map((_, i) => {
            const angle = (i * 360) / skills.length;
            const pt = polarToCartesian(center, center, maxRadius, angle);
            return (
              <line
                key={`line-${i}`}
                x1={center} y1={center}
                x2={pt.x} y2={pt.y}
                stroke="rgba(212,195,190,0.2)"
                strokeWidth="1"
              />
            );
          })}

          {/* Animated Data Polygon */}
          <motion.path
            initial={{ d: generateRadarPath([0,0,0,0,0]) }}
            animate={{ d: [currentPath, breathingPath, currentPath] }}
            transition={{
              d: { 
                duration: energyState === "hyper" ? 2 : 4, 
                repeat: Infinity, 
                ease: "easeInOut" 
              }
            }}
            fill="rgba(99,102,241,0.15)"
            stroke="rgba(99,102,241,0.8)"
            strokeWidth="2"
            strokeLinejoin="round"
            className="drop-shadow-[0_0_12px_rgba(99,102,241,0.4)]"
          />

          {/* Data Points & Labels */}
          {skills.map((skill, i) => {
            const angle = (i * 360) / skills.length;
            const r = (skill.value / 100) * maxRadius;
            const pt = polarToCartesian(center, center, r, angle);
            const labelPt = polarToCartesian(center, center, maxRadius + 20, angle);

            return (
              <g key={`point-${i}`}>
                {/* Dot */}
                <motion.circle
                  initial={{ cx: center, cy: center }}
                  animate={{ cx: pt.x, cy: pt.y }}
                  transition={{ type: "spring", damping: 15, delay: i * 0.1 }}
                  r="4"
                  fill="#ffffff"
                  stroke="rgba(99,102,241,1)"
                  strokeWidth="2"
                />
                {/* Label */}
                <text
                  x={labelPt.x}
                  y={labelPt.y}
                  textAnchor="middle"
                  alignmentBaseline="middle"
                  className="text-[10px] font-bold fill-on-surface-variant/70 uppercase tracking-widest"
                >
                  {skill.label}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      <div className="mt-4 pt-4 border-t border-outline-variant/20 flex items-start gap-3">
        <span className="material-symbols-outlined text-[16px] text-error mt-0.5" style={{ fontVariationSettings: "'FILL' 1" }}>
          warning
        </span>
        <p className="text-xs font-medium text-on-surface-variant/70 leading-snug">
          System Design volatility detected. Orbit suggests mock architecture drills before applying to Senior roles.
        </p>
      </div>
    </div>
  );
}
