"use client";

import Link from "next/link";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import PricingCard from "../../components/PricingCard";
import FeatureCard from "../../components/FeatureCard";
import FAQItem from "../../components/FAQItem";
import GetStarted from "../../components/GetStarted";
import { CheckCircle, XCircle } from "lucide-react";

// Define the feature data for reusability and easier maintenance
const basicFeatures = [
  { included: true, text: "Limited access to core roadmap paths" },
  { included: true, text: "Access to basic quests and challenges" },
  { included: true, text: "XP + leveling system" },
  { included: true, text: "Save progress and account login" },
  { included: false, text: "Side quests or bonus skills" },
  { included: false, text: "Real-world projects" },
  { included: false, text: "Advanced progress tracking" }
];

const plusFeatures = [
  { included: true, text: "Unlimited access to all roadmaps and quests" },
  { included: true, text: "Full XP system + higher level cap" },
  { included: true, text: "Side tracks (tooling, version control, DevOps)" },
  { included: true, text: "Visual progression and skill tree" },
  { included: true, text: "Themed roadmap visuals" },
  { included: false, text: "Real-world projects" },
  { included: false, text: "Portfolio/project feedback" }
];

const proFeatures = [
  { included: true, text: "Everything from Plus tier" },
  { included: true, text: "Access to real-world, portfolio-grade projects" },
  { included: true, text: "Project templates + guided steps" },
  { included: true, text: "Option to submit for peer or AI-based feedback" },
  { included: true, text: "Unlock certifications and project badges" },
  { included: true, text: "Leaderboards, streak bonuses, profile themes" }
];

// FAQ data for reusability
const faqData = [
  {
    question: "How does Codepedition work?",
    answer: "Codepedition transforms traditional learning paths into interactive quests. You choose a path (Frontend, Backend, or Fullstack), complete challenges, gain XP, and level up while building real-world projects that showcase your skills."
  },
  {
    question: "What makes Codepedition different from other platforms?",
    answer: "Unlike traditional platforms, we gamify the learning experience with interactive roadmaps, quests, challenges, and a visual progression system. You don't just watch videos—you build real skills through practical coding tasks guided by our structured learning paths."
  },
  {
    question: "Is Codepedition for beginners or experienced developers?",
    answer: "Both! Our Basic plan helps beginners establish fundamentals, while Plus and Pro plans offer deeper knowledge and portfolio projects for experienced developers looking to expand their skills or switch careers."
  },
  {
    question: "Can I upgrade or downgrade my plan later?",
    answer: "Absolutely! You can upgrade or downgrade your subscription at any time. When upgrading, you'll immediately gain access to new features. When downgrading, you'll maintain your current tier until the end of your billing cycle."
  },
  {
    question: "How does the 7-day free trial work?",
    answer: "Our 7-day free trial gives you full access to all Pro features. You won't be charged until the trial period ends, and you can cancel anytime during the trial with no obligation."
  },
  {
    question: "Do you offer refunds if I'm not satisfied?",
    answer: "Yes, we offer a 7-day money-back guarantee for new subscribers who aren't satisfied with our platform. Additionally, if your free trial ends and you haven't canceled, you can still request a refund within 3 days after the trial period ends—just contact our support team."
  }
];

export default function Pricing() {
  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      {/* Navigation */}
      <Navbar />
      
      {/* Pricing Section */}
      <section className="-mt-4 py-16 px-6 md:px-16 bg-gray-100 w-full">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-4">Pricing</h1>
          <p className="text-gray-600 max-w-2xl mx-auto mb-12">
            Choose the plan that fits your learning journey
          </p>
          
          <div className="grid md:grid-cols-3 gap-0 items-center max-w-5xl mx-auto">
            <PricingCard 
              title="Basic"
              price={0}
              description="For beginners testing the waters"
            />
            
            <PricingCard 
              title="Pro"
              price={14.99}
              description="For career switchers and portfolio builders"
              isPopular
            />
            
            <PricingCard 
              title="Plus"
              price={9.99}
              description="For learners ready to level up"
            />
          </div>
        </div>
      </section>
      
      {/* Feature Comparison */}
      <section className="py-12 px-6 md:px-16">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Compare Plan Features</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Find the perfect plan for your coding journey, whether you're just starting out or ready to build your portfolio
            </p>
          </div>
          
          {/* Tabs for mobile view */}
          <div className="block md:hidden mb-8">
            <div className="flex border-b border-gray-300">
              <button className="flex-1 py-3 font-medium text-blue-600 border-b-2 border-blue-600">Basic</button>
              <button className="flex-1 py-3 font-medium text-gray-500 hover:text-gray-700">Plus</button>
              <button className="flex-1 py-3 font-medium text-gray-500 hover:text-gray-700">Pro</button>
            </div>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            <FeatureCard 
              title="Basic"
              price="Free forever"
              description="Great for: Discovering the platform, building initial momentum"
              features={basicFeatures}
            />
            
            <FeatureCard 
              title="Pro"
              price="$14.99/month"
              description="Great for: Those who want to turn learning into results — and prove their skills"
              features={proFeatures}
            />

            <FeatureCard 
              title="Plus"
              price="$9.99/month"
              description="Great for: Those who want structured, deep knowledge — but aren't building a portfolio yet"
              features={plusFeatures}
            />
          </div>
          
          <div className="mt-12 text-center">
            <Link href="/signup" className="inline-flex items-center justify-center py-3 px-6 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors shadow-md hover:shadow-lg">
              Start your journey today
            </Link>
          </div>
        </div>
      </section>
      
      {/* FAQ Section */}
      <section className="py-16 px-6 md:px-16 bg-white">
        <div className="max-w-3xl mx-auto text-center">
          <div className="flex justify-center mb-6">
            <div className="relative w-20 h-20">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-yellow-400 text-5xl">?</div>
                <div className="absolute bottom-0 right-0 bg-blue-600 p-2 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
          
          <h2 className="text-2xl md:text-3xl font-bold mb-2">Frequently asked questions</h2>
          
          <div className="mt-10 space-y-4">
            {faqData.map((item, index) => (
              <FAQItem 
                key={index}
                question={item.question} 
                answer={item.answer} 
              />
            ))}
          </div>
        </div>
      </section>
      
      {/* Get Started Section */}
      <GetStarted 
        title="Your code expedition starts today"
        description="Join thousands of developers on their interactive learning journey with Codepedition."
        buttonText="Start your free trial"
      />
      
      {/* Footer */}
      <Footer />
    </div>
  );
} 