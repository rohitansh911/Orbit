"use client";

import { useOrbitStore } from "@/lib/store";
import { useAuth } from "@/context/AuthContext";
import { motion } from "framer-motion";
import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function SettingsPage() {
  const { signOut, user } = useAuth();
  const { clearState, profile, setProfile } = useOrbitStore();
  const [clearing, setClearing] = useState(false);

  const handleClearCache = () => {
    setClearing(true);
    setTimeout(() => {
      clearState();
      setClearing(false);
    }, 600);
  };

  const handleResetOnboarding = async () => {
    if (!user) return;
    if (confirm("This will reset your trajectory and send you back to onboarding. Are you sure?")) {
      const resetProfile = { ...profile, hasCompletedOnboarding: false };
      setProfile(resetProfile);
      await supabase.from("users").upsert(resetProfile);
      window.location.href = "/onboarding";
    }
  };

  return (
    <div className="pt-24 px-8 md:px-12 pb-24 max-w-4xl mx-auto space-y-10 min-h-screen">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-extrabold text-primary tracking-tight mb-2">Settings</h1>
        <p className="text-on-surface-variant/60 font-medium">Manage your system preferences and data.</p>
      </motion.div>

      <div className="space-y-6">
        {/* Account Section */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="premium-card p-8 rounded-3xl space-y-6">
          <div className="flex items-center gap-3 border-b border-black/5 pb-4">
            <span className="material-symbols-outlined text-muted-indigo">person</span>
            <h3 className="text-sm font-black uppercase tracking-widest text-primary">Account Identity</h3>
          </div>
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <p className="text-base font-bold text-on-surface">{user?.user_metadata?.full_name || "Guest"}</p>
              <p className="text-sm text-on-surface-variant/70">{user?.email || "No email linked"}</p>
            </div>
            <button
              onClick={signOut}
              className="px-6 py-2.5 rounded-xl bg-error/10 text-error font-bold text-xs hover:bg-error hover:text-white transition-all active:scale-95"
            >
              Sign Out
            </button>
          </div>
        </motion.div>

        {/* System & Data Section */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="premium-card p-8 rounded-3xl space-y-6">
          <div className="flex items-center gap-3 border-b border-black/5 pb-4">
            <span className="material-symbols-outlined text-muted-indigo">memory</span>
            <h3 className="text-sm font-black uppercase tracking-widest text-primary">System Data</h3>
          </div>

          <div className="space-y-4">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 p-4 rounded-2xl bg-surface-container-low/50 border border-black/5">
              <div>
                <p className="text-sm font-bold text-on-surface">Reset Trajectory</p>
                <p className="text-xs text-on-surface-variant/70 mt-1">Clears your current goals and sends you back through the onboarding matrix.</p>
              </div>
              <button
                onClick={handleResetOnboarding}
                className="px-6 py-2 rounded-xl bg-white text-muted-indigo border border-black/10 font-bold text-xs hover:border-muted-indigo/40 transition-all active:scale-95 whitespace-nowrap"
              >
                Reset Onboarding
              </button>
            </div>

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 p-4 rounded-2xl bg-surface-container-low/50 border border-black/5">
              <div>
                <p className="text-sm font-bold text-on-surface">Purge Local Memory</p>
                <p className="text-xs text-on-surface-variant/70 mt-1">Clears all cached AI insights, missions, and global Zustand state.</p>
              </div>
              <button
                onClick={handleClearCache}
                disabled={clearing}
                className="px-6 py-2 rounded-xl bg-white text-error border border-error/20 font-bold text-xs hover:bg-error/5 transition-all active:scale-95 whitespace-nowrap disabled:opacity-50"
              >
                {clearing ? "Purging..." : "Clear Cache"}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
