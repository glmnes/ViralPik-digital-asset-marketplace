import Link from 'next/link';
import { Home, Search } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        <h1 className="text-9xl font-bold text-zinc-800 mb-4">404</h1>
        <h2 className="text-3xl font-bold text-zinc-100 mb-2">
          Page Not Found
        </h2>
        <p className="text-zinc-400 mb-8">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            href="/"
            className="flex items-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-full font-medium hover:bg-blue-600 transition-colors"
          >
            <Home className="w-4 h-4" />
            Go Home
          </Link>
          <Link
            href="/explore"
            className="flex items-center gap-2 px-6 py-3 bg-zinc-800 text-zinc-100 rounded-full font-medium hover:bg-zinc-700 transition-colors"
          >
            <Search className="w-4 h-4" />
            Explore
          </Link>
        </div>
      </div>
    </div>
  );
}
