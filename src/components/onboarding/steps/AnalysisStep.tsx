"use client";

import { useEffect, useRef, useState } from "react";

const messages = [
  "mapping your trajectory…",
  "finding hidden growth gaps…",
  "calibrating your engineering path…",
  "scanning the opportunity field…",
  "aligning your skill vectors…",
  "building your mission system…",
  "orbit is locking in…",
];

interface AnalysisStepProps {
  onDone: () => void;
}

export default function AnalysisStep({ onDone }: AnalysisStepProps) {
  const [msgIdx, setMsgIdx] = useState(0);
  const [progress, setProgress] = useState(0);
  const [exiting, setExiting] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    // Cycle messages
    const msgTimer = setInterval(() => {
      setMsgIdx((prev) => {
        if (prev < messages.length - 1) return prev + 1;
        return prev;
      });
    }, 900);

    // Progress bar fills over ~6.5s
    const progressTimer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressTimer);
          return 100;
        }
        return prev + 1.6;
      });
    }, 100);

    // Auto-advance after ~7s
    const doneTimer = setTimeout(() => {
      setExiting(true);
      setTimeout(onDone, 500);
    }, 6800);

    timerRef.current = msgTimer;
    return () => {
      clearInterval(msgTimer);
      clearInterval(progressTimer);
      clearTimeout(doneTimer);
    };
  }, [onDone]);

  return (
    <div className={`flex flex-col items-center justify-center min-h-screen px-6 text-center relative overflow-hidden ${exiting ? "opacity-0 scale-95 transition-all duration-500" : "step-enter"}`}>
      {/* Orbital background */}
      <div className="absolute inset-0 pointer-events-none hero-orbital-bg" />

      {/* Concentric spinning rings */}
      <div className="relative mb-16">
        {/* Outermost ring */}
        <div
          className="analysis-ring w-52 h-52 absolute inset-0 m-auto"
          style={{
            border: "1.5px solid rgba(99,102,241,0.12)",
            borderTopColor: "rgba(99,102,241,0.5)",
          }}
        />
        {/* Middle ring */}
        <div
          className="analysis-ring analysis-ring-2 w-40 h-40 absolute inset-0 m-auto"
          style={{
            border: "1.5px solid rgba(167,139,250,0.1)",
            borderRightColor: "rgba(167,139,250,0.45)",
          }}
        />
        {/* Inner ring */}
        <div
          className="analysis-ring analysis-ring-3 w-28 h-28 absolute inset-0 m-auto"
          style={{
            border: "1px solid rgba(99,102,241,0.08)",
            borderBottomColor: "rgba(99,102,241,0.35)",
          }}
        />

        {/* Core glyph */}
        <div className="relative w-52 h-52 flex items-center justify-center">
          <div className="w-16 h-16 bg-muted-indigo/10 rounded-2xl border border-muted-indigo/20 flex items-center justify-center breathing-core">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/orbit-logo.png" alt="Orbit" className="w-8 h-8" />
          </div>
        </div>
      </div>

      {/* Rotating messages */}
      <div className="h-8 mb-10 flex items-center justify-center overflow-hidden">
        <p
          key={msgIdx}
          className="msg-in text-xl font-bold text-on-surface tracking-tight"
        >
          {messages[msgIdx]}
        </p>
      </div>

      {/* Progress bar */}
      <div className="w-full max-w-xs space-y-3">
        <div className="h-1 w-full bg-outline-variant/15 rounded-full overflow-hidden">
          <div
            className="h-full bg-muted-indigo rounded-full transition-all duration-100"
            style={{
              width: `${Math.min(progress, 100)}%`,
              boxShadow: "0 0 12px rgba(99,102,241,0.4)",
            }}
          />
        </div>
        <p className="text-[10px] font-bold text-on-surface-variant/35 tracking-[0.3em] uppercase">
          Personalizing your orbit
        </p>
      </div>
    </div>
  );
}
