'use client';

import { useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';
import { Flame, Mail, ArrowLeft, Send, CheckCircle } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  
  // Email suggestions
  const emailDomains = ['gmail.com', 'outlook.com', 'hotmail.com', 'yahoo.com', 'icloud.com'];
  const [showEmailSuggestions, setShowEmailSuggestions] = useState(false);
  const [emailSuggestionBase, setEmailSuggestionBase] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    
    // Custom validation
    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }
    
    // Validate email domain
    const emailDomain = email.split('@')[1]?.toLowerCase();
    const allowedDomains = ['gmail.com', 'outlook.com', 'hotmail.com', 'yahoo.com', 'icloud.com', 'protonmail.com', 'proton.me'];
    
    if (!emailDomain || !allowedDomains.includes(emailDomain)) {
      setError('Please use an email from a supported provider (Gmail, Outlook, Yahoo, etc.)');
      return;
    }
    
    setLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });

      if (error) {
        setError(error.message);
      } else {
        setSuccessMessage('Password reset instructions have been sent to your email.');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
              <Flame className="w-7 h-7 text-white" />
            </div>
            <span className="text-2xl font-bold text-zinc-100">ViralPik</span>
          </Link>
        </div>

        {successMessage ? (
          /* Success Message */
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8">
            <div className="mb-6 flex justify-center">
              <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center">
                <CheckCircle className="w-10 h-10 text-green-500" />
              </div>
            </div>
            
            <h1 className="text-2xl font-bold text-zinc-100 text-center mb-4">Check Your Email</h1>
            
            <p className="text-zinc-300 text-center mb-6">
              We've sent password reset instructions to:
              <span className="block font-medium text-zinc-100 mt-2">{email}</span>
            </p>
            
            <div className="bg-zinc-800/50 rounded-lg p-4 mb-6">
              <p className="text-sm font-medium text-zinc-300 mb-3">What to do next:</p>
              <ol className="text-sm text-zinc-400 space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-blue-400">1.</span>
                  <span>Open the email from ViralPik</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-400">2.</span>
                  <span>Click the password reset link</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-400">3.</span>
                  <span>Create your new password</span>
                </li>
              </ol>
            </div>
            
            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3 mb-6">
              <p className="text-sm text-yellow-400">
                Didn't receive the email? Check your spam folder or try again in a few minutes.
              </p>
            </div>
            
            <div className="flex flex-col gap-3">
              <button
                onClick={() => {
                  setSuccessMessage('');
                  setEmail('');
                }}
                className="w-full py-3 bg-zinc-800 text-zinc-100 rounded-lg font-medium hover:bg-zinc-700 transition-colors"
              >
                Try Another Email
              </button>
              
              <Link
                href="/auth/signin"
                className="w-full inline-flex items-center justify-center py-3 text-zinc-400 hover:text-zinc-100 transition-colors"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Sign In
              </Link>
            </div>
          </div>
        ) : (
          /* Reset Form */
          <>
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-zinc-100">Forgot your password?</h1>
              <p className="text-zinc-400 mt-2">No worries, we'll send you reset instructions</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              {error && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      const value = e.target.value;
                      setEmail(value);
                      
                      // Show suggestions for username part before @ or domain part after @
                      if (!value.includes('@') && value.length > 0) {
                        setEmailSuggestionBase(value);
                        setShowEmailSuggestions(true);
                      } else if (value.includes('@') && !value.split('@')[1]) {
                        setEmailSuggestionBase('');
                        setShowEmailSuggestions(true);
                      } else {
                        setShowEmailSuggestions(false);
                      }
                    }}
                    onFocus={() => {
                      if (!email.includes('@') && email.length > 0) {
                        setEmailSuggestionBase(email);
                        setShowEmailSuggestions(true);
                      } else if (email.includes('@') && !email.split('@')[1]) {
                        setEmailSuggestionBase('');
                        setShowEmailSuggestions(true);
                      }
                    }}
                    onBlur={() => setTimeout(() => setShowEmailSuggestions(false), 200)}
                    className="w-full pl-10 pr-4 py-3 bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500"
                    placeholder="Enter your registered email"
                    autoComplete="email"
                  />
                  {/* Email suggestions */}
                  {showEmailSuggestions && (
                    <div className="absolute top-full mt-1 w-full bg-zinc-900 border border-zinc-800 rounded-lg shadow-xl z-10 max-h-48 overflow-y-auto">
                      {emailSuggestionBase && !email.includes('@') ? (
                        // Username suggestions with domains
                        emailDomains.map((domain) => (
                          <button
                            key={domain}
                            type="button"
                            onClick={() => {
                              setEmail(emailSuggestionBase + '@' + domain);
                              setShowEmailSuggestions(false);
                            }}
                            className="w-full px-4 py-2 text-left text-zinc-300 hover:bg-zinc-800 first:rounded-t-lg last:rounded-b-lg transition-colors"
                          >
                            {emailSuggestionBase}@<span className="text-blue-400">{domain}</span>
                          </button>
                        ))
                      ) : email.includes('@') && (
                        // Domain suggestions
                        emailDomains.map(domain => (
                          <button
                            key={domain}
                            type="button"
                            onClick={() => {
                              setEmail(email.split('@')[0] + '@' + domain);
                              setShowEmailSuggestions(false);
                            }}
                            className="w-full px-4 py-2 text-left text-zinc-300 hover:bg-zinc-800 first:rounded-t-lg last:rounded-b-lg transition-colors"
                          >
                            {email.split('@')[0]}@<span className="text-blue-400">{domain}</span>
                          </button>
                        ))
                      )}
                    </div>
                  )}
                </div>
                <p className="text-xs text-zinc-500 mt-2">
                  Enter the email address associated with your account
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  'Sending...'
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Send Reset Instructions
                  </>
                )}
              </button>

              <div className="pt-4 border-t border-zinc-800">
                <Link
                  href="/auth/signin"
                  className="flex items-center justify-center gap-2 text-zinc-400 hover:text-zinc-100 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Sign In
                </Link>
              </div>
            </form>

            <div className="mt-8 p-4 bg-zinc-900/50 border border-zinc-800 rounded-lg">
              <h3 className="text-sm font-medium text-zinc-300 mb-2">Need help?</h3>
              <p className="text-xs text-zinc-500 mb-3">
                If you're having trouble resetting your password, make sure:
              </p>
              <ul className="text-xs text-zinc-500 space-y-1">
                <li>• You're using the correct email address</li>
                <li>• Your account has been verified</li>
                <li>• Check your spam/junk folder</li>
              </ul>
              <Link href="/support" className="text-xs text-blue-400 hover:text-blue-300 mt-3 inline-block">
                Contact support →
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
