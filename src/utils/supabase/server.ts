import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
  const cookieStore = await cookies()
  
  // Define the site URL for use in redirects
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://codepedition.com'

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
      auth: {
        // Use implicit flow instead of PKCE to avoid code verifier issues
        flowType: 'implicit',
        persistSession: true,
        autoRefreshToken: true
      },
      global: {
        headers: {
          'x-site-url': siteUrl,
          'x-client-site': siteUrl
        }
      }
    }
  )
}