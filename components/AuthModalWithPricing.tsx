'use client';

import { useState, useEffect } from 'react';
import { X, Mail, Chrome, ArrowLeft, User, Lock, Eye, EyeOff, Shield, CheckCircle, XCircle, Loader2, AlertCircle } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';
import PricingTiers from './PricingTiers';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  triggerAction?: string; // What action triggered the modal (download, like, follow)
}

export default function AuthModalWithPricing({ 
  isOpen, 
  onClose, 
  onSuccess,
  triggerAction = 'access features'
}: AuthModalProps) {
  const [mode, setMode] = useState<'signin' | 'signup' | 'pricing'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [username, setUsername] = useState('');
  const [selectedTier, setSelectedTier] = useState('free');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  
  // Username availability states
  const [checkingUsername, setCheckingUsername] = useState(false);
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null);
  const [usernameError, setUsernameError] = useState('');
  
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
    if (mode !== 'signup') return;
    
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
  }, [username, mode]);

  if (!isOpen) return null;

  const handleSignIn = async () => {
    setLoading(true);
    setError('');
    
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
      
      onSuccess?.();
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async () => {
    setError('');
    
    // Validation
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
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username,
            subscription_tier: selectedTier,
          }
        }
      });
      
      if (authError) throw authError;
      
      // Update profile with username and selected tier
      if (authData.user) {
        await supabase
          .from('profiles')
          .update({ 
            username: username.toLowerCase(),
            subscription_tier: selectedTier 
          })
          .eq('id', authData.user.id);
      }
      
      onSuccess?.();
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOAuthSignIn = async (provider: 'google' | 'github') => {
    setLoading(true);
    setError('');
    
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        }
      });
      
      if (error) throw error;
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div 
        className={`bg-zinc-950 rounded-2xl shadow-2xl border border-zinc-800 transition-all ${
          mode === 'pricing' ? 'max-w-6xl w-full' : 'max-w-md w-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-zinc-800">
          <div className="flex items-center gap-3">
            {mode === 'pricing' && (
              <button
                onClick={() => setMode('signup')}
                className="p-1 hover:bg-zinc-800 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-zinc-400" />
              </button>
            )}
            <h2 className="text-2xl font-bold text-white">
              {mode === 'signin' && `Sign in to ${triggerAction}`}
              {mode === 'signup' && 'Create Account'}
              {mode === 'pricing' && 'Choose Your Plan'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-zinc-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-zinc-400" />
          </button>
        </div>

        {/* Content */}
        <div className={`p-6 ${mode === 'pricing' ? '' : 'space-y-6'}`}>
          {mode === 'pricing' ? (
            <>
              <p className="text-center text-zinc-400 mb-6">
                To {triggerAction}, choose a plan that fits your needs
              </p>
              <PricingTiers 
                selectedTier={selectedTier}
                onSelectTier={(tier) => {
                  setSelectedTier(tier);
                  setMode('signup');
                }}
              />
            </>
          ) : (
            <>
              {/* Action Context */}
              {mode === 'signup' && (
                <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-lg">
                  <p className="text-sm text-blue-400">
                    You selected the <span className="font-semibold">{selectedTier}</span> plan.
                    You can change this anytime in settings.
                  </p>
                </div>
              )}

              {/* OAuth Button - Google Only */}
              <div>
                <button
                  onClick={() => handleOAuthSignIn('google')}
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-3 py-3 px-4 border border-zinc-800 rounded-lg hover:bg-zinc-900 transition-colors"
                >
                  <Chrome className="w-5 h-5 text-zinc-400" />
                  <span className="text-zinc-300">Continue with Google</span>
                </button>
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-zinc-800"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-zinc-950 text-zinc-500">Or continue with email</span>
                </div>
              </div>

              {/* Email/Password Form */}
              <form onSubmit={(e) => {
                e.preventDefault();
                mode === 'signin' ? handleSignIn() : handleSignUp();
              }} className="space-y-4">
                {/* Username field for signup */}
                {mode === 'signup' && (
                  <div>
                    <label className="block text-sm font-medium text-zinc-300 mb-2">Username</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                      <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                        className={`w-full pl-10 pr-10 py-2.5 bg-zinc-900/50 border rounded-lg text-white focus:outline-none focus:border-zinc-700 transition-all ${
                          usernameError 
                            ? 'border-red-500/50' 
                            : usernameAvailable === true 
                            ? 'border-green-500/50'
                            : 'border-zinc-800'
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
                )}
                
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full pl-10 pr-4 py-2.5 bg-zinc-900/50 border border-zinc-800 rounded-lg text-white placeholder-zinc-600 focus:outline-none focus:border-zinc-700 transition-all"
                      placeholder="you@example.com"
                      autoComplete="email"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">Password</label>
                  <div className="relative">
                    <Shield className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="w-full pl-10 pr-12 py-2.5 bg-zinc-900/50 border border-zinc-800 rounded-lg text-white placeholder-zinc-600 focus:outline-none focus:border-zinc-700 transition-all"
                      placeholder={mode === 'signin' ? 'Enter your password' : 'Create a strong password'}
                      autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {/* Password strength indicator for signup */}
                  {mode === 'signup' && password.length > 0 && (
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
                
                {/* Confirm Password for signup */}
                {mode === 'signup' && (
                  <div>
                    <label className="block text-sm font-medium text-zinc-300 mb-2">Confirm Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className={`w-full pl-10 pr-12 py-2.5 bg-zinc-900/50 border rounded-lg text-white focus:outline-none transition-all ${
                          confirmPassword.length > 0 && !passwordsMatch
                            ? 'border-red-500/50'
                            : confirmPassword.length > 0 && passwordsMatch
                            ? 'border-green-500/50'
                            : 'border-zinc-800 focus:border-zinc-700'
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
                )}
                
                {/* Terms and Conditions for signup */}
                {mode === 'signup' && (
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
                          <a href="/terms" target="_blank" className="text-blue-400 hover:text-blue-300 underline underline-offset-2">
                            Terms of Service
                          </a>{' '}
                          and{' '}
                          <a href="/privacy" target="_blank" className="text-blue-400 hover:text-blue-300 underline underline-offset-2">
                            Privacy Policy
                          </a>.
                          We'll protect your data and ensure a safe marketplace experience.
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
                )}

                {error && (
                  <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg text-sm">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-semibold disabled:opacity-50"
                >
                  {loading ? 'Loading...' : mode === 'signin' ? 'Sign In' : 'Create Account'}
                </button>
              </form>

              {/* Switch Mode */}
              <div className="text-center text-sm text-zinc-400">
                {mode === 'signin' ? (
                  <>
                    Don't have an account?{' '}
                    <button
                      onClick={() => {
                        setMode('pricing');
                        setError('');
                      }}
                      className="text-blue-400 hover:text-blue-300 font-semibold"
                    >
                      Sign up
                    </button>
                  </>
                ) : (
                  <>
                    Already have an account?{' '}
                    <button
                      onClick={() => {
                        setMode('signin');
                        setError('');
                      }}
                      className="text-blue-400 hover:text-blue-300 font-semibold"
                    >
                      Sign in
                    </button>
                  </>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
