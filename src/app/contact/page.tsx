"use client";

import Link from "next/link";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import GetStarted from "../../components/GetStarted";
import { useState, ChangeEvent, FormEvent } from "react";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  });
  
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    message: ""
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  
  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      name: "",
      email: "",
      message: ""
    };
    
    // Name validation
    if (formData.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
      isValid = false;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
      isValid = false;
    }
    
    // Message validation
    if (formData.message.trim().length < 10) {
      newErrors.message = "Message must be at least 10 characters";
      isValid = false;
    }
    
    setErrors(newErrors);
    return isValid;
  };
  
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
  };
  
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (validateForm()) {
      setIsSubmitting(true);
      
      // Get form data for submission
      const formSubmitEndpoint = "https://formsubmit.co/a4f10d1da93238d0b00e3edb6a2faacc";
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("email", formData.email);
      formDataToSend.append("message", formData.message);
      formDataToSend.append("_subject", "New contact form submission");
      formDataToSend.append("_captcha", "false");
      
      // Submit form using fetch to prevent redirect
      fetch(formSubmitEndpoint, {
        method: "POST",
        body: formDataToSend,
        headers: {
          'Accept': 'application/json'
        }
      })
      .then(response => {
        if (response.ok) {
          setSubmitSuccess(true);
        } else {
          throw new Error('Form submission failed');
        }
      })
      .catch(error => {
        console.error('Form submission error:', error);
        setErrors(prev => ({
          ...prev, 
          message: "There was an error sending your message. Please try again."
        }));
      })
      .finally(() => {
        setIsSubmitting(false);
      });
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      {/* Navigation */}
      <Navbar />
      
      {/* Contact Hero Section */}
      <section className="py-16 px-6 md:px-16">
        <div className="max-w-7xl mx-auto">
          <div className="md:flex items-center justify-between">
            <div className="md:w-1/2 mb-12 md:mb-0">
              <div className="flex justify-center">
                <div className="relative w-48 h-48">
                  <div className="grid grid-cols-4 gap-1">
                    {[...Array(16)].map((_, i) => (
                      <div 
                        key={i} 
                        className={`w-6 h-12 rounded-full ${
                          i % 3 === 0 ? 'bg-blue-500' : 
                          i % 3 === 1 ? 'bg-orange-500' : 'bg-gray-700'
                        }`}
                      ></div>
                    ))}
                  </div>
                  <div className="absolute top-1/4 right-1/4 w-8 h-14 bg-black rounded-md transform rotate-6"></div>
                </div>
              </div>
            </div>
            
            <div className="md:w-1/2">
              <h1 className="text-4xl font-bold mb-6">Contact Us</h1>
              <p className="text-gray-600 mb-8">
                Have a question or feedback? We're here to help.<br />
                Our team of developers is just a message away.
              </p>
              
              {submitSuccess ? (
                <div className="bg-green-50 border-2 border-green-400 rounded-lg p-6 text-center">
                  <div className="flex items-center justify-center mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-green-700 mb-2">Message Sent Successfully!</h3>
                  <p className="text-gray-600 mb-4">Thank you for reaching out. We'll get back to you as soon as possible.</p>
                  <div className="mt-6 pt-4 border-t border-green-200">
                    <p className="text-sm text-gray-500">
                      Need to send another message? <button 
                        className="text-blue-600 font-medium hover:underline cursor-pointer" 
                        onClick={() => window.location.reload()}
                      >
                        Refresh the page
                      </button> to start over.
                    </p>
                  </div>
                </div>
              ) : (
                <form 
                  action="https://formsubmit.co/a4f10d1da93238d0b00e3edb6a2faacc" 
                  method="POST" 
                  className="space-y-6"
                  onSubmit={handleSubmit}
                  noValidate
                >
                  {/* FormSubmit configurations */}
                  <input type="hidden" name="_subject" value="New contact form submission" />
                  <input type="hidden" name="_next" value={typeof window !== 'undefined' ? window.location.href : ''} />
                  <input type="text" name="_honey" style={{ display: 'none' }} />
                  <input type="hidden" name="_captcha" value="false" />
                  
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Full Name"
                      className={`w-full px-4 py-2 border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-blue-500 focus:border-blue-500`}
                    />
                    {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
                  </div>
                  
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
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows={5}
                      placeholder="How can we get better?"
                      className={`w-full px-4 py-2 border ${errors.message ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-blue-500 focus:border-blue-500`}
                    ></textarea>
                    {errors.message && <p className="mt-1 text-sm text-red-500">{errors.message}</p>}
                  </div>
                  
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full cursor-pointer bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-md transition-colors disabled:bg-blue-400"
                  >
                    {isSubmitting ? "Sending..." : "Send message"}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
      
      {/* Get Started Section */}
      <GetStarted 
        title="Your code expedition starts here"
        description="Join thousands of developers on their interactive learning journey with Codepedition."
        buttonText="Start your free trial"
      />
      
      {/* Footer */}
      <Footer />
    </div>
  );
} 