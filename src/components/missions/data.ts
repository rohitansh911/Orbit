export type Category = "Apply" | "Network" | "Learn" | "Build" | "Practice";
export type Difficulty = "Easy" | "Medium" | "Hard";

export interface Mission {
  id: string;
  title: string;
  category: Category;
  xp: number;
  time: string;
  difficulty: Difficulty;
  description: string;
  completed: boolean;
  aiRecommended?: boolean;
  aiReason?: string;
}

export const categoryStyles: Record<Category, { bg: string; text: string; dot: string; cardBg: string }> = {
  Apply:    { bg: "bg-muted-indigo/10",   text: "text-muted-indigo",        dot: "bg-muted-indigo", cardBg: "rgba(167, 139, 250, 0.04)" }, // Soft purple
  Network:  { bg: "bg-soft-lavender/15",  text: "text-soft-lavender",       dot: "bg-soft-lavender", cardBg: "rgba(16, 185, 129, 0.04)" }, // Soft green
  Learn:    { bg: "bg-primary/8",         text: "text-primary/70",          dot: "bg-primary/60", cardBg: "rgba(99, 102, 241, 0.02)" }, // Indigo/neutral
  Build:    { bg: "bg-muted-indigo/8",    text: "text-muted-indigo/80",     dot: "bg-muted-indigo/70", cardBg: "rgba(245, 158, 11, 0.04)" }, // Warm amber
  Practice: { bg: "bg-error/8",           text: "text-error/80",            dot: "bg-error/60", cardBg: "rgba(59, 130, 246, 0.04)" }, // Cool blue
};

export const difficultyStyles: Record<Difficulty, { dots: number; color: string }> = {
  Easy:   { dots: 1, color: "bg-muted-indigo/40" },
  Medium: { dots: 2, color: "bg-muted-indigo/70" },
  Hard:   { dots: 3, color: "bg-muted-indigo" },
};

export const DAILY_MISSIONS: Mission[] = [
  {
    id: "m1",
    title: "Apply to 2 internships",
    category: "Apply",
    xp: 120,
    time: "25 min",
    difficulty: "Medium",
    description: "Curate and send targeted applications. Quality over volume.",
    completed: false,
    aiReason: "Your application velocity dropped 14% this week. Keep momentum high.",
  },
  {
    id: "m2",
    title: "Message 1 alumni on LinkedIn",
    category: "Network",
    xp: 80,
    time: "10 min",
    difficulty: "Easy",
    description: "One genuine connection beats a hundred cold messages.",
    completed: false,
  },
  {
    id: "m3",
    title: "Strengthen one resume bullet",
    category: "Build",
    xp: 60,
    time: "15 min",
    difficulty: "Easy",
    description: "Replace passive verbs. Add a metric. Make it undeniable.",
    completed: false,
  },
  {
    id: "m4",
    title: "Solve 1 DSA question",
    category: "Practice",
    xp: 90,
    time: "30 min",
    difficulty: "Hard",
    description: "One focused problem — understand the pattern, not just the solution.",
    completed: false,
    aiReason: "Algorithms is currently your weakest interview area.",
  },
  {
    id: "m5",
    title: "Post insight on LinkedIn",
    category: "Network",
    xp: 70,
    time: "20 min",
    difficulty: "Medium",
    description: "Share something you learned this week. Compound your visibility.",
    completed: false,
  },
  {
    id: "m6",
    title: "Learn Docker basics",
    category: "Learn",
    xp: 100,
    time: "40 min",
    difficulty: "Medium",
    description: "Containers are non-negotiable. Start with the fundamentals.",
    completed: false,
  },
];

export const AI_MISSIONS: Mission[] = [
  {
    id: "ai1",
    title: "Write a technical blog post",
    category: "Build",
    xp: 150,
    time: "60 min",
    difficulty: "Hard",
    description: "Writing clarifies thinking. Orbit detected a gap in your personal brand visibility.",
    completed: false,
    aiRecommended: true,
    aiReason: "Your profile shows low personal brand signal — top candidates publish consistently.",
  },
  {
    id: "ai2",
    title: "Update GitHub README",
    category: "Build",
    xp: 50,
    time: "10 min",
    difficulty: "Easy",
    description: "Your pinned repos are the first impression. Make them count.",
    completed: false,
    aiRecommended: true,
    aiReason: "3 of your target companies actively review GitHub profiles before interviews.",
  },
  {
    id: "ai3",
    title: "Practice 1 system design question",
    category: "Practice",
    xp: 110,
    time: "45 min",
    difficulty: "Hard",
    description: "System design readiness is your biggest gap before Vercel interviews.",
    completed: false,
    aiRecommended: true,
    aiReason: "Interview prep score is 62% — system design is dragging your readiness down.",
  },
];

export const MOTIVATIONAL_MESSAGES = [
  "Momentum looks good today.",
  "Orbit sees interview energy.",
  "Tiny wins are stacking.",
  "Your future self is watching.",
  "Consistency > intensity.",
  "One mission at a time.",
  "The compound effect is real.",
  "You're building something great.",
];

export const WEEKLY_DATA = [
  { day: "Mon", xp: 240, status: "done"    as const },
  { day: "Tue", xp: 180, status: "done"    as const },
  { day: "Wed", xp: 310, status: "done"    as const },
  { day: "Thu", xp: 90,  status: "partial" as const },
  { day: "Fri", xp: 260, status: "done"    as const },
  { day: "Sat", xp: 0,   status: "missed"  as const },
  { day: "Sun", xp: 0,   status: "today"   as const },
];
