import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Get the pathname (without query params)
  const pathname = request.nextUrl.pathname

  // Check if there's a redirect parameter in the URL - this indicates someone is coming
  // from a verification link or other auth flow
  const requestUrl = new URL(request.url)
  const redirectTo = requestUrl.searchParams.get('redirectTo')
  const passwordResetCode = requestUrl.searchParams.get('code')
  const verificationFlow = requestUrl.hash?.includes('access_token') || 
                          requestUrl.searchParams.has('access_token') ||
                          redirectTo ||
                          (pathname === '/auth/update-password' && passwordResetCode) ||
                          (pathname === '/auth/callback');

  // SECURITY NOTE:
  // Always use supabase.auth.getUser() to validate authentication in server code
  // Never trust supabase.auth.getSession() inside server code as it isn't guaranteed 
  // to revalidate the Auth token and cookies can be spoofed by anyone
  // getUser() sends a request to the Supabase Auth server every time to revalidate the Auth token

  // Paths that don't require authentication
  const publicPaths = [
    '/auth/login',
    '/auth/register',
    '/auth/forgotten-password',
    '/auth/update-password',
    '/auth/confirm',
    '/auth/verified',
    '/auth/magic',
    '/auth/callback',
    '/',
    '/terms',
    '/privacy',
    '/about',
    '/contact',
    '/faq',
    '/help',
    '/api/public', 
    '/public/',
    '/assets/',
    '/images/',
    '/static/'
  ];

  // Authentication-only paths that should redirect to dashboard if already authenticated
  const authOnlyPaths = [
    '/auth/login',
    '/auth/register'
  ];

  // Paths that don't require profile completion (but do require authentication)
  const profileExemptPaths = [
    '/profile/complete',
    '/auth/logout',
    '/auth/reset-password',
    '/account/delete'
  ];

  // Strict check for public paths
  const isPublicPath = publicPaths.some(path => 
    pathname === path || pathname.startsWith(path));
    
  // Check if the current path is an auth-only path
  const isAuthOnlyPath = authOnlyPaths.some(path => 
    pathname === path || pathname.startsWith(path));

  // First, handle the auth-only paths separately for authenticated users
  if (isAuthOnlyPath) {
    try {
      // Minimal auth check for auth-only paths
      const { data } = await supabase.auth.getUser();
      const user = data.user;
      
      // Redirect authenticated users from login/register to dashboard
      if (user) {
        console.log('Redirecting authenticated user from auth page to dashboard');
        const redirectUrl = request.nextUrl.clone();
        redirectUrl.pathname = '/dashboard';
        return NextResponse.redirect(redirectUrl);
      }
    } catch (error) {
      console.error('Error checking auth for auth-only paths:', error);
      // Continue with normal flow if there's an error
    }
  }

  // For public paths, just skip the auth check to prevent unnecessary errors
  if (isPublicPath) {
    return supabaseResponse;
  }
  
  // For non-public paths, check authentication
  let user = null;
  try {
    const { data } = await supabase.auth.getUser();
    user = data.user;
  } catch (error: any) {
    // Handle AuthApiError: User from sub claim in JWT does not exist
    if (error?.message?.includes('User from sub claim in JWT does not exist')) {
      console.warn('Auth token references user that no longer exists in auth.users table');
      // Clear cookies to force re-authentication
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = '/auth/login';
      const response = NextResponse.redirect(redirectUrl);
      
      // Clear the session cookie to force re-login
      response.cookies.delete('sb-auth-token');
      response.cookies.delete('sb-refresh-token');
      return response;
    }
    
    // For AuthSessionMissingError, just consider the user as unauthenticated
    if (error?.message?.includes('Auth session missing') || 
        error?.name === 'AuthSessionMissingError') {
      console.log('No auth session found - treating as unauthenticated');
      user = null;
    } else {
      console.error('Error authenticating user:', error);
      user = null;
    }
  }

  // === AUTHENTICATION CHECK ===
  // Protect routes that need authentication
  if (!user && !isPublicPath) {
    // Special case for profile/complete from email verification
    if (pathname === '/profile/complete') {
      console.log('Unauthenticated user trying to access profile/complete, redirecting to verified page');
      const verifiedUrl = new URL('/auth/verified', request.url);
      // Try to capture the email if available for a better UX
      const email = requestUrl.searchParams.get('email');
      if (email) {
        verifiedUrl.searchParams.set('email', email);
      }
      return NextResponse.redirect(verifiedUrl);
    }
    
    // Check if the user is in a verification flow
    if (verificationFlow) {
      // If user is in verification flow but isn't logged in on this device,
      // redirect to the verified page with email if available
      console.log('User in verification flow but not authenticated, redirecting to verified page');
      const verifiedUrl = new URL('/auth/verified', request.url);
      // Try to capture the email if available for a better UX
      const email = requestUrl.searchParams.get('email');
      if (email) {
        verifiedUrl.searchParams.set('email', email);
      }
      return NextResponse.redirect(verifiedUrl);
    }
    
    // Redirect unauthenticated users to the login page
    console.log('Redirect to login: No user found and path requires auth:', pathname);
    const redirectUrl = request.nextUrl.clone()
    redirectUrl.pathname = '/auth/login'
    return NextResponse.redirect(redirectUrl)
  }

  // === PROFILE COMPLETION CHECK ===
  // Only apply to authenticated users on protected routes
  if (user && !isPublicPath) {
    // Check if the route is exempt from profile completion check
    const isProfileExemptPath = profileExemptPaths.some(path => 
      pathname === path || pathname.startsWith(path));
    
    // Don't redirect from profile exempt paths (like /profile/complete itself)
    if (!isProfileExemptPath) {
      try {
        // Check if user has a completed profile
        const { data, error } = await supabase
          .from('users')
          .select('username')
          .eq('user_id', user.id)
          .limit(1);
        
        if (error) {
          console.error('Error checking user profile in middleware:', error);
        } else if (!data || data.length === 0) {
          // User doesn't have a profile, redirect to complete profile
          console.log('Redirect to profile completion: User has no profile:', pathname);
          const redirectUrl = request.nextUrl.clone()
          redirectUrl.pathname = '/profile/complete'
          return NextResponse.redirect(redirectUrl)
        } else if (data[0].username.startsWith('user_')) {
          // User has a temporary username from the trigger, redirect to complete profile
          console.log('Redirect to profile completion: User has temporary username:', pathname);
          const redirectUrl = request.nextUrl.clone()
          redirectUrl.pathname = '/profile/complete'
          return NextResponse.redirect(redirectUrl)
        }
      } catch (error) {
        console.error('Error in profile check:', error);
        // On error, allow user to continue to avoid blocking access
      }
    }
  }

  return supabaseResponse
}