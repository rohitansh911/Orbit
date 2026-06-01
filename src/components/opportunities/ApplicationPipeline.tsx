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
}

const COLUMNS: { id: Application["status"]; title: string; dot: string; next?: Application["status"] }[] = [
  { id: "saved",       title: "Saved",     dot: "bg-outline-variant/40",  next: "applied" },
  { id: "applied",     title: "Applied",   dot: "bg-muted-indigo/60",     next: "interviewing" },
  { id: "interviewing",title: "Interview", dot: "bg-soft-lavender",       next: "offer" },
  { id: "offer",       title: "Offer",     dot: "bg-green-500" },
];

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function PipelineCard({
  app,
  next,
  onMove,
  onDelete,
  onUpdateNotes,
}: {
  app: Application;
  next?: Application["status"];
  onMove: (status: Application["status"]) => void;
  onDelete: () => void;
  onUpdateNotes: (notes: string) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const [notes, setNotes] = useState(app.notes || "");
  const [notesChanged, setNotesChanged] = useState(false);
  const notesRef = useRef<HTMLTextAreaElement>(null);

  const NEXT_LABEL: Record<string, string> = {
    applied: "Applied",
    interviewing: "Interview",
    offer: "Offer 🎉",
  };

  const handleSaveNotes = () => {
    onUpdateNotes(notes);
    setNotesChanged(false);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20, scale: 0.95 }}
      className="group bg-white border border-outline-variant/15 rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.02)] hover:border-muted-indigo/20 hover:shadow-md transition-all overflow-hidden"
    >
      {/* Card header — always visible */}
      <div className="px-3 py-2.5">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-on-surface leading-tight truncate">{app.company || "Company"}</p>
            <p className="text-[10px] text-on-surface-variant/50 font-medium truncate">{app.role || "Role"}</p>
            <p className="text-[9px] text-on-surface-variant/30 font-medium mt-0.5">
              {formatDate(app.created_at)}
              {app.ai_match_score ? ` · ${app.ai_match_score}% match` : ""}
            </p>
          </div>
          {/* Expand / collapse */}
          <button
            onClick={() => setExpanded(e => !e)}
            className="w-6 h-6 flex items-center justify-center rounded-md bg-[#1a1a1a]/8 hover:bg-[#1a1a1a] hover:text-[#f5f5e8] text-on-surface-variant/50 transition-all shrink-0"
          >
            <span className="material-symbols-outlined text-[14px]">
              {expanded ? "expand_less" : "expand_more"}
            </span>
          </button>
        </div>

        {/* Always-visible action row */}
        <div className="flex items-center gap-1.5 mt-2">
          {next && (
            <button
              onClick={() => onMove(next)}
              className="flex-1 py-1.5 bg-[#1a1a1a] text-[#f5f5e8] text-[9px] font-bold rounded-lg hover:bg-[#2a2a2a] active:scale-95 transition-all text-center"
            >
              → {NEXT_LABEL[next] || next}
            </button>
          )}
          <button
            onClick={() => { setExpanded(true); setTimeout(() => notesRef.current?.focus(), 100); }}
            className="w-7 h-7 flex items-center justify-center rounded-lg bg-[#1a1a1a]/8 hover:bg-[#1a1a1a] hover:text-[#f5f5e8] text-on-surface-variant/50 transition-all"
            title="Add note"
          >
            <span className="material-symbols-outlined text-[14px]">edit_note</span>
          </button>
          <button
            onClick={onDelete}
            className="w-7 h-7 flex items-center justify-center rounded-lg bg-[#1a1a1a]/8 hover:bg-error text-on-surface-variant/50 hover:text-white transition-all"
            title="Remove"
          >
            <span className="material-symbols-outlined text-[14px]">delete</span>
          </button>
        </div>
      </div>

      {/* Expanded section — notes + extra info */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden border-t border-outline-variant/10"
          >
            <div className="px-3 py-2.5 space-y-2">
              <p className="text-[9px] font-bold text-on-surface-variant/40 uppercase tracking-wider">Notes</p>
              <textarea
                ref={notesRef}
                value={notes}
                onChange={e => { setNotes(e.target.value); setNotesChanged(true); }}
                placeholder="Interview date, contact name, feedback..."
                rows={3}
                className="w-full text-[11px] font-medium text-on-surface bg-on-surface/3 border border-outline-variant/15 rounded-lg p-2 resize-none focus:outline-none focus:border-muted-indigo/30 placeholder:text-on-surface-variant/25 transition-colors"
              />
              {notesChanged && (
                <button
                  onClick={handleSaveNotes}
                  className="w-full py-1.5 bg-[#1a1a1a] text-[#f5f5e8] text-[9px] font-bold rounded-lg hover:bg-[#2a2a2a] active:scale-95 transition-all"
                >
                  Save Notes
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function ApplicationPipeline({ applications, loading, onMoveStage, onDelete, onUpdateNotes }: ApplicationPipelineProps) {
  const grouped = COLUMNS.reduce((acc, col) => {
    acc[col.id] = applications.filter(a => a.status === col.id);
    return acc;
  }, {} as Record<string, Application[]>);

  return (
    <div className="premium-card rounded-[24px] p-8 h-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[18px] text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>
            view_kanban
          </span>
          <h2 className="text-xl font-extrabold text-primary tracking-tight">Active Pipeline</h2>
        </div>
        <span className="text-[10px] font-bold text-on-surface-variant/40 uppercase tracking-[0.1em]">
          {applications.length} total
        </span>
      </div>

      <div className="grid grid-cols-4 gap-4 flex-1">
        {COLUMNS.map((col, i) => {
          const colApps = grouped[col.id] || [];
          return (
            <motion.div
              key={col.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 350, damping: 25, delay: 0.2 + i * 0.1 }}
              className="flex flex-col bg-surface-container/20 border border-black/5 rounded-[20px] p-3"
            >
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
              <div className="space-y-2 flex-1 overflow-y-auto max-h-[320px] pr-0.5">
                {loading ? (
                  Array.from({ length: i === 0 ? 2 : 1 }).map((_, j) => (
                    <div key={j} className="h-16 bg-white/60 border border-outline-variant/15 rounded-xl animate-pulse" />
                  ))
                ) : (
                  <AnimatePresence mode="popLayout">
                    {colApps.map(app => (
                      <PipelineCard
                        key={app.id}
                        app={app}
                        next={col.next}
                        onMove={(status) => onMoveStage(app.id, status)}
                        onDelete={() => onDelete(app.id)}
                        onUpdateNotes={(notes) => onUpdateNotes(app.id, notes)}
                      />
                    ))}
                  </AnimatePresence>
                )}
              </div>

              {/* Empty state */}
              {!loading && colApps.length === 0 && (
                <div className="mt-2 h-10 border border-dashed border-black/8 rounded-xl flex items-center justify-center">
                  <span className="text-[9px] text-on-surface-variant/25 font-medium">Empty</span>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Legend */}
      {!loading && applications.length > 0 && (
        <div className="mt-4 pt-4 border-t border-outline-variant/10 flex items-center gap-4">
          <span className="material-symbols-outlined text-[14px] text-on-surface-variant/30">info</span>
          <p className="text-[10px] text-on-surface-variant/40 font-medium">
            Click <strong className="text-on-surface-variant/60">→ Move</strong> to advance a stage · 
            <strong className="text-on-surface-variant/60"> ✎</strong> to add notes · 
            <strong className="text-on-surface-variant/60"> 🗑</strong> to remove (5s undo)
          </p>
        </div>
      )}
    </div>
  );
}
