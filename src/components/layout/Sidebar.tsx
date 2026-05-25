"use client";

import { usePathname } from "next/navigation";
import NavPill from "@/components/ui/NavPill";
import Link from "next/link";
import { useOrbitStore } from "@/lib/store";
import { useUser } from "@/context/UserContext";

const navItems = [
  { href: "/", icon: "grid_view", label: "Dashboard" },
  { href: "/roadmap", icon: "map", label: "Career Roadmap" },
  { href: "/timeline", icon: "history", label: "Timeline" },
  { href: "/missions", icon: "explore", label: "Missions" },
  { href: "/skills", icon: "analytics", label: "Skill Tracker" },
  { href: "/opportunities", icon: "business_center", label: "Opportunities" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { setCopilotOpen } = useOrbitStore();
  const { profile } = useUser();

  return (
    <aside className="fixed left-0 top-0 h-full w-64 z-40 border-r border-black/5 flex-col p-8 pt-24 hidden md:flex">
      {/* Brand headline */}
      <div className="mb-14 px-2">
        <p className="text-[9px] font-black text-on-surface-variant/40 tracking-[0.25em] uppercase mb-1">
          Trajectory Target
        </p>
        <p className="text-lg font-extrabold text-primary tracking-tight leading-tight">
          {profile?.onboardingData?.careerGoal || "Engineer"}
        </p>
      </div>

      {/* Main nav */}
      <nav className="flex-1 space-y-3" aria-label="Main navigation">
        {navItems.map((item) => (
          <NavPill
            key={item.href}
            href={item.href}
            icon={item.icon}
            label={item.label}
            isActive={pathname === item.href}
          />
        ))}
      </nav>

      {/* Bottom section */}
      <div className="mt-auto pt-8 space-y-6">
        <button
          id="ask-copilot-btn"
          onClick={() => setCopilotOpen(true)}
          className="w-full py-4 bg-primary text-on-primary rounded-xl font-bold text-xs tracking-widest uppercase shadow-xl shadow-primary/10 hover:shadow-primary/30 hover:-translate-y-1 transition-all active:scale-95"
        >
          Ask Copilot
        </button>

        <div className="space-y-2 px-2">
          <Link
            href="/settings"
            className="flex items-center gap-3 text-on-surface-variant/60 hover:text-muted-indigo transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">
              settings
            </span>
            <span className="text-xs font-medium">Settings</span>
          </Link>
          <Link
            href="/support"
            className="flex items-center gap-3 text-on-surface-variant/60 hover:text-muted-indigo transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">
              help_outline
            </span>
            <span className="text-xs font-medium">Support</span>
          </Link>
        </div>
      </div>
    </aside>
  );
}
