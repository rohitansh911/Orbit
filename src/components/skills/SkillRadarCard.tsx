"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useUser } from "@/context/UserContext";

function polarToCartesian(centerX: number, centerY: number, radius: number, angleInDegrees: number) {
  const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
  return {
    x: centerX + (radius * Math.cos(angleInRadians)),
    y: centerY + (radius * Math.sin(angleInRadians))
  };
}

export default function SkillRadarCard() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const { profile } = useUser();

  // If user has skills in onboarding, use them, otherwise fallback to defaults
  const userSkills = profile?.onboardingData?.skills || [];
  const displaySkills = userSkills.length >= 3 ? userSkills.slice(0, 6).map((s: string) => ({
    label: s,
    value: 70 + Math.floor(Math.random() * 20), // Placeholder dynamic score
  })) : [
    { label: "Frontend", value: 85 },
    { label: "Backend", value: 65 },
    { label: "Cloud", value: 40 },
    { label: "Algorithms", value: 50 },
    { label: "System Design", value: 45 },
    { label: "Product", value: 75 },
  ];

  type SkillType = { label: string, value: number };
  const skills: SkillType[] = displaySkills.length < 3 ? [
    ...displaySkills, 
    ...Array(3 - displaySkills.length).fill({ label: "TBD", value: 30 })
  ] : displaySkills;

  const size = 320;
  const center = size / 2;
  const maxRadius = (size / 2) - 45;

  const generateRadarPath = (values: number[], scaleMultiplier = 1) => {
    return values.map((val, i) => {
      const angle = (i * 360) / values.length;
      const r = (val / 100) * maxRadius * scaleMultiplier;
      const pt = polarToCartesian(center, center, r, angle);
      return `${i === 0 ? 'M' : 'L'} ${pt.x} ${pt.y}`;
    }).join(" ") + " Z";
  };

  const currentPath = generateRadarPath(skills.map(s => s.value));
  const breathingPath = generateRadarPath(skills.map(s => s.value), 1.03);

  if (!mounted) return null;

  return (
    <div className="premium-card rounded-3xl p-8 h-full flex flex-col justify-between">
      <div>
        <div className="flex items-center gap-2 mb-2">
          <span className="material-symbols-outlined text-[14px] text-muted-indigo">multiline_chart</span>
          <p className="text-[10px] font-black text-muted-indigo tracking-[0.35em] uppercase">
            Global Matrix
          </p>
        </div>
        <h2 className="text-xl font-extrabold text-primary tracking-tight">Skill Radar</h2>
      </div>

      <div className="flex-1 flex items-center justify-center relative mt-6">
        <svg width={size} height={size} className="overflow-visible">
          {/* Background Web / Axes */}
          {[20, 40, 60, 80, 100].map((level) => (
            <path
              key={`web-${level}`}
              d={generateRadarPath([level, level, level, level, level, level])}
              fill="none"
              stroke="rgba(0,0,0,0.03)"
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
                stroke="rgba(0,0,0,0.03)"
                strokeWidth="1"
              />
            );
          })}

          {/* Animated Data Polygon */}
          <motion.path
            initial={{ d: generateRadarPath([0,0,0,0,0,0]) }}
            animate={{ d: [currentPath, breathingPath, currentPath] }}
            transition={{
              d: { 
                duration: 4, 
                repeat: Infinity, 
                ease: "easeInOut" 
              }
            }}
            fill="rgba(99,102,241,0.08)"
            stroke="rgba(99,102,241,0.6)"
            strokeWidth="1.5"
            strokeLinejoin="round"
            className="drop-shadow-[0_0_16px_rgba(99,102,241,0.2)]"
          />

          {/* Data Points & Labels */}
          {skills.map((skill, i) => {
            const angle = (i * 360) / skills.length;
            const r = (skill.value / 100) * maxRadius;
            const pt = polarToCartesian(center, center, r, angle);
            const labelPt = polarToCartesian(center, center, maxRadius + 22, angle);

            return (
              <g key={`point-${i}`}>
                {/* Dot */}
                <motion.circle
                  initial={{ cx: center, cy: center }}
                  animate={{ cx: pt.x, cy: pt.y }}
                  transition={{ type: "spring", damping: 15, delay: i * 0.05 }}
                  r="3.5"
                  fill="#ffffff"
                  stroke="rgba(99,102,241,1)"
                  strokeWidth="2"
                  className="drop-shadow-sm hover:stroke-[3px] hover:r-[5] transition-all cursor-crosshair"
                />
                {/* Label */}
                <text
                  x={labelPt.x}
                  y={labelPt.y}
                  textAnchor="middle"
                  alignmentBaseline="middle"
                  className="text-[9px] font-bold fill-on-surface-variant/60 uppercase tracking-widest"
                >
                  {skill.label}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}
