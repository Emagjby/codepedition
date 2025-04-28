"use client";

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

export default function ErrorPage() {
  const searchParams = useSearchParams();
  const [errorMessage, setErrorMessage] = useState<string>('');
  
  useEffect(() => {
    const message = searchParams.get('message');
    setErrorMessage(message || 'An unknown error occurred');
  }, [searchParams]);
  
  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <Navbar />
      
      <div className="py-16 px-6 md:px-16">
        <div className="max-w-lg mx-auto">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="px-8 py-10">
              <h1 className="text-2xl font-bold text-center mb-6 text-red-600">Authentication Error</h1>
              
              <div className="mb-6 p-4 bg-red-50 border border-red-300 text-red-700 rounded-md">
                {errorMessage}
              </div>
              
              <p className="text-gray-600 mb-8 text-center">
                There was a problem with your authentication request. This could be due to an expired or invalid link.
              </p>
              
              <div className="flex flex-col gap-4">
                <Link 
                  href="/auth/login" 
                  className="w-full text-center bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-md transition-colors"
                >
                  Return to Login
                </Link>
                
                <Link
                  href="/"
                  className="w-full text-center text-gray-600 hover:text-gray-800"
                >
                  Go to Homepage
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
} 