"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

// Mock user data for testing
const mockUser = {
  username: "testuser123",
  email: "test@example.com",
  joinDate: new Date().toLocaleDateString(),
  lastLogin: new Date().toLocaleDateString()
};

export default function Dashboard() {
  const [user, setUser] = useState(mockUser);
  
  // In a real implementation, you would fetch user data from your auth provider
  useEffect(() => {
    // Simulate fetching user data
    // In production, replace this with actual API call to get user data
    const fetchUserData = async () => {
      // Simulating API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      setUser(mockUser);
    };
    
    fetchUserData();
  }, []);
  
  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      {/* Navigation */}
      <Navbar />
      
      {/* Dashboard Content */}
      <section className="py-16 px-6 md:px-16">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
          
          <div className="grid md:grid-cols-3 gap-6">
            {/* User Profile Card */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="bg-blue-600 px-6 py-4">
                <h2 className="text-white text-lg font-medium">User Profile</h2>
              </div>
              <div className="p-6">
                <div className="flex items-center justify-center mb-6">
                  <div className="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center">
                    <span className="text-blue-600 font-bold text-2xl">
                      {user.username.substring(0, 2).toUpperCase()}
                    </span>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <label className="block text-gray-500 text-sm">Username</label>
                    <p className="font-medium">{user.username}</p>
                  </div>
                  
                  <div>
                    <label className="block text-gray-500 text-sm">Email</label>
                    <p className="font-medium">{user.email}</p>
                  </div>
                  
                  <div>
                    <label className="block text-gray-500 text-sm">Joined</label>
                    <p className="font-medium">{user.joinDate}</p>
                  </div>
                  
                  <div>
                    <label className="block text-gray-500 text-sm">Last Login</label>
                    <p className="font-medium">{user.lastLogin}</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Activity Summary Card */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden md:col-span-2">
              <div className="bg-blue-600 px-6 py-4">
                <h2 className="text-white text-lg font-medium">Activity Summary</h2>
              </div>
              <div className="p-6">
                <p className="text-gray-600 mb-4">Welcome to your dashboard! This is a demo page for testing purposes.</p>
                
                <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-blue-800">Testing Information</h3>
                      <div className="mt-2 text-sm text-blue-700">
                        <p>
                          This dashboard is currently displaying mock data for <strong>{user.username}</strong> with email <strong>{user.email}</strong>.
                          In production, this would be connected to your authentication system.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6">
                  <Link href="/auth/login" className="text-blue-600 hover:underline font-medium">
                    ← Back to login page
                  </Link>
                </div>
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