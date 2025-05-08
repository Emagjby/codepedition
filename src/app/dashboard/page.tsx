"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { createClient } from '@/utils/supabase/client';

type UserProfile = {
  username: string;
  email: string;
  fullName: string;
  bio: string | null;
  xp: number;
  level: number;
  streakCount: number;
  completedCourses: number;
  skillsAchieved: number;
  languagesPracticed: number;
  projectsCompleted: number;
}

export default function Dashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [error, setError] = useState("");
  
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setIsLoading(true);
        
        const supabase = createClient();
        
        // Get the authenticated user
        const { data, error: authError } = await supabase.auth.getUser();
        
        if (authError) {
          console.error('Auth error:', authError);
          setError('Please log in to view your dashboard');
          setIsLoading(false);
          return;
        }
        
        if (!data.user) {
          setError('Please log in to view your dashboard');
          setIsLoading(false);
          return;
        }
        
        // Get the user's profile from the public.users table
        const { data: profiles, error: profileError } = await supabase
          .from('users')
          .select('*')
          .eq('email', data.user.email)
          .limit(1);
        
        if (profileError) {
          console.error('Profile error:', profileError);
          setError('Error loading profile data');
          setIsLoading(false);
          return;
        }
        
        if (!profiles || profiles.length === 0) {
          setError('User profile not found');
          setIsLoading(false);
          return;
        }
        
        const profile = profiles[0];
        
        // Format the user data
        const displayUsername = profile.username?.startsWith('user_') 
          ? profile.email.split('@')[0] 
          : profile.username;

        // In a real app, these would come from the database
        // For now, using mock data with some real user data
        setUser({
          username: displayUsername || 'User',
          email: profile.email,
          fullName: profile.email.split('@')[0] || 'User',
          bio: profile.bio || null,
          xp: profile.xp || 50,
          level: profile.level || 3,
          streakCount: profile.streak_count || 7,
          completedCourses: 5,
          skillsAchieved: 12,
          languagesPracticed: 3,
          projectsCompleted: 2
        });
        
        setIsLoading(false);
      } catch (err) {
        console.error('Error fetching user data:', err);
        setError('Something went wrong fetching your data');
        setIsLoading(false);
      }
    };
    
    fetchUserData();
  }, []);
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
          <p className="mt-4 text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center max-w-md p-6 bg-white rounded-lg shadow-md">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-red-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Error Loading Dashboard</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <Link href="/auth/login" className="text-blue-600 hover:underline font-medium">
            Return to Login
          </Link>
        </div>
      </div>
    );
  }
  
  if (!user) {
    return null;
  }
  
  // Calculate remaining XP to next level (for demo purposes)
  const nextLevelXP = user.level * 100;
  const currentLevelXP = (user.level - 1) * 100;
  const xpForNextLevel = nextLevelXP - currentLevelXP;
  const userCurrentLevelXP = user.xp - currentLevelXP;
  const xpProgressPercent = Math.round((userCurrentLevelXP / xpForNextLevel) * 100);
  
  // Courses data (mock)
  const recentCourses = [
    { 
      id: 1, 
      title: "JavaScript Fundamentals",
      progress: 75,
      image: "https://img.icons8.com/color/96/000000/javascript--v1.png" 
    },
    { 
      id: 2, 
      title: "React for Beginners",
      progress: 40,
      image: "https://img.icons8.com/color/96/000000/react-native.png"
    },
    { 
      id: 3, 
      title: "Intro to TypeScript",
      progress: 10,
      image: "https://img.icons8.com/color/96/000000/typescript.png"
    }
  ];
  
  return (
    <div className="space-y-8">
      {/* Header with greeting and date */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Hello, {user.fullName}!
          </h1>
          <p className="text-gray-600 mt-1">
            {new Date().toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </div>
        
        <div className="mt-4 md:mt-0">
          <Link 
            href="/learning" 
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="-ml-1 mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            Continue Learning
          </Link>
        </div>
      </div>
      
      {/* Main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main column - Learning content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Daily Quest Card */}
          <div className="bg-gradient-to-br from-indigo-500 to-blue-600 rounded-xl shadow-md overflow-hidden">
            <div className="p-5 md:p-6 text-white">
              <div className="flex items-start">
                <div className="flex-1">
                  <h2 className="text-xl font-bold mb-2">Daily Quest</h2>
                  <p className="text-indigo-100 mb-4">Complete a lesson today to keep your streak going!</p>
                  <Link href="/learning" className="inline-flex items-center px-4 py-2 bg-white text-blue-600 rounded-md font-medium hover:bg-blue-50 transition-colors">
                    Start Lesson
                    <svg xmlns="http://www.w3.org/2000/svg" className="ml-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </Link>
                </div>
                <div className="hidden md:block">
                  <div className="ml-4 w-16 h-16 bg-blue-400 bg-opacity-30 rounded-full flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.933 12.8a1 1 0 000-1.6L6.6 7.2A1 1 0 005 8v8a1 1 0 001.6.8l5.333-4z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.933 12.8a1 1 0 000-1.6l-5.333-4A1 1 0 0013 8v8a1 1 0 001.6.8l5.333-4z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Learning Roadmap */}
          <div className="bg-white rounded-xl shadow-sm p-5 md:p-6">
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-lg font-bold text-gray-800">Your Learning Roadmap</h2>
              <Link href="/roadmap" className="text-sm font-medium text-blue-600 hover:text-blue-800">
                View Details
              </Link>
            </div>
            
            <div className="relative">
              <div className="absolute left-5 top-0 bottom-0 w-px bg-blue-200"></div>
              
              <div className="space-y-8 relative">
                <div className="flex">
                  <div className="flex-shrink-0 mr-4">
                    <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">HTML & CSS Basics</h3>
                    <p className="text-xs text-gray-500 mt-1">Completed 3 weeks ago</p>
                  </div>
                </div>
                
                <div className="flex">
                  <div className="flex-shrink-0 mr-4">
                    <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">JavaScript Fundamentals</h3>
                    <p className="text-xs text-gray-500 mt-1">In progress - 75% complete</p>
                  </div>
                </div>
                
                <div className="flex">
                  <div className="flex-shrink-0 mr-4">
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">React Essentials</h3>
                    <p className="text-xs text-gray-500 mt-1">Locked - Complete JavaScript first</p>
                  </div>
                </div>
                
                <div className="flex">
                  <div className="flex-shrink-0 mr-4">
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">Advanced React & State Management</h3>
                    <p className="text-xs text-gray-500 mt-1">Locked - Complete React Essentials first</p>
                  </div>
                </div>
                
                <div className="flex">
                  <div className="flex-shrink-0 mr-4">
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">Full-Stack Development</h3>
                    <p className="text-xs text-gray-500 mt-1">Locked - Master frontend skills first</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Side column - Stats */}
        <div className="space-y-6">
          {/* User Stats Cards */}
          <div className="bg-white rounded-xl shadow-sm p-5 md:p-6">
            <h2 className="text-lg font-bold text-gray-800 mb-5">Your Progress</h2>
            
            {/* Level & XP */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">Current Level</div>
                    <div className="text-lg font-bold text-gray-800">{user.level}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-gray-500">XP</div>
                  <div className="text-lg font-bold text-gray-800">{user.xp}</div>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className="bg-blue-600 h-2.5 rounded-full"
                  style={{ width: `${xpProgressPercent}%` }}
                ></div>
              </div>
              <div className="flex justify-between mt-1">
                <span className="text-xs text-gray-500">{userCurrentLevelXP} / {xpForNextLevel} XP</span>
                <span className="text-xs text-blue-600 font-medium">{xpForNextLevel - userCurrentLevelXP} XP to Level {user.level + 1}</span>
              </div>
            </div>
            
            {/* Streak */}
            <div className="mb-6 pb-6 border-b border-gray-200">
              <div className="flex items-center mb-3">
                <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" />
                  </svg>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-900">{user.streakCount} Day Streak</div>
                  <div className="text-xs text-gray-500">Keep it going!</div>
                </div>
              </div>
              <div className="grid grid-cols-7 gap-1">
                {[...Array(7)].map((_, i) => (
                  <div 
                    key={i} 
                    className={`h-2 rounded-md ${i < user.streakCount % 7 ? 'bg-orange-500' : 'bg-gray-200'}`}
                  ></div>
                ))}
              </div>
            </div>
            
            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="text-xs text-gray-500">Modules Completed</div>
                <div className="mt-1 flex items-center">
                  <span className="text-xl font-bold text-gray-800 mr-2">{user.completedCourses}</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="text-xs text-gray-500">Skills Mastered</div>
                <div className="mt-1 flex items-center">
                  <span className="text-xl font-bold text-gray-800 mr-2">{user.skillsAchieved}</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                  </svg>
                </div>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="text-xs text-gray-500">Tech Stacks</div>
                <div className="mt-1 flex items-center">
                  <span className="text-xl font-bold text-gray-800 mr-2">{user.languagesPracticed}</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                  </svg>
                </div>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="text-xs text-gray-500">Projects Finished</div>
                <div className="mt-1 flex items-center">
                  <span className="text-xl font-bold text-gray-800 mr-2">{user.projectsCompleted}</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
          
          {/* Community Card */}
          <div className="bg-white rounded-xl shadow-sm p-5 md:p-6">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Community</h2>
            <p className="text-sm text-gray-600 mb-4">Connect with fellow learners and share your progress!</p>
            <Link href="/community" className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800">
              Join Community
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 