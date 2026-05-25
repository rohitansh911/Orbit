"use client";

import { motion } from "framer-motion";
import { useUser } from "@/context/UserContext";

// Fallback data
const fallbackSkills = [
  { id: "react", name: "React/Next.js", conf: 85, velocity: "+14 XP/wk", icon: "code_blocks", momentum: "up", aiMsg: "Strong compounding returns." },
  { id: "dsa", name: "DSA", conf: 50, velocity: "-2 XP/wk", icon: "data_object", momentum: "down", aiMsg: "Algorithms practice neglected." },
  { id: "sysdesign", name: "System Design", conf: 45, velocity: "+5 XP/wk", icon: "architecture", momentum: "neutral", aiMsg: "System design volatility detected." },
  { id: "comm", name: "Communication", conf: 90, velocity: "+20 XP/wk", icon: "forum", momentum: "up", aiMsg: "High leverage soft skill." },
  { id: "backend", name: "Backend", conf: 65, velocity: "+8 XP/wk", icon: "dns", momentum: "up", aiMsg: "Steady backend growth." },
  { id: "cloud", name: "Cloud/DevOps", conf: 40, velocity: "0 XP/wk", icon: "cloud", momentum: "neutral", aiMsg: "Consider Docker basics." },
];

export default function SkillCalibrationGrid() {
  const { profile } = useUser();
  
  const userSkills = profile?.onboardingData?.skills || [];
  
  // Map user skills to the grid format, fallback if empty
  const gridData = userSkills.length > 0 
    ? userSkills.map((s: string, i: number) => ({
        id: `skill-${i}`,
        name: s,
        conf: 60 + Math.floor(Math.random() * 30),
        velocity: `+${Math.floor(Math.random() * 15) + 5} XP/wk`,
        icon: "auto_awesome",
        momentum: Math.random() > 0.5 ? "up" : "neutral",
        aiMsg: "Active tracking initialized."
      }))
    : fallbackSkills;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
      {gridData.slice(0, 6).map((skill: any, i: number) => (
        <motion.div
          key={skill.id}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 350, damping: 25, delay: i * 0.05 }}
          whileHover={{ y: -2, scale: 1.01 }}
          className="premium-card rounded-3xl p-6 flex flex-col justify-between"
        >
          <div className="flex justify-between items-start mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-muted-indigo/5 flex items-center justify-center border border-muted-indigo/10">
                <span className="material-symbols-outlined text-[20px] text-muted-indigo" style={{ fontVariationSettings: "'FILL' 1" }}>
                  {skill.icon}
                </span>
              </div>
              <div>
                <h3 className="font-extrabold text-primary text-base">{skill.name}</h3>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className={`material-symbols-outlined text-[12px] ${skill.momentum === "up" ? "text-green-500" : skill.momentum === "down" ? "text-error" : "text-on-surface-variant/40"}`}>
                    {skill.momentum === "up" ? "trending_up" : skill.momentum === "down" ? "trending_down" : "trending_flat"}
                  </span>
                  <span className="text-[10px] font-bold text-on-surface-variant/50 uppercase tracking-widest">{skill.velocity}</span>
                </div>
              </div>
            </div>
            
            <div className="text-right">
              <p className="text-2xl font-black text-on-surface leading-none">{skill.conf}<span className="text-sm text-on-surface-variant/40">%</span></p>
            </div>
          </div>

          <div className="flex items-start gap-2.5 p-3 rounded-xl bg-outline-variant/5 border border-[rgba(0,0,0,0.02)]">
            <span className="material-symbols-outlined text-[14px] text-muted-indigo/70 mt-0.5" style={{ fontVariationSettings: "'FILL' 1" }}>
              auto_awesome
            </span>
            <p className="text-[11px] font-semibold text-on-surface-variant/60 leading-snug">
              {skill.aiMsg}
            </p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
