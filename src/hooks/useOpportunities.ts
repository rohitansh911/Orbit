"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useAuth } from "@/context/AuthContext";
import { useUser } from "@/context/UserContext";
import { useOrbitStore } from "@/lib/store";
import { supabase } from "@/lib/supabase";
import toast from "react-hot-toast";

export interface Opportunity {
  id: string;
  company: string;
  role: string;
  location: string;
  remote_type: string;
  salary_range: string;
  skills_required: string[];
  experience_level: string;
  url: string;
  tags: string[];
  hiringIntensity?: string;
  remoteFriendly?: boolean;
  internFriendly?: boolean;
  interviewDifficulty?: string;
  growthVelocity?: string;
  match_score?: number;
  skill_gap?: string;
  why_match?: string;
  urgency?: string;
  recruiter_alignment?: string;
}

export interface Application {
  id: string;
  uid: string;
  opportunity_id: string;
  status: "saved" | "applied" | "interviewing" | "offer" | "rejected" | "archived";
  ai_match_score?: number;
  company?: string;
  role?: string;
  notes?: string;
  source?: string;
  // New job-seeker fields
  follow_up_date?: string;
  interview_date?: string;
  deadline?: string;
  rejection_reason?: string;
  rejection_stage?: string;
  source_type?: "cold" | "warm" | "referral";
  cover_letter?: string;
  offer_amount?: string;
  round_number?: number;
  created_at: string;
  updated_at: string;
}

export interface MomentumData {
  appsThisWeek: number;
  appsLastWeek: number;
  responseRate: number;
  visibilityScore: number;
  velocityLabel: string;
  savedCount: number;
  appliedCount: number;
  interviewCount: number;
  offerCount: number;
}

export interface AIData {
  recommendations: any[];
  marketSignals: any[];
}

const CACHE_TTL_MS = 8 * 60 * 1000;

export function useOpportunities() {
  const { user } = useAuth();
  const { profile } = useUser();
  const { missions, memoryEvents } = useOrbitStore();

  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [aiData, setAiData] = useState<AIData>({ recommendations: [], marketSignals: [] });
  const [loading, setLoading] = useState(true);
  const [aiLoading, setAiLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cacheRef = useRef<{ data: any; ts: number } | null>(null);

  // ─── Fetch applications ───────────────────────────────────────────────────
  const fetchApplications = useCallback(async () => {
    if (!user) return [] as Application[];
    try {
      const { data, error } = await supabase
        .from("job_applications")
        .select("*")
        .eq("uid", user.id)
        .order("updated_at", { ascending: false });
      if (error) throw error;
      return (data || []) as Application[];
    } catch (e) {
      console.error("Failed to fetch applications:", e);
      return [] as Application[];
    }
  }, [user]);

  // ─── Fetch AI opportunities ───────────────────────────────────────────────
  const fetchAIIntelligence = useCallback(async (apps: Application[]) => {
    if (cacheRef.current && Date.now() - cacheRef.current.ts < CACHE_TTL_MS) {
      return cacheRef.current.data;
    }
    setAiLoading(true);
    try {
      const pipelineCounts = {
        saved: apps.filter(a => a.status === "saved").length,
        applied: apps.filter(a => a.status === "applied").length,
        interview: apps.filter(a => a.status === "interviewing").length,
        offer: apps.filter(a => a.status === "offer").length,
      };
      const res = await fetch("/api/ai/opportunities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profile, pipeline: pipelineCounts, memoryEvents: memoryEvents.slice(0, 10) }),
      });
      if (!res.ok) throw new Error("AI fetch failed");
      const result = await res.json();
      cacheRef.current = { data: result, ts: Date.now() };
      return result;
    } catch (e) {
      console.error("AI intelligence fetch failed:", e);
      return { opportunities: [], recommendations: [], marketSignals: [] };
    } finally {
      setAiLoading(false);
    }
  }, [profile, memoryEvents]);

  // ─── Momentum ─────────────────────────────────────────────────────────────
  const computeMomentum = useCallback((apps: Application[]): MomentumData => {
    const now = Date.now();
    const oneWeekAgo = now - 7 * 24 * 60 * 60 * 1000;
    const twoWeeksAgo = now - 14 * 24 * 60 * 60 * 1000;

    const appsThisWeek = apps.filter(a => new Date(a.created_at).getTime() > oneWeekAgo && a.status === "applied").length;
    const appsLastWeek = apps.filter(a => {
      const t = new Date(a.created_at).getTime();
      return t > twoWeeksAgo && t <= oneWeekAgo && a.status === "applied";
    }).length;

    const appliedCount = apps.filter(a => a.status === "applied").length;
    const interviewCount = apps.filter(a => a.status === "interviewing").length;
    const offerCount = apps.filter(a => a.status === "offer").length;
    const savedCount = apps.filter(a => a.status === "saved").length;
    const responseRate = appliedCount > 0 ? Math.round((interviewCount / appliedCount) * 100) : 0;

    const streak = profile?.stats?.streak || 0;
    const momentum = profile?.stats?.momentumScore || 0;
    const completedMissions = missions.filter((m: any) => m.status === "completed").length;
    const visibilityScore = Math.min(
      Math.round((streak * 12) + (momentum * 5) + (completedMissions * 8) + (appliedCount * 15)), 999
    );

    let velocityLabel = "Building momentum";
    if (interviewCount >= 2) velocityLabel = "Moving rapidly through screening";
    else if (appsThisWeek >= 5) velocityLabel = "High application velocity";
    else if (appsThisWeek >= 2) velocityLabel = "Steady application pace";
    else if (appsThisWeek === 0 && appliedCount === 0) velocityLabel = "Pipeline not yet active";

    return { appsThisWeek, appsLastWeek, responseRate, visibilityScore, velocityLabel, savedCount, appliedCount, interviewCount, offerCount };
  }, [profile, missions]);

  // ─── ACTIONS ──────────────────────────────────────────────────────────────

  const updateApplication = useCallback(async (appId: string, updates: Partial<Application>) => {
    if (!user) return;
    try {
      const { error } = await supabase.from("job_applications")
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq("id", appId).eq("uid", user.id);
      if (error) throw error;
      setApplications(prev => prev.map(a => a.id === appId ? { ...a, ...updates } : a));
    } catch { toast.error("Failed to update"); }
  }, [user]);

  const rejectApplication = useCallback(async (appId: string, stage: string, reason: string) => {
    if (!user) return;
    try {
      const { error } = await supabase.from("job_applications")
        .update({ status: "rejected", rejection_stage: stage, rejection_reason: reason, updated_at: new Date().toISOString() })
        .eq("id", appId).eq("uid", user.id);
      if (error) throw error;
      setApplications(prev => prev.map(a => a.id === appId ? { ...a, status: "rejected" as const, rejection_stage: stage, rejection_reason: reason } : a));
      toast.success("Logged as rejected — building pattern data");
    } catch { toast.error("Failed to log rejection"); }
  }, [user]);

  const saveJob = useCallback(async (opp: Opportunity) => {
    if (!user) { toast.error("Sign in to save opportunities"); return; }
    try {
      const { error } = await supabase.from("job_applications").upsert({
        uid: user.id, opportunity_id: opp.id, status: "saved",
        ai_match_score: opp.match_score || null, company: opp.company, role: opp.role,
        source: "orbit_feed", updated_at: new Date().toISOString(),
      }, { onConflict: "uid,opportunity_id" });
      if (error) throw error;
      toast.success(`${opp.company} saved to pipeline`);
      setApplications(await fetchApplications());
    } catch { toast.error("Failed to save"); }
  }, [user, fetchApplications]);

  const applyJob = useCallback(async (opp: Opportunity) => {
    if (!user) { toast.error("Sign in to track applications"); return; }
    try {
      // Open the real job URL in new tab
      if (opp.url) window.open(opp.url, "_blank", "noopener,noreferrer");

      const { error } = await supabase.from("job_applications").upsert({
        uid: user.id, opportunity_id: opp.id, status: "applied",
        ai_match_score: opp.match_score || null, company: opp.company, role: opp.role,
        source: "orbit_feed", updated_at: new Date().toISOString(),
      }, { onConflict: "uid,opportunity_id" });
      if (error) throw error;
      useOrbitStore.getState().addMemoryEvent({
        id: Date.now().toString(), type: "application_submitted",
        context: `Applied to ${opp.role} at ${opp.company}`, timestamp: new Date().toISOString(),
      });
      toast.success(`Opened ${opp.company} careers page + marked as Applied!`);
      setApplications(await fetchApplications());
    } catch { toast.error("Failed to track application"); }
  }, [user, fetchApplications]);

  const moveStage = useCallback(async (appId: string, newStatus: Application["status"]) => {
    if (!user) return;
    try {
      const { error } = await supabase.from("job_applications")
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq("id", appId).eq("uid", user.id);
      if (error) throw error;
      setApplications(prev => prev.map(a => a.id === appId ? { ...a, status: newStatus } : a));
      const labels: Record<string, string> = { applied: "Applied", interviewing: "Interview", offer: "Offer 🎉" };
      toast.success(`Moved to ${labels[newStatus] || newStatus}`);
    } catch { toast.error("Failed to update stage"); }
  }, [user]);

  const deleteApplication = useCallback(async (appId: string) => {
    if (!user) return;
    // Optimistic removal
    const previous = applications;
    setApplications(prev => prev.filter(a => a.id !== appId));

    const toastId = toast.success("Removed from pipeline", {
      duration: 5000,
    });

    // Give 5s to undo
    let undone = false;
    const undoTimeout = setTimeout(async () => {
      if (undone) return;
      try {
        const { error } = await supabase.from("job_applications")
          .delete().eq("id", appId).eq("uid", user.id);
        if (error) throw error;
      } catch {
        setApplications(previous);
        toast.error("Failed to delete — restored");
      }
    }, 5000);

    // Expose undo on toast (manual undo via re-add)
    return () => { undone = true; clearTimeout(undoTimeout); setApplications(previous); };
  }, [user, applications]);

  const updateNotes = useCallback(async (appId: string, notes: string) => {
    if (!user) return;
    try {
      const { error } = await supabase.from("job_applications")
        .update({ notes, updated_at: new Date().toISOString() })
        .eq("id", appId).eq("uid", user.id);
      if (error) throw error;
      setApplications(prev => prev.map(a => a.id === appId ? { ...a, notes } : a));
    } catch { toast.error("Failed to save notes"); }
  }, [user]);

  const refetchAI = useCallback(async () => {
    cacheRef.current = null;
    const apps = await fetchApplications();
    const result = await fetchAIIntelligence(apps);
    setApplications(apps);
    if (result.opportunities?.length) setOpportunities(result.opportunities);
    setAiData({ recommendations: result.recommendations || [], marketSignals: result.marketSignals || [] });
  }, [fetchApplications, fetchAIIntelligence]);

  // ─── Initial load ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (!profile) return;
    let cancelled = false;
    async function init() {
      setLoading(true); setError(null);
      try {
        const apps = await fetchApplications();
        if (cancelled) return;
        setApplications(apps);
        setLoading(false);
        const result = await fetchAIIntelligence(apps);
        if (cancelled) return;
        if (result.opportunities?.length) setOpportunities(result.opportunities);
        setAiData({ recommendations: result.recommendations || [], marketSignals: result.marketSignals || [] });
      } catch {
        if (!cancelled) { setError("Failed to load opportunities"); setLoading(false); }
      }
    }
    init();
    return () => { cancelled = true; };
  }, [profile?.uid, fetchApplications, fetchAIIntelligence]);

  const momentum = computeMomentum(applications);

  return {
    opportunities, applications, momentum, aiData, loading, aiLoading, error,
    saveJob, applyJob, moveStage, deleteApplication, updateNotes, updateApplication, rejectApplication, refetchAI,
  };
}
