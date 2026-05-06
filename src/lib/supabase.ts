import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

/**
 * Check if Supabase is configured with valid credentials.
 */
export const isSupabaseConfigured =
  supabaseUrl.startsWith("http") && supabaseAnonKey.length > 0;

/**
 * Supabase client instance.
 * Will be a functional client if credentials are configured,
 * or a dummy client that will throw on actual API calls if not.
 */
export const supabase: SupabaseClient<Database> = isSupabaseConfigured
  ? createClient<Database>(supabaseUrl, supabaseAnonKey)
  : createClient<Database>("https://placeholder.supabase.co", "placeholder");
