"use client";

import { useState, useEffect } from "react";

// Animated text component with typewriter effect
const AnimatedText = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      <div className="animate-typewriter whitespace-nowrap overflow-hidden border-r-4 border-[#4F80FF] pr-1">
        {children}
      </div>
    </div>
  );
};

// Game badge component
const Badge = ({ label, icon, color }: { label: string, icon: string, color: string }) => {
  const colors: Record<string, { bg: string, text: string }> = {
    yellow: { bg: "bg-[#FFCB2D]/20", text: "text-[#FFCB2D]" },
    purple: { bg: "bg-[#6A4C9C]/20", text: "text-[#6A4C9C]" },
    green: { bg: "bg-[#25C55E]/20", text: "text-[#25C55E]" },
    blue: { bg: "bg-[#4F80FF]/20", text: "text-[#4F80FF]" }
  };

  return (
    <div className={`inline-flex items-center gap-2 rounded-full px-4 py-1.5 ${colors[color].bg} ${colors[color].text}`}>
      <span className="text-lg">{icon}</span>
      <span className="font-medium text-sm">{label}</span>
    </div>
  );
};

// Feature card component
const FeatureCard = ({ 
  title, 
  description, 
  icon, 
  color 
}: { 
  title: string, 
  description: string, 
  icon: string, 
  color: string 
}) => {
  const colors: Record<string, { bg: string, border: string }> = {
    yellow: { bg: "bg-white", border: "border-[#FFCB2D]" },
    blue: { bg: "bg-white", border: "border-[#4F80FF]" },
    purple: { bg: "bg-white", border: "border-[#6A4C9C]" }
  };

  const iconColors: Record<string, string> = {
    yellow: "bg-[#FFCB2D]/20 text-[#FFCB2D]",
    blue: "bg-[#4F80FF]/20 text-[#4F80FF]",
    purple: "bg-[#6A4C9C]/20 text-[#6A4C9C]"
  };

  return (
    <div className={`${colors[color].bg} rounded-2xl p-6 shadow-md transition-all hover:translate-y-[-4px] border-l-4 ${colors[color].border}`}>
      <div className={`w-14 h-14 rounded-full ${iconColors[color]} flex items-center justify-center mb-4 text-2xl`}>
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-2 text-[#2E1A47]">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
};

// Animated code block component
const AnimatedCodeBlock = () => {
  const [progress, setProgress] = useState(0);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setProgress(100);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <div className="bg-[#3B2A61] rounded-2xl overflow-hidden shadow-lg p-6">
      <div className="flex items-center mb-4">
        <div className="w-3 h-3 rounded-full bg-[#FFCB2D] mr-2"></div>
        <div className="w-3 h-3 rounded-full bg-[#D1D5DB] mr-2"></div>
        <div className="w-3 h-3 rounded-full bg-[#4F80FF]"></div>
      </div>
      
      <div className="bg-[#2E1A47] rounded-xl p-4 mb-4">
        <div className="space-y-3">
          <div className="bg-[#6A4C9C]/30 h-4 rounded animate-pulse"></div>
          <div className="bg-[#6A4C9C]/30 h-4 w-3/4 rounded animate-pulse delay-100"></div>
          <div className="bg-[#6A4C9C]/30 h-4 w-5/6 rounded animate-pulse delay-200"></div>
        </div>
      </div>
      
      <div className="h-6 w-full bg-[#2E1A47] rounded-full overflow-hidden">
        <div 
          className="h-full bg-[#4F80FF] transition-all duration-1000 ease-out rounded-full" 
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      
      <div className="flex justify-between items-center mt-3 text-[#E0C8FF] text-sm">
        <div>Progress</div>
        <div>{progress}%</div>
      </div>
    </div>
  );
};

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="pt-16 pb-20 px-6 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="flex items-center mb-2">
              <div className="bg-[#4F80FF] h-8 w-2 rounded-full mr-3"></div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#2E1A47]">
                <AnimatedText>Learn. Play. Master.</AnimatedText>
              </h1>
            </div>
            
            <p className="text-xl text-gray-600">
              The most engaging way to build new skills through interactive 
              challenges, daily quests, and friendly competition.
            </p>
            
            <div className="flex flex-wrap gap-3 pt-2">
              <Badge label="10-day streak" color="yellow" icon="🔥" />
              <Badge label="Level 3" color="purple" icon="⭐" />
              <Badge label="+250 XP today" color="green" icon="📈" />
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              <button className="bg-[#4F80FF] hover:bg-blue-600 text-white font-semibold py-3 px-8 rounded-full transition-all transform hover:scale-105 hover:shadow-lg">
                Start Learning For Free
              </button>
              <button className="border-2 border-[#6A4C9C] text-[#6A4C9C] hover:bg-[#6A4C9C] hover:text-white font-semibold py-3 px-8 rounded-full transition-colors">
                Take a Tour
              </button>
            </div>
          </div>
          
          <div className="relative">
            <AnimatedCodeBlock />
            
            {/* Decorative elements */}
            <div className="absolute -top-10 -right-8 w-24 h-24 bg-[#FFCB2D] rounded-full opacity-20 animate-pulse-slow"></div>
            <div className="absolute -bottom-8 -left-8 w-16 h-16 bg-[#6A4C9C] rounded-full opacity-20 animate-bounce-slow"></div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4 text-[#2E1A47]">How You'll Learn</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our platform combines fun, interactive lessons with gamification 
              to keep you motivated and engaged throughout your learning journey.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard 
              title="Daily Challenges"
              description="Build consistent habits with bite-sized daily challenges that keep you engaged and learning."
              icon="🎯"
              color="yellow"
            />
            <FeatureCard 
              title="Interactive Lessons"
              description="Learn by doing with hands-on interactive lessons that test your knowledge in real-time."
              icon="💡"
              color="blue"
            />
            <FeatureCard 
              title="Skill Tracks"
              description="Follow curated learning paths designed to build complete skill sets from beginner to advanced."
              icon="🏆"
              color="purple"
            />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-6 bg-[#4F80FF]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="bg-white/10 p-6 rounded-xl">
              <div className="text-4xl font-bold text-white mb-2">500K+</div>
              <div className="text-white/80">Active Learners</div>
            </div>
            <div className="bg-white/10 p-6 rounded-xl">
              <div className="text-4xl font-bold text-white mb-2">100+</div>
              <div className="text-white/80">Interactive Courses</div>
            </div>
            <div className="bg-white/10 p-6 rounded-xl">
              <div className="text-4xl font-bold text-white mb-2">12M+</div>
              <div className="text-white/80">Lessons Completed</div>
            </div>
            <div className="bg-white/10 p-6 rounded-xl">
              <div className="text-4xl font-bold text-white mb-2">96%</div>
              <div className="text-white/80">Satisfaction Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold mb-12 text-center text-[#2E1A47]">What Our Learners Say</h2>
        
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
            <p className="text-gray-600 mb-4">
              "This platform completely changed how I approach learning. The gamification 
              elements keep me motivated every day, and I've made incredible progress!"
            </p>
            <div className="flex items-center">
              <div className="w-12 h-12 rounded-full bg-[#4F80FF] flex items-center justify-center text-white font-bold text-lg">JD</div>
              <div className="ml-4">
                <h4 className="font-semibold text-[#2E1A47]">Jane Doe</h4>
                <p className="text-sm text-gray-500">Web Developer</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
            <p className="text-gray-600 mb-4">
              "The interactive challenges are so addictive. I've learned more in two weeks 
              than I did in months with traditional courses. Highly recommend!"
            </p>
            <div className="flex items-center">
              <div className="w-12 h-12 rounded-full bg-[#6A4C9C] flex items-center justify-center text-white font-bold text-lg">MS</div>
              <div className="ml-4">
                <h4 className="font-semibold text-[#2E1A47]">Mark Smith</h4>
                <p className="text-sm text-gray-500">Data Scientist</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <div className="bg-[#6A4C9C] rounded-2xl p-10 md:p-16 text-center">
          <h2 className="text-3xl font-bold mb-4 text-white">Ready to Start Your Learning Journey?</h2>
          <p className="text-white text-opacity-90 text-xl mb-8 max-w-2xl mx-auto">
            Join thousands of learners who have transformed their skills through our platform.
          </p>
          <button className="bg-white text-[#6A4C9C] hover:bg-[#FFCB2D] hover:text-[#2E1A47] font-bold py-3 px-8 rounded-full transition-colors transform hover:scale-105">
            Get Started Now
          </button>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-6 text-[#2E1A47]">Contact Us</h2>
            <p className="text-gray-600 mb-8">
              Have questions about our platform? We're here to help you on your learning journey.
            </p>
            
            <div className="space-y-6">
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full bg-[#FFCB2D]/20 flex items-center justify-center text-[#2E1A47] mr-4">📧</div>
                <span className="text-gray-700">hello@learningplatform.com</span>
              </div>
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full bg-[#FFCB2D]/20 flex items-center justify-center text-[#2E1A47] mr-4">📱</div>
                <span className="text-gray-700">+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full bg-[#FFCB2D]/20 flex items-center justify-center text-[#2E1A47] mr-4">📍</div>
                <span className="text-gray-700">123 Learning Ave, San Francisco, CA 94107</span>
              </div>
            </div>
          </div>
          
          <form className="bg-white rounded-2xl p-8 shadow-md border border-gray-100">
            <div className="mb-6">
              <label className="block text-gray-700 mb-2 font-medium" htmlFor="name">Name</label>
              <input 
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#4F80FF]" 
                type="text" 
                id="name" 
                placeholder="Your name"
              />
            </div>
            <div className="mb-6">
              <label className="block text-gray-700 mb-2 font-medium" htmlFor="email">Email</label>
              <input 
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#4F80FF]" 
                type="email" 
                id="email" 
                placeholder="your.email@example.com"
              />
            </div>
            <div className="mb-6">
              <label className="block text-gray-700 mb-2 font-medium" htmlFor="message">Message</label>
              <textarea 
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#4F80FF]" 
                id="message" 
                rows={4}
                placeholder="How can we help you?"
              ></textarea>
            </div>
            <button 
              className="w-full bg-[#4F80FF] hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
              type="submit"
            >
              Send Message
            </button>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-gray-200">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center">
          <div className="text-gray-500 mb-4 md:mb-0">
            © 2023 Learning Platform. All rights reserved.
          </div>
          <div className="flex space-x-6">
            <a href="#" className="text-gray-500 hover:text-[#4F80FF] transition-colors">
              Terms
            </a>
            <a href="#" className="text-gray-500 hover:text-[#4F80FF] transition-colors">
              Privacy
            </a>
            <a href="#" className="text-gray-500 hover:text-[#4F80FF] transition-colors">
              Cookies
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
} 