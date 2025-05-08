"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { createClient } from '@/utils/supabase/client';

export default function Navbar() {
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // Check if current page is an auth page
  const isAuthPage = pathname && pathname.startsWith('/auth/');

  // Check if the auth buttons div would be empty
  const isEmptyAuthButtons = isAuthenticated && isAuthPage;

  useEffect(() => {
    async function checkAuth() {
      try {
        const supabase = createClient();
        
        // Try to use getSession instead of getUser for client-side checks
        // This is less likely to throw errors for normal unauthenticated states
        const { data: sessionData } = await supabase.auth.getSession();
        
        if (sessionData && sessionData.session) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
        
        setIsLoading(false);
      } catch (error: any) {
        console.error('Error checking authentication:', error);
        
        // Handle specific error types
        if (error?.message?.includes('Auth session missing') || 
            error?.name === 'AuthSessionMissingError') {
          // This is normal when not logged in - don't log as error
          console.log('No auth session found - user not logged in');
        } else if (error?.message?.includes('User from sub claim in JWT does not exist')) {
          console.warn('Clearing invalid auth session');
          const supabase = createClient();
          await supabase.auth.signOut();
        }
        
        // Always ensure UI is not blocked by setting state
        setIsAuthenticated(false);
        setIsLoading(false);
      }
    }
    
    checkAuth();
  }, []);

  const handleSignOut = async () => {
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
      window.location.href = '/';
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  // Nav links component
  const NavLinks = () => (
    <div className="hidden md:flex items-center space-x-8">
      <Link href="/" className={`${pathname === '/' ? 'text-blue-600' : 'text-gray-600 hover:text-blue-600'} cursor-pointer`}>Home</Link>
      <Link href="/pricing" className={`${pathname === '/pricing' ? 'text-blue-600' : 'text-gray-600 hover:text-blue-600'} cursor-pointer`}>Pricing</Link>
      <Link href="/about" className={`${pathname === '/about' ? 'text-blue-600' : 'text-gray-600 hover:text-blue-600'} cursor-pointer`}>About us</Link>
      <Link href="/contact" className={`${pathname === '/contact' ? 'text-blue-600' : 'text-gray-600 hover:text-blue-600'} cursor-pointer`}>Contact</Link>
    </div>
  );

  // Auth buttons component
  const AuthButtons = () => (
    <div className="min-h-[40px] flex items-center justify-end">
      {!isLoading && (
        isAuthenticated && !isAuthPage ? (
          <>
            <button 
              onClick={handleSignOut} 
              className="text-gray-600 hover:text-blue-600 cursor-pointer"
            >
              Sign out
            </button>
            <Link 
              href="/dashboard" 
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md cursor-pointer ml-4"
            >
              Go to Dashboard
            </Link>
          </>
        ) : !isAuthenticated && (
          <>
            <Link 
              href="/auth/login" 
              className={`${pathname === '/auth/login' ? 'text-blue-600' : 'text-gray-600 hover:text-blue-600'} cursor-pointer`}
            >
              Log in
            </Link>
            <Link 
              href="/auth/register" 
              className={`${pathname === '/auth/register' ? 'bg-blue-700' : 'bg-blue-600 hover:bg-blue-700'} text-white px-4 py-2 rounded-md cursor-pointer ml-4`}
            >
              Sign up
            </Link>
          </>
        )
      )}
    </div>
  );

  return (
    <nav className="fixed top-0 left-0 right-0 z-10 flex items-center justify-between py-4 px-6 md:px-16 bg-white shadow-sm">
      <div className="font-bold text-xl cursor-pointer">CODEPEDITION</div>
      
      {isEmptyAuthButtons ? (
        // Swap places on auth pages when auth buttons would be empty
        <>
          <AuthButtons />
          <NavLinks />
        </>
      ) : (
        // Normal order on other pages
        <>
          <NavLinks />
          <AuthButtons />
        </>
      )}
    </nav>
  );
} 