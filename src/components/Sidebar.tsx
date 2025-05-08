"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { createClient } from '@/utils/supabase/client';

export default function Sidebar() {
  const pathname = usePathname();
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [tooltipContent, setTooltipContent] = useState<string>('');
  const tooltipRef = useRef<HTMLDivElement>(null);

  const handleSignOut = async () => {
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
      window.location.href = '/';
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  // Define navigation items with icons and categories
  const navigationItems = [
    {
      category: "Core",
      items: [
        {
          id: "dashboard",
          name: "Dashboard",
          href: "/dashboard",
          icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
          )
        },
        {
          id: "current-roadmap",
          name: "Current Roadmap",
          href: "/roadmap",
          icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          )
        },
        {
          id: "explore-roadmaps",
          name: "Explore Roadmaps",
          href: "/explore",
          icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
          )
        }
      ]
    },
    {
      category: "Practice",
      items: [
        {
          id: "challenges",
          name: "Challenges",
          href: "/challenges",
          icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          )
        },
        {
          id: "projects",
          name: "Projects",
          href: "/projects",
          icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          )
        }
      ]
    },
    {
      category: "Community",
      items: [
        {
          id: "forum",
          name: "Forum",
          href: "/forum",
          icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
            </svg>
          )
        },
        {
          id: "leaderboard",
          name: "Leaderboard",
          href: "/leaderboard",
          icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          )
        }
      ]
    }
  ];

  // Function to update tooltip position
  const updateTooltipPosition = (element: HTMLElement) => {
    const rect = element.getBoundingClientRect();
    // For settings and logout, we need to account for their container
    const isSettingsOrLogout = element.getAttribute('data-tooltip-id') === 'settings' || 
                             element.getAttribute('data-tooltip-id') === 'logout';
    
    setTooltipPosition({
      x: isSettingsOrLogout ? rect.right + 20 : rect.right + 8,
      y: rect.top + (rect.height / 2)
    });
  };

  // Function to show tooltip
  const showTooltip = (id: string, event: React.MouseEvent<HTMLElement>) => {
    setActiveTooltip(id);
    updateTooltipPosition(event.currentTarget);
    
    // Set tooltip content based on id
    if (id === 'profile') {
      setTooltipContent('Your Profile');
    } else if (id === 'settings') {
      setTooltipContent('Settings');
    } else if (id === 'logout') {
      setTooltipContent('Logout');
    } else {
      // Find content from navigation items
      const item = navigationItems
        .flatMap(section => section.items)
        .find(item => item.id === id);
      if (item) {
        setTooltipContent(item.name);
      }
    }
  };

  // Function to hide tooltip
  const hideTooltip = () => {
    setActiveTooltip(null);
  };

  // Update tooltip position on window resize
  useEffect(() => {
    const handleResize = () => {
      if (activeTooltip) {
        const element = document.querySelector(`[data-tooltip-id="${activeTooltip}"]`);
        if (element) {
          updateTooltipPosition(element as HTMLElement);
        }
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [activeTooltip]);

  return (
    <>
      <aside className="fixed left-0 top-0 h-full w-16 bg-white shadow-sm z-10">
        <div className="flex flex-col h-full">
          {/* User Profile */}
          <div
            className="py-4 flex justify-center"
            onMouseEnter={(e) => showTooltip('profile', e)}
            onMouseLeave={hideTooltip}
            data-tooltip-id="profile"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xs font-medium">
            </div>
          </div>
          
          <div className="mt-2 mb-2 mx-3 h-px bg-gray-100"></div>
          
          {/* Navigation Links */}
          <nav className="flex-1 overflow-y-auto py-2">
            {navigationItems.map((section, sectionIndex) => (
              <div key={sectionIndex} className="mb-6">
                {/* Category divider */}
                {sectionIndex > 0 && (
                  <div className="mx-3 mb-2 h-px bg-gray-100"></div>
                )}
                
                <ul className="space-y-4">
                  {section.items.map((item) => (
                    <li 
                      key={item.id} 
                      className="px-3"
                      onMouseEnter={(e) => showTooltip(item.id, e)}
                      onMouseLeave={hideTooltip}
                      data-tooltip-id={item.id}
                    >
                      <Link 
                        href={item.href} 
                        className={`flex justify-center items-center h-10 rounded-md ${
                          pathname === item.href 
                            ? 'bg-blue-50 text-blue-600' 
                            : 'text-gray-600 hover:bg-gray-50 hover:text-blue-600'
                        }`}
                      >
                        <span>{item.icon}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
          
          {/* Settings and Logout */}
          <div className="p-3 mt-auto">
            <div className="mx-3 mb-3 h-px bg-gray-100"></div>
            <ul className="space-y-4">
              <li 
                onMouseEnter={(e) => showTooltip('settings', e)}
                onMouseLeave={hideTooltip}
                data-tooltip-id="settings"
              >
                <Link 
                  href="/settings" 
                  className="flex justify-center items-center h-10 rounded-md text-gray-600 hover:bg-gray-50 hover:text-blue-600"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </Link>
              </li>
              <li 
                onMouseEnter={(e) => showTooltip('logout', e)}
                onMouseLeave={hideTooltip}
                data-tooltip-id="logout"
              >
                <button 
                  onClick={handleSignOut}
                  className="flex justify-center items-center w-full h-10 rounded-md text-gray-600 hover:bg-gray-50 hover:text-blue-600 cursor-pointer"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                </button>
              </li>
            </ul>
          </div>
        </div>
      </aside>

      {/* Single tooltip element that moves based on hover */}
      <div 
        ref={tooltipRef}
        className={`fixed bg-gray-800 text-white px-2 py-1 rounded text-xs whitespace-nowrap z-50 transition-opacity duration-200 ${
          activeTooltip ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        style={{ 
          left: `${tooltipPosition.x}px`,
          top: `${tooltipPosition.y}px`,
          transform: 'translateY(-50%)'
        }}
      >
        {tooltipContent}
      </div>
    </>
  );
} 