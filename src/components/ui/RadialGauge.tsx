"use client";

import { useEffect, useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

interface RadialGaugeProps {
  value: number; // 0–100
}

export default function RadialGauge({ value }: RadialGaugeProps) {
  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, { stiffness: 60, damping: 20 });
  
  const percentageStr = useTransform(springValue, (latest) => Math.round(latest));
  
  useEffect(() => {
    // delay to let the page mount
    const t = setTimeout(() => motionValue.set(value), 600);
    return () => clearTimeout(t);
  }, [value, motionValue]);

  return (
    <motion.div 
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="radial-gauge-container mb-14 breathing-core"
    >
      <motion.div 
        className="radial-gauge"
        style={{ "--percentage": percentageStr } as any}
      />
      <div className="absolute inset-0 flex flex-col items-center justify-center pt-2 z-10">
        <motion.span className="text-8xl font-black text-muted-indigo tracking-tighter leading-none drop-shadow-sm">
          {percentageStr}
        </motion.span>
        <span className="text-[10px] font-bold text-on-surface-variant/50 tracking-[0.45em] uppercase mt-3">
          STRENGTH
        </span>
      </div>
    </motion.div>
  );
}
