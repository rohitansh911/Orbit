import RadialGauge from "@/components/ui/RadialGauge";
import ProgressBar from "@/components/ui/ProgressBar";

const stats = [
  { label: "Resume",   value: 85, sublabel: "85%", color: "indigo"   as const, delay: 800  },
  { label: "Network",  value: 62, sublabel: "62%", color: "error"    as const, delay: 950  },
  { label: "Projects", value: 90, sublabel: "90%", color: "indigo"   as const, delay: 1100 },
  { label: "Skills",   value: 75, sublabel: "75%", color: "lavender" as const, delay: 1250 },
];

export default function ProgressionCore() {
  return (
    <div className="lg:col-span-5 premium-card rounded-3xl p-12 flex flex-col items-center group relative overflow-hidden">
      {/* Layered ambient gradients */}
      <div className="absolute inset-0 bg-gradient-to-br from-muted-indigo/[0.05] via-transparent to-soft-lavender/[0.02] pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-t from-transparent to-white/10 pointer-events-none" />

      {/* Floating ambient glow blob */}
      <div
        className="ambient-orb w-48 h-48 bg-muted-indigo/8 top-0 right-0"
        style={{ "--drift-dur": "22s", "--drift-delay": "0s" } as React.CSSProperties}
      />

      {/* Header */}
      <div className="text-center mb-12 relative z-10">
        <h3 className="text-xl font-extrabold text-primary mb-1">Progression Core</h3>
        <p className="text-[10px] text-on-surface-variant/40 uppercase tracking-[0.35em] font-bold">
          Career Readiness Score
        </p>
      </div>

      {/* Animated conic gauge — now with pulsing glow via CSS */}
      <RadialGauge value={78} />

      {/* Stat bars — staggered fill animation via delay prop */}
      <div className="grid grid-cols-2 gap-x-14 gap-y-10 w-full relative z-10">
        {stats.map((stat) => (
          <ProgressBar
            key={stat.label}
            value={stat.value}
            color={stat.color}
            height="xs"
            label={stat.label}
            sublabel={stat.sublabel}
            sublabelColor={stat.color}
            delay={stat.delay}
          />
        ))}
      </div>
    </div>
  );
}
