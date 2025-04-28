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