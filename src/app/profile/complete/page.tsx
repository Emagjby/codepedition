"use client";

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import { completeProfile } from './actions'
import Navbar from '../../../components/Navbar'
import Footer from '../../../components/Footer'

export default function CompleteProfilePage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [authUser, setAuthUser] = useState<any>(null)
  const [formSubmitting, setFormSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [formData, setFormData] = useState({
    username: ''
  })

  useEffect(() => {
    async function checkUser() {
      try {
        const supabase = createClient()
        
        try {
          const { data, error } = await supabase.auth.getUser()
          
          if (error) {
            console.error('Auth error:', error)
            
            // Handle specific auth errors
            if (error.message?.includes('Auth session missing') || 
                error.name === 'AuthSessionMissingError') {
              console.log('No auth session found - redirecting to login')
            } else if (error.message?.includes('User from sub claim in JWT does not exist')) {
              console.warn('User in token does not exist - signing out')
              await supabase.auth.signOut()
            }
            
            router.push('/auth/login')
            return
          }
          
          if (!data.user) {
            console.log('No user data found - redirecting to login')
            router.push('/auth/login')
            return
          }
          
          setAuthUser(data.user)
          
          // Check if user already has a profile
          const { data: userProfile, error: profileError } = await supabase
            .from('users')
            .select('username')
            .eq('user_id', data.user.id)
            .single()
          
          if (profileError && profileError.code !== 'PGRST116') {
            // Unexpected error (not "no rows returned" error)
            console.error('Error checking profile:', profileError)
          }
          
          // If user has a non-temporary profile, redirect to dashboard
          if (userProfile && !userProfile.username.startsWith('user_')) {
            console.log('User already has a profile, redirecting to dashboard')
            router.push('/dashboard')
            return
          }
          
          // Set a default username based on email if available
          const email = data.user.email
          if (email) {
            setFormData(prev => ({
              ...prev,
              username: email.split('@')[0]
            }))
          }
        } catch (authError: any) {
          // Handle any unexpected auth errors
          console.error('Unexpected auth error:', authError)
          
          // Handle specific auth errors
          if (authError?.message?.includes('Auth session missing') || 
              authError?.name === 'AuthSessionMissingError') {
            console.log('No auth session found - redirecting to login')
          } else if (authError?.message?.includes('User from sub claim in JWT does not exist')) {
            console.warn('User in token does not exist - signing out')
            await supabase.auth.signOut()
          }
          
          router.push('/auth/login')
          return
        }
        
        setIsLoading(false)
      } catch (err) {
        console.error('Error checking user:', err)
        setIsLoading(false)
        router.push('/auth/login')
      }
    }
    
    checkUser()
  }, [router])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormSubmitting(true)
    setSubmitError('')
    
    try {
      if (!authUser || !authUser.email) {
        throw new Error('User not authenticated')
      }
      
      // Call the server action to complete the profile
      const result = await completeProfile({
        userId: authUser.id,
        email: authUser.email,
        username: formData.username
      })
      
      if (typeof result === 'string') {
        // Error message returned
        setSubmitError(result)
        setFormSubmitting(false)
        return
      }
      
      // Success, redirect to dashboard
      router.push('/dashboard')
    } catch (err) {
      console.error('Error completing profile:', err)
      setSubmitError('An unexpected error occurred. Please try again.')
      setFormSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <Navbar />
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
            <p className="mt-4 text-gray-600">Loading...</p>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      {/* Navigation */}
      <Navbar />
      
      {/* Complete Profile Section */}
      <section className="py-16 px-6 md:px-16">
        <div className="max-w-md mx-auto">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="px-8 py-10">
              <h1 className="text-3xl font-bold text-center mb-2">Choose a Username</h1>
              <p className="text-gray-600 text-center mb-8">
                Select a username to identify yourself on the platform
              </p>
              
              {submitError && (
                <div className="mb-6 p-3 bg-red-50 border border-red-300 text-red-700 rounded-md">
                  {submitError}
                </div>
              )}
              
              <form className="space-y-6" onSubmit={handleSubmit} noValidate>
                <div>
                  <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                    Username <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    placeholder="Choose a unique username"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    This will be your public handle and cannot be changed later.
                  </p>
                </div>
                
                <button
                  type="submit"
                  disabled={formSubmitting || !formData.username}
                  className="w-full cursor-pointer bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-md transition-colors disabled:bg-blue-400"
                >
                  {formSubmitting ? "Saving..." : "Continue"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <Footer />
    </div>
  )
} 