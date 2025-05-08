'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export async function register(formData: FormData) {
  const supabase = await createClient()
  
  // Extract data from form
  const name = formData.get('name') as string
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  
  if (!name || !email || !password) {
    return { 
      success: false, 
      error: 'Missing required fields' 
    }
  }
  
  try {
    // Create a new user account
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name,
        },
      },
    })
    
    if (error) {
      return { 
        success: false, 
        error: error.message 
      }
    }
    
    // Handle email confirmation
    if (data.user) {
      return { 
        success: true, 
        message: 'Account created successfully! Please check your email to confirm your account.' 
      }
    }
    
    return { 
      success: false, 
      error: 'An unexpected error occurred' 
    }
  } catch (error: any) {
    return { 
      success: false, 
      error: error.message || 'An unexpected error occurred' 
    }
  }
}

export async function signInWithOAuth(formData: FormData) {
  const supabase = await createClient()
  
  // Extract provider from form
  const provider = formData.get('provider') as string
  
  if (!provider) {
    return 'Provider is required'
  }
  
  try {
    // Supported providers: 'google', 'github'
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: provider as any,
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
      },
    })
    
    if (error) {
      return error.message
    }
    
    // Redirect to the OAuth provider's page
    if (data?.url) {
      redirect(data.url)
    }
    
    return 'Something went wrong with the OAuth provider'
  } catch (error: any) {
    if (error.message && (
      error.message.includes('NEXT_REDIRECT') || 
      error.message.includes('redirect') || 
      error.message.includes('navigation')
    )) {
      // This is part of the expected OAuth flow
      return null
    }
    
    return error.message || 'An unexpected error occurred'
  }
}