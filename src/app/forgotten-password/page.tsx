"use client";

import Link from "next/link";
import { useState, ChangeEvent, FormEvent } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

export default function ForgottenPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  
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
  
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (validateForm()) {
      setIsSubmitting(true);
      
      // Here you would integrate with your password reset service
      console.log("Password reset requested for:", email);
      
      // Simulate API call
      setTimeout(() => {
        setIsSubmitting(false);
        setIsSubmitted(true);
      }, 1000);
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      {/* Navigation */}
      <Navbar />
      
      {/* Forgotten Password Section */}
      <section className="py-16 px-6 md:px-16">
        <div className="max-w-md mx-auto">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="px-8 py-10">
              <h1 className="text-3xl font-bold text-center mb-6">Forgotten Password?</h1>
              
              {isSubmitted ? (
                <div className="bg-green-50 border-2 border-green-400 rounded-lg p-6 text-center">
                  <div className="flex items-center justify-center mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-green-700 mb-2">Email Sent Successfully!</h3>
                  <p className="text-gray-600 mb-4">
                    If an account exists with the email <span className="font-medium">{email}</span>, you will receive password reset instructions shortly.
                  </p>
                  <div className="mt-6 pt-4 border-t border-green-200">
                    <p className="text-sm text-gray-500">
                      Return to <Link href="/auth/login" className="text-blue-600 font-medium hover:underline cursor-pointer">Login</Link>
                    </p>
                  </div>
                </div>
              ) : (
                <>
                  <p className="text-gray-600 text-center mb-8">
                    Enter your email address and we'll send you instructions to reset your password.
                  </p>
                  
                  <form className="space-y-6" onSubmit={handleSubmit} noValidate>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={email}
                        onChange={handleChange}
                        placeholder="Email address"
                        className={`w-full px-4 py-2 border ${error ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-blue-500 focus:border-blue-500`}
                      />
                      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
                    </div>
                    
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full cursor-pointer bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-md transition-colors disabled:bg-blue-400"
                    >
                      {isSubmitting ? "Sending..." : "Send reset instructions"}
                    </button>
                  </form>
                  
                  <div className="mt-6 text-center">
                    <p className="text-sm text-gray-600">
                      Remember your password?{" "}
                      <Link href="/auth/login" className="text-blue-600 font-medium hover:underline cursor-pointer">
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