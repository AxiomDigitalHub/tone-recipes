import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import type { Database } from "./schema";

/**
 * Returns true when the required Supabase env vars are present.
 */
export function isSupabaseConfigured(): boolean {
  return !!(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}

/**
 * Server-side Supabase client (uses anon key -- fine for public reads).
 */
export function createClient() {
  return createSupabaseClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}

/**
 * Browser-side Supabase client (same anon key, singleton pattern).
 */
let browserClient: ReturnType<typeof createSupabaseClient<Database>> | null = null;

export function createBrowserClient() {
  if (browserClient) return browserClient;
  browserClient = createSupabaseClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
  return browserClient;
}
