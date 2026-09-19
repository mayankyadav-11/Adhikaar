import { createBrowserClient } from "@supabase/ssr";

/**
 * Creates a Supabase client for use in Client Components (browser environment).
 * Uses NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY (or fallback to ANON_KEY).
 */
export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseKey =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

  return createBrowserClient(supabaseUrl, supabaseKey);
}
