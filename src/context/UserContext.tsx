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

  // Helper to fix Postgres lowercase columns vs JS camelCase
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

  // Sync Supabase to Zustand on mount/auth change
  useEffect(() => {
    let isMounted = true;

    // STEP 1 & 2: Wait for auth and hydration
    if (isHydrating || authLoading) return;

    async function loadProfile() {
      // Mark as unresolved for the current user
      setProfileResolved(false);

      if (!user) {
        useOrbitStore.getState().setProfile(null);
        if (isMounted) {
          setResolvedUserId(undefined);
          setProfileResolved(true);
        }
        return;
      }

      // Read fresh local state to bypass React closure traps
      const currentLocalProfile = useOrbitStore.getState().profile;

      // STEP 3: Fetch user profile
      try {
        const { data, error } = await supabase.from('users').select('*').eq('uid', user.id).single();
        
        // STEP 4: Merge DB + local state
        if (data && isMounted) {
          const normalizedData = normalizeProfile(data);
          // Sync strategy: If local is completed but DB is not, local is ahead (upsert probably failed earlier). Sync UP.
          if (currentLocalProfile?.hasCompletedOnboarding && !normalizedData.hasCompletedOnboarding) {
            console.log("Local state ahead of DB, syncing UP to DB");
            await supabase.from('users').update(toDbProfile(currentLocalProfile)).eq('uid', user.id);
          } else {
            console.log("DB ahead or in sync, pulling from DB");
            useOrbitStore.getState().setProfile(normalizedData);
          }
        } else if (error || !data) {
          // Only fallback to a blank profile if we literally have nothing locally either.
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
        }
      } catch (err) {
        console.error("Error loading profile:", err);
      } finally {
        // STEP 5: Resolve status
        if (isMounted) {
          setResolvedUserId(user.id);
          setProfileResolved(true);
        }
      }
    }

    loadProfile();

    return () => { isMounted = false; };
  }, [user, isHydrating, authLoading]);

  // STEP 6: Mark appReady = true ONLY when all conditions align perfectly
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

    // Persist to Supabase (using lowercase Postgres columns and UPDATE explicitly)
    try {
      const { error } = await supabase.from('users').update(toDbProfile(newProfile)).eq('uid', user.id);
      if (error) throw error;
    } catch (e) {
      console.error("Failed to save onboarding to Supabase", e);
      toast.error("Failed to sync profile. Check your network.");
    }
  };

  const addXp = async (amount: number) => {
    if (!user || !profile) return;
    
    // Optimistic update
    updateProfileStats(amount);

    // Persist to Supabase (fire and forget)
    try {
      const newXp = profile.stats.xp + amount;
      const newLevel = Math.floor(newXp / 1000) + 1;
      await supabase.from('users').update({ 
        'stats': { ...profile.stats, xp: newXp, level: newLevel } 
      }).eq('uid', user.id);
    } catch (e) {
      console.error("Failed to update XP in Supabase", e);
    }
  };

  return (
    <UserContext.Provider value={{ profile, appReady, completeOnboarding, addXp }}>
      {children}
    </UserContext.Provider>
  );
}

export const useUser = () => useContext(UserContext);
