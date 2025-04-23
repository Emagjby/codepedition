import Link from "next/link";

interface PricingCardProps {
  title: string;
  price: number;
  description: string;
  isPopular?: boolean;
}

export default function PricingCard({ title, price, description, isPopular = false }: PricingCardProps) {
  return (
    <div className={`bg-white rounded-lg border border-gray-100 flex flex-col items-center p-8
      ${isPopular ? 'shadow-lg transform scale-105 relative py-4 p-6' : 'shadow-md h-9/10'}`}>
      
      {isPopular && (
        <div className="absolute top-3 right-4 bg-blue-600 text-white text-xs px-3 py-1 rounded-full">
          Most Popular
        </div>
      )}
      
      {isPopular && <div className="py-4"></div>}
      
      <h3 className="font-semibold text-lg mb-4">{title}</h3>
      
      <div className="mb-4 text-center">
        <div className="text-4xl font-bold">${price}</div>
        <div className="text-gray-500">/month</div>
      </div>
      
      <p className="text-gray-600 mb-6 text-center">
        {description}
      </p>
      
      <Link href="/signup" 
        className={`mt-auto block w-full py-2 px-4 rounded-md text-center
          ${isPopular 
            ? 'bg-blue-600 hover:bg-blue-700 text-white' 
            : 'border border-gray-300 hover:bg-gray-50'}`}>
        {isPopular ? "Start 7-day Free Trial" : `Get Started with ${title}`}
      </Link>
      
      {isPopular && <div className="py-4"></div>}
    </div>
  );
} 