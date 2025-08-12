'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

function AuthErrorContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  const getErrorMessage = () => {
    switch (error) {
      case 'unauthorized_client':
        return 'This client is not authorized.';
      case 'access_denied':
        return 'Access was denied.';
      case 'server_error':
        return 'A server error occurred.';
      case 'temporarily_unavailable':
        return 'The service is temporarily unavailable.';
      default:
        return 'An authentication error occurred.';
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <h1 className="text-2xl font-bold text-white mb-4">Authentication Error</h1>
        <p className="text-zinc-400 mb-8">{getErrorMessage()}</p>
        <Link href="/auth/signin" className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          Try Again
        </Link>
      </div>
    </div>
  );
}

export default function AuthError() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AuthErrorContent />
    </Suspense>
  );
}
