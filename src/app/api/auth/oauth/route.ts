import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const provider = formData.get('provider') as string;
    const source = formData.get('source') as string;
    
    if (!provider) {
      // Redirect back to the source page with error
      const returnPath = source === 'login' ? '/auth/login' : '/auth/register';
      const searchParams = new URLSearchParams();
      searchParams.set('error', 'OAuth provider is required');
      return NextResponse.redirect(new URL(`${returnPath}?${searchParams.toString()}`, request.url));
    }
    
    console.log(`API route: OAuth ${source} with ${provider}`);
    
    const supabase = await createClient();
    // Get the domain without any path
    const domain = process.env.NEXT_PUBLIC_SITE_URL || 'https://codepedition.com';
    
    // Create the OAuth sign-in
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: provider as 'google' | 'github',
      options: {
        redirectTo: `${domain}/auth/callback`,
      }
    });
    
    if (error) {
      console.error(`API route: OAuth error with ${provider}:`, error.message);
      
      // Redirect back to the source page with error
      const returnPath = source === 'login' ? '/auth/login' : '/auth/register';
      const searchParams = new URLSearchParams();
      searchParams.set('error', `Error signing in with ${provider}: ${error.message}`);
      return NextResponse.redirect(new URL(`${returnPath}?${searchParams.toString()}`, request.url));
    }
    
    // If successful, the data will contain a URL to redirect the user to
    if (data?.url) {
      console.log(`API route: Redirecting to OAuth provider URL: ${data.url}`);
      // Use direct response redirect to the provider URL
      return NextResponse.redirect(data.url);
    } else {
      console.error(`API route: No URL returned from OAuth attempt with ${provider}`);
      
      // Redirect back to the source page with error
      const returnPath = source === 'login' ? '/auth/login' : '/auth/register';
      const searchParams = new URLSearchParams();
      searchParams.set('error', `Error signing in with ${provider}: No redirect URL returned`);
      return NextResponse.redirect(new URL(`${returnPath}?${searchParams.toString()}`, request.url));
    }
  } catch (error: any) {
    console.error('API route: Unexpected error during OAuth:', error);
    
    // Try to extract source from the error or default to login
    let source = 'login';
    try {
      const referer = request.headers.get('referer') || '';
      if (referer.includes('/register')) {
        source = 'register';
      }
    } catch (e) {
      console.error('Error determining source from referer:', e);
    }
    
    // Redirect back to the source page with error
    const returnPath = source === 'login' ? '/auth/login' : '/auth/register';
    const searchParams = new URLSearchParams();
    searchParams.set('error', 'An unexpected error occurred');
    return NextResponse.redirect(new URL(`${returnPath}?${searchParams.toString()}`, request.url));
  }
} 