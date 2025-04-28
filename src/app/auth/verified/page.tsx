"use client";

import Link from 'next/link';
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { CheckCircle2 } from 'lucide-react';

export default function VerifiedPage() {
  const params = useSearchParams();
  const email = params.get('email') || '';
  
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md shadow-lg bg-white rounded-lg overflow-hidden">
        <div className="text-center p-6 border-b border-gray-200">
          <div className="flex justify-center mb-4">
            <CheckCircle2 className="h-12 w-12 text-green-500" />
          </div>
          <h1 className="text-xl font-bold">Email Verified Successfully</h1>
        </div>
        <div className="text-center p-6">
          <p className="mb-4">
            Your email address {email ? <strong>{email}</strong> : ''} has been successfully verified.
          </p>
          <p>You can now log in to your account.</p>
        </div>
        <div className="flex justify-center p-6 pt-0">
          <Link 
            href={email ? `/auth/login?email=${encodeURIComponent(email)}` : '/auth/login'}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md cursor-pointer"
          >
            Go to Login
          </Link>
        </div>
      </div>
    </div>
  );
} 