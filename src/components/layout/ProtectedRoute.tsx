"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useUser } from "@/context/UserContext";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const { profile, appReady } = useUser();
  const router = useRouter();

  useEffect(() => {
    // BLOCK ROUTE GUARDS: Do not execute any routing decisions until the app is mathematically ready
    if (!appReady) return;

    if (!user) {
      router.push("/onboarding");
      return;
    }
    
    // Explicit null/undefined checks. If app is ready, undefined means incomplete.
    if (user && (!profile || profile.hasCompletedOnboarding !== true)) {
      router.push("/onboarding");
    }
  }, [user, profile, appReady, router]);

  // APP SHELL LOADER
  if (!appReady) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-6">
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 rounded-full border-4 border-outline-variant/20 border-t-primary animate-spin" />
            <div className="absolute inset-2 rounded-full border-4 border-muted-indigo/10 border-b-muted-indigo animate-spin-slow" />
            <span className="absolute inset-0 flex items-center justify-center material-symbols-outlined text-primary text-xl animate-pulse">
              explore
            </span>
          </div>
          <p className="text-[10px] font-black uppercase tracking-[0.25em] text-on-surface-variant/50 animate-pulse">
            Initializing Orbit...
          </p>
        </div>
      </div>
    );
  }

  // Final render guard
  if (!user || profile?.hasCompletedOnboarding !== true || !profile.uid) {
    return null; 
  }

  return <>{children}</>;
}
