"use client";

import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-10 flex items-center justify-between py-4 px-6 md:px-16 bg-white shadow-sm">
      <div className="font-bold text-xl cursor-pointer">CODEPEDITION</div>
      
      <div className="hidden md:flex items-center space-x-8">
        <Link href="/" className="text-blue-600 cursor-pointer">Home</Link>
        <Link href="/pricing" className="text-gray-600 hover:text-blue-600 cursor-pointer">Pricing</Link>
        <Link href="/about" className="text-gray-600 hover:text-blue-600 cursor-pointer">About us</Link>
        <Link href="/contact" className="text-gray-600 hover:text-blue-600 cursor-pointer">Contact</Link>
      </div>
      
      <div className="flex items-center space-x-4">
        <Link href="/login" className="text-gray-600 hover:text-blue-600 cursor-pointer">Log in</Link>
        <Link href="/signup" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md cursor-pointer">Sign up</Link>
      </div>
    </nav>
  );
} 