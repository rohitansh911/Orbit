"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useOrbitStore } from "@/lib/store";
import { supabase } from "@/lib/supabase";
import toast from "react-hot-toast";

interface UserContextType {
  profile: any | null;
  appReady: boolean;
  completeOnboarding: (data: any) => Promise<void>;
  addXp: (amount: number) => Promise<void>;
}

const UserContext = createContext<UserContextType>({
  profile: null,
  appReady: false,
  completeOnboarding: async () => {},
  addXp: async () => {},
});

export function UserProvider({ children }: { children: React.ReactNode }) {
  const { user, loading: authLoading } = useAuth();
  const { profile, setProfile, updateProfileStats } = useOrbitStore();
  const [isHydrating, setIsHydrating] = useState(true);
  const [profileResolved, setProfileResolved] = useState(false);
  const [resolvedUserId, setResolvedUserId] = useState<string | undefined>(undefined);

  useEffect(() => {
    setIsHydrating(false); // Zustand is fully hydrated on client mount
  }, []);

  // Helper to normalize Postgres lowercase columns → JS camelCase
  const normalizeProfile = (dbData: any) => ({
    uid: dbData.uid,
    displayName: dbData.displayname || dbData.displayName,
    email: dbData.email,
    photoURL: dbData.photourl || dbData.photoURL,
    hasCompletedOnboarding: dbData.hascompletedonboarding ?? dbData.hasCompletedOnboarding ?? false,
    onboardingData: dbData.onboardingdata || dbData.onboardingData || {},
    stats: dbData.stats || { xp: 0, level: 1, momentumScore: 0, streak: 0 },
  });

  const toDbProfile = (prof: any) => ({
    uid: prof.uid,
    displayname: prof.displayName,
    email: prof.email,
    photourl: prof.photoURL,
    hascompletedonboarding: prof.hasCompletedOnboarding,
    onboardingdata: prof.onboardingData,
    stats: prof.stats,
  });

  // Sync Supabase ↔ Zustand on mount/auth change
  useEffect(() => {
    let isMounted = true;

    if (isHydrating || authLoading) return;

    async function loadProfile() {
      setProfileResolved(false);

      if (!user) {
        useOrbitStore.getState().setProfile(null);
        if (isMounted) {
          setResolvedUserId(undefined);
          setProfileResolved(true);
        }
        return;
      }

      // Read fresh local state (bypass React closure traps)
      const currentLocalProfile = useOrbitStore.getState().profile;

      try {
        const { data, error } = await supabase.from('users').select('*').eq('uid', user.id).single();

        if (data && isMounted) {
          const normalizedData = normalizeProfile(data);
          // If local is ahead (completed onboarding but DB hasn't synced), push local → DB
          if (currentLocalProfile?.hasCompletedOnboarding && !normalizedData.hasCompletedOnboarding) {
            await supabase.from('users').upsert(toDbProfile(currentLocalProfile), { onConflict: 'uid' });
          } else {
            useOrbitStore.getState().setProfile(normalizedData);
          }
        } else if (error || !data) {
          // Row doesn't exist — create it via upsert (self-healing if trigger didn't fire)
          if (isMounted) {
            const seedProfile = currentLocalProfile || {
              uid: user.id,
              displayName: user.user_metadata?.full_name,
              email: user.email,
              photoURL: user.user_metadata?.avatar_url,
              hasCompletedOnboarding: false,
              stats: { xp: 0, level: 1, momentumScore: 0, streak: 0 },
            };

            // Ensure uid is set correctly
            seedProfile.uid = user.id;

            // Try to upsert into DB so the row exists for future updates
            await supabase.from('users').upsert(toDbProfile(seedProfile), { onConflict: 'uid' }).select().single();

            useOrbitStore.getState().setProfile(seedProfile);
          }
        }
      } catch (err) {
        // Network error — use local state if available, otherwise create blank
        if (isMounted && !currentLocalProfile) {
          useOrbitStore.getState().setProfile({
            uid: user.id,
            displayName: user.user_metadata?.full_name,
            email: user.email,
            photoURL: user.user_metadata?.avatar_url,
            hasCompletedOnboarding: false,
            stats: { xp: 0, level: 1, momentumScore: 0, streak: 0 },
          });
        }
      } finally {
        if (isMounted) {
          setResolvedUserId(user.id);
          setProfileResolved(true);
        }
      }
    }

    loadProfile();

    return () => { isMounted = false; };
  }, [user, isHydrating, authLoading]);

  // appReady = ALL conditions must be true before any routing decisions
  const appReady = !authLoading && !isHydrating && profileResolved && (resolvedUserId === user?.id);

  const completeOnboarding = async (data: any) => {
    if (!user) return;
    
    const newProfile = {
      uid: user.id,
      displayName: user.user_metadata?.full_name,
      email: user.email,
      photoURL: user.user_metadata?.avatar_url,
      hasCompletedOnboarding: true,
      onboardingData: data,
      stats: { xp: 50, level: 1, momentumScore: 25, streak: 1 },
    };

    // Optimistic UI update
    setProfile(newProfile);

    // Persist to Supabase — try upsert first, fallback to insert
    try {
      const dbProfile = toDbProfile(newProfile);
      const { error } = await supabase
        .from('users')
        .upsert(dbProfile, { onConflict: 'uid' });
      
      if (error) {
        console.error("Upsert failed, trying insert:", JSON.stringify(error));
        // Fallback: try a plain insert (row might not exist yet)
        const { error: insertError } = await supabase
          .from('users')
          .insert(dbProfile);
        
        if (insertError) {
          console.error("Insert also failed:", JSON.stringify(insertError));
          // Last resort: try update
          const { error: updateError } = await supabase
            .from('users')
            .update(dbProfile)
            .eq('uid', newProfile.uid);
          
          if (updateError) {
            console.error("All save methods failed:", JSON.stringify(updateError));
            toast.error("Failed to sync profile. Your data is saved locally.");
          }
        }
      }
    } catch (e: any) {
      console.error("Failed to save onboarding to Supabase:", e?.message || JSON.stringify(e));
      toast.error("Failed to sync profile. Your data is saved locally.");
    }
  };

  const addXp = async (amount: number) => {
    if (!user) return;
    
    // Read fresh state from Zustand (NOT the stale React closure)
    const freshProfile = useOrbitStore.getState().profile;
    if (!freshProfile?.stats) return;

    // Optimistic update
    updateProfileStats(amount);

    // Persist to Supabase using fresh values
    try {
      const newXp = freshProfile.stats.xp + amount;
      const newLevel = Math.floor(newXp / 1000) + 1;
      await supabase.from('users').update({ 
        stats: { ...freshProfile.stats, xp: newXp, level: newLevel } 
      }).eq('uid', user.id);
    } catch (e) {
      // Silent failure — local state is still correct from optimistic update
    }
  };

  return (
    <UserContext.Provider value={{ profile, appReady, completeOnboarding, addXp }}>
      {children}
    </UserContext.Provider>
  );
}

export const useUser = () => useContext(UserContext);
