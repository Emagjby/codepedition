'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { createClient } from '@/utils/supabase/server'

export async function login(formData: FormData) {
  const supabase = await createClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string
  
  // Create variables to hold redirect info
  let shouldRedirect = false
  let redirectPath = '/dashboard'

  try {
    // Login process
    const { data, error: loginError } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (loginError) {
      console.error('Login error:', loginError.message, loginError.code)
      
      // Return appropriate error messages based on error type
      if (loginError.message.includes('credentials')) {
        return 'Invalid credentials. Please check your email and password.'
      } else if (loginError.message.includes('not found')) {
        return 'User not found. Please check your email or create an account.'
      } else if (loginError.message.includes('Email not confirmed') || 
                loginError.message.toLowerCase().includes('confirm email') ||
                loginError.message.includes('not confirmed')) {
        return 'Email not confirmed. Please check your email for a confirmation link.'
      } else {
        return 'Login error: ' + loginError.message
      }
    }

    const user = data?.user

    if (!user) {
      console.error('No user returned after login:', data)
      return 'No user returned after login'
    }

    // Check if the email is confirmed
    if (!user.email_confirmed_at) {
      console.warn('User email not confirmed:', user.email)
      return 'Email not confirmed. Please check your email for a confirmation link.'
    }

    // Successful login, log it
    console.log('User logged in successfully:', user.id)
    
    // Check if user has a profile in the users table
    const { data: profile, error: profileError } = await supabase
      .from('users')
      .select('*')
      .eq('user_id', user.id)
      .limit(1)
    
    if (profileError) {
      console.error('Error checking profile:', profileError)
      // Still redirect to dashboard but with warning
      revalidatePath('/dashboard', 'layout')
      shouldRedirect = true
      return
    }
    
    // For successful login, set the redirect target based on whether the user has a profile
    revalidatePath('/dashboard', 'layout')
    
    if (!profile || profile.length === 0) {
      // User needs to complete their profile
      redirectPath = '/profile/complete'
    }
    
    // Set redirect flag
    shouldRedirect = true
  } catch (err) {
    console.error('Unexpected error during login:', err)
    return 'Unexpected error during login: ' + err
  }
  
  // Only redirect after try/catch block is complete
  if (shouldRedirect) {
    redirect(redirectPath)
  }
}

export async function sendMagicLink(formData: FormData) {
  const supabase = await createClient()
  const email = formData.get('email') as string
  
  console.log("Server action: sendMagicLink called with email:", email)
  
  // Validate email
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    console.log("Server action: Email validation failed")
    return 'Please enter a valid email address'
  }
  
  try {
    // Get the domain without any path
    const domain = process.env.NEXT_PUBLIC_SITE_URL || 'https://codepedition.com'
    console.log(`Server action: Using domain for magic link: ${domain}`)
    
    console.log(`Server action: Sending magic link to ${email}`)
    
    const { data, error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: domain + '/auth/magic'
      }
    })
    
    if (error) {
      console.error('Server action: Magic link error:', error.message)
      return 'Error sending magic link: ' + error.message
    }
    
    console.log("Server action: Magic link sent successfully", data)
    
    // Success
    return { success: true, message: 'Magic link sent! Check your email.' }
  } catch (err) {
    console.error('Server action: Unexpected error sending magic link:', err)
    return 'Unexpected error sending magic link: ' + err
  }
}

export async function signInWithOAuth(formData: FormData) {
  const provider = formData.get('provider') as string
  
  if (!provider) {
    return 'No provider specified'
  }
  
  try {
    const supabase = await createClient()
    // Get the domain without any path
    const domain = process.env.NEXT_PUBLIC_SITE_URL || 'https://codepedition.com'
    console.log(`Server action: OAuth sign in with ${provider}, redirecting to ${domain}/auth/callback`)
    
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: provider as 'google' | 'github',
      options: {
        redirectTo: `${domain}/auth/callback`
      }
    })
    
    if (error) {
      console.error(`Server action: OAuth error with ${provider}:`, error.message)
      // Redirect back to login page with error message
      const searchParams = new URLSearchParams();
      searchParams.set('error', `Error signing in with ${provider}: ${error.message}`);
      redirect(`/auth/login?${searchParams.toString()}`);
    }
    
    // If successful, the data will contain a URL to redirect the user to
    if (data?.url) {
      console.log(`Server action: Redirecting to OAuth provider URL: ${data.url}`)
      redirect(data.url)
    } else {
      console.error(`Server action: No URL returned from OAuth attempt with ${provider}`)
      // Redirect back to login page with error message
      const searchParams = new URLSearchParams();
      searchParams.set('error', `Error signing in with ${provider}: No redirect URL returned`);
      redirect(`/auth/login?${searchParams.toString()}`);
    }
  } catch (err) {
    console.error(`Server action: Unexpected error during OAuth sign in with ${provider}:`, err)
    // Redirect back to login page with error message
    const searchParams = new URLSearchParams();
    searchParams.set('error', `Unexpected error signing in with ${provider}`);
    redirect(`/auth/login?${searchParams.toString()}`);
  }
}