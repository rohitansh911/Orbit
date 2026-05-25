"use client";

import { useEffect, useRef } from "react";
import { useEnergy } from "@/context/EnergyContext";

/** 
 * Full-page ambient layer — drifting orbs + very subtle floating particles.
 * Modulates intensity based on the global Energy State.
 */
export default function AmbientBackground() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { energyState, momentumScore } = useEnergy();

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    let alive = true;

    // Adjust particle speed based on energy state
    const baseSpeed = energyState === "hyper" ? 3 : energyState === "calm" ? 8 : 5;

    function spawnParticle() {
      if (!alive || !el) return;
      const p = document.createElement("div");
      const size = 1.5 + Math.random() * 2;
      p.style.cssText = `
        position: fixed;
        width: ${size}px;
        height: ${size}px;
        border-radius: 50%;
        background: rgba(99,102,241,${0.15 + Math.random() * 0.2});
        left: ${5 + Math.random() * 90}%;
        top: ${10 + Math.random() * 80}%;
        pointer-events: none;
        z-index: 1;
        box-shadow: 0 0 ${4 + Math.random() * 6}px rgba(99,102,241,0.4);
        animation: stardust-twinkle ${baseSpeed + Math.random() * 5}s ease-in-out infinite;
        animation-delay: ${Math.random() * 6}s;
      `;
      el.appendChild(p);
      return p;
    }

    // Spawn 20 persistent particles
    const particles: HTMLDivElement[] = [];
    for (let i = 0; i < 20; i++) {
      const p = spawnParticle();
      if (p) particles.push(p);
    }

    return () => {
      alive = false;
      particles.forEach((p) => p.remove());
    };
  }, [energyState]); // Re-spawn particles if state changes drastically

  // Calculate dynamic glow and drift duration
  const glowOpacity = 0.04 + (momentumScore / 100) * 0.06; // scales from 0.04 to 0.1
  const driftMultiplier = energyState === "hyper" ? 0.6 : energyState === "calm" ? 1.5 : 1;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden transition-all duration-1000"
      aria-hidden="true"
    >
      {/* Slow-drifting ambient orbs */}
      <div
        className="ambient-orb w-[500px] h-[500px] transition-all duration-1000"
        style={{
          top: "10%",
          left: "-5%",
          background: `rgba(99, 102, 241, ${0.035 * (energyState === 'hyper' ? 1.5 : 1)})`,
          "--drift-dur": `${28 * driftMultiplier}s`,
          "--drift-delay": "0s",
        } as React.CSSProperties}
      />
      <div
        className="ambient-orb w-[400px] h-[400px] transition-all duration-1000"
        style={{
          top: "50%",
          right: "-8%",
          background: `rgba(167, 139, 250, ${0.025 * (energyState === 'hyper' ? 1.5 : 1)})`,
          "--drift-dur": `${35 * driftMultiplier}s`,
          "--drift-delay": "6s",
        } as React.CSSProperties}
      />
      <div
        className="ambient-orb w-[300px] h-[300px] transition-all duration-1000"
        style={{
          bottom: "15%",
          left: "30%",
          background: `rgba(99, 102, 241, ${0.02 * (energyState === 'hyper' ? 1.5 : 1)})`,
          "--drift-dur": `${22 * driftMultiplier}s`,
          "--drift-delay": "10s",
        } as React.CSSProperties}
      />

      {/* Dynamic radial gradient — top-center breathing atmosphere */}
      <div
        className="absolute inset-0 transition-opacity duration-1000"
        style={{
          background: `radial-gradient(ellipse 70% 40% at 50% 0%, rgba(99,102,241,${glowOpacity}) 0%, transparent 100%)`,
        }}
      />
    </div>
  );
}
