"use client";

import Link from 'next/link';
import { useSearchParams } from "next/navigation";
import { CheckCircle2 } from 'lucide-react';
import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";

export default function VerifiedPage() {
  const params = useSearchParams();
  const email = params.get('email') || '';
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 pt-20">
      {/* Navigation */}
      <Navbar />
      
      {/* Verified Email Section */}
      <section className="py-16 px-6 md:px-16">
        <div className="max-w-md mx-auto">
          <div className="bg-white rounded-xl shadow-xl overflow-hidden transform transition-all">
            <div className="px-8 py-10">
              <div className="mb-6 text-center">
                <div className="inline-flex items-center justify-center h-20 w-20 bg-green-100 rounded-full mb-4">
                  <CheckCircle2 className="h-12 w-12 text-green-600" />
                </div>
                <h1 className="text-2xl font-bold text-gray-800">Email Verified Successfully</h1>
                <p className="mt-2 text-gray-600">Your account is now active and ready to use</p>
              </div>
              
              <div className="overflow-hidden bg-gradient-to-r from-green-50 to-teal-50 rounded-lg shadow-sm border border-green-200 mb-8">
                <div className="bg-white bg-opacity-90 p-6">
                  {email && (
                    <div className="mb-6 bg-blue-50 border border-blue-100 rounded-lg p-4">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <svg className="h-6 w-6 text-blue-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-sm text-blue-700">Verification completed for:</p>
                          <p className="font-medium text-blue-800">{email}</p>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div className="space-y-6">
                    <div className="flex items-start">
                      <div className="flex-shrink-0 h-6 w-6 rounded-full bg-green-100 flex items-center justify-center mr-3">
                        <svg className="h-4 w-4 text-green-600" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <p className="text-gray-700">Your email has been successfully verified</p>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="flex-shrink-0 h-6 w-6 rounded-full bg-green-100 flex items-center justify-center mr-3">
                        <svg className="h-4 w-4 text-green-600" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <p className="text-gray-700">Your account is now active and ready to use</p>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="flex-shrink-0 h-6 w-6 rounded-full bg-green-100 flex items-center justify-center mr-3">
                        <svg className="h-4 w-4 text-green-600" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <p className="text-gray-700">You can now sign in with your email and password</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="text-center">
                <Link 
                  href={email ? `/auth/login?email=${encodeURIComponent(email)}` : '/auth/login'}
                  className="inline-flex items-center justify-center px-5 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors focus:outline-none focus:ring-4 focus:ring-green-300 cursor-pointer w-full sm:w-auto"
                >
                  <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                  </svg>
                  Continue to Login
                </Link>
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