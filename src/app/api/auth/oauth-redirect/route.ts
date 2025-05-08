import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Get the provider from URL parameters
    const provider = request.nextUrl.searchParams.get('provider');
    const source = request.nextUrl.searchParams.get('source') || 'login';
    
    if (!provider) {
      // Redirect back with error
      const returnPath = source === 'register' ? '/auth/register' : '/auth/login';
      return NextResponse.redirect(new URL(`${returnPath}?error=Provider is required`, request.url));
    }
    
    console.log(`API route: Initiating OAuth flow with ${provider}`);
    
    const supabase = await createClient();
    
    // Simple OAuth sign-in with minimal configuration
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: provider as 'google' | 'github',
    });
    
    if (error) {
      console.error(`OAuth error:`, error.message);
      const returnPath = source === 'register' ? '/auth/register' : '/auth/login';
      return NextResponse.redirect(new URL(`${returnPath}?error=${error.message}`, request.url));
    }
    
    if (data?.url) {
      // Redirect to the provider's authentication URL
      return NextResponse.redirect(data.url);
    } else {
      console.error(`No redirect URL returned from OAuth provider`);
      const returnPath = source === 'register' ? '/auth/register' : '/auth/login';
      return NextResponse.redirect(new URL(`${returnPath}?error=Unable to initiate OAuth flow`, request.url));
    }
  } catch (error: any) {
    console.error('Unexpected error during OAuth:', error);
    return NextResponse.redirect(new URL('/auth/login?error=Authentication failed', request.url));
  }
} 