'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabaseClient';
import { Flame, Mail, Lock, User, Eye, EyeOff, Sparkles, CheckCircle, XCircle, Loader2, Shield, AlertCircle } from 'lucide-react';

export default function SignUpPage() {
  const { signUp } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [username, setUsername] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showVerificationMessage, setShowVerificationMessage] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  
  // Username availability states
  const [checkingUsername, setCheckingUsername] = useState(false);
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null);
  const [usernameError, setUsernameError] = useState('');
  
  // Removed email suggestions - using standard browser autocomplete
  
  // Password strength calculation
  const calculatePasswordStrength = (pass: string) => {
    let strength = 0;
    if (pass.length >= 8) strength++;
    if (pass.length >= 12) strength++;
    if (/[a-z]/.test(pass) && /[A-Z]/.test(pass)) strength++;
    if (/[0-9]/.test(pass)) strength++;
    if (/[^A-Za-z0-9]/.test(pass)) strength++;
    return strength;
  };
  
  const passwordStrength = calculatePasswordStrength(password);
  const passwordsMatch = password === confirmPassword && password.length > 0;

  // Check username availability
  useEffect(() => {
    // If username is empty, reset everything
    if (!username) {
      setUsernameAvailable(null);
      setUsernameError('');
      setCheckingUsername(false);
      return;
    }
    
    const checkUsername = async () => {
      // Reset states
      setUsernameAvailable(null);
      setUsernameError('');
      
      // Validate username format
      if (username.length < 3) {
        setUsernameError('Username must be at least 3 characters');
        return;
      }
      
      if (username.length > 20) {
        setUsernameError('Username must be less than 20 characters');
        return;
      }
      
      if (!/^[a-zA-Z0-9_]+$/.test(username)) {
        setUsernameError('Username can only contain letters, numbers, and underscores');
        return;
      }
      
      setCheckingUsername(true);
      
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('username')
          .eq('username', username.toLowerCase())
          .maybeSingle();
        
        if (error) {
          console.error('Error checking username:', error);
          setUsernameError('Error checking username availability');
        } else {
          setUsernameAvailable(!data);
          if (data) {
            setUsernameError('Username is already taken');
          }
        }
      } catch (err) {
        console.error('Error checking username:', err);
        setUsernameError('Error checking username availability');
      } finally {
        setCheckingUsername(false);
      }
    };
    
    // Debounce the username check
    const timeoutId = setTimeout(() => {
      if (username) {
        checkUsername();
      }
    }, 500);
    
    return () => clearTimeout(timeoutId);
  }, [username]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Custom validation messages
    if (!username || username.length < 3) {
      setError('Please enter a valid username (at least 3 characters)');
      return;
    }
    
    if (usernameError) {
      setError(usernameError);
      return;
    }
    
    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }
    
    if (!password || password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    if (!termsAccepted) {
      setError('Please accept the Terms of Service and Privacy Policy');
      return;
    }
    
    setLoading(true);

    try {
      const result = await signUp(email, password, username, false); // Always sign up as regular user
      if (result?.requiresEmailVerification) {
        setShowVerificationMessage(true);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during sign up');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {showVerificationMessage ? (
          /* Email Verification Message */
          <div className="text-center">
            <div className="mb-8">
              <Link href="/" className="inline-block">
                <span className="text-2xl font-bold text-white">ViralPik</span>
              </Link>
            </div>
            
            <div className="bg-zinc-900/50 border border-zinc-800 p-8">
              <div className="mb-6 flex justify-center">
                <div className="w-16 h-16 bg-green-500/10 flex items-center justify-center">
                  <CheckCircle className="w-8 h-8 text-green-500" />
                </div>
              </div>
              
              <h1 className="text-2xl font-medium text-white mb-4">Check Your Email</h1>
              
              <p className="text-zinc-300 mb-6">
                We&apos;ve sent a verification link to
                <span className="block font-medium text-zinc-100 mt-2">{email}</span>
              </p>
              
              <div className="bg-zinc-800/50 rounded-lg p-4 mb-6">
                <p className="text-sm font-medium text-zinc-300 mb-3">What happens next?</p>
                <ol className="text-sm text-zinc-400 text-left space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-400">1.</span>
                    <span>Check your email inbox for our verification message</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-400">2.</span>
                    <span>Click the verification link in the email</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-400">3.</span>
                    <span>Return here to sign in with your new account</span>
                  </li>
                </ol>
              </div>
              
              <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3 mb-6">
                <p className="text-sm text-yellow-400">
                  Can&apos;t find the email? Check your spam folder or wait a few minutes.
                </p>
              </div>
              
              <Link
                href="/auth/signin"
                className="w-full inline-flex items-center justify-center px-6 py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors"
              >
                Go to Sign In
              </Link>
              
              <p className="text-sm text-zinc-500 mt-4">
                Need help? <Link href="/support" className="text-blue-400 hover:text-blue-300">Contact support</Link>
              </p>
            </div>
          </div>
        ) : (
          /* Sign Up Form */
          <>
        {/* Logo */}
        <div className="text-center mb-12">
          <Link href="/" className="inline-block mb-8">
            <span className="text-2xl font-bold text-white">ViralPik</span>
          </Link>
          <h1 className="text-2xl font-medium text-white">Create account</h1>
          <p className="text-sm text-zinc-500 mt-2">Join the marketplace</p>
        </div>


        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">
              Username
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                className={`w-full pl-10 pr-10 py-3 bg-zinc-900 border rounded-lg text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-colors ${
                  usernameError 
                    ? 'border-red-500/50 focus:border-red-500' 
                    : usernameAvailable === true 
                    ? 'border-green-500/50 focus:border-green-500'
                    : 'border-zinc-800 focus:border-blue-500'
                }`}
                placeholder="Choose a username"
                maxLength={20}
              />
              {/* Status indicator */}
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                {checkingUsername ? (
                  <Loader2 className="w-5 h-5 text-zinc-400 animate-spin" />
                ) : usernameAvailable === true ? (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                ) : usernameAvailable === false ? (
                  <XCircle className="w-5 h-5 text-red-500" />
                ) : null}
              </div>
            </div>
            {/* Status message */}
            {usernameError ? (
              <p className="text-xs text-red-400 mt-1">{usernameError}</p>
            ) : usernameAvailable === true ? (
              <p className="text-xs text-green-400 mt-1">Username is available!</p>
            ) : username.length > 0 && username.length < 3 ? (
              <p className="text-xs text-zinc-500 mt-1">Username must be at least 3 characters</p>
            ) : (
              <p className="text-xs text-zinc-500 mt-1">Letters, numbers, and underscores only</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-zinc-900/50 border border-zinc-800 text-white placeholder:text-zinc-600 focus:outline-none focus:border-zinc-700 transition-all"
                placeholder="Enter your email"
                autoComplete="email"
                name="email"
                id="email"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">
              Password
            </label>
            <div className="relative">
              <Shield className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-12 py-2.5 bg-zinc-900/50 border border-zinc-800 text-white placeholder:text-zinc-600 focus:outline-none focus:border-zinc-700 transition-all"
                placeholder="Create a strong password"
                autoComplete="new-password"
                name="password"
                id="password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {/* Password strength indicator */}
            {password.length > 0 && (
              <div className="mt-2">
                <div className="flex gap-1 mb-1">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className={`h-1 flex-1 rounded-full transition-colors ${
                        i < passwordStrength
                          ? passwordStrength <= 2
                            ? 'bg-red-500'
                            : passwordStrength <= 3
                            ? 'bg-yellow-500'
                            : 'bg-green-500'
                          : 'bg-zinc-800'
                      }`}
                    />
                  ))}
                </div>
                <p className={`text-xs ${
                  passwordStrength <= 2
                    ? 'text-red-400'
                    : passwordStrength <= 3
                    ? 'text-yellow-400'
                    : 'text-green-400'
                }`}>
                  {passwordStrength <= 2
                    ? 'Weak password'
                    : passwordStrength <= 3
                    ? 'Good password'
                    : 'Strong password'}
                  {passwordStrength < 5 && ' - add ' +
                    [
                      password.length < 8 && 'more characters',
                      !/[A-Z]/.test(password) && 'uppercase letters',
                      !/[0-9]/.test(password) && 'numbers',
                      !/[^A-Za-z0-9]/.test(password) && 'special characters'
                    ].filter(Boolean).slice(0, 2).join(' and ')}
                </p>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">
              Confirm Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={`w-full pl-10 pr-12 py-3 bg-zinc-900 border rounded-lg text-zinc-100 focus:outline-none focus:ring-2 transition-colors ${
                  confirmPassword.length > 0 && !passwordsMatch
                    ? 'border-red-500/50 focus:border-red-500 focus:ring-red-500/50'
                    : confirmPassword.length > 0 && passwordsMatch
                    ? 'border-green-500/50 focus:border-green-500 focus:ring-green-500/50'
                    : 'border-zinc-800 focus:border-blue-500 focus:ring-blue-500/50'
                }`}
                placeholder="Re-enter your password"
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300"
              >
                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {confirmPassword.length > 0 && (
              <p className={`text-xs mt-1 ${
                passwordsMatch ? 'text-green-400' : 'text-red-400'
              }`}>
                {passwordsMatch ? '✓ Passwords match' : '✗ Passwords do not match'}
              </p>
            )}
          </div>


          <div className={`relative p-4 rounded-lg border transition-all ${
            termsAccepted 
              ? 'bg-blue-500/10 border-blue-500/30' 
              : 'bg-zinc-900/50 border-zinc-800 hover:border-zinc-700'
          }`}>
            <label className="flex items-start gap-3 cursor-pointer">
              <div className="relative mt-0.5">
                <input
                  type="checkbox"
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                  className="sr-only"
                />
                <div className={`w-5 h-5 rounded border-2 transition-all flex items-center justify-center ${
                  termsAccepted
                    ? 'bg-blue-500 border-blue-500'
                    : 'bg-zinc-900 border-zinc-700 hover:border-zinc-600'
                }`}>
                  {termsAccepted && (
                    <CheckCircle className="w-3 h-3 text-white" />
                  )}
                </div>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <Shield className="w-4 h-4 text-blue-400" />
                  <span className="text-sm font-medium text-zinc-200">
                    Legal Agreement
                  </span>
                </div>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  By creating an account, you agree to our{' '}
                  <Link href="/terms" className="text-blue-400 hover:text-blue-300 underline underline-offset-2">
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link href="/privacy" className="text-blue-400 hover:text-blue-300 underline underline-offset-2">
                    Privacy Policy
                  </Link>.
                  We&apos;ll protect your data and ensure a safe marketplace experience.
                </p>
              </div>
            </label>
            {!termsAccepted && (
              <div className="absolute -top-2 -right-2">
                <div className="relative">
                  <div className="absolute inset-0 bg-red-500 rounded-full blur animate-pulse"></div>
                  <AlertCircle className="w-5 h-5 text-red-500 relative" />
                </div>
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-blue-500 text-white font-medium hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Creating account...' : 'Sign up'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-zinc-400">
            Already have an account?{' '}
            <Link href="/auth/signin" className="text-blue-400 hover:text-blue-300">
              Sign in
            </Link>
          </p>
        </div>
          </>
        )}
      </div>
    </div>
  );
}
