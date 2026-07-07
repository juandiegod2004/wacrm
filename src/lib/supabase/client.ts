import { createBrowserClient } from '@supabase/ssr'
import type { SupabaseClient } from '@supabase/supabase-js'

// Singleton instance — one client shared across the whole browser session.
// Creating multiple clients causes auth-lock contention ("Lock was released
// because another request stole it") and intermittent fetch failures.
let browserClient: SupabaseClient | undefined

export function createClient() {
  if (browserClient) return browserClient

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  // During static pre-rendering on Vercel/build, these variables might be empty.
  // We use placeholder values to avoid build failures, as no database operations
  // are actually executed during the static markup generation of auth pages.
  if (!url || !key) {
    return createBrowserClient(
      url || 'https://placeholder-url.supabase.co',
      key || 'placeholder-anon-key'
    )
  }

  browserClient = createBrowserClient(url, key)
  return browserClient
}
