import { createClient } from "@supabase/supabase-js";
import { ENV, validatePublicEnv } from "./env";

// Validate at module load — surface missing vars immediately
const { valid, missing } = validatePublicEnv();
if (!valid && typeof window !== "undefined") {
  console.error(`[Orbit] Missing environment variables: ${missing.join(", ")}. Auth and database will not function.`);
}

export const supabase = createClient(
  ENV.SUPABASE_URL,
  ENV.SUPABASE_ANON_KEY,
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
