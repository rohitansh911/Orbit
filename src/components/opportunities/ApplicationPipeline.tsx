"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef } from "react";
import { Application } from "@/hooks/useOpportunities";

interface ApplicationPipelineProps {
  applications: Application[];
  loading: boolean;
  onMoveStage: (id: string, status: Application["status"]) => void;
  onDelete: (id: string) => void;
  onUpdateNotes: (id: string, notes: string) => void;
  onUpdateApplication: (id: string, updates: Partial<Application>) => void;
  onReject: (id: string, stage: string, reason: string) => void;
  onGenerateCoverLetter?: (app: Application) => void;
}

const COLUMNS: { id: Application["status"]; title: string; dot: string; color: string; next?: Application["status"] }[] = [
  { id: "saved",        title: "Saved",      dot: "bg-black/20",      color: "from-black/3",    next: "applied" },
  { id: "applied",      title: "Applied",    dot: "bg-blue-400/60",   color: "from-blue-50/50", next: "interviewing" },
  { id: "interviewing", title: "Interview",  dot: "bg-violet-400/70", color: "from-violet-50/40", next: "offer" },
  { id: "offer",        title: "Offer 🎉",   dot: "bg-green-400",     color: "from-green-50/60" },
];

const REJECTION_STAGES = ["Resume screen", "Phone screen", "Technical round", "System design", "HR round", "Final round", "Offer stage"];
const SOURCE_TYPES = [
  { value: "cold", label: "Cold", icon: "send", color: "text-slate-500" },
  { value: "warm", label: "Warm", icon: "handshake", color: "text-amber-600" },
  { value: "referral", label: "Referral", icon: "person_raised_hand", color: "text-green-600" },
];

function formatDate(dateStr?: string) {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function daysUntil(dateStr?: string): number | null {
  if (!dateStr) return null;
  const diff = new Date(dateStr).getTime() - Date.now();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

function DeadlineBadge({ date }: { date?: string }) {
  if (!date) return null;
  const days = daysUntil(date);
  if (days === null) return null;
  const isOverdue = days < 0;
  const isUrgent = days >= 0 && days <= 3;
  return (
    <span className={`text-[9px] font-bold px-2 py-0.5 rounded-md ${isOverdue ? "bg-error/15 text-error" : isUrgent ? "bg-amber-500/15 text-amber-700" : "bg-black/5 text-on-surface-variant/50"}`}>
      {isOverdue ? `${Math.abs(days)}d overdue` : days === 0 ? "Due today!" : `${days}d left`}
    </span>
  );
}

function FollowUpBadge({ date }: { date?: string }) {
  if (!date) return null;
  const days = daysUntil(date);
  if (days === null) return null;
  const isOverdue = days < 0;
  return (
    <span className={`flex items-center gap-1 text-[9px] font-bold ${isOverdue ? "text-amber-600" : "text-on-surface-variant/40"}`}>
      <span className="material-symbols-outlined text-[11px]">notifications</span>
      {isOverdue ? `Follow up overdue ${Math.abs(days)}d` : `Follow up in ${days}d`}
    </span>
  );
}

function RejectionModal({ app, onConfirm, onClose }: { app: Application; onConfirm: (stage: string, reason: string) => void; onClose: () => void }) {
  const [stage, setStage] = useState("");
  const [reason, setReason] = useState("");
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm" onClick={onClose}>
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-2xl p-6 w-full max-w-sm mx-4 shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        <h3 className="font-extrabold text-base text-on-surface mb-1">Log Rejection</h3>
        <p className="text-[11px] text-on-surface-variant/60 mb-4">{app.company} — {app.role}</p>

        <div className="space-y-3">
          <div>
            <label className="text-[10px] font-bold text-on-surface-variant/50 uppercase tracking-wider">Stage</label>
            <select value={stage} onChange={e => setStage(e.target.value)}
              className="w-full mt-1 text-[12px] font-medium bg-black/3 border border-black/8 rounded-xl px-3 py-2 focus:outline-none focus:border-muted-indigo/30">
              <option value="">Select stage...</option>
              {REJECTION_STAGES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="text-[10px] font-bold text-on-surface-variant/50 uppercase tracking-wider">Reason (optional)</label>
            <textarea value={reason} onChange={e => setReason(e.target.value)}
              placeholder="Skills gap, no feedback, overqualified..."
              rows={2}
              className="w-full mt-1 text-[12px] font-medium bg-black/3 border border-black/8 rounded-xl px-3 py-2 focus:outline-none focus:border-muted-indigo/30 resize-none"
            />
          </div>
        </div>

        <div className="flex gap-2 mt-4">
          <button onClick={onClose} className="flex-1 py-2 text-[11px] font-bold text-on-surface-variant/60 border border-black/8 rounded-xl hover:bg-black/5 transition-all">Cancel</button>
          <button onClick={() => { if (stage) { onConfirm(stage, reason); onClose(); } }}
            disabled={!stage}
            className="flex-1 py-2 text-[11px] font-bold bg-error text-white rounded-xl hover:bg-error/90 transition-all disabled:opacity-40">
            Log Rejection
          </button>
        </div>
      </motion.div>
    </div>
  );
}

function PipelineCard({
  app, next, onMove, onDelete, onUpdateNotes, onUpdateApplication, onReject, onGenerateCoverLetter,
}: {
  app: Application; next?: Application["status"];
  onMove: (s: Application["status"]) => void;
  onDelete: () => void;
  onUpdateNotes: (n: string) => void;
  onUpdateApplication: (u: Partial<Application>) => void;
  onReject: (stage: string, reason: string) => void;
  onGenerateCoverLetter?: () => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const [tab, setTab] = useState<"notes" | "details" | "rejection">("notes");
  const [notes, setNotes] = useState(app.notes || "");
  const [notesChanged, setNotesChanged] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [followUpDate, setFollowUpDate] = useState(app.follow_up_date || "");
  const [interviewDate, setInterviewDate] = useState(app.interview_date?.split("T")[0] || "");
  const [deadline, setDeadline] = useState(app.deadline || "");
  const [offerAmount, setOfferAmount] = useState(app.offer_amount || "");
  const notesRef = useRef<HTMLTextAreaElement>(null);

  const NEXT_LABEL: Record<string, string> = { applied: "Applied", interviewing: "Interview", offer: "Offer 🎉" };
  const sourceType = (app.source_type || "cold") as "cold" | "warm" | "referral";
  const sourceInfo = SOURCE_TYPES.find(s => s.value === sourceType) || SOURCE_TYPES[0];

  const handleSaveDetails = () => {
    onUpdateApplication({
      follow_up_date: followUpDate || undefined,
      interview_date: interviewDate ? new Date(interviewDate).toISOString() : undefined,
      deadline: deadline || undefined,
      offer_amount: offerAmount || undefined,
    });
  };

  return (
    <>
      {showRejectModal && (
        <RejectionModal app={app} onConfirm={onReject} onClose={() => setShowRejectModal(false)} />
      )}
      <motion.div
        layout
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, x: -20, scale: 0.95 }}
        className={`group bg-white border rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.02)] hover:shadow-md transition-all overflow-hidden ${app.status === "rejected" ? "opacity-60 border-error/15" : "border-outline-variant/15 hover:border-muted-indigo/20"}`}
      >
        {/* Card header */}
        <div className="px-3 py-2.5">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <p className="text-xs font-bold text-on-surface leading-tight truncate">{app.company || "Company"}</p>
                <span className={`text-[8px] font-bold uppercase tracking-wider ${sourceInfo.color} flex items-center gap-0.5`}>
                  <span className="material-symbols-outlined text-[9px]">{sourceInfo.icon}</span>
                  {sourceInfo.label}
                </span>
              </div>
              <p className="text-[10px] text-on-surface-variant/50 font-medium truncate">{app.role || "Role"}</p>
              <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                <p className="text-[9px] text-on-surface-variant/30 font-medium">
                  {formatDate(app.created_at)}
                  {app.ai_match_score ? ` · ${app.ai_match_score}% match` : ""}
                </p>
                {app.status === "rejected" && app.rejection_stage && (
                  <span className="text-[8px] font-bold text-error bg-error/8 px-1.5 py-0.5 rounded">
                    ✗ {app.rejection_stage}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 mt-1 flex-wrap">
                <DeadlineBadge date={app.deadline} />
                <FollowUpBadge date={app.follow_up_date} />
              </div>
            </div>
            <button onClick={() => setExpanded(e => !e)}
              className="w-6 h-6 flex items-center justify-center rounded-md bg-[#1a1a1a]/8 hover:bg-[#1a1a1a] hover:text-[#f5f5e8] text-on-surface-variant/50 transition-all shrink-0">
              <span className="material-symbols-outlined text-[14px]">{expanded ? "expand_less" : "expand_more"}</span>
            </button>
          </div>

          {/* Action row */}
          <div className="flex items-center gap-1.5 mt-2">
            {next && app.status !== "rejected" && (
              <button onClick={() => onMove(next)}
                className="flex-1 py-1.5 bg-[#1a1a1a] text-[#f5f5e8] text-[9px] font-bold rounded-lg hover:bg-[#2a2a2a] active:scale-95 transition-all text-center">
                → {NEXT_LABEL[next] || next}
              </button>
            )}
            {app.status !== "rejected" && (
              <button onClick={() => setShowRejectModal(true)}
                className="px-2 py-1.5 text-[9px] font-bold text-error/70 border border-error/15 rounded-lg hover:bg-error/8 hover:text-error transition-all"
                title="Log rejection">✗</button>
            )}
            <button onClick={() => { setExpanded(true); setTab("notes"); setTimeout(() => notesRef.current?.focus(), 100); }}
              className="w-7 h-7 flex items-center justify-center rounded-lg bg-[#1a1a1a]/8 hover:bg-[#1a1a1a] hover:text-[#f5f5e8] text-on-surface-variant/50 transition-all" title="Notes">
              <span className="material-symbols-outlined text-[14px]">edit_note</span>
            </button>
            {onGenerateCoverLetter && (
              <button onClick={onGenerateCoverLetter}
                className="w-7 h-7 flex items-center justify-center rounded-lg bg-[#1a1a1a]/8 hover:bg-[#1a1a1a] hover:text-[#f5f5e8] text-on-surface-variant/50 transition-all" title="Generate cover letter">
                <span className="material-symbols-outlined text-[14px]">description</span>
              </button>
            )}
            <button onClick={onDelete}
              className="w-7 h-7 flex items-center justify-center rounded-lg bg-[#1a1a1a]/8 hover:bg-error hover:text-white text-on-surface-variant/50 transition-all" title="Remove">
              <span className="material-symbols-outlined text-[14px]">delete</span>
            </button>
          </div>
        </div>

        {/* Expanded section */}
        <AnimatePresence>
          {expanded && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }}
              className="overflow-hidden border-t border-outline-variant/10">
              {/* Tabs */}
              <div className="flex border-b border-outline-variant/10">
                {(["notes", "details", "rejection"] as const).map(t => (
                  <button key={t} onClick={() => setTab(t)}
                    className={`flex-1 py-2 text-[9px] font-bold uppercase tracking-wider transition-all ${tab === t ? "text-on-surface border-b-2 border-[#1a1a1a]" : "text-on-surface-variant/40 hover:text-on-surface-variant/70"}`}>
                    {t === "notes" ? "Notes" : t === "details" ? "Dates" : "Rejection"}
                  </button>
                ))}
              </div>

              <div className="px-3 py-2.5 space-y-2">
                {tab === "notes" && (
                  <>
                    <textarea ref={notesRef} value={notes} onChange={e => { setNotes(e.target.value); setNotesChanged(true); }}
                      placeholder="Interview feedback, recruiter name, next steps..." rows={3}
                      className="w-full text-[11px] font-medium text-on-surface bg-black/3 border border-black/8 rounded-lg p-2 resize-none focus:outline-none focus:border-muted-indigo/30 placeholder:text-on-surface-variant/25 transition-colors" />
                    {notesChanged && (
                      <button onClick={() => { onUpdateNotes(notes); setNotesChanged(false); }}
                        className="w-full py-1.5 bg-[#1a1a1a] text-[#f5f5e8] text-[9px] font-bold rounded-lg hover:bg-[#2a2a2a] active:scale-95 transition-all">
                        Save Notes
                      </button>
                    )}
                  </>
                )}

                {tab === "details" && (
                  <div className="space-y-2.5">
                    {/* Source type */}
                    <div>
                      <p className="text-[9px] font-bold text-on-surface-variant/40 uppercase tracking-wider mb-1">Source</p>
                      <div className="flex gap-1.5">
                        {SOURCE_TYPES.map(s => (
                          <button key={s.value}
                            onClick={() => onUpdateApplication({ source_type: s.value as any })}
                            className={`flex-1 py-1.5 text-[9px] font-bold rounded-lg border transition-all flex items-center justify-center gap-1 ${sourceType === s.value ? "bg-[#1a1a1a] text-[#f5f5e8] border-[#1a1a1a]" : "border-black/10 text-on-surface-variant/50 hover:border-black/20"}`}>
                            <span className="material-symbols-outlined text-[11px]">{s.icon}</span>
                            {s.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[9px] font-bold text-on-surface-variant/40 uppercase tracking-wider">Follow-up</label>
                        <input type="date" value={followUpDate} onChange={e => setFollowUpDate(e.target.value)}
                          className="w-full mt-1 text-[10px] bg-black/3 border border-black/8 rounded-lg px-2 py-1.5 focus:outline-none focus:border-muted-indigo/30" />
                      </div>
                      <div>
                        <label className="text-[9px] font-bold text-on-surface-variant/40 uppercase tracking-wider">Deadline</label>
                        <input type="date" value={deadline} onChange={e => setDeadline(e.target.value)}
                          className="w-full mt-1 text-[10px] bg-black/3 border border-black/8 rounded-lg px-2 py-1.5 focus:outline-none focus:border-muted-indigo/30" />
                      </div>
                      <div>
                        <label className="text-[9px] font-bold text-on-surface-variant/40 uppercase tracking-wider">Interview Date</label>
                        <input type="date" value={interviewDate} onChange={e => setInterviewDate(e.target.value)}
                          className="w-full mt-1 text-[10px] bg-black/3 border border-black/8 rounded-lg px-2 py-1.5 focus:outline-none focus:border-muted-indigo/30" />
                      </div>
                      <div>
                        <label className="text-[9px] font-bold text-on-surface-variant/40 uppercase tracking-wider">Offer (₹/$/yr)</label>
                        <input type="text" value={offerAmount} onChange={e => setOfferAmount(e.target.value)}
                          placeholder="e.g. $120k"
                          className="w-full mt-1 text-[10px] bg-black/3 border border-black/8 rounded-lg px-2 py-1.5 focus:outline-none focus:border-muted-indigo/30 placeholder:text-on-surface-variant/25" />
                      </div>
                    </div>
                    <button onClick={handleSaveDetails}
                      className="w-full py-1.5 bg-[#1a1a1a] text-[#f5f5e8] text-[9px] font-bold rounded-lg hover:bg-[#2a2a2a] active:scale-95 transition-all">
                      Save Details
                    </button>
                  </div>
                )}

                {tab === "rejection" && (
                  <div className="space-y-2">
                    {app.status === "rejected" ? (
                      <>
                        <div className="p-2.5 bg-error/5 border border-error/10 rounded-lg space-y-1">
                          <p className="text-[10px] font-bold text-error">Stage: {app.rejection_stage || "Not specified"}</p>
                          {app.rejection_reason && <p className="text-[10px] text-on-surface-variant/60">{app.rejection_reason}</p>}
                        </div>
                        <button onClick={() => onMove("applied")}
                          className="w-full py-1.5 bg-[#1a1a1a] text-[#f5f5e8] text-[9px] font-bold rounded-lg hover:bg-[#2a2a2a] transition-all">
                          ↩ Move back to Applied
                        </button>
                      </>
                    ) : (
                      <>
                        <p className="text-[10px] text-on-surface-variant/50">Not rejected yet. Use the ✗ button to log a rejection with stage + reason.</p>
                        <p className="text-[9px] text-on-surface-variant/35">Rejections are tracked to identify patterns across your search.</p>
                      </>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </>
  );
}

export default function ApplicationPipeline({
  applications, loading, onMoveStage, onDelete, onUpdateNotes, onUpdateApplication, onReject, onGenerateCoverLetter
}: ApplicationPipelineProps) {
  const activeApps = applications.filter(a => a.status !== "rejected");
  const rejectedApps = applications.filter(a => a.status === "rejected");
  const [showRejected, setShowRejected] = useState(false);

  const grouped = COLUMNS.reduce((acc, col) => {
    acc[col.id] = applications.filter(a => a.status === col.id);
    return acc;
  }, {} as Record<string, Application[]>);

  // Overdue follow-ups
  const overdueFollowUps = applications.filter(a => {
    if (!a.follow_up_date || a.status === "rejected") return false;
    return new Date(a.follow_up_date) < new Date();
  });

  return (
    <div className="premium-card rounded-[24px] p-8 h-full flex flex-col gap-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[18px] text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>view_kanban</span>
          <h2 className="text-xl font-extrabold text-primary tracking-tight">Active Pipeline</h2>
        </div>
        <div className="flex items-center gap-2">
          {overdueFollowUps.length > 0 && (
            <span className="flex items-center gap-1 text-[9px] font-bold text-amber-600 bg-amber-50 border border-amber-200 px-2 py-1 rounded-lg">
              <span className="material-symbols-outlined text-[11px]">notifications_active</span>
              {overdueFollowUps.length} follow-up{overdueFollowUps.length > 1 ? "s" : ""} overdue
            </span>
          )}
          <span className="text-[10px] font-bold text-on-surface-variant/40 uppercase tracking-[0.1em]">
            {activeApps.length} active
          </span>
        </div>
      </div>

      {/* Kanban columns */}
      <div className="grid grid-cols-4 gap-4 flex-1">
        {COLUMNS.map((col, i) => {
          const colApps = grouped[col.id] || [];
          return (
            <motion.div key={col.id}
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 350, damping: 25, delay: 0.1 + i * 0.08 }}
              className={`flex flex-col bg-gradient-to-b ${col.color} to-transparent border border-black/5 rounded-[20px] p-3`}>
              {/* Column header */}
              <div className="flex items-center justify-between px-1 mb-3">
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${col.dot}`} />
                  <span className="text-[11px] font-bold text-on-surface-variant/70 uppercase tracking-wider">{col.title}</span>
                </div>
                <span className="text-[10px] font-black text-on-surface-variant/40 bg-white/50 px-2 py-0.5 rounded-md border border-black/5">
                  {loading ? "—" : colApps.length}
                </span>
              </div>

              {/* Cards */}
              <div className="space-y-2 flex-1 overflow-y-auto max-h-[340px] pr-0.5 scrollbar-hide">
                {loading ? (
                  Array.from({ length: i === 0 ? 2 : 1 }).map((_, j) => (
                    <div key={j} className="h-20 bg-white/60 border border-outline-variant/15 rounded-xl animate-pulse" />
                  ))
                ) : (
                  <AnimatePresence mode="popLayout">
                    {colApps.map(app => (
                      <PipelineCard key={app.id} app={app} next={col.next}
                        onMove={status => onMoveStage(app.id, status)}
                        onDelete={() => onDelete(app.id)}
                        onUpdateNotes={notes => onUpdateNotes(app.id, notes)}
                        onUpdateApplication={updates => onUpdateApplication(app.id, updates)}
                        onReject={(stage, reason) => onReject(app.id, stage, reason)}
                        onGenerateCoverLetter={onGenerateCoverLetter ? () => onGenerateCoverLetter(app) : undefined}
                      />
                    ))}
                  </AnimatePresence>
                )}
              </div>

              {!loading && colApps.length === 0 && (
                <div className="mt-2 h-10 border border-dashed border-black/8 rounded-xl flex items-center justify-center">
                  <span className="text-[9px] text-on-surface-variant/25 font-medium">Empty</span>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Rejected accordion */}
      {rejectedApps.length > 0 && (
        <div className="border-t border-outline-variant/10 pt-4">
          <button onClick={() => setShowRejected(s => !s)}
            className="flex items-center justify-between w-full text-left">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[14px] text-error/60">cancel</span>
              <span className="text-[11px] font-bold text-error/70">Rejected ({rejectedApps.length})</span>
            </div>
            <span className="material-symbols-outlined text-[14px] text-on-surface-variant/30">
              {showRejected ? "expand_less" : "expand_more"}
            </span>
          </button>

          <AnimatePresence>
            {showRejected && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }}
                className="overflow-hidden mt-3 grid grid-cols-2 gap-2">
                {rejectedApps.map(app => (
                  <div key={app.id} className="p-2.5 bg-error/3 border border-error/10 rounded-xl">
                    <p className="text-[10px] font-bold text-on-surface truncate">{app.company}</p>
                    <p className="text-[9px] text-on-surface-variant/50 truncate">{app.role}</p>
                    {app.rejection_stage && <p className="text-[8px] font-bold text-error/60 mt-0.5">✗ {app.rejection_stage}</p>}
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Legend */}
      {!loading && applications.length > 0 && (
        <div className="pt-2 border-t border-outline-variant/10 flex items-center gap-4">
          <span className="material-symbols-outlined text-[12px] text-on-surface-variant/30">info</span>
          <p className="text-[9px] text-on-surface-variant/40 font-medium">
            <strong className="text-on-surface-variant/60">→ Move</strong> stage · 
            <strong className="text-on-surface-variant/60"> ✗</strong> log rejection · 
            <strong className="text-on-surface-variant/60"> 📝</strong> notes · 
            <strong className="text-on-surface-variant/60"> 📄</strong> cover letter · 
            <strong className="text-on-surface-variant/60"> 🗑</strong> remove (5s undo)
          </p>
        </div>
      )}
    </div>
  );
}
