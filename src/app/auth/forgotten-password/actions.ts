'use server'

import { createClient } from '@/utils/supabase/server'

export async function resetPassword(formData: FormData) {
  const supabase = await createClient()
  const email = formData.get('email') as string
  
  console.log("Server action: resetPassword called for email:", email)
  
  // Validate email
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    console.log("Server action: Email validation failed")
    return 'Please enter a valid email address'
  }
  
  try {
    // Get the domain without any path
    const domain = process.env.NEXT_PUBLIC_SITE_URL || 'https://codepedition.com'
    console.log(`Server action: Using domain for password reset: ${domain}`)
    
    // Send password reset email
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: domain + '/auth/update-password'
    })
    
    if (error) {
      console.error('Server action: Password reset error:', error.message)
      return 'Error sending password reset email: ' + error.message
    }
    
    console.log("Server action: Password reset email sent successfully")
    
    // Success
    return { success: true, message: 'Password reset email sent! Check your inbox.' }
  } catch (err) {
    console.error('Server action: Unexpected error sending password reset email:', err)
    return 'Unexpected error sending password reset email: ' + err
  }
} 