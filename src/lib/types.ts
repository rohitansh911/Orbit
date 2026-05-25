export interface NavItem {
  href: string;
  icon: string;
  label: string;
}

export interface ProgressStat {
  label: string;
  value: number;
  color: "indigo" | "error" | "lavender";
}

export interface Quest {
  id: string;
  label: string;
  xp: number;
  completed: boolean;
}

export interface SkillBar {
  label: string;
  sublabel: string;
  value: number;
  color: "indigo" | "lavender";
}

export interface Opportunity {
  id: string;
  company: string;
  role: string;
  appliedAgo: string;
  status: "Interviewing" | "Pending" | "Archived";
  initial: string;
  highlighted?: boolean;
}
