"use client";

import { Mission } from "./data";
import MissionCard from "./MissionCard";

interface DailyMissionsProps {
  missions: Mission[];
  onComplete: (id: string, xp: number, rect: DOMRect) => void;
}

const enterClasses = [
  "quest-enter-1", "quest-enter-2", "quest-enter-3",
  "card-enter-3",  "card-enter-4",  "card-enter-5",
];

export default function DailyMissions({ missions, onComplete }: DailyMissionsProps) {
  const active    = missions.filter((m) => !m.completed);
  const completed = missions.filter((m) => m.completed);
  const pct = Math.round((completed.length / missions.length) * 100);

  return (
    <div className="space-y-8">
      {/* Section header */}
      <div className="flex items-end justify-between">
        <div>
          <p className="text-[10px] font-black text-muted-indigo tracking-[0.35em] uppercase mb-1.5">
            Daily Missions
          </p>
          <h2 className="text-2xl font-extrabold text-primary">
            Today&rsquo;s assignments
          </h2>
        </div>

        {/* Progress pill */}
        <div className="flex items-center gap-3">
          <div className="w-28 h-1.5 bg-outline-variant/15 rounded-full overflow-hidden">
            <div
              className="h-full bg-muted-indigo rounded-full transition-all duration-700"
              style={{
                width: `${pct}%`,
                boxShadow: pct > 0 ? "0 0 8px rgba(99,102,241,0.45)" : "none",
              }}
            />
          </div>
          <span className="text-[11px] font-black text-on-surface-variant/50 tracking-wide">
            {completed.length}/{missions.length}
          </span>
        </div>
      </div>

      {/* Active missions grid */}
      {active.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {active.map((mission, i) => (
            <MissionCard
              key={mission.id}
              mission={mission}
              onComplete={onComplete}
              enterClass={enterClasses[i] ?? "card-enter"}
            />
          ))}
        </div>
      )}

      {/* Completed section */}
      {completed.length > 0 && (
        <div className="space-y-4">
          <p className="text-[10px] font-black text-on-surface-variant/30 uppercase tracking-[0.3em] flex items-center gap-3">
            <span className="flex-1 h-px bg-outline-variant/20" />
            Completed · {completed.length}
            <span className="flex-1 h-px bg-outline-variant/20" />
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {completed.map((mission) => (
              <MissionCard
                key={mission.id}
                mission={mission}
                onComplete={onComplete}
              />
            ))}
          </div>
        </div>
      )}

      {/* All done state */}
      {active.length === 0 && completed.length === missions.length && (
        <div className="flex flex-col items-center justify-center py-16 space-y-4">
          <div className="w-16 h-16 bg-muted-indigo/10 rounded-2xl flex items-center justify-center border border-muted-indigo/20 breathing-core">
            <span className="material-symbols-outlined text-[32px] text-muted-indigo" style={{ fontVariationSettings: "'FILL' 1" }}>
              military_tech
            </span>
          </div>
          <div className="text-center space-y-1">
            <p className="text-lg font-extrabold text-primary">All missions complete.</p>
            <p className="text-sm text-on-surface-variant/50 font-medium">
              Orbit is generating tomorrow&rsquo;s trajectory.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
