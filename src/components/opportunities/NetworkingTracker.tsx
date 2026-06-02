"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNetworking, NetworkingContact } from "@/hooks/useNetworking";
import { useUser } from "@/context/UserContext";
import toast from "react-hot-toast";

const STATUS_FLOW: { id: NetworkingContact["status"]; label: string; icon: string; color: string }[] = [
  { id: "connected",          label: "Connected",         icon: "link",               color: "bg-slate-100 text-slate-600 border-slate-200" },
  { id: "replied",            label: "Replied",           icon: "reply",              color: "bg-blue-50 text-blue-600 border-blue-200" },
  { id: "intro_made",         label: "Intro Made",        icon: "handshake",          color: "bg-amber-50 text-amber-700 border-amber-200" },
  { id: "referral_requested", label: "Referral Asked",    icon: "send",               color: "bg-violet-50 text-violet-700 border-violet-200" },
  { id: "referral_given",     label: "Referral Given ✓", icon: "verified",           color: "bg-green-50 text-green-700 border-green-200" },
];

const CONNECTION_TYPES = ["linkedin", "email", "event", "referral", "cold"];

function AddContactModal({ onAdd, onClose }: { onAdd: (c: any) => void; onClose: () => void }) {
  const [form, setForm] = useState({ name: "", company: "", role: "", linkedin_url: "", email: "", connection_type: "linkedin", follow_up_date: "", notes: "" });
  const valid = form.name && form.company;
  const isDirty = Object.values(form).some(v => v !== "");

  // FIX #9: Escape key
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") handleClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDirty]);

  // FIX #7: Warn before discarding a partially-filled form
  const handleClose = () => {
    if (isDirty && !window.confirm("Discard this contact? Your changes will be lost.")) return;
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4" onClick={handleClose}>
      <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden"
        onClick={e => e.stopPropagation()}>
        <div className="px-6 py-4 border-b border-outline-variant/10 flex justify-between items-center">
          <h3 className="font-extrabold text-base">Add Contact</h3>
          <button onClick={handleClose} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-black/5 text-on-surface-variant/40">
            <span className="material-symbols-outlined text-[16px]">close</span>
          </button>
        </div>
        <div className="px-6 py-4 space-y-3">
          <div className="grid grid-cols-2 gap-2">
            {[
              { key: "name", label: "Name *", placeholder: "Sarah Chen" },
              { key: "company", label: "Company *", placeholder: "Google" },
              { key: "role", label: "Their Role", placeholder: "Senior PM" },
              { key: "email", label: "Email", placeholder: "sarah@google.com" },
            ].map(f => (
              <div key={f.key}>
                <label className="text-[9px] font-bold text-on-surface-variant/40 uppercase tracking-wider">{f.label}</label>
                <input value={(form as any)[f.key]} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                  placeholder={f.placeholder}
                  className="w-full mt-1 text-[11px] bg-black/3 border border-black/8 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-muted-indigo/30" />
              </div>
            ))}
          </div>
          <div>
            <label className="text-[9px] font-bold text-on-surface-variant/40 uppercase tracking-wider">LinkedIn URL</label>
            <input value={form.linkedin_url} onChange={e => setForm(p => ({ ...p, linkedin_url: e.target.value }))}
              placeholder="linkedin.com/in/sarah-chen"
              className="w-full mt-1 text-[11px] bg-black/3 border border-black/8 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-muted-indigo/30" />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[9px] font-bold text-on-surface-variant/40 uppercase tracking-wider">Source</label>
              <select value={form.connection_type} onChange={e => setForm(p => ({ ...p, connection_type: e.target.value }))}
                className="w-full mt-1 text-[11px] bg-black/3 border border-black/8 rounded-lg px-2.5 py-1.5 focus:outline-none capitalize">
                {CONNECTION_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="text-[9px] font-bold text-on-surface-variant/40 uppercase tracking-wider">Follow-up Date</label>
              <input type="date" value={form.follow_up_date} onChange={e => setForm(p => ({ ...p, follow_up_date: e.target.value }))}
                className="w-full mt-1 text-[11px] bg-black/3 border border-black/8 rounded-lg px-2.5 py-1.5 focus:outline-none" />
            </div>
          </div>
          <div>
            <label className="text-[9px] font-bold text-on-surface-variant/40 uppercase tracking-wider">Notes</label>
            <textarea value={form.notes} onChange={e => setForm(p => ({ ...p, notes: e.target.value }))}
              placeholder="Met at hackathon, works on ads infra..." rows={2}
              className="w-full mt-1 text-[11px] bg-black/3 border border-black/8 rounded-lg px-2.5 py-1.5 resize-none focus:outline-none focus:border-muted-indigo/30" />
          </div>
        </div>
        <div className="px-6 py-4 border-t border-outline-variant/10 flex gap-2">
          <button onClick={handleClose} className="flex-1 py-2.5 border border-black/10 text-[11px] font-bold text-on-surface-variant/60 rounded-xl hover:bg-black/5 transition-all">Cancel</button>
          <button onClick={() => { if (valid) { onAdd({ ...form, status: "connected", last_contacted: new Date().toISOString().split("T")[0] }); onClose(); } }}
            disabled={!valid}
            className="flex-1 py-2.5 bg-[#1a1a1a] text-[#f5f5e8] text-[11px] font-bold rounded-xl hover:bg-[#2a2a2a] transition-all disabled:opacity-40">
            Add Contact
          </button>
        </div>
      </motion.div>
    </div>
  );
}

function ContactCard({ contact, onUpdate, onDelete, onGenerateOutreach, userGoal }: {
  contact: NetworkingContact; onUpdate: (u: Partial<NetworkingContact>) => void;
  onDelete: () => void; onGenerateOutreach: () => Promise<string>; userGoal: string;
}) {
  const [outreach, setOutreach] = useState("");
  const [loadingOutreach, setLoadingOutreach] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const statusInfo = STATUS_FLOW.find(s => s.id === contact.status) || STATUS_FLOW[0];
  const nextStatus = STATUS_FLOW[STATUS_FLOW.findIndex(s => s.id === contact.status) + 1];

  const isOverdue = contact.follow_up_date && new Date(contact.follow_up_date) < new Date();

  const handleOutreach = async () => {
    setLoadingOutreach(true);
    const msg = await onGenerateOutreach();
    setOutreach(msg);
    setLoadingOutreach(false);
  };

  return (
    <motion.div layout initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
      className="bg-white border border-outline-variant/15 rounded-xl overflow-hidden hover:border-muted-indigo/20 hover:shadow-sm transition-all">
      <div className="px-3 py-2.5">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-on-surface truncate">{contact.name}</p>
            <p className="text-[10px] text-on-surface-variant/50 truncate">{contact.role} · {contact.company}</p>
            <div className="flex items-center gap-1.5 mt-1 flex-wrap">
              <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded border ${statusInfo.color}`}>
                {statusInfo.label}
              </span>
              {isOverdue && (
                <span className="text-[8px] font-bold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                  Follow-up overdue
                </span>
              )}
            </div>
          </div>
          <button onClick={() => setExpanded(e => !e)}
            className="w-6 h-6 flex items-center justify-center rounded-md bg-[#1a1a1a]/8 hover:bg-[#1a1a1a] hover:text-[#f5f5e8] text-on-surface-variant/50 transition-all shrink-0">
            <span className="material-symbols-outlined text-[13px]">{expanded ? "expand_less" : "expand_more"}</span>
          </button>
        </div>

        {/* Action row */}
        <div className="flex items-center gap-1.5 mt-2">
          {nextStatus && (
            <button onClick={() => onUpdate({ status: nextStatus.id })}
              className="flex-1 py-1.5 bg-[#1a1a1a] text-[#f5f5e8] text-[9px] font-bold rounded-lg hover:bg-[#2a2a2a] transition-all text-center">
              → {nextStatus.label}
            </button>
          )}
          {contact.linkedin_url && (
            <a href={contact.linkedin_url.startsWith("http") ? contact.linkedin_url : `https://${contact.linkedin_url}`}
              target="_blank" rel="noopener noreferrer"
              className="w-7 h-7 flex items-center justify-center rounded-lg bg-[#1a1a1a]/8 hover:bg-[#0077B5] hover:text-white text-on-surface-variant/50 transition-all" title="LinkedIn">
              <span className="material-symbols-outlined text-[13px]">open_in_new</span>
            </a>
          )}
          <button onClick={onDelete}
            className="w-7 h-7 flex items-center justify-center rounded-lg bg-[#1a1a1a]/8 hover:bg-error hover:text-white text-on-surface-variant/50 transition-all">
            <span className="material-symbols-outlined text-[13px]">delete</span>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }}
            className="border-t border-outline-variant/10 px-3 py-2.5 space-y-2">
            {contact.notes && <p className="text-[10px] text-on-surface-variant/60 italic">{contact.notes}</p>}
            <button onClick={handleOutreach} disabled={loadingOutreach}
              className="w-full py-1.5 bg-[#1a1a1a] text-[#f5f5e8] text-[9px] font-bold rounded-lg hover:bg-[#2a2a2a] transition-all flex items-center justify-center gap-1.5 disabled:opacity-50">
              <span className="material-symbols-outlined text-[12px]">auto_awesome</span>
              {loadingOutreach ? "Generating..." : "Generate outreach message"}
            </button>
            {outreach && (
              <div className="space-y-1.5">
                <div className="bg-black/3 border border-black/8 rounded-lg p-2.5 text-[10px] text-on-surface-variant/70 leading-relaxed">{outreach}</div>
                <button onClick={() => { navigator.clipboard.writeText(outreach); toast.success("Copied!"); }}
                  className="w-full py-1 text-[9px] font-bold text-on-surface-variant/50 border border-black/8 rounded-lg hover:bg-black/5 transition-all">
                  Copy Message
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function NetworkingTracker() {
  const { contacts, loading, dbMissing, addContact, updateContact, deleteContact, generateOutreach, overdueFollowUps } = useNetworking();
  const { profile } = useUser();
  const [showAdd, setShowAdd] = useState(false);
  const userGoal = profile?.onboardingData?.careerGoal || "Product Manager";

  const referralGiven = contacts.filter(c => c.status === "referral_given").length;
  const referralRequested = contacts.filter(c => c.status === "referral_requested").length;
  const activeContacts = contacts.filter(c => c.status !== "referral_given");

  return (
    <>
      {showAdd && <AddContactModal onAdd={(c) => addContact(c as any)} onClose={() => setShowAdd(false)} />}
      <div className="premium-card rounded-[24px] p-8 flex flex-col gap-5">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px] text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>group</span>
            <h2 className="text-xl font-extrabold text-primary tracking-tight">Networking</h2>
          </div>
          <button onClick={() => setShowAdd(true)}
            className="px-4 py-2 bg-[#1a1a1a] text-[#f5f5e8] text-[10px] font-bold rounded-xl hover:bg-[#2a2a2a] active:scale-95 transition-all flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[13px]">person_add</span>
            Add Contact
          </button>
        </div>

        {/* FIX #3: DB migration error banner */}
        {dbMissing && (
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-3">
            <span className="material-symbols-outlined text-[18px] text-amber-600 shrink-0 mt-0.5">warning</span>
            <div>
              <p className="text-[12px] font-bold text-amber-800">Database setup required</p>
              <p className="text-[11px] text-amber-700 mt-0.5">
                Run the <code className="bg-amber-100 px-1 rounded">networking_contacts</code> SQL migration in Supabase to enable this feature.
              </p>
            </div>
          </div>
        )}
        <div className="grid grid-cols-4 gap-3">
          {[
            { label: "Total", value: contacts.length, icon: "group" },
            { label: "Referrals Given", value: referralGiven, icon: "verified", highlight: referralGiven > 0 },
            { label: "Follow-ups Due", value: overdueFollowUps.length, icon: "notifications", warn: overdueFollowUps.length > 0 },
            { label: "Asking Referral", value: referralRequested, icon: "send" },
          ].map(s => (
            <div key={s.label} className={`p-3 rounded-xl border text-center ${s.highlight ? "bg-green-50 border-green-200" : s.warn && s.value > 0 ? "bg-amber-50 border-amber-200" : "bg-black/3 border-black/5"}`}>
              <p className={`text-xl font-black ${s.highlight ? "text-green-700" : s.warn && s.value > 0 ? "text-amber-700" : "text-on-surface"}`}>{s.value}</p>
              <p className="text-[9px] font-bold text-on-surface-variant/50 mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Contact cards */}
        <div className="space-y-2 max-h-[360px] overflow-y-auto pr-0.5">
          {loading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-16 bg-black/5 rounded-xl animate-pulse" />
            ))
          ) : contacts.length === 0 ? (
            <div className="text-center py-10 space-y-2">
              <span className="material-symbols-outlined text-4xl text-on-surface-variant/20 block">group</span>
              <p className="text-[12px] text-on-surface-variant/40 font-medium">No contacts yet</p>
              <p className="text-[11px] text-on-surface-variant/30">Track everyone you reach out to for referrals</p>
            </div>
          ) : (
            <AnimatePresence mode="popLayout">
              {contacts.map(contact => (
                <ContactCard key={contact.id} contact={contact}
                  onUpdate={updates => updateContact(contact.id, updates)}
                  onDelete={() => deleteContact(contact.id)}
                  onGenerateOutreach={() => generateOutreach(contact, userGoal)}
                  userGoal={userGoal}
                />
              ))}
            </AnimatePresence>
          )}
        </div>

        {/* Pipeline funnel */}
        {contacts.length > 0 && (
          <div className="pt-4 border-t border-outline-variant/10">
            <p className="text-[9px] font-bold text-on-surface-variant/40 uppercase tracking-wider mb-2">Referral Funnel</p>
            <div className="flex items-center gap-1">
              {STATUS_FLOW.map((s, i) => {
                const count = contacts.filter(c => c.status === s.id).length;
                return (
                  <div key={s.id} className="flex-1 text-center">
                    <div className={`h-1.5 rounded-full mb-1 ${count > 0 ? "bg-[#1a1a1a]" : "bg-black/8"}`} />
                    <p className="text-[8px] font-bold text-on-surface-variant/40">{count}</p>
                  </div>
                );
              })}
            </div>
            <div className="flex items-center gap-1 mt-0.5">
              {STATUS_FLOW.map(s => (
                <p key={s.id} className="flex-1 text-[7px] text-on-surface-variant/25 font-medium text-center leading-tight">{s.label.split(" ")[0]}</p>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
