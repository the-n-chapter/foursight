import { createClient, type SupabaseClient } from "@supabase/supabase-js"

/** Set only after a successful `createClient` — never cache `null` so a mistaken first load (e.g. build tooling) cannot lock Supabase off for the whole process. */
let cachedClient: SupabaseClient | undefined

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
  if (cachedClient) return cachedClient

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim()
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim()

  if (!url || !key) {
    return null
  }

  cachedClient = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  })
  return cachedClient
}
