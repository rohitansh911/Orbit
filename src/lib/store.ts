import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface OrbitState {
  // Global Modals & UI State
  isCopilotOpen: boolean;
  setCopilotOpen: (open: boolean) => void;
  
  // User Profile & Onboarding Data
  profile: any | null;
  setProfile: (profile: any) => void;
  updateProfileStats: (xpToAdd: number) => void;
  
  // Missions & Progression
  missions: any[];
  setMissions: (missions: any[]) => void;
  completeMission: (id: string, baseXP: number) => void;
  skipMission: (id: string) => void;
  
  // AI Memory / Copilot History
  copilotHistory: any[];
  addCopilotMessage: (message: any) => void;
  clearCopilotHistory: () => void;
  
  // Memory Analytics (Behavioral tracking)
  memoryEvents: any[];
  addMemoryEvent: (event: any) => void;
  
  // Milestones & Timeline
  milestones: any[];
  unlockMilestone: (id: string, label: string, description: string) => void;
  
  // Intelligence Persistence
  resumeAudit: any | null;
  setResumeAudit: (audit: any | null) => void;
  
  careerRoadmap: any | null;
  setCareerRoadmap: (roadmap: any | null) => void;

  dailyBriefing: { date: string; content: any } | null;
  setDailyBriefing: (briefing: { date: string; content: any } | null) => void;

  weeklyReports: any[];
  addWeeklyReport: (report: any) => void;

  // Support & Feedback
  supportTickets: any[];
  addSupportTicket: (ticket: any) => void;
  
  // System
  clearState: () => void;
}

export const useOrbitStore = create<OrbitState>()(
  persist(
    (set, get) => ({
      isCopilotOpen: false,
      setCopilotOpen: (open) => set({ isCopilotOpen: open }),
      
      profile: null,
      setProfile: (profile) => set({ profile }),
      updateProfileStats: (xpToAdd) => {
        set((state) => {
          if (!state.profile || !state.profile.stats) return state;
          const newXp = state.profile.stats.xp + xpToAdd;
          const newLevel = Math.floor(newXp / 1000) + 1;
          return {
            profile: {
              ...state.profile,
              stats: { ...state.profile.stats, xp: newXp, level: newLevel }
            }
          };
        });
        
        // Passive Milestone Checks
        const state = get();
        if (state.profile?.stats?.level >= 5) {
          get().unlockMilestone("level_5", "Level 5 Architect", "Achieved Level 5 engineering mastery through sustained execution.");
        }
        if (state.profile?.stats?.streak >= 7) {
          get().unlockMilestone("streak_7", "7-Day Momentum", "Maintained an unbroken 7-day execution streak.");
        }
      },
      
      missions: [],
      setMissions: (missions) => set({ missions }),
      completeMission: (id, baseXP) => {
        set((state) => ({
          missions: state.missions.map(m => m.id === id ? { ...m, completed: true, status: 'completed' } : m)
        }));
        
        const state = get();
        // Progression Math: Add 5% per streak day, capped at 50%
        const streak = state.profile?.stats?.streak || 0;
        const multiplier = Math.min(1 + (streak * 0.05), 1.5);
        const finalXp = Math.floor(baseXP * multiplier);
        
        get().updateProfileStats(finalXp);
        get().addMemoryEvent({
          id: Date.now().toString(),
          type: 'mission_completed',
          context: `Completed mission ${id} for ${finalXp} XP (Base: ${baseXP}, Multiplier: ${multiplier.toFixed(2)}x)`,
          timestamp: new Date().toISOString()
        });
      },
      skipMission: (id) => {
        set((state) => ({
          missions: state.missions.map(m => m.id === id ? { ...m, status: 'skipped' } : m)
        }));
        get().addMemoryEvent({
          id: Date.now().toString(),
          type: 'mission_skipped',
          context: `Skipped mission ${id}. AI should avoid similar tasks temporarily.`,
          timestamp: new Date().toISOString()
        });
      },
      
      copilotHistory: [
        { id: "init", role: "orbit", content: "Telemetry active. How can we optimize your trajectory today?" }
      ],
      addCopilotMessage: (message) => set((state) => ({
        copilotHistory: [...state.copilotHistory, message]
      })),
      clearCopilotHistory: () => set({ 
        copilotHistory: [{ id: "init", role: "orbit", content: "Telemetry active. How can we optimize your trajectory today?" }]
      }),
      
      memoryEvents: [],
      addMemoryEvent: (event) => set((state) => ({
        // Keep last 50 events to prevent massive local storage growth
        memoryEvents: [event, ...(state.memoryEvents || [])].slice(0, 50)
      })),

      milestones: [],
      unlockMilestone: (id, label, description) => set((state) => {
        const currentMilestones = state.milestones || [];
        if (currentMilestones.find(m => m.id === id)) return state; // Already unlocked
        
        return {
          milestones: [
            { id, label, description, unlockedAt: new Date().toISOString() },
            ...currentMilestones
          ]
        };
      }),
      
      resumeAudit: null,
      setResumeAudit: (audit) => set({ resumeAudit: audit }),
      
      careerRoadmap: null,
      setCareerRoadmap: (roadmap) => set({ careerRoadmap: roadmap }),

      dailyBriefing: null,
      setDailyBriefing: (briefing) => set({ dailyBriefing: briefing }),

      weeklyReports: [],
      addWeeklyReport: (report) => set((state) => ({
        weeklyReports: [report, ...state.weeklyReports]
      })),

      supportTickets: [],
      addSupportTicket: (ticket) => set((state) => ({
        supportTickets: [ticket, ...state.supportTickets]
      })),
      
      clearState: () => set({
        isCopilotOpen: false,
        profile: null,
        missions: [],
        copilotHistory: [{ id: "init", role: "orbit", content: "Telemetry active. How can we optimize your trajectory today?" }],
        memoryEvents: [],
        milestones: [],
        resumeAudit: null,
        careerRoadmap: null,
        dailyBriefing: null,
        weeklyReports: [],
        supportTickets: [],
      })
    }),
    {
      name: 'orbit-global-state',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        // Persist all user data. We do NOT persist `isCopilotOpen` so it doesn't open unexpectedly on refresh.
        profile: state.profile,
        missions: state.missions,
        copilotHistory: state.copilotHistory,
        memoryEvents: state.memoryEvents,
        milestones: state.milestones,
        resumeAudit: state.resumeAudit,
        careerRoadmap: state.careerRoadmap,
        dailyBriefing: state.dailyBriefing,
        weeklyReports: state.weeklyReports,
        supportTickets: state.supportTickets,
      })
    }
  )
);
