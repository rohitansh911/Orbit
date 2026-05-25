import ProgressBar from "@/components/ui/ProgressBar";

const technicalSkills = [
  { label: "System Design",       sublabel: "Intermediate", value: 45, color: "indigo" as const, delay: 300  },
  { label: "React & Next.js",     sublabel: "Advanced",     value: 88, color: "indigo" as const, delay: 500  },
  { label: "Cloud Infrastructure",sublabel: "Foundation",   value: 20, color: "indigo" as const, delay: 700  },
];

const softSkills = [
  { label: "Outreach Volume",  sublabel: "High Velocity", value: 65, color: "lavender" as const, delay: 400 },
  { label: "Narrative Design", sublabel: "Consistent",   value: 55, color: "lavender" as const, delay: 600 },
];

export default function SkillCalibration() {
  return (
    <div className="lg:col-span-8 premium-card rounded-3xl p-12 space-y-10 relative overflow-hidden">
      {/* Ambient glow */}
      <div
        className="ambient-orb w-64 h-64 bg-soft-lavender/6 -bottom-8 -right-8"
        style={{ "--drift-dur": "26s", "--drift-delay": "4s" } as React.CSSProperties}
      />

      {/* Header */}
      <div className="flex justify-between items-end relative z-10">
        <div>
          <h3 className="text-xl font-extrabold text-primary mb-1">Skill Calibration</h3>
          <p className="text-sm text-on-surface-variant/60 font-medium">
            Benchmarked against Tier-1 engineering standards
          </p>
        </div>
        <button
          id="skill-full-report-btn"
          className="group text-[11px] font-black text-muted-indigo flex items-center gap-1 uppercase tracking-widest hover:underline transition-all duration-200 hover:gap-2"
        >
          Full Report
          <span className="material-symbols-outlined text-[16px] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
            arrow_outward
          </span>
        </button>
      </div>

      {/* Two-column skill groups */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-16 relative z-10">
        {/* Technical Core */}
        <div className="space-y-8">
          <h4 className="text-[10px] font-black text-muted-indigo uppercase tracking-[0.35em] flex items-center gap-3">
            <span className="w-1.5 h-1.5 rounded-full bg-muted-indigo shadow-[0_0_6px_rgba(99,102,241,0.6)]" />
            Technical Core
          </h4>
          <div className="space-y-8">
            {technicalSkills.map((skill) => (
              <div key={skill.label} className="space-y-2 group/skill">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-on-surface/80 group-hover/skill:text-on-surface transition-colors">{skill.label}</span>
                  <span className={skill.value >= 80 ? "text-muted-indigo" : "text-on-surface-variant/40 font-semibold"}>
                    {skill.sublabel}
                  </span>
                </div>
                <ProgressBar value={skill.value} color={skill.color} height="sm" delay={skill.delay} />
              </div>
            ))}
          </div>
        </div>

        {/* Soft Infrastructure */}
        <div className="space-y-8">
          <h4 className="text-[10px] font-black text-soft-lavender uppercase tracking-[0.35em] flex items-center gap-3">
            <span className="w-1.5 h-1.5 rounded-full bg-soft-lavender shadow-[0_0_6px_rgba(167,139,250,0.6)]" />
            Soft Infrastructure
          </h4>
          <div className="space-y-8">
            {softSkills.map((skill) => (
              <div key={skill.label} className="space-y-2 group/skill">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-on-surface/80 group-hover/skill:text-on-surface transition-colors">{skill.label}</span>
                  <span className="text-soft-lavender">{skill.sublabel}</span>
                </div>
                <ProgressBar value={skill.value} color={skill.color} height="sm" delay={skill.delay} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
