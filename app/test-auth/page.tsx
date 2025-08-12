'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function TestAuthPage() {
  const [status, setStatus] = useState<any>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    setLoading(true);
    
    // Check Supabase URL
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    // Check session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    // Check user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    // Try to fetch from a public table
    const { data: testData, error: tableError } = await supabase
      .from('profiles')
      .select('*')
      .limit(1);
    
    setStatus({
      supabaseUrl: supabaseUrl ? `${supabaseUrl.substring(0, 30)}...` : 'NOT SET',
      hasKey: !!supabaseKey,
      session: session ? 'Active' : 'No session',
      sessionError: sessionError?.message,
      user: user?.email || 'No user',
      userError: userError?.message,
      tableAccess: tableError ? `Error: ${tableError.message}` : 'Success',
      cookies: document.cookie.split(';').filter(c => c.includes('sb-')).map(c => c.split('=')[0].trim()),
      localStorage: Object.keys(localStorage).filter(k => k.includes('supabase')),
    });
    
    setLoading(false);
  };

  const testSignIn = async () => {
    const email = prompt('Enter email:');
    const password = prompt('Enter password:');
    
    if (email && password) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        alert(`Error: ${error.message}`);
      } else {
        alert('Success! Refreshing...');
        window.location.reload();
      }
    }
  };

  const testSignOut = async () => {
    await supabase.auth.signOut();
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-zinc-950 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-zinc-100 mb-8">Authentication Test Page</h1>
        
        {loading ? (
          <p className="text-zinc-400">Loading...</p>
        ) : (
          <div className="space-y-6">
            <div className="bg-zinc-900 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-zinc-100 mb-4">Environment</h2>
              <dl className="space-y-2">
                <div>
                  <dt className="text-zinc-400">Supabase URL:</dt>
                  <dd className="text-zinc-100 font-mono">{status.supabaseUrl}</dd>
                </div>
                <div>
                  <dt className="text-zinc-400">Has Anon Key:</dt>
                  <dd className="text-zinc-100">{status.hasKey ? '✅ Yes' : '❌ No'}</dd>
                </div>
              </dl>
            </div>

            <div className="bg-zinc-900 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-zinc-100 mb-4">Authentication Status</h2>
              <dl className="space-y-2">
                <div>
                  <dt className="text-zinc-400">Session:</dt>
                  <dd className="text-zinc-100">{status.session}</dd>
                  {status.sessionError && <dd className="text-red-400 text-sm">{status.sessionError}</dd>}
                </div>
                <div>
                  <dt className="text-zinc-400">User:</dt>
                  <dd className="text-zinc-100">{status.user}</dd>
                  {status.userError && <dd className="text-red-400 text-sm">{status.userError}</dd>}
                </div>
                <div>
                  <dt className="text-zinc-400">Database Access:</dt>
                  <dd className="text-zinc-100">{status.tableAccess}</dd>
                </div>
              </dl>
            </div>

            <div className="bg-zinc-900 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-zinc-100 mb-4">Storage</h2>
              <dl className="space-y-2">
                <div>
                  <dt className="text-zinc-400">Cookies:</dt>
                  <dd className="text-zinc-100 font-mono text-sm">
                    {status.cookies?.length > 0 ? status.cookies.join(', ') : 'None'}
                  </dd>
                </div>
                <div>
                  <dt className="text-zinc-400">LocalStorage:</dt>
                  <dd className="text-zinc-100 font-mono text-sm">
                    {status.localStorage?.length > 0 ? status.localStorage.join(', ') : 'None'}
                  </dd>
                </div>
              </dl>
            </div>

            <div className="flex gap-4">
              <button
                onClick={testSignIn}
                className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                Test Sign In
              </button>
              <button
                onClick={testSignOut}
                className="px-6 py-3 bg-zinc-800 text-zinc-100 rounded-lg hover:bg-zinc-700"
              >
                Sign Out
              </button>
              <button
                onClick={checkAuth}
                className="px-6 py-3 bg-zinc-800 text-zinc-100 rounded-lg hover:bg-zinc-700"
              >
                Refresh Status
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
