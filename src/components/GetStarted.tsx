import Link from "next/link";

interface GetStartedProps {
  title: string;
  description: string;
  buttonText: string;
  buttonLink?: string;
}

export default function GetStarted({
  title,
  description,
  buttonText,
  buttonLink = "/auth/register"
}: GetStartedProps) {
  return (
    <section className="py-16 px-6 md:px-16 bg-gray-50">
      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
        <div className="md:flex">
          <div className="p-8 md:p-12 md:w-1/2 flex flex-col justify-center min-h-[240px]">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">{title}</h2>
            <p className="text-gray-600 mb-6 min-h-[48px]">{description}</p>
            <div>
              <Link href={buttonLink} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md inline-block transition-colors">
                {buttonText}
              </Link>
            </div>
          </div>
          <div className="md:w-1/2 p-8 md:p-12 flex justify-center items-center min-h-[240px]">
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
  );
} 