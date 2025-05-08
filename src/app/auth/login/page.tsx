"use client";

import Link from "next/link";
import { useState, ChangeEvent, FormEvent, useRef, useEffect } from "react";
import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";
import { login, sendMagicLink, signInWithOAuth } from './actions';
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
  const [magicLinkSent, setMagicLinkSent] = useState(false);
  const [sendingMagicLink, setSendingMagicLink] = useState(false);
  const [magicLinkError, setMagicLinkError] = useState("");
  const [activeTab, setActiveTab] = useState<'password' | 'oauth' | 'magic'>('password');
  
  // Check for email in URL and prefill it
  useEffect(() => {
    const emailParam = searchParams.get('email');
    if (emailParam) {
      setFormData(prev => ({
        ...prev,
        email: emailParam
      }));
    }
    
    // Check for error parameter
    const errorParam = searchParams.get('error');
    if (errorParam) {
      setServerError(errorParam);
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
    
    // Clear magic link status when email changes
    if (name === 'email') {
      setMagicLinkSent(false);
      setMagicLinkError("");
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
  
  const handleMagicLinkRequest = async () => {
    // Email validation for magic link
    console.log("Magic link button clicked for email:", formData.email);
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email) {
      // If email is empty, show a specific error and focus the email field
      setErrors({
        ...errors,
        email: "Please enter your email address to use the magic link"
      });
      // Focus the email input field
      document.getElementById('email')?.focus();
      // Set a short timeout to clear the message after a few seconds
      setTimeout(() => {
        if (errors.email === "Please enter your email address to use the magic link") {
          setErrors({
            ...errors,
            email: ""
          });
        }
      }, 3000);
      return;
    } else if (!emailRegex.test(formData.email)) {
      console.log("Email validation failed");
      setErrors({
        ...errors,
        email: "Please enter a valid email address"
      });
      document.getElementById('email')?.focus();
      return;
    }
    
    setSendingMagicLink(true);
    setMagicLinkError("");
    setMagicLinkSent(false);
    
    try {
      console.log("Preparing to send magic link...");
      const formDataObj = new FormData();
      formDataObj.append('email', formData.email);
      
      const result = await sendMagicLink(formDataObj);
      console.log("Magic link result:", result);
      
      if (result && typeof result === 'string') {
        setMagicLinkError(result);
      } else if (result && typeof result === 'object' && result.success) {
        setMagicLinkSent(true);
      }
    } catch (error) {
      console.error('Error sending magic link:', error);
      setMagicLinkError("Something went wrong. Please try again later.");
    } finally {
      setSendingMagicLink(false);
    }
  };
  
  const handleOAuthLogin = async (provider: string) => {
    try {
      setIsSubmitting(true);
      setServerError("");
      
      // Direct redirect to OAuth endpoint using window.location
      window.location.href = `/api/auth/oauth-redirect?provider=${provider}&source=login`;
    } catch (error) {
      console.error('Error during OAuth login:', error);
      setServerError('An unexpected error occurred. Please try again.');
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 pt-20">
      {/* Navigation */}
      <Navbar />
      
      {/* Login Section */}
      <section className="py-16 px-6 md:px-16">
        <div className="max-w-md mx-auto">
          <div className="bg-white rounded-xl shadow-xl overflow-hidden transform transition-all">
            <div className="px-8 py-10">
              <h1 className="text-3xl font-bold text-center mb-2">Welcome Back</h1>
              <p className="text-gray-600 text-center mb-8">
                Sign in to continue your journey
              </p>
              
              {/* Auth Tabs */}
              <div className="flex mb-8 border-b border-gray-200">
                <button 
                  onClick={() => setActiveTab('password')}
                  className={`flex-1 pb-3 text-sm font-medium transition-colors cursor-pointer ${
                    activeTab === 'password' 
                      ? 'text-blue-600 border-b-2 border-blue-600' 
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Password
                </button>
                <button 
                  onClick={() => setActiveTab('oauth')}
                  className={`flex-1 pb-3 text-sm font-medium transition-colors cursor-pointer ${
                    activeTab === 'oauth' 
                      ? 'text-blue-600 border-b-2 border-blue-600' 
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Social Login
                </button>
                <button 
                  onClick={() => setActiveTab('magic')}
                  className={`flex-1 pb-3 text-sm font-medium transition-colors cursor-pointer ${
                    activeTab === 'magic' 
                      ? 'text-blue-600 border-b-2 border-blue-600' 
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Magic Link
                </button>
              </div>
              
              {/* Status Messages */}
              {isRedirecting && (
                <div className="mt-6 mb-6 p-4 bg-blue-50 border border-blue-300 text-blue-700 rounded-lg flex items-center justify-center animate-pulse">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Signing in, please wait...</span>
                </div>
              )}
              
              {magicLinkSent && (
                <div className="mt-6 mb-6 p-4 bg-green-50 border border-green-300 text-green-700 rounded-lg transition-all duration-300 ease-in-out">
                  <div className="flex items-center">
                    <svg className="h-5 w-5 text-green-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <p className="font-medium">Magic link has been sent!</p>
                  </div>
                  <p className="mt-2 text-sm">Check your email and click the link to sign in.</p>
                </div>
              )}
              
              {serverError && !isRedirecting && !isEmailNotConfirmed && (
                <div className="mt-6 mb-6 p-4 bg-red-50 border border-red-300 text-red-700 rounded-lg">
                  <div className="flex items-center">
                    <svg className="h-5 w-5 text-red-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    <p>{serverError}</p>
                  </div>
                </div>
              )}
              
              {isEmailNotConfirmed && (
                <div className="mt-6 mb-6 bg-amber-50 border border-amber-300 rounded-lg overflow-hidden">
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
                    
                    <button
                      type="button"
                      onClick={handleResendConfirmation}
                      disabled={isResending || cooldownActive}
                      className="w-full bg-amber-600 hover:bg-amber-700 text-white font-medium py-2 px-4 rounded-md transition-colors disabled:bg-amber-400 flex justify-center items-center cursor-pointer"
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
              )}
              
              {/* Password Login (Tab 1) */}
              {activeTab === 'password' && (
                <form className="space-y-5 mt-6" onSubmit={handleSubmit} noValidate>
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
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="you@example.com"
                        className={`w-full pl-10 pr-4 py-2 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors`}
                        disabled={isRedirecting}
                      />
                    </div>
                    {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
                  </div>
                  
                  <div className="group">
                    <div className="flex items-center justify-between mb-1">
                      <label htmlFor="password" className="block text-sm font-medium text-gray-700 group-focus-within:text-blue-600 transition-colors">Password</label>
                      <Link href="/auth/forgotten-password" className="text-xs font-medium text-blue-600 hover:text-blue-500 transition-colors cursor-pointer">
                        Forgot password?
                      </Link>
                    </div>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <input
                        type="password"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="••••••••"
                        className={`w-full pl-10 pr-4 py-2 border ${errors.password ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors`}
                        disabled={isRedirecting}
                      />
                    </div>
                    {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password}</p>}
                  </div>
                  
                  <button
                    type="submit"
                    disabled={isSubmitting || isRedirecting}
                    className="w-full bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 text-white font-medium py-3 px-4 rounded-lg transition-all transform hover:translate-y-[-1px] disabled:opacity-70 disabled:cursor-not-allowed disabled:translate-y-0 cursor-pointer"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span>Logging in...</span>
                      </div>
                    ) : isRedirecting ? (
                      "Redirecting..."
                    ) : (
                      "Sign in"
                    )}
                  </button>
                </form>
              )}
              
              {/* OAuth Login (Tab 2) */}
              {activeTab === 'oauth' && (
                <div className="space-y-4 mt-6">
                  <button
                    type="button"
                    onClick={() => handleOAuthLogin('google')}
                    disabled={isSubmitting || isRedirecting}
                    className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg shadow-sm bg-white hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer"
                  >
                    <svg className="h-5 w-5 text-red-500" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" />
                    </svg>
                    <span className="ml-3 font-medium text-gray-700">Continue with Google</span>
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => handleOAuthLogin('github')}
                    disabled={isSubmitting || isRedirecting}
                    className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg shadow-sm bg-white hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer"
                  >
                    <svg className="h-5 w-5 text-gray-800" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
                    </svg>
                    <span className="ml-3 font-medium text-gray-700">Continue with GitHub</span>
                  </button>
                </div>
              )}
              
              {/* Magic Link Login (Tab 3) */}
              {activeTab === 'magic' && (
                <div className="space-y-5 mt-6">
                  <div>
                    <label htmlFor="email-magic" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                          <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                        </svg>
                      </div>
                      <input
                        type="email"
                        id="email-magic"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="you@example.com"
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      />
                    </div>
                    <p className="mt-2 text-xs text-gray-500">
                      We'll email you a magic link for password-free sign in.
                    </p>
                  </div>
                  
                  <button 
                    type="button"
                    onClick={handleMagicLinkRequest}
                    disabled={sendingMagicLink || isRedirecting}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-300 text-white font-medium py-3 px-4 rounded-lg transition-all transform hover:translate-y-[-1px] flex justify-center items-center disabled:opacity-70 disabled:cursor-not-allowed disabled:translate-y-0 cursor-pointer"
                  >
                    {sendingMagicLink ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span>Sending...</span>
                      </>
                    ) : (
                      <>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        <span>Send Magic Link</span>
                      </>
                    )}
                  </button>
                </div>
              )}
              
              <div className="mt-8 text-center">
                <p className="text-sm text-gray-600">
                  Don't have an account?{" "}
                  <Link href="/auth/register" className="text-blue-600 font-medium hover:text-blue-500 transition-colors cursor-pointer">
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