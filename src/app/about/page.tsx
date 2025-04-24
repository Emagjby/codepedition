"use client";

import Link from "next/link";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import GetStarted from "../../components/GetStarted";

export default function AboutUs() {
  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      {/* Navigation */}
      <Navbar />
      
      {/* About Us Hero Section */}
      <section className="py-16 px-6 md:px-16">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-6">About us</h1>
          <p className="text-gray-600 max-w-2xl mx-auto mb-12">
            Codepedition is an interactive learning platform that transforms traditional coding roadmaps into a gamified expedition. Through quest-style challenges, real-world projects, and visual progress tracking, we help developers of all levels stay motivated, focused, and engaged.
          </p>
        </div>

        {/* 3D Figures Image Section */}
        <div className="max-w-2xl mx-auto my-16 flex justify-center">
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
      </section>
      
      {/* Our Mission Section */}
      <section className="py-16 px-6 md:px-16 bg-white">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Our mission</h2>
          <p className="text-gray-600 max-w-2xl mx-auto mb-8">
            To create a gamified coding education platform that actually keeps people learning — and loving it — while helping them build portfolio-ready skills and confidence for the real world. Unlike traditional course platforms or linear tutorials, we gamify learning with levels, XP, challenges, and quests while offering a clear, interactive roadmap.
          </p>
        </div>
      </section>
      
      {/* Who It's For Section */}
      <section className="py-16 px-6 md:px-16 bg-gray-50">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Who Codepedition is for</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 mt-12 gap-6 mx-auto">
            <div className="bg-white p-6 rounded-lg shadow-md border border-transparent hover:border-blue-500 transition-all duration-300 hover:shadow-lg group">
              <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3 group-hover:text-blue-600 transition-colors">Aspiring developers</h3>
              <p className="text-gray-600">Starting their journey into web development or software engineering</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md border border-transparent hover:border-blue-500 transition-all duration-300 hover:shadow-lg group">
              <div className="w-16 h-16 mx-auto mb-4 bg-orange-100 rounded-full flex items-center justify-center group-hover:bg-orange-200 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3 group-hover:text-orange-600 transition-colors">Self-taught learners</h3>
              <p className="text-gray-600">Looking for clearer structure and more motivation than traditional tutorials</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md border border-transparent hover:border-blue-500 transition-all duration-300 hover:shadow-lg group">
              <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center group-hover:bg-green-200 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3 group-hover:text-green-600 transition-colors">Bootcamp grads</h3>
              <p className="text-gray-600">Who want to reinforce skills and build real-world projects</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md border border-transparent hover:border-blue-500 transition-all duration-300 hover:shadow-lg group">
              <div className="w-16 h-16 mx-auto mb-4 bg-purple-100 rounded-full flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3 group-hover:text-purple-600 transition-colors">Gamified learning fans</h3>
              <p className="text-gray-600">Who thrive on progress, goals, and XP systems</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Vision Section with Image */}
      <section className="py-16 px-6 md:px-16">
        <div className="max-w-7xl mx-auto">
          <div className="md:flex items-center space-y-12 md:space-y-0">
            <div className="md:w-1/2 md:pr-12">
              <h2 className="text-3xl font-bold mb-6">Why we're different</h2>
              <ul className="text-gray-600 mb-8 space-y-4">
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">✓</span>
                  <span>We <strong>gamify learning</strong> with levels, XP, challenges, and quests</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">✓</span>
                  <span>We offer a <strong>clear roadmap</strong> that's fully interactive, trackable, and personalized</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">✓</span>
                  <span>You don't just consume content—you <strong>practice, build, and level up</strong> with real-world code tasks</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">✓</span>
                  <span>Built for <strong>solo learners</strong> who want a motivating experience that still feels structured</span>
                </li>
              </ul>
            </div>
            <div className="md:w-1/2 flex justify-center">
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
        </div>
      </section>
      
      {/* Core Features Section */}
      <section className="py-16 px-6 md:px-16 bg-white">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Core Features</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-3">🗺️ Roadmap Interface</h3>
              <p className="text-gray-600">Visual roadmaps with main paths (Frontend, Backend, Fullstack) and side quests</p>
            </div>
            <div className="p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-3">🧠 Interactive Lessons</h3>
              <p className="text-gray-600">Modular content at each node with automatic progress tracking</p>
            </div>
            <div className="p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-3">🎮 Gamified Progression</h3>
              <p className="text-gray-600">XP for completed content, levels, and visual indicators of progress</p>
            </div>
            <div className="p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-3">⚔️ Challenges & Projects</h3>
              <p className="text-gray-600">Topic-based code challenges and guided project steps</p>
            </div>
            <div className="p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-3">🌙 Dark UI Theme</h3>
              <p className="text-gray-600">Developer-friendly theme optimized for long coding sessions</p>
            </div>
            <div className="p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-3">👤 Account System</h3>
              <p className="text-gray-600">Secure authentication with saved progress and user profiles</p>
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