import { createClient } from "@supabase/supabase-js";
import { ENV, validatePublicEnv } from "./env";

// Validate at module load — surface missing vars immediately (client-side only)
const { valid, missing } = validatePublicEnv();
if (!valid && typeof window !== "undefined") {
  console.error(`[Orbit] Missing environment variables: ${missing.join(", ")}. Auth and database will not function.`);
}

// During Next.js static generation (build time), env vars may not exist.
// Provide a safe dummy URL so the build doesn't crash — the client won't be used at build time anyway.
const supabaseUrl = ENV.SUPABASE_URL || "https://placeholder.supabase.co";
const supabaseKey = ENV.SUPABASE_ANON_KEY || "placeholder-key";

export const supabase = createClient(
  supabaseUrl,
  supabaseKey,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      flowType: "pkce",
      storageKey: "orbit-auth-session",
    },
  }
);
