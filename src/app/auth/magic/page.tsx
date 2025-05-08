"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";
import { createClient } from '@/utils/supabase/client';

export default function MagicLinkAuth() {
  const router = useRouter();
  const [countdown, setCountdown] = useState(3);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  
  // Effect to handle magic link authentication when the component mounts
  useEffect(() => {
    const handleMagicLinkAuth = async () => {
      try {
        setLoading(true);
        const supabase = createClient();
        
        // Get the hash from the URL
        const hash = window.location.hash;
        const params = new URLSearchParams(window.location.search);
        
        console.log("URL params:", Array.from(params.entries()));
        console.log("URL hash:", hash);
        
        // Check for session directly instead of relying on the hash
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Magic link authentication error:', error);
          setError('Authentication failed: ' + error.message);
          setLoading(false);
          return;
        }
        
        if (!data.session) {
          console.error('No session found after magic link authentication');
          setError('No active session found. Please try logging in again.');
          setLoading(false);
          return;
        }
        
        console.log('Magic link authentication successful, session:', data.session);
        setLoading(false);
        
        // Start countdown for redirect
        startCountdown();
      } catch (err) {
        console.error('Unexpected error during magic link authentication:', err);
        setError('An unexpected error occurred. Please try logging in again.');
        setLoading(false);
      }
    };
    
    handleMagicLinkAuth();
  }, []);
  
  // Effect for countdown
  const startCountdown = () => {
    // Set up countdown timer
    const timer = setInterval(() => {
      setCountdown((prevCount) => {
        if (prevCount <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prevCount - 1;
      });
    }, 1000);
    
    // Clean up timer on component unmount
    return () => clearInterval(timer);
  };
  
  // Separate effect for navigation
  useEffect(() => {
    if (countdown === 0) {
      // Use setTimeout to ensure this happens in a separate render cycle
      const redirectTimeout = setTimeout(() => {
        router.push("/dashboard");
      }, 0);
      
      return () => clearTimeout(redirectTimeout);
    }
  }, [countdown, router]);
  
  const handleRedirect = () => {
    router.push("/dashboard");
  };
  
  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      {/* Navigation */}
      <Navbar />
      
      {/* Magic Link Authentication Section */}
      <section className="py-16 px-6 md:px-16">
        <div className="max-w-md mx-auto">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="px-8 py-10">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-8">
                  <svg className="animate-spin h-10 w-10 text-blue-500 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <p className="text-gray-600">Authenticating, please wait...</p>
                </div>
              ) : error ? (
                <div className="bg-red-50 border-2 border-red-400 rounded-lg p-6 text-center">
                  <div className="flex items-center justify-center mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-red-700 mb-2">Authentication Failed</h3>
                  <p className="text-gray-600 mb-6">
                    {error}
                  </p>
                  <Link href="/auth/login">
                    <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-md transition-colors">
                      Back to Login
                    </button>
                  </Link>
                </div>
              ) : (
                <div className="bg-green-50 border-2 border-green-400 rounded-lg p-6 text-center">
                  <div className="flex items-center justify-center mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-green-700 mb-2">Magic Link Authentication Successful!</h3>
                  <p className="text-gray-600 mb-6">
                    You have been authenticated successfully using the magic link. You now have access to all features of our platform.
                  </p>
                  <p className="text-gray-500 mb-4">
                    You will be redirected to the dashboard in <span className="font-semibold">{countdown}</span> seconds.
                  </p>
                  <button
                    onClick={handleRedirect}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-md transition-colors"
                  >
                    Go to Dashboard Now
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <Footer />
    </div>
  );
} 