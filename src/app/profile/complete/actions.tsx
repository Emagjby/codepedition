'use server'

import { createClient } from '@/utils/supabase/server'

type ProfileData = {
  userId: string
  email: string
  username: string
}

export async function completeProfile(data: ProfileData) {
  if (!data.userId || !data.email || !data.username) {
    return 'Missing required profile information'
  }

  // Validate username
  if (data.username.length < 3) {
    return 'Username must be at least 3 characters'
  }

  if (!/^[a-zA-Z0-9_]+$/.test(data.username)) {
    return 'Username can only contain letters, numbers, and underscores'
  }

  const supabase = await createClient()

  try {
    // Check if username already exists (excluding the user's temporary username)
    const { data: existingUsers, error: checkError } = await supabase
      .from('users')
      .select('username')
      .eq('username', data.username)
      .neq('user_id', data.userId)
      .limit(1)

    if (checkError) {
      console.error('Error checking username:', checkError)
      return 'Error checking username availability'
    }

    if (existingUsers && existingUsers.length > 0) {
      return 'This username is already taken'
    }

    // Update the user profile
    const { error: updateError } = await supabase
      .from('users')
      .update({
        username: data.username
      })
      .eq('user_id', data.userId)

    if (updateError) {
      console.error('Error updating profile:', updateError)
      return 'Error updating your profile'
    }

    // If no record was updated, we need to insert one
    const { data: userData } = await supabase
      .from('users')
      .select('*')
      .eq('user_id', data.userId)
      .limit(1)

    if (!userData || userData.length === 0) {
      // Insert new profile
      const { error: insertError } = await supabase
        .from('users')
        .insert({
          user_id: data.userId,
          email: data.email,
          username: data.username,
          xp: 0,
          level: 1
        })

      if (insertError) {
        console.error('Error creating profile:', insertError)
        return 'Error creating your profile'
      }
    }

    return { success: true }
  } catch (error) {
    console.error('Unexpected error completing profile:', error)
    return 'An unexpected error occurred'
  }
} 