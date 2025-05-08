"use client";

import { ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "./Sidebar";
import { createClient } from '@/utils/supabase/client';

interface LoggedInLayoutProps {
  children: ReactNode;
}

export default function LoggedInLayout({ children }: LoggedInLayoutProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  useEffect(() => {
    async function checkAuth() {
      try {
        const supabase = createClient();
        const { data: sessionData } = await supabase.auth.getSession();
        
        if (sessionData && sessionData.session) {
          setIsAuthenticated(true);
        } else {
          // Not authenticated, redirect to login
          router.push('/auth/login');
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error('Error checking authentication:', error);
        setIsAuthenticated(false);
        setIsLoading(false);
        router.push('/auth/login');
      }
    }
    
    checkAuth();
  }, [router]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Let the redirect happen
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Desktop Sidebar */}
      <div className="hidden md:block">
        <Sidebar />
      </div>
      
      {/* Mobile Sidebar - Overlay style when open */}
      <div className={`md:hidden fixed inset-0 z-20 transition-opacity ${isMobileSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <div 
          className="absolute inset-0 bg-gray-600 opacity-75"
          onClick={() => setIsMobileSidebarOpen(false)}
        ></div>
        <div className="relative">
          <Sidebar />
        </div>
      </div>
      
      {/* Main Content */}
      <main className="flex-1 md:ml-16 p-4 md:p-8">
        {/* Mobile Header with menu button */}
        <div className="md:hidden flex items-center mb-6">
          <button
            onClick={() => setIsMobileSidebarOpen(true)}
            className="p-2 mr-3 rounded-md text-gray-600 hover:text-blue-600 hover:bg-gray-100 focus:outline-none"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <h1 className="text-xl font-bold text-blue-600">CODEPEDITION</h1>
        </div>
        
        {children}
      </main>
    </div>
  );
} 