"use client";

import { useState } from "react";
import { useOrbitStore } from "@/lib/store";
import toast from "react-hot-toast";

export default function IssueReporter() {
  const { addSupportTicket } = useOrbitStore();
  const [type, setType] = useState("bug");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) {
      toast.error("Please describe the issue.");
      return;
    }

    setIsSubmitting(true);
    
    // Simulate network delay
    setTimeout(() => {
      addSupportTicket({
        id: `ticket_${Date.now()}`,
        type,
        description,
        status: "open",
        createdAt: new Date().toISOString()
      });
      
      toast.success("Report submitted successfully.");
      setDescription("");
      setIsSubmitting(false);
    }, 800);
  };

  return (
    <div className="premium-card rounded-3xl p-8 h-full">
      <h2 className="text-xl font-extrabold text-primary tracking-tight mb-2">Report an Issue</h2>
      <p className="text-xs font-medium text-on-surface-variant/70 mb-8">
        Help us improve Orbit by reporting bugs, broken AI generations, or requesting features.
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-[10px] font-black uppercase tracking-widest text-on-surface-variant/60 mb-2">
            Issue Type
          </label>
          <div className="flex gap-2">
            {["bug", "feature", "ai_error"].map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setType(t)}
                className={`px-4 py-2 rounded-xl text-[11px] font-bold uppercase tracking-wider transition-all border ${
                  type === t 
                    ? "bg-muted-indigo text-white border-muted-indigo shadow-md shadow-muted-indigo/20" 
                    : "bg-surface-container-low text-on-surface-variant border-black/5 hover:border-black/10"
                }`}
              >
                {t.replace("_", " ")}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-[10px] font-black uppercase tracking-widest text-on-surface-variant/60 mb-2">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe what happened or what you'd like to see..."
            className="w-full h-32 p-4 bg-surface-container-lowest border border-outline-variant/30 rounded-2xl focus:outline-none focus:border-muted-indigo focus:ring-1 focus:ring-muted-indigo/50 text-sm font-medium resize-none transition-all"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3 bg-primary text-white font-bold text-sm rounded-xl shadow-lg shadow-primary/20 hover:shadow-primary/40 active:scale-95 transition-all disabled:opacity-50 disabled:pointer-events-none flex justify-center items-center gap-2"
        >
          {isSubmitting ? (
            <span className="material-symbols-outlined animate-spin text-[18px]">sync</span>
          ) : (
            <span className="material-symbols-outlined text-[18px]">send</span>
          )}
          {isSubmitting ? "Submitting..." : "Submit Report"}
        </button>
      </form>
    </div>
  );
}
