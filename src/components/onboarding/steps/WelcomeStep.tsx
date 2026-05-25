"use client";

import { useEffect, useRef } from "react";
import ProgressDots from "../ProgressDots";
import { useAuth } from "@/context/AuthContext";

interface WelcomeStepProps {
  onNext: () => void;
  step: number;
  totalSteps: number;
}

export default function WelcomeStep({ onNext, step, totalSteps }: WelcomeStepProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { user, signInWithGoogle } = useAuth();

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const interval = setInterval(() => {
      const particle = document.createElement("div");
      particle.style.cssText = `
        position: absolute;
        width: ${2 + Math.random() * 3}px;
        height: ${2 + Math.random() * 3}px;
        border-radius: 50%;
        background: #6366f1;
        opacity: 0.3;
        left: ${10 + Math.random() * 80}%;
        bottom: 20%;
        pointer-events: none;
        animation: float-up ${3 + Math.random() * 4}s ease-out forwards;
      `;
      el.appendChild(particle);
      setTimeout(() => particle.remove(), 7000);
    }, 600);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="step-enter flex flex-col items-center justify-center min-h-screen px-6 text-center relative overflow-hidden" ref={containerRef}>
      {/* Orbital background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="hero-orbital-bg" />
        <svg className="orbital-curve absolute top-1/2 left-1/2 w-[700px] h-[700px] opacity-[0.07]" viewBox="0 0 100 100">
          <circle cx="50" cy="50" fill="none" r="48" stroke="#6366f1" strokeWidth="0.06" />
          <ellipse cx="50" cy="50" fill="none" rx="45" ry="18" stroke="#6366f1" strokeWidth="0.08" transform="rotate(30 50 50)" />
          <ellipse cx="50" cy="50" fill="none" rx="38" ry="14" stroke="#a78bfa" strokeWidth="0.06" transform="rotate(-50 50 50)" />
        </svg>
      </div>

      <div className="relative z-10 max-w-xl mx-auto space-y-10">
        {/* Orbit wordmark */}
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="w-9 h-9 bg-muted-indigo/10 rounded-xl flex items-center justify-center border border-muted-indigo/20">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/orbit-logo.png" alt="Orbit" className="w-5 h-5" />
          </div>
          <span className="text-lg font-bold text-primary tracking-tight">Orbit</span>
        </div>

        {/* Headline */}
        <div className="space-y-5">
          <h1 className="text-5xl md:text-6xl font-black text-on-surface tracking-tighter leading-[0.92] heading-glow">
            Let&rsquo;s build your<br />
            <span className="text-muted-indigo">trajectory.</span>
          </h1>
          <p className="text-lg text-on-surface-variant/60 font-medium leading-relaxed max-w-sm mx-auto">
            Orbit will personalize your growth system based on your goals, skills, and ambitions.
          </p>
        </div>

        {/* CTA */}
        {!user ? (
          <button
            onClick={async () => {
              await signInWithGoogle();
              // After successful login, user might still be on WelcomeStep, 
              // and the UI will automatically update to show "Begin launch sequence".
            }}
            className="group relative px-14 py-4.5 bg-primary text-on-primary font-bold text-sm rounded-2xl transition-all shadow-2xl shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-1 active:scale-95 overflow-hidden"
          >
            <span className="relative z-10 flex items-center gap-3">
              <span className="material-symbols-outlined text-[18px]">login</span>
              Sign in with Google to Begin
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
          </button>
        ) : (
          <button
            id="onboarding-start-btn"
            onClick={onNext}
            className="group relative px-14 py-4.5 bg-primary text-on-primary font-bold text-sm rounded-2xl transition-all shadow-2xl shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-1 active:scale-95 overflow-hidden"
          >
            <span className="relative z-10">Begin launch sequence →</span>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
          </button>
        )}

        {/* Progress */}
        <div className="flex flex-col items-center gap-3 pt-4">
          <ProgressDots total={totalSteps} current={step} />
          <p className="text-[10px] text-on-surface-variant/35 font-medium tracking-widest uppercase">
            Step 1 of {totalSteps}
          </p>
        </div>
      </div>
    </div>
  );
}
