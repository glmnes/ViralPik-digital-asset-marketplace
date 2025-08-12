'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase, Profile } from '@/lib/supabaseClient';
import { User } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  signUp: (email: string, password: string, username: string, isCreator?: boolean) => Promise<{ requiresEmailVerification?: boolean } | void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<Profile>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check active sessions and sets the user
    supabase.auth.getSession().then(({ data: { session } }: any) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
      }
      setLoading(false);
    });

    // Listen for changes on auth state
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event: any, session: any) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
      } else {
        setProfile(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;
      setProfile(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const signUp = async (email: string, password: string, username: string, isCreator = false) => {
    try {
      // Basic email validation
      if (!email || !email.includes('@')) {
        throw new Error('Please enter a valid email address');
      }

      // Only allow major email providers
      const allowedDomains = [
        'gmail.com',
        'yahoo.com',
        'outlook.com',
        'hotmail.com',
        'live.com',
        'msn.com',
        'icloud.com',
        'me.com',
        'mac.com',
        'aol.com',
        'protonmail.com',
        'proton.me',
        'yandex.com',
        'mail.com',
        'zoho.com',
        'gmx.com',
        'fastmail.com',
        'tutanota.com',
        'pm.me'
      ];

      const emailDomain = email.split('@')[1]?.toLowerCase();
      if (!emailDomain || !allowedDomains.includes(emailDomain)) {
        throw new Error('Please use an email from a major provider (Gmail, Outlook, Yahoo, etc.)');
      }

      // Validate password strength
      if (password.length < 6) {
        throw new Error('Password must be at least 6 characters long');
      }

      // Validate username
      if (username.length < 3) {
        throw new Error('Username must be at least 3 characters long');
      }

      // Check if the username is already taken
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('username')
        .eq('username', username)
        .maybeSingle(); // Use maybeSingle instead of single to avoid error when no match

      if (existingProfile) {
        throw new Error('Username already taken');
      }

      // Sign up the user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username,
          },
          emailRedirectTo: `${window.location.origin}/auth/callback`
        }
      });

      if (authError) throw authError;

      // Log auth data for debugging
      console.log('Auth signup response:', {
        user: authData.user,
        session: authData.session,
        email_confirmed_at: authData.user?.email_confirmed_at,
        identities: authData.user?.identities
      });

      // Update or create profile (upsert to handle trigger-created profiles)
      if (authData.user) {
        // Wait a bit for the trigger to complete
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Check if profile was created by trigger
        const { data: existingProfileById } = await supabase
          .from('profiles')
          .select('id')
          .eq('id', authData.user.id)
          .maybeSingle();

        if (existingProfileById) {
          // Profile exists (created by trigger), update it
          const { error: profileError } = await supabase
            .from('profiles')
            .update({
              username,
              email,
              is_creator: isCreator,
              approval_status: isCreator ? 'pending' : 'approved',
              updated_at: new Date().toISOString()
            })
            .eq('id', authData.user.id);

          if (profileError) {
            console.error('Profile update error:', JSON.stringify(profileError, null, 2));
            console.error('Profile update error details:', profileError.message, profileError.code, profileError.details);
            // Don't throw - continue with signup flow
          }
        } else {
          // Profile doesn't exist, create it
          const { error: profileError } = await supabase
            .from('profiles')
            .insert([
              {
                id: authData.user.id,
                username,
                email,
                is_creator: isCreator,
                approval_status: isCreator ? 'pending' : 'approved',
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
              }
            ]);

          if (profileError) {
            console.error('Profile insert error:', JSON.stringify(profileError, null, 2));
            console.error('Profile insert error details:', profileError.message, profileError.code, profileError.details);
            // Don't throw - continue with signup flow
          }
        }

        // If creator, create application
        if (isCreator) {
          const { error: appError } = await supabase
            .from('creator_applications')
            .insert([
              {
                user_id: authData.user.id,
                status: 'pending'
              }
            ]);

          if (appError) {
            console.error('Creator application error:', appError);
            // Don't throw - continue with signup
          }
        }

        // Check if email confirmation is required
        // When signing up, if no session is returned, it means email confirmation is required
        // Also check email_confirmed_at to be sure
        const needsVerification = !authData.session || !authData.user.email_confirmed_at;
        
        console.log('Needs verification?', needsVerification, {
          hasSession: !!authData.session,
          emailConfirmed: !!authData.user.email_confirmed_at
        });
        
        if (needsVerification) {
          // Email confirmation required - always show verification message for new signups
          return { requiresEmailVerification: true };
        } else {
          // Email already confirmed or auto-confirmed (unlikely for new signups)
          router.push('/');
        }
      }
    } catch (error: any) {
      console.error('Signup error:', error);
      throw new Error(error.message || 'Failed to create account');
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      router.push('/');
    } catch (error: any) {
      throw new Error(error.message);
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      router.push('/');
    } catch (error: any) {
      throw new Error(error.message);
    }
  };

  const updateProfile = async (updates: Partial<Profile>) => {
    try {
      if (!user) throw new Error('No user logged in');

      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id)
        .select()
        .single();

      if (error) throw error;
      setProfile(data);
    } catch (error: any) {
      throw new Error(error.message);
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      profile,
      loading,
      signUp,
      signIn,
      signOut,
      updateProfile,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
