import { ReactNode } from "react";
import { CheckCircle, XCircle } from "lucide-react";

interface Feature {
  included: boolean;
  text: string;
}

interface FeatureCardProps {
  title: string;
  price: string;
  description: string;
  features: Feature[];
}

export default function FeatureCard({ title, price, description, features }: FeatureCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
      {/* Card Header */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 border-b border-blue-100">
        <h3 className="font-bold text-xl mb-2 text-gray-800">{title}</h3>
        <div className="text-gray-500 text-sm mb-2">{price}</div>
        <p className="text-gray-600 text-sm italic">{description}</p>
      </div>
      
      {/* Features List */}
      <div className="p-6">
        <ul className="space-y-4">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start">
              {feature.included ? (
                <CheckCircle className="h-5 w-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" />
              ) : (
                <XCircle className="h-5 w-5 text-red-500 mr-3 mt-0.5 flex-shrink-0" />
              )}
              <span className={feature.included ? "text-gray-700" : "text-gray-500"}>
                {feature.text}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
} 