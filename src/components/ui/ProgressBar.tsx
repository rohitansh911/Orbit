"use client";

import { motion } from "framer-motion";

type BarColor = "indigo" | "lavender" | "error";

interface ProgressBarProps {
  value: number; // 0–100
  color?: BarColor;
  /** xs = 1.5px  sm = 2px  md = 4px (XP bar) */
  height?: "xs" | "sm" | "md";
  shimmer?: boolean;
  label?: string;
  sublabel?: string;
  sublabelColor?: BarColor;
  /** Delay (ms) before the bar animates in — for staggered lists */
  delay?: number;
}

const colorMap: Record<BarColor, string> = {
  indigo:  "bg-muted-indigo  shadow-[0_0_16px_rgba(99,102,241,0.25)]",
  lavender:"bg-soft-lavender shadow-[0_0_16px_rgba(167,139,250,0.25)]",
  error:   "bg-error/70",
};

const heightMap = { xs: "h-1.5", sm: "h-2", md: "h-4" };

const sublabelColorClass: Record<BarColor, string> = {
  indigo:  "text-muted-indigo",
  lavender:"text-soft-lavender",
  error:   "text-error",
};

export default function ProgressBar({
  value,
  color = "indigo",
  height = "sm",
  shimmer = false,
  label,
  sublabel,
  sublabelColor,
  delay = 0,
}: ProgressBarProps) {
  return (
    <div className="space-y-3">
      {(label || sublabel) && (
        <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/60">
          {label && <span>{label}</span>}
          {sublabel && (
            <span className={sublabelColor ? sublabelColorClass[sublabelColor] : ""}>
              {sublabel}
            </span>
          )}
        </div>
      )}
      <div
        className={`${heightMap[height]} w-full bg-outline-variant/10 rounded-full overflow-hidden ${
          height === "md" ? "p-0.5 border border-outline-variant/10 shadow-inner" : ""
        }`}
      >
        <motion.div
          initial={{ width: "0%" }}
          animate={{ width: `${value}%` }}
          transition={{ type: "spring", stiffness: 80, damping: 25, delay: delay / 1000 }}
          className={`h-full ${colorMap[color]} rounded-full relative`}
        >
          {shimmer && <div className="absolute inset-0 shimmer rounded-full" />}
        </motion.div>
      </div>
    </div>
  );
}
