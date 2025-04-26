'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { createClient } from '@/utils/supabase/server'

export async function login(formData: FormData) {
  const supabase = await createClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string

    // Login process
    const { data, error: loginError } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (loginError) {
      console.error('Login error:', loginError.message, loginError.code)
      return 'Login error: ' + loginError.message
    }

    const user = data?.user

    if (!user) {
      console.error('No user returned after login:', data)
      return 'No user returned after login'
    }

    // Successful login, log it
    console.log('User logged in successfully:', user.id)
    
    revalidatePath('/dashboard', 'layout')
    redirect('/dashboard')
}