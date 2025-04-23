"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

interface FAQItemProps {
  question: string;
  answer: string;
}

export default function FAQItem({ question, answer }: FAQItemProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-gray-200 pb-4">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="cursor-pointer flex w-full justify-between items-center py-3 transition-colors hover:text-blue-600 focus:outline-none"
      >
        <span className="font-medium text-left">{question}</span>
        {isOpen ? (
          <ChevronUp className="h-5 w-5 text-blue-600" />
        ) : (
          <ChevronDown className="h-5 w-5 text-gray-500" />
        )}
      </button>
      
      {isOpen && (
        <div className="mt-2 text-gray-600 text-left pl-1 pr-8 pb-2 animate-fadeIn">
          {answer}
        </div>
      )}
    </div>
  );
} 