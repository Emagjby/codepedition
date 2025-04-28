import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  // Define the site URL for use in redirects
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://codepedition.com'
  
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        // Use 'implicit' flow instead of 'pkce' to avoid code verifier issues
        flowType: 'implicit',
        detectSessionInUrl: true,
        persistSession: true,
        // No direct 'site' property, but we can set the autoRefreshToken
        autoRefreshToken: true
      },
      global: {
        // Set headers to communicate the site URL
        headers: {
          'x-client-site': siteUrl
        }
      }
    }
  )
}