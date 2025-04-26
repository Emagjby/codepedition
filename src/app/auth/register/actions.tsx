'use server'

import { createClient } from '@/utils/supabase/server'

export async function signup(formData: FormData) {
  const supabase = await createClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string

  try {
    // SignUp process
    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password
    })

    if (signUpError) {
      console.error('Signup error:', signUpError.message, signUpError.code)
      return 'Signup error: ' + signUpError.message
    }

    const user = data?.user

    if (!user) {
      console.error('No user returned after signup:', data)
      return 'No user returned after signup'
    }

    // Successful signup, log it
    console.log('User signed up successfully:', user.id)
    return 'User signed up successfully'
  } catch (err) {
    console.error('Unexpected error during signup:', err)
    return 'Unexpected error during signup: ' + err
  }
}