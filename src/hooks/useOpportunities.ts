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
  // AI-enriched fields (filled after scoring)
  match_score?: number;
  skill_gap?: string;
  why_match?: string;
  urgency?: string;
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

const CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes

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

  // ─── Fetch base opportunities from Supabase ───
  const fetchOpportunities = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("opportunities")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(20);

      if (error) throw error;
      return (data || []) as Opportunity[];
    } catch (e) {
      console.error("Failed to fetch opportunities:", e);
      return [] as Opportunity[];
    }
  }, []);

  // ─── Fetch user's application pipeline ───
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

  // ─── Fetch AI scores + recommendations ───
  const fetchAIIntelligence = useCallback(async (opps: Opportunity[], apps: Application[]) => {
    // Use cache if still fresh
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
        body: JSON.stringify({
          opportunities: opps.slice(0, 8), // limit to 8 for speed
          profile,
          pipeline: pipelineCounts,
          memoryEvents: memoryEvents.slice(0, 10),
        }),
      });

      if (!res.ok) throw new Error("AI scoring failed");
      const result = await res.json();

      cacheRef.current = { data: result, ts: Date.now() };
      return result;
    } catch (e) {
      console.error("AI intelligence fetch failed:", e);
      return { scores: [], recommendations: [], marketSignals: [] };
    } finally {
      setAiLoading(false);
    }
  }, [profile, memoryEvents]);

  // ─── Merge AI scores into opportunities ───
  const mergeScores = (opps: Opportunity[], scores: any[]): Opportunity[] => {
    if (!scores?.length) return opps;
    const scoreMap = new Map(scores.map((s: any) => [s.id, s]));
    return opps
      .map(opp => {
        const score = scoreMap.get(opp.id);
        return score
          ? { ...opp, match_score: score.match_score, skill_gap: score.skill_gap, why_match: score.why_match, urgency: score.urgency }
          : { ...opp, match_score: 0 };
      })
      .filter(opp => opp.match_score !== undefined && opp.match_score > 0)
      .sort((a, b) => (b.match_score || 0) - (a.match_score || 0));
  };

  // ─── Compute momentum analytics from real data ───
  const computeMomentum = useCallback((apps: Application[]): MomentumData => {
    const now = Date.now();
    const oneWeekAgo = now - 7 * 24 * 60 * 60 * 1000;
    const twoWeeksAgo = now - 14 * 24 * 60 * 60 * 1000;

    const appsThisWeek = apps.filter(a =>
      new Date(a.created_at).getTime() > oneWeekAgo && a.status === "applied"
    ).length;

    const appsLastWeek = apps.filter(a => {
      const t = new Date(a.created_at).getTime();
      return t > twoWeeksAgo && t <= oneWeekAgo && a.status === "applied";
    }).length;

    const appliedCount = apps.filter(a => a.status === "applied").length;
    const interviewCount = apps.filter(a => a.status === "interviewing").length;
    const offerCount = apps.filter(a => a.status === "offer").length;
    const savedCount = apps.filter(a => a.status === "saved").length;

    const responseRate = appliedCount > 0
      ? Math.round((interviewCount / appliedCount) * 100)
      : 0;

    // Visibility score: driven by streak × momentum × applications
    const streak = profile?.stats?.streak || 0;
    const momentum = profile?.stats?.momentumScore || 0;
    const completedMissions = missions.filter(m => m.status === "completed").length;
    const visibilityScore = Math.min(
      Math.round((streak * 12) + (momentum * 5) + (completedMissions * 8) + (appliedCount * 15)),
      999
    );

    // Velocity label
    let velocityLabel = "Building momentum";
    if (interviewCount >= 2) velocityLabel = "Moving rapidly through screening";
    else if (appsThisWeek >= 5) velocityLabel = "High application velocity";
    else if (appsThisWeek >= 2) velocityLabel = "Steady application pace";
    else if (appsThisWeek === 0 && appliedCount === 0) velocityLabel = "Pipeline not yet active";

    return { appsThisWeek, appsLastWeek, responseRate, visibilityScore, velocityLabel, savedCount, appliedCount, interviewCount, offerCount };
  }, [profile, missions]);

  // ─── ACTIONS ───

  const saveJob = useCallback(async (opp: Opportunity) => {
    if (!user) { toast.error("Sign in to save opportunities"); return; }
    try {
      const { error } = await supabase.from("job_applications").upsert({
        uid: user.id,
        opportunity_id: opp.id,
        status: "saved",
        ai_match_score: opp.match_score || null,
        company: opp.company,
        role: opp.role,
        source: "orbit_feed",
        updated_at: new Date().toISOString(),
      }, { onConflict: "uid,opportunity_id" });

      if (error) throw error;
      toast.success(`${opp.company} saved to pipeline`);
      const updated = await fetchApplications();
      setApplications(updated);
    } catch (e) {
      toast.error("Failed to save opportunity");
    }
  }, [user, fetchApplications]);

  const applyJob = useCallback(async (opp: Opportunity) => {
    if (!user) { toast.error("Sign in to track applications"); return; }
    try {
      const { error } = await supabase.from("job_applications").upsert({
        uid: user.id,
        opportunity_id: opp.id,
        status: "applied",
        ai_match_score: opp.match_score || null,
        company: opp.company,
        role: opp.role,
        source: "orbit_feed",
        updated_at: new Date().toISOString(),
      }, { onConflict: "uid,opportunity_id" });

      if (error) throw error;
      useOrbitStore.getState().addMemoryEvent({
        id: Date.now().toString(),
        type: "application_submitted",
        context: `Applied to ${opp.role} at ${opp.company}`,
        timestamp: new Date().toISOString(),
      });
      toast.success(`Applied to ${opp.company}!`);
      const updated = await fetchApplications();
      setApplications(updated);
    } catch (e) {
      toast.error("Failed to track application");
    }
  }, [user, fetchApplications]);

  const moveStage = useCallback(async (appId: string, newStatus: Application["status"]) => {
    if (!user) return;
    try {
      const { error } = await supabase
        .from("job_applications")
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq("id", appId)
        .eq("uid", user.id);
      if (error) throw error;
      setApplications(prev => prev.map(a => a.id === appId ? { ...a, status: newStatus } : a));
    } catch (e) {
      toast.error("Failed to update stage");
    }
  }, [user]);

  const refetchAI = useCallback(async () => {
    cacheRef.current = null; // bust cache
    const [opps, apps] = await Promise.all([fetchOpportunities(), fetchApplications()]);
    const aiResult = await fetchAIIntelligence(opps, apps);
    const scored = mergeScores(opps, aiResult.scores || []);
    setOpportunities(scored);
    setAiData({ recommendations: aiResult.recommendations || [], marketSignals: aiResult.marketSignals || [] });
  }, [fetchOpportunities, fetchApplications, fetchAIIntelligence]);

  // ─── Initial load ───
  useEffect(() => {
    if (!profile) return;

    let cancelled = false;
    async function init() {
      setLoading(true);
      setError(null);
      try {
        const [opps, apps] = await Promise.all([fetchOpportunities(), fetchApplications()]);
        if (cancelled) return;
        setApplications(apps);

        // Show base opportunities immediately
        setOpportunities(opps);
        setLoading(false);

        // Then enrich with AI scores
        const aiResult = await fetchAIIntelligence(opps, apps);
        if (cancelled) return;
        const scored = mergeScores(opps, aiResult.scores || []);
        setOpportunities(scored.length > 0 ? scored : opps);
        setAiData({ recommendations: aiResult.recommendations || [], marketSignals: aiResult.marketSignals || [] });
      } catch (e) {
        if (!cancelled) {
          setError("Failed to load opportunities");
          setLoading(false);
        }
      }
    }

    init();
    return () => { cancelled = true; };
  }, [profile?.uid, fetchOpportunities, fetchApplications, fetchAIIntelligence]);

  const momentum = computeMomentum(applications);

  return {
    opportunities,
    applications,
    momentum,
    aiData,
    loading,
    aiLoading,
    error,
    saveJob,
    applyJob,
    moveStage,
    refetchAI,
  };
}
