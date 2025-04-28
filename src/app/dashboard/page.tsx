"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { createClient } from '@/utils/supabase/client';

type UserProfile = {
  username: string;
  email: string;
  fullName: string;
  bio: string | null;
  location: string | null;
  website: string | null;
  joinDate: string;
  lastLogin: string;
  xp: number;
  level: number;
  streakCount: number;
}

export default function Dashboard() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [error, setError] = useState("");
  
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setIsLoading(true);
        
        const supabase = createClient();
        
        try {
          // Get the authenticated user
          const { data, error: authError } = await supabase.auth.getUser();
          
          if (authError) {
            console.error('Auth error:', authError);
            
            // Handle specific auth errors
            if (authError.message?.includes('Auth session missing') || 
                authError.name === 'AuthSessionMissingError') {
              console.log('No auth session - redirecting to login');
            } else if (authError.message?.includes('User from sub claim in JWT does not exist')) {
              console.warn('User in token does not exist - signing out');
              await supabase.auth.signOut();
            }
            
            setError('Please log in to view your dashboard');
            router.push('/auth/login');
            return;
          }
          
          if (!data.user) {
            console.log('No user data found - redirecting to login');
            setError('Please log in to view your dashboard');
            router.push('/auth/login');
            return;
          }
          
          // Get the user's profile from the public.users table
          const { data: profiles, error: profileError } = await supabase
            .from('users')
            .select('*')
            .eq('email', data.user.email)
            .limit(1);
          
          if (profileError) {
            console.error('Profile error:', profileError);
            setError('Error loading profile data');
            setIsLoading(false);
            return;
          }
          
          if (!profiles || profiles.length === 0) {
            // User doesn't have a profile, redirect to complete profile
            router.push('/profile/complete');
            return;
          }
          
          const profile = profiles[0];
          
          // Format the user data
          const displayUsername = profile.username.startsWith('user_') 
            ? profile.email.split('@')[0] 
            : profile.username;

          setUser({
            username: displayUsername,
            email: profile.email,
            fullName: profile.email.split('@')[0] || 'User',
            bio: null,
            location: null,
            website: null,
            joinDate: new Date().toISOString(),
            lastLogin: new Date(data.user.last_sign_in_at || Date.now()).toLocaleDateString(),
            xp: profile.xp || 0,
            level: profile.level || 1,
            streakCount: profile.streak_count || 0
          });
        } catch (authError: any) {
          // Handle any unexpected auth errors
          console.error('Unexpected auth error:', authError);
          
          // Handle specific auth errors
          if (authError?.message?.includes('Auth session missing') || 
              authError?.name === 'AuthSessionMissingError') {
            console.log('No auth session - redirecting to login');
          } else if (authError?.message?.includes('User from sub claim in JWT does not exist')) {
            console.warn('User in token does not exist - signing out');
            await supabase.auth.signOut();
          }
          
          setError('Please log in to view your dashboard');
          router.push('/auth/login');
          return;
        }
        
        setIsLoading(false);
      } catch (err) {
        console.error('Error fetching user data:', err);
        setError('Something went wrong fetching your data');
        setIsLoading(false);
      }
    };
    
    fetchUserData();
  }, [router]);
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <Navbar />
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
            <p className="mt-4 text-gray-600">Loading your dashboard...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <Navbar />
        <div className="flex items-center justify-center h-96">
          <div className="text-center max-w-md p-6 bg-white rounded-lg shadow-md">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-red-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <h2 className="text-xl font-bold text-gray-800 mb-2">Error Loading Dashboard</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <Link href="/auth/login" className="text-blue-600 hover:underline font-medium">
              Return to Login
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
  
  if (!user) {
    return null; // This shouldn't happen with our flow, but just in case
  }
  
  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      {/* Navigation */}
      <Navbar />
      
      {/* Dashboard Content */}
      <section className="py-16 px-6 md:px-16">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
          
          <div className="grid md:grid-cols-3 gap-6">
            {/* User Profile Card */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="bg-blue-600 px-6 py-4">
                <h2 className="text-white text-lg font-medium">User Profile</h2>
              </div>
              <div className="p-6">
                <div className="flex items-center justify-center mb-6">
                  <div className="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center">
                    <span className="text-blue-600 font-bold text-2xl">
                      {user.username.substring(0, 2).toUpperCase()}
                    </span>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <label className="block text-gray-500 text-sm">Username</label>
                    <p className="font-medium">{user.username}</p>
                  </div>
                  
                  <div>
                    <label className="block text-gray-500 text-sm">Full Name</label>
                    <p className="font-medium">{user.fullName}</p>
                  </div>
                  
                  <div>
                    <label className="block text-gray-500 text-sm">Email</label>
                    <p className="font-medium">{user.email}</p>
                  </div>
                  
                  {user.bio && (
                    <div>
                      <label className="block text-gray-500 text-sm">Bio</label>
                      <p className="font-medium">{user.bio}</p>
                    </div>
                  )}
                  
                  {user.location && (
                    <div>
                      <label className="block text-gray-500 text-sm">Location</label>
                      <p className="font-medium">{user.location}</p>
                    </div>
                  )}
                  
                  {user.website && (
                    <div>
                      <label className="block text-gray-500 text-sm">Website</label>
                      <a href={user.website} target="_blank" rel="noopener noreferrer" className="font-medium text-blue-600 hover:underline">{user.website}</a>
                    </div>
                  )}
                  
                  <div>
                    <label className="block text-gray-500 text-sm">Joined</label>
                    <p className="font-medium">{user.joinDate}</p>
                  </div>
                  
                  <div>
                    <label className="block text-gray-500 text-sm">Last Login</label>
                    <p className="font-medium">{user.lastLogin}</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Activity Summary Card */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden md:col-span-2">
              <div className="bg-blue-600 px-6 py-4">
                <h2 className="text-white text-lg font-medium">Activity Summary</h2>
              </div>
              <div className="p-6">
                <p className="text-gray-600 mb-4">Welcome to your dashboard, {user.fullName}! You've successfully completed your profile.</p>
                
                <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-blue-800">Account Information</h3>
                      <div className="mt-2 text-sm text-blue-700">
                        <p>
                          Your account is fully set up and ready to go! You can now explore all the features available to you.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6">
                  <Link href="/profile/edit" className="text-blue-600 hover:underline font-medium">
                    Edit your profile →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <Footer />
    </div>
  );
} 