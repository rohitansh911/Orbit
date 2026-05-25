import { Opportunity } from "@/lib/types";

const pipelineStats = [
  { count: 4, label: "Applied",   color: "text-primary",              border: "border-outline-variant/30",  numClass: "num-pop-1" },
  { count: 1, label: "Interview", color: "text-muted-indigo",         border: "border-muted-indigo/30",     numClass: "num-pop-2" },
  { count: 2, label: "Archived",  color: "text-on-surface-variant/20",border: "border-outline-variant/30",  numClass: "num-pop-3" },
  { count: 0, label: "Offers",    color: "text-primary/10",           border: "border-outline-variant/20",  numClass: "num-pop-4" },
];

const opportunities: Opportunity[] = [
  { id: "opp-vercel", company: "Vercel", role: "Frontend Engineer Intern", appliedAgo: "Applied 2 days ago", status: "Interviewing", initial: "V", highlighted: true  },
  { id: "opp-linear", company: "Linear", role: "Product Engineer",          appliedAgo: "Applied 5 days ago", status: "Pending",     initial: "L", highlighted: false },
];

function StatusBadge({ status }: { status: Opportunity["status"] }) {
  if (status === "Interviewing") {
    return (
      <span className="px-6 py-2.5 badge-xp text-[10px] font-black rounded-full tracking-[0.2em] uppercase transition-all duration-200 group-hover/row:shadow-[0_0_12px_rgba(99,102,241,0.2)]">
        Interviewing
      </span>
    );
  }
  return (
    <span className="px-6 py-2.5 bg-surface-variant/60 text-on-surface-variant/70 text-[10px] font-black rounded-full border border-black/5 tracking-[0.2em] uppercase">
      {status}
    </span>
  );
}

export default function OpportunityPipeline() {
  return (
    <div className="lg:col-span-12 premium-card rounded-3xl p-12 space-y-12 relative overflow-hidden">
      {/* Ambient orb */}
      <div
        className="ambient-orb w-72 h-72 bg-muted-indigo/5 top-0 left-1/2"
        style={{ "--drift-dur": "30s", "--drift-delay": "2s" } as React.CSSProperties}
      />

      {/* Header */}
      <div className="flex justify-between items-center relative z-10">
        <div>
          <h3 className="text-2xl font-extrabold text-primary mb-1">Opportunity Pipeline</h3>
          <p className="text-sm text-on-surface-variant/60 font-medium">Tracking your strategic career expansion</p>
        </div>
        <div className="flex gap-3">
          {["tune", "search"].map((icon, i) => (
            <button
              key={icon}
              id={`pipeline-${i === 0 ? "filter" : "search"}-btn`}
              aria-label={i === 0 ? "Filter pipeline" : "Search pipeline"}
              className="p-3.5 glass-acc hover:bg-white/90 hover:text-muted-indigo rounded-xl transition-all duration-200 border border-black/5 hover:border-muted-indigo/20 hover:-translate-y-0.5 hover:shadow-[0_8px_16px_rgba(99,102,241,0.06)] active:scale-95"
            >
              <span className="material-symbols-outlined text-[20px]">{icon}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Pipeline stats — numbers pop in */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-gutter relative z-10">
        {pipelineStats.map((stat) => (
          <div
            key={stat.label}
            className={`p-10 rounded-[2.5rem] glass-acc border ${stat.border} flex flex-col items-center text-center group hover:bg-white/85 hover:shadow-[0_8px_32px_rgba(99,102,241,0.08),inset_0_1px_0_rgba(255,255,255,0.9)] hover:-translate-y-2 transition-all duration-300 cursor-default`}
          >
            <span className={`text-6xl font-black ${stat.color} mb-3 drop-shadow-sm ${stat.numClass} transition-transform duration-300 group-hover:scale-110`}>
              {stat.count}
            </span>
            <span className="text-[10px] font-black tracking-[0.35em] text-on-surface-variant/50 uppercase">
              {stat.label}
            </span>
          </div>
        ))}
      </div>

      {/* Job rows */}
      <div className="space-y-3 relative z-10">
        {opportunities.map((opp, i) => (
          <div
            key={opp.id}
            id={opp.id}
            className={`opp-row group/row flex items-center justify-between p-7 border border-transparent cursor-pointer ${i === 0 ? "card-enter-1" : "card-enter-2"}`}
          >
            <div className="flex items-center gap-7">
              {/* Company avatar — glows on hover */}
              <div
                className={`w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-black transition-all duration-300 ${
                  opp.highlighted
                    ? "bg-muted-indigo text-on-primary shadow-xl shadow-muted-indigo/30 group-hover/row:shadow-2xl group-hover/row:shadow-muted-indigo/40 group-hover/row:scale-105"
                    : "bg-on-surface-variant/8 text-on-surface-variant/60 group-hover/row:bg-on-surface-variant/12"
                }`}
              >
                {opp.initial}
              </div>
              <div>
                <p className="font-bold text-lg text-on-surface group-hover/row:text-muted-indigo transition-colors duration-200">
                  {opp.role}
                </p>
                <p className="text-sm text-on-surface-variant/50 font-medium mt-0.5">
                  {opp.company} • {opp.appliedAgo}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-7">
              <StatusBadge status={opp.status} />
              <span className="material-symbols-outlined text-on-surface-variant/20 group-hover/row:text-muted-indigo transition-all duration-200 group-hover/row:translate-x-1.5">
                chevron_right
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
