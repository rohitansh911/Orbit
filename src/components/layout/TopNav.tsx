"use client";

import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import { useUser } from "@/context/UserContext";
import { motion } from "framer-motion";
import { useState } from "react";
import ProfilePanel from "@/components/dashboard/ProfilePanel";

export default function TopNav() {
  const { user, signOut } = useAuth();
  const { profile } = useUser();
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  return (
    <header className="fixed top-0 w-full z-50 bg-surface/85 backdrop-blur-2xl border-b border-black/5 flex justify-between items-center px-margin-desktop h-16"
      style={{ boxShadow: "0 1px 0 rgba(212,195,190,0.3), 0 4px 24px rgba(68,42,34,0.04)" }}
    >
      {/* Logo + Wordmark */}
      <motion.div
        whileHover={{ x: 2, scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="flex items-center gap-4 group cursor-pointer"
      >
        <div className="w-8 h-8 bg-muted-indigo/10 rounded-lg flex items-center justify-center border border-muted-indigo/20 transition-all duration-300 group-hover:bg-muted-indigo/15 group-hover:border-muted-indigo/35 group-hover:shadow-[0_0_16px_rgba(99,102,241,0.15)]">
          <Image
            src="/orbit-logo.png"
            alt="Orbit Logo"
            width={16}
            height={16}
            className="h-4 w-4 transition-transform duration-300 group-hover:scale-110"
          />
        </div>
        <span className="font-bold text-lg tracking-tight text-primary transition-colors group-hover:text-muted-indigo">
          Orbit
        </span>
      </motion.div>

      {/* Right side */}
      <div className="flex items-center gap-6">
        {/* Streak pill — pulsing, hidden on mobile */}
        <div className="hidden md:flex items-center gap-2.5 px-4 py-1.5 glass-acc rounded-full border border-muted-indigo/15 streak-pulse cursor-default select-none">
          <span
            className="material-symbols-outlined text-muted-indigo text-[16px] transition-transform hover:scale-110"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            local_fire_department
          </span>
          <span className="text-[10px] font-bold tracking-[0.15em] text-muted-indigo uppercase">
            {profile?.stats?.streak || 0} Day Streak
          </span>
        </div>

        {/* Profile + Streak */}
        <div className="flex items-center gap-5 relative group">
          <div className="text-right hidden sm:block">
            <p className="text-xs font-bold text-on-surface">
              {user?.user_metadata?.full_name || "Guest Explorer"}
            </p>
          </div>

          <motion.div 
            whileHover={{ scale: 1.05 }} 
            className="relative cursor-pointer"
            onClick={() => setIsProfileOpen(true)}
          >
            <div className="absolute inset-0 rounded-full bg-muted-indigo/10 scale-0 group-hover:scale-110 transition-transform duration-300" />
            <Image
              src={user?.user_metadata?.avatar_url || "https://api.dicebear.com/9.x/notionists/svg?seed=Felix&backgroundColor=e2e8f0"}
              alt="User profile avatar"
              width={32}
              height={32}
              className="relative z-10 w-8 h-8 rounded-full object-cover border border-black/10 group-hover:border-muted-indigo/40 group-hover:ring-[3px] ring-muted-indigo/10 transition-all duration-300"
              unoptimized
            />
            {/* Online dot — with micro-pulse */}
            <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 border border-surface rounded-full z-20"
              style={{ animation: "streak-pulse 3s ease-in-out infinite" }}
            />
          </motion.div>

          {/* Simple Dropdown for Sign Out on hover */}
          <div className="absolute top-full right-0 mt-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 min-w-[160px] bg-white border border-black/5 rounded-xl shadow-lg overflow-hidden py-1 z-50">
            <button 
              onClick={signOut}
              className="w-full text-left px-4 py-2.5 text-xs font-bold text-red-500 hover:bg-red-50 transition-colors flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-[16px]">logout</span>
              Sign Out
            </button>
          </div>
        </div>
      </div>

      <ProfilePanel isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} />
    </header>
  );
}
