"use client";

import Link from "next/link";
import { useState, ChangeEvent, FormEvent, useRef, useEffect } from "react";
import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";
import { login } from './actions';
import { createClient } from '@/utils/supabase/client';
import { useSearchParams } from "next/navigation";

export default function Login() {
  const formRef = useRef<HTMLFormElement>(null);
  const searchParams = useSearchParams();

  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  
  const [errors, setErrors] = useState({
    email: "",
    password: ""
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [serverError, setServerError] = useState("");
  const [isEmailNotConfirmed, setIsEmailNotConfirmed] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);
  const [cooldownSeconds, setCooldownSeconds] = useState(0);
  const [cooldownActive, setCooldownActive] = useState(false);
  
  // Check for email in URL and prefill it
  useEffect(() => {
    const emailParam = searchParams.get('email');
    if (emailParam) {
      setFormData(prev => ({
        ...prev,
        email: emailParam
      }));
    }
  }, [searchParams]);
  
  // Check if the user is in cooldown period on component mount
  useEffect(() => {
    const lastResendTime = localStorage.getItem('lastEmailResendTime');
    if (lastResendTime) {
      const timeElapsed = Math.floor((Date.now() - parseInt(lastResendTime)) / 1000);
      const cooldownPeriod = 60; // 1 minute in seconds
      
      if (timeElapsed < cooldownPeriod) {
        const remainingTime = cooldownPeriod - timeElapsed;
        setCooldownSeconds(remainingTime);
        setCooldownActive(true);
      }
    }
  }, []);
  
  // Countdown timer for cooldown period
  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (cooldownActive && cooldownSeconds > 0) {
      timer = setInterval(() => {
        setCooldownSeconds(prev => {
          const newValue = prev - 1;
          if (newValue <= 0) {
            setCooldownActive(false);
            clearInterval(timer);
            return 0;
          }
          return newValue;
        });
      }, 1000);
    }
    
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [cooldownActive, cooldownSeconds]);
  
  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      email: "",
      password: ""
    };
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
      isValid = false;
    }
    
    // Password validation
    if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
      isValid = false;
    }
    
    setErrors(newErrors);
    return isValid;
  };
  
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when typing
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
    
    // Clear server error when user makes changes
    if (serverError) {
      setServerError("");
      setIsEmailNotConfirmed(false);
      setResendSuccess(false);
    }
  };
  
  const handleResendConfirmation = async () => {
    if (!formData.email || isResending) return;
    
    // Check if within the cooldown period
    const lastResendTime = localStorage.getItem('lastEmailResendTime');
    if (lastResendTime) {
      const timeElapsed = Math.floor((Date.now() - parseInt(lastResendTime)) / 1000);
      const cooldownPeriod = 60; // 1 minute in seconds
      
      if (timeElapsed < cooldownPeriod) {
        const remainingTime = cooldownPeriod - timeElapsed;
        setCooldownSeconds(remainingTime);
        setCooldownActive(true);
        setServerError(`Please wait ${remainingTime} seconds before requesting another email.`);
        return;
      }
    }
    
    setIsResending(true);
    setResendSuccess(false);
    
    try {
      const supabase = createClient();
      const domain = process.env.NEXT_PUBLIC_SITE_URL || 'https://codepedition.com';
      
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: formData.email,
        options: {
          emailRedirectTo: domain + '/auth/verified'
        }
      });
      
      if (error) {
        // Only log non-rate-limiting errors
        if (!error.message.includes('security purposes') && 
            !error.message.toLowerCase().includes('wait') &&
            !error.message.toLowerCase().includes('seconds')) {
          console.error('Error resending confirmation email:', error);
        }
        
        setServerError(`${error.message}`);
      } else {
        // Store the current time as the last resend time
        localStorage.setItem('lastEmailResendTime', Date.now().toString());
        
        // Set cooldown period
        setCooldownSeconds(60);
        setCooldownActive(true);
        
        setResendSuccess(true);
        setServerError('');
        setIsEmailNotConfirmed(false);
      }
    } catch (error) {
      console.error('Unexpected error resending confirmation:', error);
      setServerError('Something went wrong. Please try again later.');
    } finally {
      setIsResending(false);
    }
  };
  
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (validateForm()) {
      setIsSubmitting(true);
      setServerError("");
      setIsEmailNotConfirmed(false);
      setResendSuccess(false);
      
      try {
        const formDataObj = new FormData();
        formDataObj.append('email', formData.email);
        formDataObj.append('password', formData.password);

        // When the action redirects, it will throw a NEXT_REDIRECT error
        // which gets caught in the catch block below
        const result = await login(formDataObj);
        
        // If we got a result (not a redirect), then it's an error
        if (result && typeof result === 'string') {
          if (result.includes('Invalid credentials')) {
            setServerError("Incorrect email or password. Please try again.");
          } else if (result.includes('not found')) {
            setServerError("No account found with this email. Need to create an account?");
          } else if (result.includes('Email not confirmed') || result.toLowerCase().includes('confirm email')) {
            // Handle email confirmation issues
            setIsEmailNotConfirmed(true);
            setServerError("Your email has not been confirmed yet. Please check your inbox or click the button below to resend the confirmation email.");
          } else {
            setServerError(result);
          }
          setIsSubmitting(false);
        } else {
          // Successful login (though we should redirect before reaching here)
          setIsRedirecting(true);
        }
      } catch (error: any) {
        // This could be a redirect error, so check the error type or message
        if (error.name === 'NEXT_REDIRECT' || 
            (error.message && (
              error.message.includes('NEXT_REDIRECT') || 
              error.message.includes('redirect') || 
              error.message.includes('navigation')
            ))) {
          // This is a redirect, not an error
          console.log('Redirecting...');
          setIsRedirecting(true);
          return;
        }
        
        // Check for email confirmation errors in the caught error too
        if (error.message && (
          error.message.includes('Email not confirmed') || 
          error.message.toLowerCase().includes('confirm email')
        )) {
          setIsEmailNotConfirmed(true);
          setServerError("Your email has not been confirmed yet. Please check your inbox or click the button below to resend the confirmation email.");
        } else {
          // It's a real error
          console.error('Login failed', error);
          setServerError("Something went wrong. Please try again later.");
        }
        
        setIsSubmitting(false);
        setIsRedirecting(false);
      }
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      {/* Navigation */}
      <Navbar />
      
      {/* Login Section */}
      <section className="py-16 px-6 md:px-16">
        <div className="max-w-md mx-auto">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="px-8 py-10">
              <h1 className="text-3xl font-bold text-center mb-6">Log In</h1>
              <p className="text-gray-600 text-center mb-8">
                Welcome back! Sign in to your account.
              </p>
              
              {isRedirecting && (
                <div className="mb-6 p-4 bg-blue-50 border border-blue-300 text-blue-700 rounded-md flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Signing in, please wait...</span>
                </div>
              )}
              
              {resendSuccess && (
                <div className="mb-6 p-4 bg-green-50 border border-green-300 text-green-700 rounded-md">
                  <p>Confirmation email has been resent. Please check your inbox and spam folder.</p>
                </div>
              )}
              
              {serverError && !isRedirecting && !isEmailNotConfirmed && (
                <div className="mb-6 p-3 bg-red-50 border border-red-300 text-red-700 rounded-md">
                  {serverError}
                </div>
              )}
              
              {isEmailNotConfirmed && (
                <div className="mb-6 bg-amber-50 border border-amber-300 rounded-md overflow-hidden">
                  <div className="px-4 py-3 bg-amber-100 border-b border-amber-300 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-amber-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    <h3 className="font-semibold text-amber-800">Email Verification Required</h3>
                  </div>
                  <div className="p-4">
                    <p className="text-amber-800 mb-3">
                      Your account exists, but your email address hasn't been verified yet. Please check your inbox for a verification link.
                    </p>
                    
                    {serverError && (
                      <div className="mb-4 p-2 bg-red-50 border border-red-200 text-red-700 rounded text-sm">
                        {serverError}
                      </div>
                    )}
                    
                    {resendSuccess && (
                      <div className="mb-4 p-2 bg-green-50 border border-green-200 text-green-700 rounded text-sm">
                        Verification email sent! Please check your inbox and spam folder.
                      </div>
                    )}
                    
                    <div className="mt-2">
                      <button
                        type="button"
                        onClick={handleResendConfirmation}
                        disabled={isResending || cooldownActive}
                        className="cursor-pointer w-full bg-amber-600 hover:bg-amber-700 text-white font-medium py-2 px-4 rounded-md transition-colors disabled:bg-amber-400 flex justify-center items-center"
                      >
                        {isResending ? (
                          <>
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            <span>Sending...</span>
                          </>
                        ) : cooldownActive ? (
                          `Resend available in ${cooldownSeconds}s`
                        ) : (
                          "Resend Verification Email"
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              )}
              
              <form className="space-y-6" onSubmit={handleSubmit} noValidate>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Email address"
                    className={`w-full px-4 py-2 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-blue-500 focus:border-blue-500`}
                    disabled={isRedirecting}
                  />
                  {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
                </div>
                
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Password"
                    className={`w-full px-4 py-2 border ${errors.password ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-blue-500 focus:border-blue-500`}
                    disabled={isRedirecting}
                  />
                  {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password}</p>}
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      id="remember-me"
                      name="remember-me"
                      type="checkbox"
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      disabled={isRedirecting}
                    />
                    <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                      Remember me
                    </label>
                  </div>
                  
                  <div className="text-sm">
                    <Link href="/auth/forgotten-password" className="font-medium text-blue-600 hover:text-blue-500">
                      Forgot password?
                    </Link>
                  </div>
                </div>
                
                <button
                  type="submit"
                  disabled={isSubmitting || isRedirecting}
                  className="w-full cursor-pointer bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-md transition-colors disabled:bg-blue-400"
                >
                  {isRedirecting ? "Redirecting..." : isSubmitting ? "Signing in..." : "Sign in"}
                </button>
              </form>
              
              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                  Don't have an account?{" "}
                  <Link href="/auth/register" className="text-blue-600 font-medium hover:underline cursor-pointer">
                    Create account
                  </Link>
                </p>
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