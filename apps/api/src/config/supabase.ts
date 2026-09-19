import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { env } from "./env";

let supabaseAdmin: SupabaseClient | null = null;

/**
 * Returns the singleton Supabase admin client configured with the service secret key.
 * This client runs strictly on the server and is never exposed to the browser.
 */
export function getSupabaseAdmin(): SupabaseClient | null {
  if (!env.SUPABASE_URL || !env.SUPABASE_SECRET_KEY) {
    return null;
  }

  if (!supabaseAdmin) {
    supabaseAdmin = createClient(env.SUPABASE_URL, env.SUPABASE_SECRET_KEY, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });
  }

  return supabaseAdmin;
}
