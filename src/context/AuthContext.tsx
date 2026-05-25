"use client";

import { createContext, useContext, useEffect, useState, useRef } from "react";
import { supabase } from "@/lib/supabase";
import { Session, User } from "@supabase/supabase-js";
import { useOrbitStore } from "@/lib/store";
import toast from "react-hot-toast";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  loading: true,
  signInWithGoogle: async () => {},
  signOut: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const { clearState } = useOrbitStore();
  const signingIn = useRef(false);

  useEffect(() => {
    // Check active session on mount
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (!session) {
        clearState();
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [clearState]);

  const signInWithGoogle = async () => {
    if (signingIn.current) return; // Prevent double-click
    signingIn.current = true;

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          // Always redirect to root — ProtectedRoute handles onboarding vs dashboard routing
          redirectTo: typeof window !== 'undefined' ? window.location.origin : undefined
        }
      });
      if (error) throw error;
    } catch (error) {
      console.error("Error signing in with Google:", error);
      toast.error("Failed to sign in. Please try again.");
    } finally {
      signingIn.current = false;
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      clearState();
    } catch (error) {
      console.error("Error signing out:", error);
      toast.error("Failed to sign out cleanly.");
    }
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, signInWithGoogle, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
