"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Application } from "@/hooks/useOpportunities";
import { useUser } from "@/context/UserContext";
import toast from "react-hot-toast";

interface CoverLetterModalProps {
  app: Application | null;
  onClose: () => void;
  onSave: (appId: string, text: string) => void;
}

export default function CoverLetterModal({ app, onClose, onSave }: CoverLetterModalProps) {
  const { profile } = useUser();
  const [loading, setLoading] = useState(false);
  const [coverLetter, setCoverLetter] = useState(app?.cover_letter || "");
  const [generated, setGenerated] = useState(false);

  const handleGenerate = async () => {
    if (!app) return;
    setLoading(true);
    try {
      const res = await fetch("/api/ai/cover-letter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          profile,
          job: { company: app.company, role: app.role, skills_required: [], tags: [] }
        })
      });
      const data = await res.json();
      setCoverLetter(data.coverLetter || "");
      setGenerated(true);
    } catch {
      toast.error("Failed to generate cover letter");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(coverLetter);
    toast.success("Copied to clipboard!");
  };

  const handleSave = () => {
    if (app) {
      onSave(app.id, coverLetter);
      toast.success("Cover letter saved to application");
      onClose();
    }
  };

  if (!app) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4" onClick={onClose}>
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 10 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-outline-variant/10 flex items-start justify-between">
          <div>
            <h3 className="font-extrabold text-base text-on-surface">Cover Letter Generator</h3>
            <p className="text-[11px] text-on-surface-variant/60 mt-0.5">
              {app.role} at {app.company}
            </p>
          </div>
          <button onClick={onClose} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-black/5 text-on-surface-variant/40 transition-all">
            <span className="material-symbols-outlined text-[16px]">close</span>
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-4 space-y-3">
          {!coverLetter && !loading && (
            <div className="text-center py-8 space-y-3">
              <span className="material-symbols-outlined text-4xl text-on-surface-variant/20 block">description</span>
              <p className="text-[12px] text-on-surface-variant/50 font-medium">
                AI will write a personalized cover letter based on your profile and this job
              </p>
            </div>
          )}

          {loading && (
            <div className="text-center py-8 space-y-3">
              <div className="w-8 h-8 border-2 border-[#1a1a1a] border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-[12px] text-on-surface-variant/50 font-medium">Crafting your letter...</p>
            </div>
          )}

          {coverLetter && !loading && (
            <div className="space-y-2">
              {generated && (
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-green-600">
                  <span className="material-symbols-outlined text-[12px]">auto_awesome</span>
                  AI-generated — edit as needed
                </div>
              )}
              <textarea
                value={coverLetter}
                onChange={e => setCoverLetter(e.target.value)}
                rows={10}
                className="w-full text-[12px] font-medium text-on-surface bg-black/2 border border-black/8 rounded-xl p-3 resize-none focus:outline-none focus:border-muted-indigo/30 leading-relaxed"
              />
              <p className="text-[10px] text-on-surface-variant/40">{coverLetter.split(/\s+/).length} words</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-outline-variant/10 flex gap-2">
          <button onClick={handleGenerate} disabled={loading}
            className="flex-1 py-2.5 bg-[#1a1a1a] text-[#f5f5e8] text-[11px] font-bold rounded-xl hover:bg-[#2a2a2a] active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-1.5">
            <span className="material-symbols-outlined text-[14px]">auto_awesome</span>
            {coverLetter ? "Regenerate" : "Generate"}
          </button>
          {coverLetter && (
            <>
              <button onClick={handleCopy}
                className="px-4 py-2.5 border border-black/10 text-[11px] font-bold text-on-surface-variant/70 rounded-xl hover:bg-black/5 transition-all">
                Copy
              </button>
              <button onClick={handleSave}
                className="px-4 py-2.5 border border-black/10 text-[11px] font-bold text-on-surface-variant/70 rounded-xl hover:bg-black/5 transition-all">
                Save
              </button>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
}
