"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="fixed top-0 left-0 right-0 z-10 flex items-center justify-between py-4 px-6 md:px-16 bg-white shadow-sm">
      <div className="font-bold text-xl cursor-pointer">CODEPEDITION</div>
      
      <div className="hidden md:flex items-center space-x-8">
        <Link href="/" className={`${pathname === '/' ? 'text-blue-600' : 'text-gray-600 hover:text-blue-600'} cursor-pointer`}>Home</Link>
        <Link href="/pricing" className={`${pathname === '/pricing' ? 'text-blue-600' : 'text-gray-600 hover:text-blue-600'} cursor-pointer`}>Pricing</Link>
        <Link href="/about" className={`${pathname === '/about' ? 'text-blue-600' : 'text-gray-600 hover:text-blue-600'} cursor-pointer`}>About us</Link>
        <Link href="/contact" className={`${pathname === '/contact' ? 'text-blue-600' : 'text-gray-600 hover:text-blue-600'} cursor-pointer`}>Contact</Link>
      </div>
      
      <div className="flex items-center space-x-4">
        <Link href="/login" className={`${pathname === '/login' ? 'text-blue-600' : 'text-gray-600 hover:text-blue-600'} cursor-pointer`}>Log in</Link>
        <Link href="/signup" className={`${pathname === '/signup' ? 'bg-blue-700' : 'bg-blue-600 hover:bg-blue-700'} text-white px-4 py-2 rounded-md cursor-pointer`}>Sign up</Link>
      </div>
    </nav>
  );
} 