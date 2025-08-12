'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

export default function ClearAuthPage() {
  const router = useRouter();

  useEffect(() => {
    const clearAuth = async () => {
      // Sign out from Supabase
      await supabase.auth.signOut();
      
      // Clear all cookies that might be interfering
      document.cookie.split(";").forEach((c) => {
        document.cookie = c
          .replace(/^ +/, "")
          .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
      });
      
      // Clear local storage
      localStorage.clear();
      sessionStorage.clear();
      
      console.log('All auth data cleared');
      
      // Redirect to home after a moment
      setTimeout(() => {
        router.push('/');
      }, 2000);
    };

    clearAuth();
  }, [router]);

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-zinc-100 mb-4">Clearing Authentication...</h1>
        <p className="text-zinc-400">Removing all cached authentication data</p>
        <div className="mt-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
        </div>
      </div>
    </div>
  );
}
