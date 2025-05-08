"use client";

import Link from "next/link";
import { useState, ChangeEvent, FormEvent } from "react";
import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";
import { resetPassword } from "./actions";
import { CheckCircle2, ArrowRight, AlertCircle } from "lucide-react";

export default function ForgottenPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const validateForm = () => {
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address");
      return false;
    }
    
    setError("");
    return true;
  };
  
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    // Clear error when typing
    if (error) {
      setError("");
    }
  };
  
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (validateForm()) {
      setIsSubmitting(true);
      
      try {
        // Call our server action to send the password reset email
        const formData = new FormData();
        formData.append('email', email);
        const result = await resetPassword(formData);
        
        // Check if the result is an error message (string) or success object
        if (typeof result === 'string') {
          setError(result);
          setIsSubmitting(false);
        } else if (result.success) {
          setIsSubmitting(false);
          setIsSubmitted(true);
          setSuccess(true);
        }
      } catch (err) {
        console.error('Error in password reset:', err);
        setError('An unexpected error occurred. Please try again.');
        setIsSubmitting(false);
      }
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 pt-20">
      {/* Navigation */}
      <Navbar />
      
      {/* Forgotten Password Section */}
      <section className="py-16 px-6 md:px-16">
        <div className="max-w-md mx-auto">
          <div className="bg-white rounded-xl shadow-xl overflow-hidden transform transition-all">
            <div className="px-8 py-10">
              <h1 className="text-3xl font-bold text-center mb-2">Forgotten Password?</h1>
              
              {/* Success Message */}
              {success && (
                <div className="mt-6 mb-6 p-4 rounded-lg bg-gradient-to-br from-green-50 to-green-100 border border-green-200">
                  <div className="flex flex-col items-center text-center space-y-3">
                    <div className="rounded-full bg-green-100 p-2">
                      <CheckCircle2 className="h-8 w-8 text-green-600" />
                    </div>
                    <h3 className="text-lg font-medium text-green-800">Reset Link Sent!</h3>
                    <p className="text-green-700">We've sent a password reset link to {email}</p>
                    <Link 
                      href="/auth/login" 
                      className="mt-2 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 cursor-pointer">
                      Return to Login
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </div>
                </div>
              )}

              {/* Server Error */}
              {error && (
                <div className="mt-6 mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center">
                    <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
                    <p className="text-red-700">{error}</p>
                  </div>
                </div>
              )}
              
              {/* Form */}
              {!success && (
                <>
                  <p className="text-gray-600 text-center mb-8">
                    Enter your email address and we'll send you instructions to reset your password.
                  </p>
                  
                  <form className="space-y-6" onSubmit={handleSubmit} noValidate>
                    <div className="group">
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1 group-focus-within:text-blue-600 transition-colors">Email</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <svg className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                            <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                          </svg>
                        </div>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={email}
                          onChange={handleChange}
                          placeholder="you@example.com"
                          className={`w-full pl-10 pr-4 py-2 border ${error ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors`}
                        />
                      </div>
                    </div>
                    
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full cursor-pointer bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 text-white font-medium py-3 px-4 rounded-lg transition-all transform hover:translate-y-[-1px] disabled:opacity-70 disabled:cursor-not-allowed disabled:translate-y-0"
                    >
                      {isSubmitting ? (
                        <div className="flex items-center justify-center">
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          <span>Sending...</span>
                        </div>
                      ) : (
                        "Send Reset Instructions"
                      )}
                    </button>
                  </form>
                  
                  <div className="mt-8 text-center">
                    <p className="text-sm text-gray-600">
                      Remember your password?{" "}
                      <Link href="/auth/login" className="text-blue-600 font-medium hover:text-blue-500 transition-colors cursor-pointer">
                        Back to login
                      </Link>
                    </p>
                  </div>
                </>
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