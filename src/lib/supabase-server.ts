import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import type { Database } from "@/types/database";

export function createServerSupabase() {
  return createServerComponentClient<Database>({ cookies });
}
