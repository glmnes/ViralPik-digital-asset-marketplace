'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';
import { Flame, Lock, Eye, EyeOff, Shield, CheckCircle, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  
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

  // Check if we have a valid session from the email link
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        // No valid session from email link
        setError('Invalid or expired reset link. Please request a new one.');
      }
    };
    checkSession();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Custom validation
    if (!password || password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    
    if (passwordStrength < 2) {
      setError('Please choose a stronger password');
      return;
    }
    
    if (!confirmPassword) {
      setError('Please confirm your password');
      return;
    }
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    setLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({
        password: password
      });

      if (error) {
        setError(error.message);
      } else {
        setSuccess(true);
        toast.success('Password reset successfully!');
        
        // Redirect to signin after 3 seconds
        setTimeout(() => {
          router.push('/auth/signin');
        }, 3000);
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

        {success ? (
          /* Success Message */
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8">
            <div className="mb-6 flex justify-center">
              <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center">
                <CheckCircle className="w-10 h-10 text-green-500" />
              </div>
            </div>
            
            <h1 className="text-2xl font-bold text-zinc-100 text-center mb-4">Password Reset Complete!</h1>
            
            <p className="text-zinc-300 text-center mb-6">
              Your password has been successfully reset. You can now sign in with your new password.
            </p>
            
            <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3 mb-6">
              <p className="text-sm text-green-400 text-center">
                Redirecting to sign in page...
              </p>
            </div>
            
            <Link
              href="/auth/signin"
              className="w-full inline-flex items-center justify-center py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors"
            >
              Go to Sign In
            </Link>
          </div>
        ) : (
          /* Reset Form */
          <>
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-zinc-100">Create new password</h1>
              <p className="text-zinc-400 mt-2">Your new password must be different from previous ones</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              {error && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                  New Password
                </label>
                <div className="relative">
                  <Shield className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-12 py-3 bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500"
                    placeholder="Enter new password"
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
                  Confirm New Password
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
                    placeholder="Re-enter new password"
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

              <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-4">
                <h3 className="text-sm font-medium text-zinc-300 mb-2">Password Requirements</h3>
                <ul className="text-xs text-zinc-500 space-y-1">
                  <li className={password.length >= 6 ? 'text-green-400' : ''}>
                    {password.length >= 6 ? '✓' : '•'} At least 6 characters
                  </li>
                  <li className={/[a-z]/.test(password) && /[A-Z]/.test(password) ? 'text-green-400' : ''}>
                    {/[a-z]/.test(password) && /[A-Z]/.test(password) ? '✓' : '•'} Mix of uppercase & lowercase letters
                  </li>
                  <li className={/[0-9]/.test(password) ? 'text-green-400' : ''}>
                    {/[0-9]/.test(password) ? '✓' : '•'} At least one number
                  </li>
                  <li className={/[^A-Za-z0-9]/.test(password) ? 'text-green-400' : ''}>
                    {/[^A-Za-z0-9]/.test(password) ? '✓' : '•'} At least one special character
                  </li>
                </ul>
              </div>

              <button
                type="submit"
                disabled={loading || !passwordsMatch || passwordStrength < 2}
                className="w-full py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Resetting Password...' : 'Reset Password'}
              </button>

              <div className="pt-4 border-t border-zinc-800">
                <Link
                  href="/auth/signin"
                  className="flex items-center justify-center gap-2 text-zinc-400 hover:text-zinc-100 transition-colors"
                >
                  Cancel and return to sign in
                </Link>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
