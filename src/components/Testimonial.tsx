"use client";
import { useState } from 'react';

type TestimonialProps = {
  quote: string;
  name: string;
  role: string;
  rating?: number;
  avatar?: string;
};

export default function Testimonial({ 
  quote, 
  name, 
  role, 
  rating = 5,
  avatar
}: TestimonialProps) {
  const [imgError, setImgError] = useState(false);
  
  // Generate a placeholder based on initial
  const initial = name.charAt(0).toUpperCase();
  const colors = ["bg-blue-500", "bg-green-500", "bg-purple-500", "bg-amber-500", "bg-rose-500"];
  const colorIndex = name.length % colors.length;
  
  return (
    <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 relative overflow-hidden group z-0 flex flex-col h-full">
      {/* Decorative elements */}
      <div className="absolute -top-4 -left-4 text-6xl text-blue-100 opacity-70">
        "
      </div>
      <div className="absolute bottom-0 right-0 w-24 h-24 bg-gradient-to-tl from-blue-50 to-transparent rounded-tl-full opacity-50"></div>
      
      <div className="relative z-0 flex-grow">
        <p className="text-gray-700 leading-relaxed">{quote}</p>
      </div>
      
      <div className="mt-auto pt-6 border-t border-gray-100">
        <div className="flex justify-start text-yellow-400 mb-4">
          {[...Array(rating)].map((_, i) => (
            <span key={i} className="text-lg">★</span>
          ))}
        </div>
        
        <div className="flex items-center">
          <div className="w-12 h-12 rounded-full overflow-hidden mr-4 flex-shrink-0 ring-2 ring-blue-100 group-hover:ring-blue-300 transition-all">
            {!imgError && avatar ? (
              <img 
                src={avatar} 
                alt={name} 
                className="w-full h-full object-cover"
                onError={() => setImgError(true)}
              />
            ) : (
              <div className={`w-full h-full flex items-center justify-center ${colors[colorIndex]} text-white font-bold`}>
                {initial}
              </div>
            )}
          </div>
          <div>
            <p className="font-semibold text-gray-900">{name}</p>
            <p className="text-sm text-blue-600">{role}</p>
          </div>
        </div>
      </div>
    </div>
  );
} 