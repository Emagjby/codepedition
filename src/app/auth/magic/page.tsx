"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";

export default function MagicLinkAuth() {
  const router = useRouter();
  const [countdown, setCountdown] = useState(3);
  
  // Effect for countdown
  useEffect(() => {
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
  }, []);
  
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
            </div>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <Footer />
    </div>
  );
} 