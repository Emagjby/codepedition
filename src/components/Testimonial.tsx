"use client";

type TestimonialProps = {
  quote: string;
  name: string;
  role: string;
  rating?: number;
};

export default function Testimonial({ quote, name, role, rating = 5 }: TestimonialProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow cursor-pointer">
      <p className="text-gray-700 mb-4">"{quote}"</p>
      <div className="flex justify-center text-yellow-500 mb-2">
        {[...Array(rating)].map((_, i) => (
          <span key={i}>★</span>
        ))}
      </div>
      <p className="font-semibold">{name}</p>
      <p className="text-sm text-gray-500">{role}</p>
    </div>
  );
} 