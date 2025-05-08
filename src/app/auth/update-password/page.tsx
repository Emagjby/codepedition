"use client";

import Link from "next/link";
import { useState, ChangeEvent, FormEvent, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";
import { createClient } from '@/utils/supabase/client';
import { AlertTriangle, AlertCircle, ArrowRight, CheckCircle2, EyeIcon, EyeOffIcon } from 'lucide-react';

export default function UpdatePassword() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: ""
  });
  
  const [errors, setErrors] = useState({
    password: "",
    confirmPassword: ""
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [serverError, setServerError] = useState("");
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Check authentication on component mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const supabase = createClient();
        const { data: { session } } = await supabase.auth.getSession();
        setIsAuthenticated(!!session);
      } catch (error) {
        console.error("Authentication check failed:", error);
        setIsAuthenticated(false);
      }
    };
    
    checkAuth();
  }, []);
  
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
      isValid: hasMinLength && hasUppercase && hasLowercase && hasNumber
    };
  };
  
  const passwordChecks = validatePasswordRequirements(formData.password);
  
  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      password: "",
      confirmPassword: ""
    };
    
    // Password validation
    if (!formData.password) {
      newErrors.password = "Password is required";
      isValid = false;
    } else if (!passwordChecks.isValid) {
      newErrors.password = "Password does not meet requirements";
      isValid = false;
    }
    
    // Confirm password validation
    if (formData.confirmPassword !== formData.password) {
      newErrors.confirmPassword = "Passwords do not match";
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
    
    // Clear server error when typing
    if (serverError) {
      setServerError("");
    }
  };
  
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      setServerError("You must be logged in to update your password");
      return;
    }
    
    if (validateForm()) {
      setIsSubmitting(true);
      
      try {
        const supabase = createClient();
        
        // Update the user's password
        const { data, error } = await supabase.auth.updateUser({
          password: formData.password
        });
        
        if (error) {
          console.error('Error updating password:', error);
          setServerError(error.message);
          setIsSubmitting(false);
          return;
        }
        
        console.log('Password updated successfully:', data);
        setIsSubmitting(false);
        setIsSubmitted(true);
        
        // Redirect to dashboard after 3 seconds since user is already authenticated
        setTimeout(() => {
          router.push('/dashboard');
        }, 3000);
      } catch (err) {
        console.error('Unexpected error updating password:', err);
        setServerError('An unexpected error occurred. Please try again.');
        setIsSubmitting(false);
      }
    }
  };
  
  // Loading state
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 pt-20">
        <Navbar />
        <section className="py-16 px-6 md:px-16">
          <div className="max-w-md mx-auto">
            <div className="bg-white rounded-xl shadow-xl overflow-hidden p-8">
              <h1 className="text-3xl font-bold text-center mb-6">Update Password</h1>
              <div className="flex justify-center py-12">
                <svg className="animate-spin h-10 w-10 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>
              <p className="text-center text-gray-600">Checking authentication status...</p>
            </div>
          </div>
        </section>
        <Footer />
      </div>
    );
  }
  
  // Unauthorized state 
  if (isAuthenticated === false) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 pt-20">
        <Navbar />
        <section className="py-16 px-6 md:px-16">
          <div className="max-w-md mx-auto">
            <div className="bg-white rounded-xl shadow-xl overflow-hidden">
              <div className="px-8 py-10">
                <h1 className="text-3xl font-bold text-center mb-6">Update Password</h1>
                <div className="overflow-hidden bg-gradient-to-r from-red-50 to-orange-50 rounded-lg shadow-sm border border-red-200">
                  <div className="bg-white bg-opacity-90 p-6">
                    <div className="flex flex-col items-center justify-center">
                      <div className="h-16 w-16 rounded-full bg-red-100 flex items-center justify-center mb-4">
                        <AlertTriangle className="h-10 w-10 text-red-600" />
                      </div>
                      <h3 className="text-xl font-semibold text-center text-gray-800 mb-2">Authentication Required</h3>
                      <p className="text-gray-600 text-center mb-8">
                        You must be logged in to update your password.
                      </p>
                      <div className="space-y-4 w-full">
                        <Link 
                          href="/auth/login" 
                          className="inline-flex items-center justify-center w-full px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors focus:outline-none focus:ring-4 focus:ring-blue-300 cursor-pointer"
                        >
                          <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                          </svg>
                          Go to Login
                        </Link>
                        <Link
                          href="/"
                          className="inline-flex items-center justify-center w-full px-5 py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium rounded-lg transition-colors focus:outline-none focus:ring-4 focus:ring-gray-300 cursor-pointer"
                        >
                          <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                          </svg>
                          Return to Home
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <Footer />
      </div>
    );
  }
  
  // Authorized state
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 pt-20">
      {/* Navigation */}
      <Navbar />
      
      {/* Update Password Section */}
      <section className="py-16 px-6 md:px-16">
        <div className="max-w-md mx-auto">
          <div className="bg-white rounded-xl shadow-xl overflow-hidden transform transition-all">
            <div className="px-8 py-10">
              <h1 className="text-3xl font-bold text-center mb-2">Update Password</h1>
              
              {isSubmitted ? (
                <div className="mt-6 overflow-hidden bg-gradient-to-r from-green-50 to-teal-50 rounded-lg shadow-sm border border-green-200">
                  <div className="bg-white bg-opacity-80 p-5">
                    <div className="flex items-center justify-center mb-4">
                      <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                        <svg className="h-7 w-7 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold text-center text-gray-800 mb-2">Password Updated Successfully!</h3>
                    <p className="text-gray-600 text-center mb-4">
                      Your password has been updated successfully. You will be redirected to the dashboard shortly.
                    </p>
                    <div className="flex items-center justify-center mt-6">
                      <div className="h-1 w-full max-w-xs bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-full bg-green-500 rounded-full animate-pulse"></div>
                      </div>
                    </div>
                    <div className="mt-6 pt-4 border-t border-green-100 text-center">
                      <Link href="/dashboard" className="inline-flex items-center justify-center px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors focus:outline-none focus:ring-4 focus:ring-green-300 cursor-pointer">
                        <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                        Go to Dashboard
                      </Link>
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  <p className="text-gray-600 text-center mb-6">
                    Please create a new secure password for your account.
                  </p>
                  
                  {/* Success Message */}
                  {serverError && (
                    <div className="mt-6 mb-6 p-4 rounded-lg bg-red-50 border border-red-200">
                      <div className="flex">
                        <div className="flex-shrink-0">
                          <AlertCircle className="h-5 w-5 text-red-400" />
                        </div>
                        <div className="ml-3">
                          <h3 className="text-sm font-medium text-red-800">Error</h3>
                          <p className="text-sm text-red-700">{serverError}</p>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <form className="space-y-6 mt-6" onSubmit={handleSubmit} noValidate>
                    <div className="group">
                      <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1 group-focus-within:text-blue-600 transition-colors">New Password</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <svg className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <input
                          type={showPassword ? "text" : "password"}
                          id="password"
                          name="password"
                          value={formData.password}
                          onChange={handleChange}
                          onFocus={() => setIsPasswordFocused(true)}
                          onBlur={() => setIsPasswordFocused(false)}
                          placeholder="••••••••"
                          className={`w-full pl-10 pr-4 py-2 border ${errors.password ? 'border-red-500' : formData.password && passwordChecks.isValid ? 'border-green-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors`}
                        />
                        <button
                          type="button"
                          className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeOffIcon className="h-5 w-5 text-gray-400" />
                          ) : (
                            <EyeIcon className="h-5 w-5 text-gray-400" />
                          )}
                        </button>
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
                      <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1 group-focus-within:text-blue-600 transition-colors">Confirm New Password</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <svg className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <input
                          type={showConfirmPassword ? "text" : "password"}
                          id="confirmPassword"
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          placeholder="••••••••"
                          className={`w-full pl-10 pr-4 py-2 border ${errors.confirmPassword ? 'border-red-500' : formData.confirmPassword && formData.password === formData.confirmPassword ? 'border-green-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors`}
                        />
                        <button
                          type="button"
                          className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                          {showConfirmPassword ? (
                            <EyeOffIcon className="h-5 w-5 text-gray-400" />
                          ) : (
                            <EyeIcon className="h-5 w-5 text-gray-400" />
                          )}
                        </button>
                      </div>
                      {errors.confirmPassword && <p className="mt-1 text-sm text-red-500">{errors.confirmPassword}</p>}
                      {formData.confirmPassword && formData.password === formData.confirmPassword && (
                        <p className="mt-1 text-sm text-green-600">Passwords match</p>
                      )}
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
                          <span>Updating Password...</span>
                        </div>
                      ) : (
                        "Update Password"
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