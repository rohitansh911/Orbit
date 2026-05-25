"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useOrbitStore } from "@/lib/store";
import { useAuth } from "@/context/AuthContext";

interface ProfilePanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ProfilePanel({ isOpen, onClose }: ProfilePanelProps) {
  const { profile } = useOrbitStore();
  const { user, signOut } = useAuth();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-surface-container-low/40 backdrop-blur-sm z-[90]"
          />
          
          {/* Slide-out Panel */}
          <motion.div
            initial={{ x: "100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "100%", opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed top-0 right-0 h-full w-full sm:w-[400px] bg-white border-l border-black/5 shadow-2xl z-[100] flex flex-col"
          >
            <div className="p-6 flex items-center justify-between border-b border-black/5 bg-surface/50 backdrop-blur-md">
              <h2 className="text-sm font-black uppercase tracking-widest text-primary">Operative Profile</h2>
              <button onClick={onClose} className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-black/5 transition-colors">
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
              {/* Identity Header */}
              <div className="flex flex-col items-center text-center space-y-3">
                <div className="relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={user?.user_metadata?.avatar_url || "https://api.dicebear.com/9.x/notionists/svg?seed=Felix"}
                    alt="Avatar"
                    className="w-24 h-24 rounded-full border-4 border-white shadow-xl object-cover"
                  />
                  <div className="absolute bottom-0 right-2 w-4 h-4 bg-green-500 border-2 border-white rounded-full" />
                </div>
                <div>
                  <h3 className="text-xl font-extrabold text-primary">{user?.user_metadata?.full_name || "Guest Explorer"}</h3>
                  <p className="text-xs font-semibold text-muted-indigo tracking-wider uppercase mt-1">Level {profile?.stats?.level || 1} • {profile?.onboardingData?.careerGoal || "Engineer"}</p>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-surface-container-low/50 border border-black/5 flex flex-col items-center justify-center text-center">
                  <span className="material-symbols-outlined text-orange-500 text-[24px] mb-2" style={{ fontVariationSettings: "'FILL' 1" }}>local_fire_department</span>
                  <span className="text-2xl font-black text-primary">{profile?.stats?.streak || 0}</span>
                  <span className="text-[9px] font-bold text-on-surface-variant/50 uppercase tracking-widest mt-1">Day Streak</span>
                </div>
                <div className="p-4 rounded-2xl bg-surface-container-low/50 border border-black/5 flex flex-col items-center justify-center text-center">
                  <span className="material-symbols-outlined text-green-500 text-[24px] mb-2">radar</span>
                  <span className="text-2xl font-black text-primary">{profile?.stats?.momentumScore || 0}%</span>
                  <span className="text-[9px] font-bold text-on-surface-variant/50 uppercase tracking-widest mt-1">Momentum</span>
                </div>
              </div>

              {/* Progress */}
              <div className="space-y-3">
                <div className="flex justify-between items-end">
                  <span className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant/60">XP Progress</span>
                  <span className="text-xs font-bold text-muted-indigo">{profile?.stats?.xp || 0} / {((profile?.stats?.level || 1) * 1000)} XP</span>
                </div>
                <div className="h-2 w-full bg-surface-container-low rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-muted-indigo rounded-full transition-all duration-1000"
                    style={{ width: `${((profile?.stats?.xp || 0) % 1000) / 10}%` }}
                  />
                </div>
              </div>

              {/* Tracked Skills */}
              {profile?.onboardingData?.skills && (
                <div className="space-y-4">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant/60">Tracked Skills</h4>
                  <div className="flex flex-wrap gap-2">
                    {profile.onboardingData.skills.map((skill: string) => (
                      <span key={skill} className="px-3 py-1.5 rounded-lg bg-muted-indigo/5 border border-muted-indigo/20 text-muted-indigo text-[11px] font-bold">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="p-6 border-t border-black/5 bg-surface/50">
              <button
                onClick={signOut}
                className="w-full py-3 rounded-xl bg-error/10 text-error font-bold text-xs tracking-widest uppercase hover:bg-error hover:text-white transition-all active:scale-95"
              >
                Sign Out
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
