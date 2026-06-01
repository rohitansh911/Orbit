import BadgeXP from "@/components/ui/BadgeXP";
import { useEffect, useState } from "react";
import { useUser } from "@/context/UserContext";
import { useOrbitStore } from "@/lib/store";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";

const enterClasses = ["quest-enter-1", "quest-enter-2", "quest-enter-3"];

function CompletedQuestItem({ label, xp }: { label: string; xp: number }) {
  return (
    <div className="flex items-center justify-between p-6 rounded-2xl bg-surface-container-low/40 border border-black/5 opacity-50 grayscale transition-all duration-300 hover:opacity-60 hover:grayscale-0 interactive-card cursor-default">
      <div className="flex items-center gap-6">
        <div className="w-6 h-6 bg-muted-indigo text-on-primary rounded-lg flex items-center justify-center shadow-md shadow-muted-indigo/20">
          <span className="material-symbols-outlined text-[14px] font-bold check-pop" style={{ fontVariationSettings: "'FILL' 1,'wght' 600" }}>
            check
          </span>
        </div>
        <span className="font-semibold text-on-surface line-through text-[15px]">{label}</span>
      </div>
      <BadgeXP>+{xp} XP</BadgeXP>
    </div>
  );
}

function ActiveQuestItem({ label, xp, onComplete, onSkip }: { label: string; xp: number; onComplete: () => void; onSkip: () => void }) {
  return (
    <div className="group flex flex-col sm:flex-row sm:items-center justify-between p-6 rounded-2xl bg-white/45 border border-black/5 hover:border-muted-indigo/20 hover:bg-white/90 hover:shadow-[0_8px_32px_rgba(99,102,241,0.08),inset_0_1px_0_rgba(255,255,255,0.9)] transition-all duration-300 interactive-card gap-4">
      <div className="flex items-center gap-6 flex-1 cursor-pointer" onClick={onComplete}>
        <div className="relative w-6 h-6 border-2 border-outline/30 rounded-lg group-hover:border-muted-indigo transition-colors duration-200 flex items-center justify-center overflow-hidden shrink-0">
          <div className="w-3 h-3 bg-muted-indigo rounded-sm opacity-0 group-hover:opacity-100 transition-all duration-200 scale-50 group-hover:scale-100" />
        </div>
        <span className="font-bold text-on-surface text-[15px] group-hover:text-muted-indigo transition-colors duration-200 leading-tight">{label}</span>
      </div>
      <div className="flex items-center gap-3 shrink-0">
        <button 
          onClick={(e) => { e.stopPropagation(); onSkip(); }}
          className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/50 hover:text-error hover:bg-error/8 transition-all px-3 py-1.5 rounded-lg border border-black/8 hover:border-error/20"
        >
          Skip
        </button>
        <div className="transition-transform duration-200 group-hover:-translate-y-0.5 cursor-pointer" onClick={onComplete}>
          <BadgeXP solid>+{xp} XP</BadgeXP>
        </div>
      </div>
    </div>
  );
}

export default function DailyQuests() {
  const { profile } = useUser();
  const { missions, setMissions, completeMission, skipMission, memoryEvents } = useOrbitStore();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchMissions() {
      const currentMissions = missions || [];
      if (currentMissions.length > 0) return; // Only fetch if empty
      setLoading(true);
      
      try {
        const res = await fetch("/api/ai/missions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            role: profile?.onboardingData?.careerGoal,
            level: profile?.stats?.level,
            skills: profile?.onboardingData?.skills || [],
            momentum: profile?.stats?.momentumScore,
            memory: memoryEvents // Feed behavioral memory into AI
          })
        });
        
        if (res.ok) {
          const data = await res.json();
          const mappedQuests = data.missions.map((m: any) => ({
            id: m.id || Date.now().toString() + Math.random(),
            label: m.title,
            xp: m.xp,
            status: 'active' // 'active', 'completed', 'skipped'
          }));
          setMissions(mappedQuests);
        }
      } catch (e) {
        console.error("Failed to fetch missions", e);
        toast.error("Failed to generate strategic missions. Retrying later.");
      } finally {
        setLoading(false);
      }
    }

    if (profile) {
      fetchMissions();
    }
  }, [profile, missions, setMissions, memoryEvents]);

  // Filter out skipped missions from view
  const currentMissions = missions || [];
  const visibleMissions = currentMissions.filter(m => m.status !== 'skipped');
  const completedCount = visibleMissions.filter(m => m.status === 'completed').length;
  const totalXP = visibleMissions.reduce((a, q) => a + q.xp, 0);

  return (
    <div className="lg:col-span-7 premium-card rounded-3xl p-12 space-y-10">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div className="space-y-1">
          <h3 className="text-xl font-extrabold text-primary">Daily Quests</h3>
          <p className="text-sm text-on-surface-variant/60 font-medium">
            Strategic actions to accelerate your growth
          </p>
        </div>
        <div className="flex flex-col items-end gap-1">
          <span className="px-5 py-2.5 badge-xp text-[10px] font-black rounded-xl tracking-[0.2em] uppercase">
            {completedCount} / {visibleMissions.length} Complete
          </span>
          <span className="text-[10px] text-on-surface-variant/35 font-semibold tracking-wide">
            {totalXP} XP available
          </span>
        </div>
      </div>

      {/* Completion micro-bar */}
      <div className="h-0.5 w-full bg-outline-variant/10 rounded-full overflow-hidden -mt-4">
        <div
          className="h-full bg-muted-indigo rounded-full transition-all duration-700"
          style={{ width: visibleMissions.length === 0 ? "0%" : `${(completedCount / visibleMissions.length) * 100}%`, boxShadow: "0 0 8px rgba(99,102,241,0.5)" }}
        />
      </div>

      {/* Quest list with entrance stagger */}
      <div className="space-y-4 min-h-[250px]">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-10 space-y-3 opacity-50">
            <div className="w-6 h-6 border-2 border-muted-indigo border-t-transparent rounded-full animate-spin" />
            <span className="text-xs font-bold text-muted-indigo tracking-widest uppercase">Generating Missions</span>
          </div>
        ) : visibleMissions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 opacity-60">
             <span className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">No active missions</span>
             <button onClick={() => setMissions([])} className="mt-4 px-4 py-2 bg-muted-indigo text-white rounded-lg text-xs font-bold tracking-widest uppercase hover:bg-muted-indigo/90 transition-colors">
               Generate New Set
             </button>
          </div>
        ) : (
          <AnimatePresence>
            {visibleMissions.map((quest, i) => (
              <motion.div 
                key={quest.id} 
                className={enterClasses[i % enterClasses.length]}
                initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                animate={{ opacity: 1, height: "auto", marginBottom: 16 }}
                exit={{ opacity: 0, height: 0, marginBottom: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
              >
                {quest.status === 'completed' ? (
                  <CompletedQuestItem label={quest.label} xp={quest.xp} />
                ) : (
                  <ActiveQuestItem 
                    label={quest.label} 
                    xp={quest.xp} 
                    onComplete={() => completeMission(quest.id, quest.xp)} 
                    onSkip={() => skipMission(quest.id)}
                  />
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>

      {/* Add custom mission */}
      <button
        id="add-mission-btn"
        className="w-full py-4 bg-[#1a1a1a] text-[#f5f5e8] rounded-2xl text-[11px] font-black hover:bg-[#2a2a2a] active:scale-[0.99] transition-all duration-300 tracking-[0.25em] uppercase"
      >
        + Design custom mission
      </button>
    </div>
  );
}
