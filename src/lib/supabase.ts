import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "@/types/database";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

/**
 * Check if Supabase is configured with valid credentials.
 */
export const isSupabaseConfigured =
  supabaseUrl.startsWith("http") && supabaseAnonKey.length > 0;

/**
 * Creates a Supabase browser client using @supabase/ssr.
 * createBrowserClient automatically handles cookie-based auth and
 * internally deduplicates — safe to call multiple times.
 */
export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

/**
 * Singleton instance for client-side usage (e.g., AuthContext).
 * Kept for backwards compatibility with existing V2 imports.
 */
export const supabase = createClient();
