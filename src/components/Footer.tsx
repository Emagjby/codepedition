"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="py-12 px-6 md:px-16 bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="font-bold text-xl mb-4 cursor-pointer">CODEPEDITION</div>
            <p className="text-gray-500 text-sm">
              © 2025 Codepedition.<br />
              All rights reserved.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Learning Paths</h3>
            <ul className="space-y-2 text-sm text-gray-500">
              <li><Link href="/frontend" className="hover:text-blue-600 cursor-pointer">Frontend</Link></li>
              <li><Link href="/backend" className="hover:text-blue-600 cursor-pointer">Backend</Link></li>
              <li><Link href="/fullstack" className="hover:text-blue-600 cursor-pointer">Fullstack</Link></li>
              <li><Link href="/pricing" className="hover:text-blue-600 cursor-pointer">Pricing</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Company</h3>
            <ul className="space-y-2 text-sm text-gray-500">
              <li><Link href="/about" className="hover:text-blue-600 cursor-pointer">About us</Link></li>
              <li><Link href="/contact" className="hover:text-blue-600 cursor-pointer">Contact</Link></li>
              <li><Link href="/blog" className="hover:text-blue-600 cursor-pointer">Blog</Link></li>
              <li><Link href="/careers" className="hover:text-blue-600 cursor-pointer">Careers</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Legal</h3>
            <ul className="space-y-2 text-sm text-gray-500">
              <li><Link href="/privacy" className="hover:text-blue-600 cursor-pointer">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-blue-600 cursor-pointer">Terms Of Service</Link></li>
              <li><Link href="/cookies" className="hover:text-blue-600 cursor-pointer">Cookie Policy</Link></li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
} 