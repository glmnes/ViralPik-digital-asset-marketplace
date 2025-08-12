'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Bell, MessageCircle, User, Shield, Settings, LogOut, UserCheck } from 'lucide-react';

export default function NavHeader() {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { user, profile, signOut } = useAuth();

  const handleSignOut = async () => {
    setShowProfileMenu(false);
    await signOut();
    router.push('/');
  };

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
    };

    if (showProfileMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showProfileMenu]);

  return (
    <nav className="fixed top-0 w-full bg-zinc-950/80 backdrop-blur-md border-b border-zinc-800 z-50">
      <div className="px-4 py-2">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="text-white text-xl font-bold hover:opacity-80 transition-opacity">
            ViralPik
          </Link>
          
          {/* Right Actions */}
          <div className="flex items-center gap-2">
            {user ? (
              <>
                <button
                  className="p-2 hover:bg-zinc-800 rounded-lg transition-colors"
                  aria-label="Notifications"
                >
                  <Bell className="w-5 h-5 text-zinc-400" />
                </button>
                <button
                  className="p-2 hover:bg-zinc-800 rounded-lg transition-colors"
                  aria-label="Messages"
                >
                  <MessageCircle className="w-5 h-5 text-zinc-400" />
                </button>
                
                {/* Profile Menu */}
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setShowProfileMenu(!showProfileMenu)}
                    className="flex items-center justify-center w-8 h-8 bg-zinc-800 rounded-full hover:bg-zinc-700 transition-colors"
                  >
                    {profile?.avatar_url ? (
                      <img 
                        src={profile.avatar_url} 
                        alt={profile.username || 'User'}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    ) : (
                      <span className="text-white font-medium text-sm">
                        {profile?.username?.[0]?.toUpperCase() || 'U'}
                      </span>
                    )}
                  </button>

                  {/* Dropdown Menu */}
                  {showProfileMenu && (
                    <div className="absolute right-0 mt-2 w-64 bg-zinc-900 rounded-lg shadow-xl border border-zinc-800 overflow-hidden">
                      {/* User Info */}
                      {profile?.username && (
                        <>
                          <div className="px-4 py-3 border-b border-zinc-800">
                            <div className="font-medium text-zinc-100">@{profile.username}</div>
                            {profile.badge_level && profile.badge_level !== 'none' && (
                              <div className="mt-1">
                                <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                                  profile.badge_level === 'gold' ? 'bg-yellow-500/10 text-yellow-400' :
                                  profile.badge_level === 'silver' ? 'bg-gray-500/10 text-gray-400' :
                                  'bg-blue-500/10 text-blue-400'
                                }`}>
                                  <UserCheck className="w-3 h-3 mr-1" />
                                  {profile.badge_level} verified
                                </span>
                              </div>
                            )}
                          </div>
                        </>
                      )}

                      {/* Menu Items */}
                      <div className="py-1">
                        {profile?.is_admin && (
                          <Link
                            href="/admin"
                            onClick={() => setShowProfileMenu(false)}
                            className="flex items-center gap-3 px-4 py-2 text-purple-400 hover:bg-zinc-800 transition-colors"
                          >
                            <Shield className="w-4 h-4" />
                            Admin Dashboard
                          </Link>
                        )}
                        {profile?.is_creator && (
                          <Link
                            href="/contributor"
                            onClick={() => setShowProfileMenu(false)}
                            className="flex items-center gap-3 px-4 py-2 text-zinc-300 hover:bg-zinc-800 transition-colors"
                          >
                            <UserCheck className="w-4 h-4" />
                            Contributor Dashboard
                          </Link>
                        )}
                        <Link
                          href={`/profile/${profile?.username || 'me'}`}
                          onClick={() => setShowProfileMenu(false)}
                          className="flex items-center gap-3 px-4 py-2 text-zinc-300 hover:bg-zinc-800 transition-colors"
                        >
                          <User className="w-4 h-4" />
                          Your Profile
                        </Link>
                        <Link
                          href="/settings"
                          onClick={() => setShowProfileMenu(false)}
                          className="flex items-center gap-3 px-4 py-2 text-zinc-300 hover:bg-zinc-800 transition-colors"
                        >
                          <Settings className="w-4 h-4" />
                          Settings
                        </Link>
                        
                        {/* Divider */}
                        <div className="my-1 border-t border-zinc-800" />
                        
                        <button
                          onClick={handleSignOut}
                          className="flex items-center gap-3 w-full px-4 py-2 text-zinc-300 hover:bg-zinc-800 transition-colors text-left"
                        >
                          <LogOut className="w-4 h-4" />
                          Sign out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex gap-2 items-center">
                <Link
                  href="/auth/signin"
                  className="px-4 py-2 text-zinc-300 hover:text-white border border-zinc-700 hover:border-zinc-600 rounded-lg transition-all"
                >
                  Sign in
                </Link>
                <Link
                  href="/auth/signup"
                  className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
                >
                  Sign up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
