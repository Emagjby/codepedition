'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export async function signup(formData: FormData) {
  const supabase = await createClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const terms = formData.get('terms') as string

  // Check if terms were agreed to
  if (terms !== 'true') {
    return 'You must agree to the Terms and Privacy Policy to create an account.'
  }
  
  // Get the domain without any path
  const domain = process.env.NEXT_PUBLIC_SITE_URL || 'https://codepedition.com'
  
  // Supabase will append the path to the domain so we can't include it here
  console.log(`Using site domain for confirmation: ${domain}`)

  try {
    console.log('Starting signup process for email:', email)
    
    // Explicitly set the redirectTo URL with just the domain
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: domain + '/profile/complete'
      }
    })

    if (error) {
      console.error('Signup error:', error.message)
      
      if (error.message.includes('email already registered')) {
        return 'This email is already registered. Try logging in instead.'
      }
      
      return 'Signup error: ' + error.message
    }

    if (!data.user) {
      return 'No user returned from signup'
    }

    console.log('User signed up successfully:', data.user.id)
    
    // Check if email confirmation is needed
    if (data.user.identities && data.user.identities.length === 0) {
      return 'Account already exists with this email. Please log in instead.'
    }
    
    if (data.user.email_confirmed_at) {
      // Email already confirmed - rare case but possible
      return { success: true, message: 'User signed up and email already confirmed!' }
    } else {
      // Email confirmation required
      return { 
        success: true, 
        message: 'Please check your email to confirm your account.' 
      }
    }
  } catch (err) {
    console.error('Unexpected error during signup:', err)
    return 'Unexpected error during signup: ' + err
  }
}