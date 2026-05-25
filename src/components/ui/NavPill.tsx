"use client";

import Link from "next/link";
import { motion } from "framer-motion";

interface NavPillProps {
  href: string;
  icon: string;
  label: string;
  isActive?: boolean;
}

export default function NavPill({
  href,
  icon,
  label,
  isActive = false,
}: NavPillProps) {
  return (
    <Link href={href} className="relative block outline-none">
      <motion.div
        whileHover={{ x: 6, backgroundColor: isActive ? "transparent" : "rgba(255,255,255,0.7)" }}
        whileTap={{ scale: 0.97 }}
        className={`relative z-10 flex items-center gap-4 px-4 py-3.5 rounded-xl transition-colors ${
          isActive ? "text-muted-indigo" : "text-on-surface-variant/80 hover:text-primary"
        }`}
      >
        <span className="material-symbols-outlined text-[20px]">{icon}</span>
        <span className="text-sm font-semibold">{label}</span>
      </motion.div>

      {/* Fluid active indicator */}
      {isActive && (
        <motion.div
          layoutId="sidebar-active-pill"
          className="absolute inset-0 bg-white rounded-xl shadow-[0_4px_20px_rgba(99,102,241,0.06)] z-0"
          transition={{ type: "spring", stiffness: 250, damping: 25 }}
        >
          {/* Ambient glow */}
          <div className="absolute inset-0 rounded-xl shadow-[0_0_24px_rgba(99,102,241,0.12)] border border-muted-indigo/5" />
        </motion.div>
      )}
    </Link>
  );
}
