'use client';

import { AlertCircle } from 'lucide-react';

export default function SupabaseWarning() {
  const isConfigured = process.env.NEXT_PUBLIC_SUPABASE_URL && 
                      process.env.NEXT_PUBLIC_SUPABASE_URL !== 'your_supabase_project_url' &&
                      process.env.NEXT_PUBLIC_SUPABASE_URL.startsWith('http');

  if (isConfigured) return null;

  return (
    <div className="fixed bottom-4 right-4 max-w-md p-4 bg-yellow-900/20 border border-yellow-900/50 rounded-lg backdrop-blur-sm">
      <div className="flex items-start space-x-3">
        <AlertCircle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
        <div>
          <h4 className="text-sm font-medium text-yellow-200">Supabase Not Configured</h4>
          <p className="text-xs text-yellow-300/80 mt-1">
            The app is running with mock data. To use real data, set up Supabase and update your .env.local file.
          </p>
          <a 
            href="https://github.com/yourusername/ViralPik#setup" 
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-yellow-400 hover:text-yellow-300 underline mt-2 inline-block"
          >
            View setup instructions →
          </a>
        </div>
      </div>
    </div>
  );
}
