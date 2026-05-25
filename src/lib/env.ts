// Centralized environment validation for Orbit
// Separates public (client-safe) from private (server-only) keys

// --- Public (available on client + server) ---
export const ENV = {
  SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",
} as const;

// --- Private (server-only, never exposed to client) ---
export function getServerEnv() {
  return {
    GEMINI_API_KEY: process.env.GEMINI_API_KEY || "",
  } as const;
}

// --- Validation ---
export function validatePublicEnv(): { valid: boolean; missing: string[] } {
  const missing: string[] = [];
  if (!ENV.SUPABASE_URL) missing.push("NEXT_PUBLIC_SUPABASE_URL");
  if (!ENV.SUPABASE_ANON_KEY) missing.push("NEXT_PUBLIC_SUPABASE_ANON_KEY");
  return { valid: missing.length === 0, missing };
}

export function validateServerEnv(): { valid: boolean; missing: string[] } {
  const missing: string[] = [];
  const server = getServerEnv();
  if (!server.GEMINI_API_KEY) missing.push("GEMINI_API_KEY");
  return { valid: missing.length === 0, missing };
}
