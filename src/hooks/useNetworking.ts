"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import toast from "react-hot-toast";

export interface NetworkingContact {
  id: string;
  uid: string;
  name: string;
  company: string;
  role: string;
  linkedin_url?: string;
  email?: string;
  connection_type: "linkedin" | "email" | "event" | "referral" | "cold";
  status: "connected" | "replied" | "intro_made" | "referral_requested" | "referral_given";
  last_contacted?: string;
  follow_up_date?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export function useNetworking() {
  const { user } = useAuth();
  const [contacts, setContacts] = useState<NetworkingContact[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchContacts = useCallback(async () => {
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from("networking_contacts")
        .select("*")
        .eq("uid", user.id)
        .order("updated_at", { ascending: false });
      if (error) throw error;
      setContacts((data || []) as NetworkingContact[]);
    } catch (e) {
      console.error("Failed to fetch contacts:", e);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => { fetchContacts(); }, [fetchContacts]);

  const addContact = useCallback(async (contact: Omit<NetworkingContact, "id" | "uid" | "created_at" | "updated_at">) => {
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from("networking_contacts")
        .insert({ ...contact, uid: user.id, updated_at: new Date().toISOString() })
        .select().single();
      if (error) throw error;
      setContacts(prev => [data as NetworkingContact, ...prev]);
      toast.success(`${contact.name} added to network`);
    } catch { toast.error("Failed to add contact"); }
  }, [user]);

  const updateContact = useCallback(async (id: string, updates: Partial<NetworkingContact>) => {
    if (!user) return;
    try {
      const { error } = await supabase
        .from("networking_contacts")
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq("id", id).eq("uid", user.id);
      if (error) throw error;
      setContacts(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
    } catch { toast.error("Failed to update contact"); }
  }, [user]);

  const deleteContact = useCallback(async (id: string) => {
    if (!user) return;
    const prev = contacts;
    setContacts(c => c.filter(x => x.id !== id));
    setTimeout(async () => {
      try {
        await supabase.from("networking_contacts").delete().eq("id", id).eq("uid", user.id);
        toast.success("Contact removed");
      } catch { setContacts(prev); toast.error("Failed to remove"); }
    }, 100);
  }, [user, contacts]);

  const generateOutreach = useCallback(async (contact: NetworkingContact, userGoal: string): Promise<string> => {
    try {
      const res = await fetch("/api/ai/copilot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: `Write a short, genuine LinkedIn connection message (under 300 chars) to ${contact.name} who works as ${contact.role} at ${contact.company}. I'm targeting ${userGoal} roles. Sound human, specific, not salesy. No emojis.`,
          profile: { onboardingData: { careerGoal: userGoal } }
        })
      });
      const data = await res.json();
      return data.response || "Hi, I came across your profile and would love to connect. I'm exploring opportunities in this space.";
    } catch {
      return "Hi, I came across your profile and would love to connect!";
    }
  }, []);

  const overdueFollowUps = contacts.filter(c => {
    if (!c.follow_up_date) return false;
    return new Date(c.follow_up_date) < new Date() && c.status !== "referral_given";
  });

  return { contacts, loading, addContact, updateContact, deleteContact, generateOutreach, overdueFollowUps };
}
