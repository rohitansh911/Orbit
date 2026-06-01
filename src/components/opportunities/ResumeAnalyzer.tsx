"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useUser } from "@/context/UserContext";
import { useOrbitStore } from "@/lib/store";
import toast from "react-hot-toast";

export default function ResumeAnalyzer() {
  const { profile } = useUser();
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { resumeAudit: result, setResumeAudit: setResult } = useOrbitStore();

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleAnalyze = async () => {
    if (!file) return;
    setIsAnalyzing(true);
    setResult(null);

    const formData = new FormData();
    formData.append("resume", file);
    formData.append("role", profile?.onboardingData?.careerGoal || "Software Engineer");
    formData.append("memoryEvents", JSON.stringify(useOrbitStore.getState().memoryEvents.slice(0, 10)));

    try {
      const res = await fetch("/api/ai/resume", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        setResult(data.analysis);
      } else {
        toast.error("Failed to analyze resume.");
      }
    } catch (e) {
      toast.error("Error parsing resume.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div id="resume-analyzer" className="premium-card rounded-3xl p-8 lg:p-12 space-y-8 relative overflow-hidden scroll-mt-24">
      {/* Background glow */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.04)_0%,transparent_70%)] pointer-events-none" />

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 relative z-10">
        <div className="space-y-2">
          <div className="flex items-center gap-3 mb-2">
            <span className="material-symbols-outlined text-muted-indigo text-[24px]">document_scanner</span>
            <h3 className="text-2xl font-extrabold text-primary tracking-tight">Resume Intelligence</h3>
          </div>
          <p className="text-sm text-on-surface-variant/60 font-medium max-w-lg">
            Upload your resume for a brutal, strategic AI breakdown. We analyze ATS alignment, impact communication, and recruiter readiness for your target role.
          </p>
        </div>
      </div>

      {!result && !isAnalyzing && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`border-2 border-dashed rounded-2xl p-10 flex flex-col items-center justify-center transition-all duration-300 ${
            isDragging ? "border-muted-indigo bg-muted-indigo/5" : "border-black/10 bg-white/30 hover:border-muted-indigo/30 hover:bg-white/60"
          }`}
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
        >
          <div className="w-16 h-16 rounded-2xl bg-muted-indigo/10 flex items-center justify-center mb-4">
            <span className="material-symbols-outlined text-muted-indigo text-[32px]">upload_file</span>
          </div>
          <p className="text-base font-bold text-on-surface mb-1">
            {file ? file.name : "Drag & drop your resume"}
          </p>
          <p className="text-[11px] font-semibold text-on-surface-variant/50 uppercase tracking-widest mb-6">
            PDF or DOCX
          </p>
          
          <div className="flex gap-4">
            <input
              type="file"
              id="resume-upload"
              className="hidden"
              accept=".pdf,.doc,.docx"
              onChange={(e) => e.target.files && setFile(e.target.files[0])}
            />
            <button
              onClick={() => document.getElementById("resume-upload")?.click()}
              className="px-6 py-2.5 rounded-xl bg-[#1a1a1a] text-[#f5f5e8] font-bold text-xs hover:bg-[#2a2a2a] active:scale-95 transition-all"
            >
              Browse Files
            </button>
            <button
              onClick={handleAnalyze}
              disabled={!file}
              className="px-8 py-2.5 rounded-xl bg-[#1a1a1a] text-[#f5f5e8] font-bold text-xs disabled:opacity-50 disabled:pointer-events-none hover:bg-[#2a2a2a] active:scale-95 transition-all flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-[16px]">auto_awesome</span>
              Analyze Orbit
            </button>
          </div>
        </motion.div>
      )}

      {isAnalyzing && (
        <div className="py-20 flex flex-col items-center justify-center space-y-6">
          <div className="relative w-24 h-24">
            <div className="absolute inset-0 rounded-full border-4 border-muted-indigo/20 border-t-muted-indigo animate-spin" />
            <div className="absolute inset-2 rounded-full border-4 border-soft-lavender/30 border-b-soft-lavender animate-spin-slow" />
            <span className="absolute inset-0 flex items-center justify-center material-symbols-outlined text-muted-indigo text-[32px] animate-pulse">
              memory
            </span>
          </div>
          <div className="text-center space-y-2">
            <p className="text-lg font-bold text-primary">Analyzing telemetry...</p>
            <p className="text-[11px] font-semibold text-on-surface-variant/50 uppercase tracking-widest">Running ATS simulation</p>
          </div>
        </div>
      )}

      {result && !isAnalyzing && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="space-y-8"
        >
          {/* Top stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-6 rounded-2xl bg-white/50 border border-black/5 flex flex-col items-center text-center justify-center space-y-2">
              <span className="text-[10px] font-black text-on-surface-variant/40 uppercase tracking-[0.2em]">ATS Score</span>
              <span className={`text-5xl font-black ${result.atsScore >= 80 ? 'text-green-500' : result.atsScore >= 60 ? 'text-amber-500' : 'text-error'}`}>
                {result.atsScore}
              </span>
            </div>
            <div className="p-6 rounded-2xl bg-white/50 border border-black/5 flex flex-col items-center text-center justify-center space-y-2">
              <span className="text-[10px] font-black text-on-surface-variant/40 uppercase tracking-[0.2em]">Readiness</span>
              <span className={`text-3xl font-black tracking-tight ${result.readiness === 'Strong' ? 'text-green-500' : result.readiness === 'Average' ? 'text-amber-500' : 'text-error'}`}>
                {result.readiness}
              </span>
            </div>
            <div className="p-6 rounded-2xl bg-muted-indigo/5 border border-muted-indigo/15 flex flex-col justify-center space-y-2">
              <span className="text-[10px] font-black text-muted-indigo uppercase tracking-[0.2em]">Strategic Verdict</span>
              <p className="text-xs font-semibold text-on-surface leading-relaxed">
                {result.overallStrategy}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Strengths & Weaknesses */}
            <div className="space-y-6">
              <div>
                <h4 className="text-xs font-black text-primary uppercase tracking-widest mb-3 flex items-center gap-2">
                  <span className="material-symbols-outlined text-green-500 text-[16px]">verified</span>
                  Strengths
                </h4>
                <ul className="space-y-2">
                  {result.strengths.map((s: string, i: number) => (
                    <li key={i} className="text-sm font-medium text-on-surface-variant flex items-start gap-2">
                      <div className="w-1.5 h-1.5 mt-1.5 rounded-full bg-green-500 shrink-0" />
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="text-xs font-black text-primary uppercase tracking-widest mb-3 flex items-center gap-2">
                  <span className="material-symbols-outlined text-error text-[16px]">warning</span>
                  Missing Keywords
                </h4>
                <div className="flex flex-wrap gap-2">
                  {result.missingKeywords.map((kw: string, i: number) => (
                    <span key={i} className="px-3 py-1.5 rounded-lg bg-error/5 text-error text-[11px] font-bold border border-error/10">
                      {kw}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Bullet Rewrites */}
            <div className="space-y-4">
              <h4 className="text-xs font-black text-primary uppercase tracking-widest mb-1 flex items-center gap-2">
                <span className="material-symbols-outlined text-muted-indigo text-[16px]">edit_document</span>
                Bullet Optimization
              </h4>
              {result.weakBullets.map((wb: any, i: number) => (
                <div key={i} className="p-4 rounded-xl bg-white border border-black/5 space-y-3 shadow-sm">
                  <div className="space-y-1">
                    <span className="text-[9px] font-black text-error uppercase tracking-widest">Weak Impact</span>
                    <p className="text-xs font-medium text-on-surface-variant line-through opacity-70">
                      {wb.original}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[9px] font-black text-green-600 uppercase tracking-widest">Orbit Suggestion</span>
                    <p className="text-xs font-bold text-on-surface">
                      {wb.rewrite}
                    </p>
                  </div>
                  <p className="text-[10px] font-semibold text-muted-indigo bg-muted-indigo/5 p-2 rounded-md">
                    {wb.critique}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-center pt-4">
            <button
              onClick={() => setResult(null)}
              className="px-6 py-2.5 rounded-xl bg-[#1a1a1a] text-[#f5f5e8] text-[11px] font-bold hover:bg-[#2a2a2a] active:scale-95 transition-all"
            >
              Analyze Another Resume
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
