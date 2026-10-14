import { createClient, type SupabaseClient } from "@supabase/supabase-js";

export type SupabaseStatus =
  | { state: "ok"; client: SupabaseClient }
  | { state: "missing"; setting: string }
  | { state: "not_configured" };

/**
 * Reads the two public Supabase settings from the environment.
 * Only the browser (publishable) values are used here.
 * Never put a service role / secret key in this file.
 */
export function getSupabase(): SupabaseStatus {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!url || url.trim() === "" || url.includes("[")) {
    return { state: "missing", setting: "NEXT_PUBLIC_SUPABASE_URL" };
  }
  if (!key || key.trim() === "" || key.includes("[")) {
    return { state: "missing", setting: "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY" };
  }

  const client = createClient(url, key, {
    auth: { persistSession: true, autoRefreshToken: true },
  });
  return { state: "ok", client };
}
