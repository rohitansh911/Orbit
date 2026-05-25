export type EnergyState = "calm" | "flow" | "hyper";

export interface OrbitMemory {
  momentumScore: number;
  consistencyTrend: number;
  preferredTime: string;
  strongestSkill: string;
  bottleneck: string;
  recentBehavior: string[];
}

export interface CopilotInsight {
  id: string;
  type: "observation" | "prediction" | "nudge" | "signal";
  text: string;
  urgency?: "low" | "medium" | "high";
}

// Simulated central intelligence data
export const ORBIT_MEMORY: OrbitMemory = {
  momentumScore: 82, // 0-100
  consistencyTrend: 18, // +18%
  preferredTime: "morning",
  strongestSkill: "System Design",
  bottleneck: "Outreach & Networking",
  recentBehavior: [
    "Completed 3 system design tasks in 2 days",
    "Skipped networking mission on Tuesday",
    "High execution velocity before 12 PM",
  ],
};

export const COPILOT_INSIGHTS: CopilotInsight[] = [
  {
    id: "i1",
    type: "observation",
    text: "Your consistency rises 18% on networking-heavy weeks.",
  },
  {
    id: "i2",
    type: "prediction",
    text: "Orbit predicts interview readiness in 14 days.",
    urgency: "high",
  },
  {
    id: "i3",
    type: "observation",
    text: "Frontend velocity increased after project-based missions.",
  },
  {
    id: "i4",
    type: "nudge",
    text: "You tend to avoid outreach missions after 9PM.",
    urgency: "low",
  },
  {
    id: "i5",
    type: "prediction",
    text: "Projected Level 5 in 11 days at current velocity.",
  },
  {
    id: "i6",
    type: "signal",
    text: "3 recruiters viewed profiles with Docker this week.",
    urgency: "medium",
  },
];

// Helper to derive UI state from momentum
export function deriveEnergyState(momentum: number): EnergyState {
  if (momentum < 40) return "calm";
  if (momentum < 75) return "flow";
  return "hyper";
}
