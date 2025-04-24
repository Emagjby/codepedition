"use client";

import Link from "next/link";
import Image from "next/image";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import PathCard from "../components/PathCard";
import Testimonial from "../components/Testimonial";
import GetStarted from "../components/GetStarted";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      {/* Navigation */}
      <Navbar />
      
      {/* Hero Section */}
      <section className=" py-16 px-6 md:px-16 flex flex-col md:flex-row items-center">
        <div className="md:w-1/2 space-y-6">
          <p className="uppercase text-gray-500 tracking-wider text-sm">INTERACTIVE LEARNING PLATFORM</p>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
            Your Code Expedition Starts Here.
          </h1>
          <p className="text-gray-600">
            An interactive coding platform that turns roadmaps into quests, challenges, and real-world projects.
          </p>
          <div className="flex space-x-4 pt-4">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md cursor-pointer">
              Start free trial
            </button>
            <button className="border border-gray-300 hover:border-blue-600 px-6 py-3 rounded-md cursor-pointer">
              Explore roadmaps
            </button>
          </div>
        </div>
        
        <div className="md:w-1/2 mt-12 md:mt-0 flex justify-center">
          <div className="relative w-80 h-80">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500 rounded-full opacity-20"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-orange-500 rounded-full opacity-20"></div>
            {/* Placeholder for 3D figures */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="grid grid-cols-4 gap-2">
                {[...Array(16)].map((_, i) => (
                  <div 
                    key={i} 
                    className={`w-10 h-16 rounded-full ${
                      i % 3 === 0 ? 'bg-blue-500' : 
                      i % 3 === 1 ? 'bg-orange-500' : 'bg-gray-700'
                    }`}
                  ></div>
                ))}
              </div>
              <div className="absolute top-1/4 right-1/4 w-12 h-20 bg-black rounded-md transform rotate-6"></div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Paths Section - Improved from Trusted By Section */}
      <section className="py-16 px-6 md:px-16 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">Choose Your Path</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Perfect for aspiring developers, self-taught learners, and bootcamp graduates looking to level up their skills
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <PathCard 
              title="Frontend Path"
              description="Master HTML, CSS, JavaScript and modern frameworks to build beautiful, responsive user interfaces."
              quests={40}
              projects={15}
              color="blue"
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              }
            />
            
            <PathCard 
              title="Backend Path"
              description="Learn server-side programming, databases, API development, and cloud deployment for robust applications."
              quests={35}
              projects={12}
              color="purple"
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
                </svg>
              }
            />
            
            <PathCard 
              title="Fullstack Path"
              description="Become a versatile developer with expertise in both frontend and backend technologies for end-to-end solutions."
              quests={60}
              projects={20}
              color="amber"
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              }
            />
          </div>
          
          <div className="text-center mt-10">
            <button className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2 px-6 rounded-md inline-flex items-center transition-colors cursor-pointer">
              <span>Compare all paths</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </section>
      
      {/* Feature Section 1 */}
      <section className="py-16 px-6 md:px-16">
        <div className="bg-white rounded-xl shadow-lg p-8 md:p-12 flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 space-y-4 md:pr-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
              Interactive Roadmap Interface
            </h2>
            <p className="text-gray-600">
              Visual roadmap styled like roadmap.sh with main paths (Frontend, Backend, Fullstack), 
              subpaths, and side quests that guide your learning journey.
            </p>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md mt-4 cursor-pointer">
              Explore roadmaps
            </button>
          </div>
          <div className="md:w-1/2 mt-8 md:mt-0 flex justify-center">
            {/* Placeholder for 3D figures */}
            <div className="relative w-64 h-64">
              <div className="grid grid-cols-4 gap-2">
                {[...Array(16)].map((_, i) => (
                  <div 
                    key={i} 
                    className={`w-8 h-14 rounded-full ${
                      i % 3 === 0 ? 'bg-blue-500' : 
                      i % 3 === 1 ? 'bg-orange-500' : 'bg-gray-700'
                    }`}
                  ></div>
                ))}
              </div>
              <div className="absolute top-1/4 right-1/4 w-10 h-16 bg-black rounded-md transform rotate-6"></div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Feature Section 2 */}
      <section className="py-16 px-6 md:px-16 flex flex-col-reverse md:flex-row items-center">
        <div className="md:w-1/2 flex justify-center mt-8 md:mt-0">
          {/* Placeholder for 3D figures */}
          <div className="relative w-64 h-64">
            <div className="grid grid-cols-4 gap-2">
              {[...Array(16)].map((_, i) => (
                <div 
                  key={i} 
                  className={`w-8 h-14 rounded-full ${
                    i % 3 === 0 ? 'bg-blue-500' : 
                    i % 3 === 1 ? 'bg-orange-500' : 'bg-gray-700'
                  }`}
                ></div>
              ))}
            </div>
            <div className="absolute top-1/4 right-1/4 w-10 h-16 bg-black rounded-md transform rotate-6"></div>
          </div>
        </div>
        <div className="md:w-1/2 space-y-4 md:pl-16">
          <h3 className="uppercase text-gray-500 tracking-wider text-sm">GAMIFIED PROGRESSION</h3>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
            Level up your coding skills
          </h2>
          <p className="text-gray-600">
            Unlike traditional course platforms, Codepedition gamifies learning with levels, XP, 
            challenges, and quests. You don't just consume content—you practice, build, and level up 
            with real-world code tasks.
          </p>
          <button className="border border-gray-300 hover:border-blue-600 px-4 py-2 rounded-md mt-2 cursor-pointer">
            Start your journey
          </button>
        </div>
      </section>
      
      {/* Feature Section 3 */}
      <section className="py-16 px-6 md:px-16 bg-gray-50">
        <div className="md:flex items-center">
          <div className="md:w-1/2 space-y-4">
            <h3 className="uppercase text-gray-500 tracking-wider text-sm">INTERACTIVE LEARNING</h3>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
              Challenges & Projects
            </h2>
            <p className="text-gray-600">
              Topic-based code challenges and optional projects with guided steps help you 
              reinforce your learning and build portfolio-ready skills. Perfect for solo learners 
              who want a motivating and flexible experience that still feels structured.
            </p>
            <button className="border border-gray-300 hover:border-blue-600 px-4 py-2 rounded-md mt-2 cursor-pointer">
              Explore challenges
            </button>
          </div>
          <div className="md:w-1/2 mt-8 md:mt-0 flex justify-center">
            {/* Placeholder for 3D figures */}
            <div className="relative w-64 h-64">
              <div className="grid grid-cols-4 gap-2">
                {[...Array(16)].map((_, i) => (
                  <div 
                    key={i} 
                    className={`w-8 h-14 rounded-full ${
                      i % 3 === 0 ? 'bg-blue-500' : 
                      i % 3 === 1 ? 'bg-orange-500' : 'bg-gray-700'
                    }`}
                  ></div>
                ))}
              </div>
              <div className="absolute top-1/4 right-1/4 w-10 h-16 bg-black rounded-md transform rotate-6"></div>
            </div>
          </div>
        </div>
      </section>
      
      {/* How to Join Section */}
      <section className="py-16 px-6 md:px-16">
        <div className="bg-white rounded-xl shadow-lg p-8 md:p-12 flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 space-y-4 md:pr-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
              Start your code expedition
            </h2>
            <p className="text-gray-600">
              Follow these 3 simple steps to begin your learning journey with us.
            </p>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md mt-4 cursor-pointer">
              Get started
            </button>
          </div>
          <div className="md:w-1/2 mt-8 md:mt-0">
            <div className="space-y-6">
              <div className="flex items-start">
                <div className="font-bold text-xl mr-4">Step 1</div>
                <div>
                  <p className="text-gray-900">Create your account</p>
                  <p className="text-gray-500 text-sm">Sign up and choose your learning path: Frontend, Backend, or Fullstack.</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="font-bold text-xl mr-4">Step 2</div>
                <div>
                  <p className="text-gray-900">Set up your profile</p>
                  <p className="text-gray-500 text-sm">We organize and customize your roadmap to fit your experience level.</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="font-bold text-xl mr-4">Step 3</div>
                <div>
                  <p className="text-gray-900">Begin your quests</p>
                  <p className="text-gray-500 text-sm">Start completing challenges, earning XP, and building your skills.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Testimonials Section */}
      <section className="py-20 px-6 md:px-16 bg-gradient-to-b from-gray-50 to-white relative z-0">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h3 className="uppercase text-gray-500 font-medium tracking-wider text-sm mb-2">TESTIMONIALS</h3>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">What Our Learners Say</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Hear from developers who have accelerated their careers with our interactive learning approach</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 h-full">
            <Testimonial 
              quote="The interactive roadmap approach completely changed how I learn. I've built 6 projects for my portfolio and landed a junior dev role within 3 months."
              name="Sarah Chen"
              role="Frontend Developer at Acme Inc."
              rating={5}
            />
            
            <Testimonial 
              quote="After my bootcamp, I felt lost on what to learn next. Codepedition's structured path and gamified challenges kept me motivated and filled my knowledge gaps."
              name="Michael Rodriguez"
              role="Full Stack Developer"
              rating={5}
            />
            
            <Testimonial 
              quote="As someone switching careers at 35, I needed a practical approach. The project-based learning gave me real skills I use daily in my new dev job."
              name="Emily Jackson"
              role="Backend Developer at TechCorp"
              rating={5}
            />
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <GetStarted 
        title="Begin your coding journey today"
        description="Join thousands of developers building portfolio-ready skills in a fun and structured way."
        buttonText="Start 7-day free trial"
      />
      
      {/* Footer */}
      <Footer />
    </div>
  );
}