interface InsightCardProps {
  icon: string;
  iconBg: string;
  iconShadow: string;
  glowBg: string;
  borderColor: string;
  body: string;
  ctaLabel: string;
  ctaColor: string;
  id: string;
}

function InsightCard({
  icon,
  iconBg,
  iconShadow,
  glowBg,
  borderColor,
  body,
  ctaLabel,
  ctaColor,
  id,
}: InsightCardProps) {
  return (
    <div
      className={`premium-card rounded-3xl p-8 relative group overflow-hidden ${borderColor} interactive-card`}
    >
      {/* Glow blob */}
      <div
        className={`absolute -top-12 -right-12 w-36 h-36 ${glowBg} blur-[80px] group-hover:scale-150 transition-transform duration-1000`}
      />
      <div className="flex gap-6 items-start relative z-10">
        <div className={`p-3.5 ${iconBg} text-on-primary rounded-2xl shadow-xl ${iconShadow}`}>
          <span
            className="material-symbols-outlined text-[24px]"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            {icon}
          </span>
        </div>
        <div className="space-y-4">
          <p className="text-sm font-bold leading-relaxed text-primary">
            {body}
          </p>
          <button
            id={id}
            className={`text-[10px] font-black ${ctaColor} uppercase tracking-widest hover:underline`}
          >
            {ctaLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AIInsights() {
  return (
    <div className="lg:col-span-4 space-y-gutter">
      <InsightCard
        icon="auto_awesome"
        iconBg="bg-muted-indigo"
        iconShadow="shadow-muted-indigo/30"
        glowBg="bg-muted-indigo/15"
        borderColor="border-muted-indigo/15"
        body="Market Shift: 'Docker' demand surged by 12% in New Grad roles this week."
        ctaLabel="Recalibrate Skills"
        ctaColor="text-muted-indigo"
        id="insight-docker-cta"
      />
      <InsightCard
        icon="handshake"
        iconBg="bg-soft-lavender"
        iconShadow="shadow-soft-lavender/30"
        glowBg="bg-soft-lavender/15"
        borderColor="border-soft-lavender/15"
        body="Warm Intro: Sarah (Vercel) matches your tech stack profile."
        ctaLabel="Draft Connection"
        ctaColor="text-soft-lavender"
        id="insight-sarah-cta"
      />

      {/* View All Analytics row */}
      <div className="premium-card rounded-2xl p-7 flex items-center justify-between group cursor-pointer hover:bg-white/80 interactive-card">
        <span className="text-[10px] font-black text-on-surface-variant/50 tracking-[0.35em] group-hover:text-muted-indigo transition-colors uppercase">
          View All Analytics
        </span>
        <span className="material-symbols-outlined text-on-surface-variant/30 group-hover:translate-x-1 transition-all text-[22px] group-hover:text-muted-indigo">
          arrow_forward
        </span>
      </div>
    </div>
  );
}
