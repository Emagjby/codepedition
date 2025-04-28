"use client";

import Link from "next/link";
import { useState, ChangeEvent, FormEvent, useRef } from "react";
import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";
import { signup } from "./actions";
import { useRouter } from "next/navigation";

export default function Register() {
  const formRef = useRef<HTMLFormElement>(null);
  const router = useRouter();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: ""
  });
  
  const [errors, setErrors] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    terms: ""
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [serverError, setServerError] = useState("");
  
  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      email: "",
      password: "",
      confirmPassword: "",
      terms: ""
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
    } else if (!/[A-Z]/.test(formData.password)) {
      newErrors.password = "Password must contain at least one uppercase letter";
      isValid = false;
    } else if (!/[a-z]/.test(formData.password)) {
      newErrors.password = "Password must contain at least one lowercase letter";
      isValid = false;
    } else if (!/[0-9]/.test(formData.password)) {
      newErrors.password = "Password must contain at least one number";
      isValid = false;
    }
    
    // Confirm password validation
    if (formData.confirmPassword !== formData.password) {
      newErrors.confirmPassword = "Passwords do not match";
      isValid = false;
    }
    
    // Terms validation
    const terms = document.getElementById('terms') as HTMLInputElement;
    if (!terms.checked) {
      newErrors.terms = "You must agree to the Terms and Privacy Policy";
      isValid = false;
    }
    
    setErrors(newErrors);
    return isValid;
  };
  
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox') {
      // Clear checkbox error when checked
      if (checked && errors[name as keyof typeof errors]) {
        setErrors(prev => ({
          ...prev,
          [name]: ""
        }));
      }
    } else {
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
    }
    
    // Clear server error when user makes changes
    if (serverError) {
      setServerError("");
    }
  };
  
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (validateForm()) {
      setIsSubmitting(true);
      setServerError("");
      
      try {
        const formDataObj = new FormData();

        formDataObj.append('email', formData.email);
        formDataObj.append('password', formData.password);
        formDataObj.append('confirmPassword', formData.confirmPassword);

        const terms = document.getElementById('terms') as HTMLInputElement;
        formDataObj.append('terms', terms.checked ? 'true' : 'false');

        const result = await signup(formDataObj);
        
        // Check if the result is a success object
        if (result && typeof result === 'object' && 'success' in result) {
          if (result.redirectTo) {
            // If there's a redirect path, go there directly
            router.push(result.redirectTo);
            return;
          }
          
          // Otherwise show the success message
          setIsSubmitting(false);
          setIsSubmitted(true);
          return;
        }
        
        // Check if the result contains an error message
        if (result && typeof result === 'string') {
          if (result.includes('already registered')) {
            setServerError("This email is already registered. Try logging in instead.");
          } else {
            setServerError(result);
          }
        }
        setIsSubmitting(false);
      } catch (error) {
        setIsSubmitting(false);
        console.error('Signup failed', error);
        setServerError("Something went wrong. Please try again later.");
      }
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      {/* Navigation */}
      <Navbar />
      
      {/* Register Section */}
      <section className="py-16 px-6 md:px-16">
        <div className="max-w-md mx-auto">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="px-8 py-10">
              <h1 className="text-3xl font-bold text-center mb-6">Create Account</h1>
              
              {isSubmitted ? (
                <div className="bg-green-50 border-2 border-green-400 rounded-lg p-6 text-center">
                  <div className="flex items-center justify-center mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-green-700 mb-2">Registration Successful!</h3>
                  <p className="text-gray-600 mb-4">
                    A confirmation email has been sent to <span className="font-medium">{formData.email}</span>. Please check your inbox and click the verification link to activate your account.
                  </p>
                  <div className="mt-6 pt-4 border-t border-green-200">
                    <p className="text-sm text-gray-500">
                      Already verified? <Link href="/auth/login" className="text-blue-600 font-medium hover:underline cursor-pointer">Log in</Link>
                    </p>
                  </div>
                </div>
              ) : (
                <>
                  <p className="text-gray-600 text-center mb-8">
                    Join our community of learners today.
                  </p>
                  
                  {serverError && (
                    <div className="mb-6 p-3 bg-red-50 border border-red-300 text-red-700 rounded-md">
                      {serverError}
                    </div>
                  )}
                  
                  <form className="space-y-6" onSubmit={handleSubmit} ref={formRef} noValidate>                    
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
                      />
                      {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password}</p>}
                    </div>
                    
                    <div>
                      <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                      <input
                        type="password"
                        id="confirmPassword"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        placeholder="Confirm Password"
                        className={`w-full px-4 py-2 border ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-blue-500 focus:border-blue-500`}
                      />
                      {errors.confirmPassword && <p className="mt-1 text-sm text-red-500">{errors.confirmPassword}</p>}
                    </div>
                    
                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id="terms"
                          name="terms"
                          type="checkbox"
                          onChange={handleChange}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          required
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="terms" className="text-gray-700">
                          I agree to the <Link href="/terms" className="text-blue-600 hover:underline">Terms</Link> and <Link href="/privacy" className="text-blue-600 hover:underline">Privacy Policy</Link>
                        </label>
                        {errors.terms && (
                          <p className="mt-1 text-sm text-red-500">{errors.terms}</p>
                        )}
                      </div>
                    </div>
                    
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full cursor-pointer bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-md transition-colors disabled:bg-blue-400"
                    >
                      {isSubmitting ? "Creating account..." : "Create account"}
                    </button>
                  </form>
                  
                  <div className="mt-6 text-center">
                    <p className="text-sm text-gray-600">
                      Already have an account?{" "}
                      <Link href="/auth/login" className="text-blue-600 font-medium hover:underline cursor-pointer">
                        Sign in
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