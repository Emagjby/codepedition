"use client";

import Link from "next/link";
import { useState, ChangeEvent, FormEvent, useRef, useEffect } from "react";
import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";
import { register, signInWithOAuth } from './actions';
import { useSearchParams } from "next/navigation";
import { CheckCircle2, ArrowRight, AlertCircle } from "lucide-react";

// Password validation regex
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

export default function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    form: ""
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [serverError, setServerError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [registeredEmail, setRegisteredEmail] = useState("");
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [isPasswordValid, setIsPasswordValid] = useState(false);
  const [activeTab, setActiveTab] = useState<'form' | 'oauth'>('form');

  const formRef = useRef<HTMLFormElement>(null);
  const searchParams = useSearchParams();
  
  // Check for error parameter in URL
  useEffect(() => {
    const errorParam = searchParams.get('error');
    if (errorParam) {
      setServerError(errorParam);
    }
  }, [searchParams]);

  // Password validation checks
  const validatePasswordRequirements = (password: string) => {
    const hasMinLength = password.length >= 8;
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    
    return {
      hasMinLength,
      hasUppercase,
      hasLowercase,
      hasNumber,
      isValid: PASSWORD_REGEX.test(password)
    };
  };

  const passwordChecks = validatePasswordRequirements(formData.password);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear specific error when user types
    if (errors[name as keyof typeof errors]) {
      setErrors({
        ...errors,
        [name]: ""
      });
    }
    
    // Password validation feedback
    if (name === "password") {
      const validationResult = validatePasswordRequirements(value);
      setIsPasswordValid(validationResult.isValid);
    }
    
    // Clear confirm password error when either password changes
    if (name === "password" || name === "confirmPassword") {
      if (errors.confirmPassword) {
        setErrors({
          ...errors,
          confirmPassword: ""
        });
      }
    }
  };

  // Handle form submission
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    // Reset errors
    setServerError("");
    setSuccessMessage("");
    
    const newErrors = {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      form: ""
    };
    
    // Validate form
    let isValid = true;
    
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
      isValid = false;
    }
    
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
      isValid = false;
    }
    
    if (!formData.password) {
      newErrors.password = "Password is required";
      isValid = false;
    } else if (!PASSWORD_REGEX.test(formData.password)) {
      newErrors.password = "Password does not meet requirements";
      isValid = false;
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
      isValid = false;
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
      isValid = false;
    }
    
    setErrors(newErrors);
    
    if (!isValid) return;
    
    try {
      setIsSubmitting(true);
      
      // Convert form data to FormData object
      const formDataObj = new FormData();
      formDataObj.append('name', formData.name);
      formDataObj.append('email', formData.email);
      formDataObj.append('password', formData.password);
      
      // Submit the form
      const result = await register(formDataObj);
      
      if (result.success) {
        setRegisteredEmail(formData.email);
        setSuccessMessage(result.message || "Account created successfully! Please check your email to confirm your account.");
      } else {
        setServerError(result.error || "An error occurred during registration");
      }
    } catch (error: any) {
      console.error("Registration error:", error);
      setServerError(error.message || "An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Function to handle OAuth registration
  const handleOAuthRegistration = async (provider: string) => {
    try {
      setIsSubmitting(true);
      setServerError("");
      
      // Direct redirect to OAuth endpoint using window.location
      window.location.href = `/api/auth/oauth-redirect?provider=${provider}&source=register`;
    } catch (error) {
      console.error('Error during OAuth registration:', error);
      setServerError('An unexpected error occurred. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 pt-20">
      {/* Navigation */}
      <Navbar />
      
      {/* Registration Section */}
      <section className="py-16 px-6 md:px-16">
        <div className="max-w-md mx-auto">
          <div className="bg-white rounded-xl shadow-xl overflow-hidden transform transition-all">
            <div className="px-8 py-10">
              <h1 className="text-3xl font-bold text-center mb-2">Create Account</h1>
              <p className="text-gray-600 text-center mb-8">
                Join our community today
              </p>
              
              {/* Auth Tabs */}
              <div className="flex mb-8 border-b border-gray-200">
                <button 
                  onClick={() => setActiveTab('form')}
                  className={`flex-1 pb-3 text-sm font-medium transition-colors cursor-pointer ${
                    activeTab === 'form' 
                      ? 'text-blue-600 border-b-2 border-blue-600' 
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Sign Up with Email
                </button>
                <button 
                  onClick={() => setActiveTab('oauth')}
                  className={`flex-1 pb-3 text-sm font-medium transition-colors cursor-pointer ${
                    activeTab === 'oauth' 
                      ? 'text-blue-600 border-b-2 border-blue-600' 
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Social Sign Up
                </button>
              </div>
              
              {/* Status Messages */}
              {isRedirecting && (
                <div className="mb-6 p-4 bg-blue-50 border border-blue-300 text-blue-700 rounded-lg flex items-center justify-center animate-pulse">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Account created! Redirecting to verification page...</span>
                </div>
              )}
              
              {/* Success Message */}
              {successMessage && (
                <div className="mt-6 mb-6 p-4 rounded-lg bg-gradient-to-br from-green-50 to-green-100 border border-green-200">
                  <div className="flex flex-col items-center text-center space-y-3">
                    <div className="rounded-full bg-green-100 p-2">
                      <CheckCircle2 className="h-8 w-8 text-green-600" />
                    </div>
                    <h3 className="text-lg font-medium text-green-800">Registration Successful!</h3>
                    <p className="text-green-700">{successMessage}</p>
                    <Link 
                      href="/auth/login" 
                      className="mt-2 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 cursor-pointer">
                      Continue to Sign In
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </div>
                </div>
              )}
              
              {/* Server Error */}
              {serverError && (
                <div className="mt-6 mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center">
                    <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
                    <p className="text-red-700">{serverError}</p>
                  </div>
                </div>
              )}
              
              {/* Only show the form if there's no success message */}
              {!successMessage && (
                <>
                  {/* Email Form (Tab 1) */}
                  {activeTab === 'form' && (
                    <form className="space-y-5" onSubmit={handleSubmit} ref={formRef} noValidate>
                      <div className="group">
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1 group-focus-within:text-blue-600 transition-colors">Full Name</label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="John Doe"
                            className={`w-full pl-10 pr-4 py-2 border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors`}
                            disabled={isRedirecting}
                          />
                        </div>
                        {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
                      </div>
                      
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
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1 group-focus-within:text-blue-600 transition-colors">Password</label>
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
                            onFocus={() => setIsPasswordFocused(true)}
                            onBlur={() => setIsPasswordFocused(false)}
                            placeholder="••••••••"
                            className={`w-full pl-10 pr-4 py-2 border ${errors.password ? 'border-red-500' : formData.password && isPasswordValid ? 'border-green-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors`}
                            disabled={isRedirecting}
                          />
                        </div>
                        {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password}</p>}
                        
                        {/* Password requirements */}
                        {(isPasswordFocused || formData.password) && (
                          <div className="mt-2 p-3 bg-gray-50 border border-gray-200 rounded-lg">
                            <p className="text-xs font-medium text-gray-700 mb-2">Password must have:</p>
                            <ul className="space-y-1">
                              <li className="flex items-center text-xs">
                                <span className={`mr-2 inline-flex items-center justify-center w-4 h-4 rounded-full ${passwordChecks.hasMinLength ? 'bg-green-100 text-green-600' : 'bg-gray-200 text-gray-400'}`}>
                                  {passwordChecks.hasMinLength ? (
                                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                                    </svg>
                                  ) : <span>•</span>}
                                </span>
                                <span className={passwordChecks.hasMinLength ? 'text-green-700' : 'text-gray-600'}>At least 8 characters</span>
                              </li>
                              <li className="flex items-center text-xs">
                                <span className={`mr-2 inline-flex items-center justify-center w-4 h-4 rounded-full ${passwordChecks.hasUppercase ? 'bg-green-100 text-green-600' : 'bg-gray-200 text-gray-400'}`}>
                                  {passwordChecks.hasUppercase ? (
                                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                                    </svg>
                                  ) : <span>•</span>}
                                </span>
                                <span className={passwordChecks.hasUppercase ? 'text-green-700' : 'text-gray-600'}>At least one uppercase letter</span>
                              </li>
                              <li className="flex items-center text-xs">
                                <span className={`mr-2 inline-flex items-center justify-center w-4 h-4 rounded-full ${passwordChecks.hasLowercase ? 'bg-green-100 text-green-600' : 'bg-gray-200 text-gray-400'}`}>
                                  {passwordChecks.hasLowercase ? (
                                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                                    </svg>
                                  ) : <span>•</span>}
                                </span>
                                <span className={passwordChecks.hasLowercase ? 'text-green-700' : 'text-gray-600'}>At least one lowercase letter</span>
                              </li>
                              <li className="flex items-center text-xs">
                                <span className={`mr-2 inline-flex items-center justify-center w-4 h-4 rounded-full ${passwordChecks.hasNumber ? 'bg-green-100 text-green-600' : 'bg-gray-200 text-gray-400'}`}>
                                  {passwordChecks.hasNumber ? (
                                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                                    </svg>
                                  ) : <span>•</span>}
                                </span>
                                <span className={passwordChecks.hasNumber ? 'text-green-700' : 'text-gray-600'}>At least one number</span>
                              </li>
                            </ul>
                          </div>
                        )}
                      </div>
                      
                      <div className="group">
                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1 group-focus-within:text-blue-600 transition-colors">Confirm Password</label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <input
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            placeholder="••••••••"
                            className={`w-full pl-10 pr-4 py-2 border ${errors.confirmPassword ? 'border-red-500' : formData.confirmPassword && formData.password === formData.confirmPassword ? 'border-green-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors`}
                            disabled={isRedirecting}
                          />
                        </div>
                        {errors.confirmPassword && <p className="mt-1 text-sm text-red-500">{errors.confirmPassword}</p>}
                        {formData.confirmPassword && formData.password === formData.confirmPassword && (
                          <p className="mt-1 text-sm text-green-600">Passwords match</p>
                        )}
                      </div>
                      
                      <div className="flex items-start">
                        <div className="flex items-center h-5">
                          <input
                            id="terms"
                            name="terms"
                            type="checkbox"
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded transition-colors"
                          />
                        </div>
                        <div className="ml-3 text-sm">
                          <label htmlFor="terms" className="text-gray-700">
                            I agree to the <a href="#" className="text-blue-600 hover:text-blue-500">Terms of Service</a> and <a href="#" className="text-blue-600 hover:text-blue-500">Privacy Policy</a>
                          </label>
                        </div>
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
                            <span>Creating account...</span>
                          </div>
                        ) : isRedirecting ? (
                          "Redirecting..."
                        ) : (
                          "Create Account"
                        )}
                      </button>
                    </form>
                  )}
                  
                  {/* OAuth Registration (Tab 2) */}
                  {activeTab === 'oauth' && (
                    <div className="space-y-4">
                      <button
                        type="button"
                        onClick={() => handleOAuthRegistration('google')}
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
                        onClick={() => handleOAuthRegistration('github')}
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
                </>
              )}
              
              <div className="mt-8 text-center">
                <p className="text-sm text-gray-600">
                  Already have an account?{" "}
                  <Link href="/auth/login" className="text-blue-600 font-medium hover:text-blue-500 transition-colors">
                    Sign in
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