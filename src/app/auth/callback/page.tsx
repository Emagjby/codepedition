"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from '@/utils/supabase/client';
import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";

export default function AuthCallback() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleCallback = async () => {
      const supabase = createClient();
      
      try {
        // Exchange the auth code for a session and get the state of the auth process
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error processing OAuth callback:', error);
          setError(`Authentication failed: ${error.message}`);
          setLoading(false);
          return;
        }
        
        if (!data.session) {
          console.error('No session found after OAuth authentication');
          setError('Authentication failed: No session found');
          setLoading(false);
          return;
        }
        
        // Check if the user has a profile
        const { data: profile, error: profileError } = await supabase
          .from('users')
          .select('*')
          .eq('user_id', data.session.user.id)
          .limit(1);
        
        if (profileError) {
          console.error('Error checking profile during OAuth callback:', profileError);
        }
        
        // Successful login
        console.log('OAuth authentication successful');
        setLoading(false);
        
        // Redirect to appropriate page
        if (!profile || profile.length === 0) {
          // User needs to complete their profile
          router.push('/profile/complete');
        } else {
          // User has a profile, redirect to dashboard
          router.push('/dashboard');
        }
      } catch (err) {
        console.error('Unexpected error during OAuth callback:', err);
        setError('An unexpected error occurred. Please try again.');
        setLoading(false);
      }
    };
    
    handleCallback();
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <Navbar />
      
      <section className="py-16 px-6 md:px-16">
        <div className="max-w-md mx-auto">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="px-8 py-10">
              <h1 className="text-3xl font-bold text-center mb-6">
                {loading ? "Completing Login..." : (error ? "Authentication Error" : "Login Successful")}
              </h1>
              
              {loading ? (
                <div className="text-center">
                  <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
                  <p className="text-gray-600">
                    Please wait while we complete your login...
                  </p>
                </div>
              ) : error ? (
                <div className="bg-red-50 border-2 border-red-400 rounded-lg p-6 text-center">
                  <div className="flex items-center justify-center mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-red-700 mb-2">Authentication Failed</h3>
                  <p className="text-gray-600 mb-4">
                    {error}
                  </p>
                  <div className="mt-6 pt-4 border-t border-red-200">
                    <button
                      onClick={() => router.push('/auth/login')}
                      className="text-blue-600 font-medium hover:underline cursor-pointer"
                    >
                      Back to Login
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-green-50 border-2 border-green-400 rounded-lg p-6 text-center">
                  <div className="flex items-center justify-center mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-green-700 mb-2">Authentication Successful</h3>
                  <p className="text-gray-600 mb-4">
                    You have successfully logged in. Redirecting you now...
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
} 