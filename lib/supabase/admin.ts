import { createClient, type SupabaseClient } from "@supabase/supabase-js"

let cached: SupabaseClient | null | undefined

export function supabaseMissingEnvMessage(): string {
  if (process.env.NODE_ENV !== "development") {
    return "Supabase is not configured."
  }
  return (
    "Add NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY to .env.local (not .env.example), then restart the dev server. " +
    "Use the service_role secret from Supabase → Project Settings → API — not the anon or publishable key."
  )
}

/**
 * Server-only Supabase client with the service role key. Bypasses RLS — use only in Route Handlers / server code.
 * Returns null if env vars are missing (local dev without Supabase).
 */
export function getSupabaseAdmin(): SupabaseClient | null {
  if (cached !== undefined) return cached

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !key) {
    cached = null
    return null
  }

  cached = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  })
  return cached
}
