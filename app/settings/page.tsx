'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Settings,
  User,
  Mail,
  Lock,
  Bell,
  Shield,
  Globe,
  Save,
  Camera,
  AlertCircle,
  Check,
  CheckCircle,
  X,
  Loader2,
  LogOut,
  RefreshCw
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabaseClient';
import { toast } from 'sonner';

interface ProfileSettings {
  username: string;
  email: string;
  bio: string;
  website: string;
  twitter: string;
  instagram: string;
  youtube: string;
}

interface UserPreferences {
  email_comments: boolean;
  email_follows: boolean;
  email_updates: boolean;
  email_marketing: boolean;
  profile_visibility: 'public' | 'private';
  show_email: boolean;
  show_analytics: boolean;
  theme: 'dark' | 'light' | 'system';
  language: string;
}

export default function SettingsPage() {
  const router = useRouter();
  const { user, profile, loading } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [saving, setSaving] = useState(false);
  const [loadingPreferences, setLoadingPreferences] = useState(true);
  const [emailVerified, setEmailVerified] = useState(false);
  const [sendingVerification, setSendingVerification] = useState(false);
  
  const [profileSettings, setProfileSettings] = useState<ProfileSettings>({
    username: '',
    email: '',
    bio: '',
    website: '',
    twitter: '',
    instagram: '',
    youtube: ''
  });

  const [userPreferences, setUserPreferences] = useState<UserPreferences>({
    email_comments: true,
    email_follows: true,
    email_updates: true,
    email_marketing: false,
    profile_visibility: 'public',
    show_email: false,
    show_analytics: true,
    theme: 'dark',
    language: 'en'
  });

  const [passwordForm, setPasswordForm] = useState({
    current: '',
    new: '',
    confirm: ''
  });

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/signin');
      return;
    }

    if (user && profile) {
      // Load existing settings
      setProfileSettings({
        username: profile.username || '',
        email: user.email || '',
        bio: profile.bio || '',
        website: profile.website || '',
        twitter: profile.twitter || '',
        instagram: profile.instagram || '',
        youtube: profile.youtube || ''
      });
      
      // Check email verification status
      setEmailVerified(user.email_confirmed_at !== null);
      
      // Load user preferences
      loadUserPreferences();
    }
  }, [user, profile, loading, router]);

  const loadUserPreferences = async () => {
    if (!user) return;
    
    try {
      // First try to get existing preferences
      const result = await supabase
        .from('user_preferences')
        .select('*')
        .eq('user_id', user.id)
        .single();
      
      let preferences = result.data;
      const errorObj = result.error;

      if (errorObj && errorObj.code === 'PGRST116') {
        // No preferences exist, create them
        const { data: newPreferences, error: insertError } = await supabase
          .from('user_preferences')
          .insert({ user_id: user.id })
          .select()
          .single();
          
        if (insertError) throw insertError;
        preferences = newPreferences;
      } else if (errorObj) {
        throw errorObj;
      }

      if (preferences) {
        setUserPreferences({
          email_comments: preferences.email_comments ?? true,
          email_follows: preferences.email_follows ?? true,
          email_updates: preferences.email_updates ?? true,
          email_marketing: preferences.email_marketing ?? false,
          profile_visibility: preferences.profile_visibility || 'public',
          show_email: preferences.show_email ?? false,
          show_analytics: preferences.show_analytics ?? true,
          theme: preferences.theme || 'dark',
          language: preferences.language || 'en'
        });
      }
    } catch (error) {
      console.error('Error loading preferences:', error);
    } finally {
      setLoadingPreferences(false);
    }
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          username: profileSettings.username,
          bio: profileSettings.bio,
          website: profileSettings.website,
          twitter: profileSettings.twitter,
          instagram: profileSettings.instagram,
          youtube: profileSettings.youtube,
          updated_at: new Date().toISOString()
        })
        .eq('id', user?.id);

      if (error) throw error;
      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveNotifications = async () => {
    if (!user) return;
    
    setSaving(true);
    try {
      const { error } = await supabase
        .from('user_preferences')
        .update({
          email_comments: userPreferences.email_comments,
          email_follows: userPreferences.email_follows,
          email_updates: userPreferences.email_updates,
          email_marketing: userPreferences.email_marketing
        })
        .eq('user_id', user.id);

      if (error) throw error;
      toast.success('Notification preferences updated');
    } catch (error) {
      console.error('Error updating notifications:', error);
      toast.error('Failed to update notification preferences');
    } finally {
      setSaving(false);
    }
  };

  const handleSavePrivacy = async () => {
    if (!user) return;
    
    setSaving(true);
    try {
      const { error } = await supabase
        .from('user_preferences')
        .update({
          profile_visibility: userPreferences.profile_visibility,
          show_email: userPreferences.show_email,
          show_analytics: userPreferences.show_analytics
        })
        .eq('user_id', user.id);

      if (error) throw error;
      toast.success('Privacy settings updated');
    } catch (error) {
      console.error('Error updating privacy settings:', error);
      toast.error('Failed to update privacy settings');
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (passwordForm.new !== passwordForm.confirm) {
      toast.error('New passwords do not match');
      return;
    }

    if (passwordForm.new.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setSaving(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: passwordForm.new
      });

      if (error) throw error;
      
      toast.success('Password updated successfully');
      setPasswordForm({ current: '', new: '', confirm: '' });
    } catch (error) {
      console.error('Error updating password:', error);
      toast.error('Failed to update password');
    } finally {
      setSaving(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  const handleSendVerificationEmail = async () => {
    if (!user?.email) return;
    
    setSendingVerification(true);
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: user.email
      });
      
      if (error) throw error;
      toast.success('Verification email sent! Please check your inbox.');
    } catch (error) {
      console.error('Error sending verification email:', error);
      toast.error('Failed to send verification email');
    } finally {
      setSendingVerification(false);
    }
  };

  if (loading || loadingPreferences) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (!user || !profile) {
    return null;
  }

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'privacy', label: 'Privacy', icon: Lock }
  ];

  return (
    <div className="min-h-screen bg-zinc-950">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-zinc-100 mb-8">Settings</h1>

        {/* Tabs */}
        <div className="flex gap-1 mb-8 border-b border-zinc-800">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 font-medium transition-colors relative ${
                  activeTab === tab.id 
                    ? 'text-zinc-100' 
                    : 'text-zinc-400 hover:text-zinc-100'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
                {activeTab === tab.id && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500" />
                )}
              </button>
            );
          })}
        </div>

        {/* Profile Settings */}
        {activeTab === 'profile' && (
          <div className="space-y-6">
            <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-800">
              <h2 className="text-xl font-semibold text-zinc-100 mb-6">Profile Information</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">
                    Username
                  </label>
                  <input
                    type="text"
                    value={profileSettings.username}
                    onChange={(e) => setProfileSettings({ ...profileSettings, username: e.target.value })}
                    className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">
                    Email
                  </label>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <input
                        type="email"
                        value={profileSettings.email}
                        disabled
                        className="flex-1 px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-400 cursor-not-allowed"
                      />
                      {emailVerified ? (
                        <div className="flex items-center gap-1 text-green-500">
                          <CheckCircle className="w-4 h-4" />
                          <span className="text-sm">Verified</span>
                        </div>
                      ) : (
                        <button
                          onClick={handleSendVerificationEmail}
                          disabled={sendingVerification}
                          className="px-3 py-2 bg-yellow-600 text-white rounded-lg text-sm font-medium hover:bg-yellow-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                        >
                          {sendingVerification ? (
                            <Loader2 className="w-3 h-3 animate-spin" />
                          ) : (
                            <Mail className="w-3 h-3" />
                          )}
                          Verify
                        </button>
                      )}
                    </div>
                    <p className="text-xs text-zinc-500">Email cannot be changed</p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">
                    Bio
                  </label>
                  <textarea
                    value={profileSettings.bio}
                    onChange={(e) => setProfileSettings({ ...profileSettings, bio: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Tell us about yourself"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">
                    Website
                  </label>
                  <input
                    type="url"
                    value={profileSettings.website}
                    onChange={(e) => setProfileSettings({ ...profileSettings, website: e.target.value })}
                    className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="https://example.com"
                  />
                </div>
              </div>

              <button
                onClick={handleSaveProfile}
                disabled={saving}
                className="mt-6 px-6 py-2 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {saving ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                Save Changes
              </button>
            </div>

            {/* Social Links */}
            <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-800">
              <h2 className="text-xl font-semibold text-zinc-100 mb-6">Social Links</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">
                    Twitter/X
                  </label>
                  <input
                    type="text"
                    value={profileSettings.twitter}
                    onChange={(e) => setProfileSettings({ ...profileSettings, twitter: e.target.value })}
                    className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="@username"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">
                    Instagram
                  </label>
                  <input
                    type="text"
                    value={profileSettings.instagram}
                    onChange={(e) => setProfileSettings({ ...profileSettings, instagram: e.target.value })}
                    className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="@username"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">
                    YouTube
                  </label>
                  <input
                    type="text"
                    value={profileSettings.youtube}
                    onChange={(e) => setProfileSettings({ ...profileSettings, youtube: e.target.value })}
                    className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Channel URL"
                  />
                </div>
              </div>

              <button
                onClick={handleSaveProfile}
                disabled={saving}
                className="mt-6 px-6 py-2 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {saving ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                Save Social Links
              </button>
            </div>
          </div>
        )}

        {/* Notification Settings */}
        {activeTab === 'notifications' && (
          <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-800">
            <h2 className="text-xl font-semibold text-zinc-100 mb-6">Email Notifications</h2>
            
            <div className="space-y-4">
              <label className="flex items-center justify-between p-3 bg-zinc-800 rounded-lg cursor-pointer hover:bg-zinc-700 transition-colors">
                <div>
                  <p className="text-zinc-100 font-medium">Comments</p>
                  <p className="text-sm text-zinc-400">Get notified when someone comments on your assets</p>
                </div>
                <input
                  type="checkbox"
                  checked={userPreferences.email_comments}
                  onChange={(e) => setUserPreferences({ ...userPreferences, email_comments: e.target.checked })}
                  className="w-4 h-4 text-blue-500 bg-zinc-700 border-zinc-600 rounded focus:ring-blue-500"
                />
              </label>

              <label className="flex items-center justify-between p-3 bg-zinc-800 rounded-lg cursor-pointer hover:bg-zinc-700 transition-colors">
                <div>
                  <p className="text-zinc-100 font-medium">New Followers</p>
                  <p className="text-sm text-zinc-400">Get notified when someone follows you</p>
                </div>
                <input
                  type="checkbox"
                  checked={userPreferences.email_follows}
                  onChange={(e) => setUserPreferences({ ...userPreferences, email_follows: e.target.checked })}
                  className="w-4 h-4 text-blue-500 bg-zinc-700 border-zinc-600 rounded focus:ring-blue-500"
                />
              </label>

              <label className="flex items-center justify-between p-3 bg-zinc-800 rounded-lg cursor-pointer hover:bg-zinc-700 transition-colors">
                <div>
                  <p className="text-zinc-100 font-medium">Product Updates</p>
                  <p className="text-sm text-zinc-400">Get notified about new features and updates</p>
                </div>
                <input
                  type="checkbox"
                  checked={userPreferences.email_updates}
                  onChange={(e) => setUserPreferences({ ...userPreferences, email_updates: e.target.checked })}
                  className="w-4 h-4 text-blue-500 bg-zinc-700 border-zinc-600 rounded focus:ring-blue-500"
                />
              </label>

              <label className="flex items-center justify-between p-3 bg-zinc-800 rounded-lg cursor-pointer hover:bg-zinc-700 transition-colors">
                <div>
                  <p className="text-zinc-100 font-medium">Marketing Emails</p>
                  <p className="text-sm text-zinc-400">Receive tips and promotions</p>
                </div>
                <input
                  type="checkbox"
                  checked={userPreferences.email_marketing}
                  onChange={(e) => setUserPreferences({ ...userPreferences, email_marketing: e.target.checked })}
                  className="w-4 h-4 text-blue-500 bg-zinc-700 border-zinc-600 rounded focus:ring-blue-500"
                />
              </label>
            </div>

            <button
              onClick={handleSaveNotifications}
              disabled={saving}
              className="mt-6 px-6 py-2 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {saving ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              Save Preferences
            </button>
          </div>
        )}

        {/* Security Settings */}
        {activeTab === 'security' && (
          <div className="space-y-6">
            <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-800">
              <h2 className="text-xl font-semibold text-zinc-100 mb-6">Change Password</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">
                    Current Password
                  </label>
                  <input
                    type="password"
                    value={passwordForm.current}
                    onChange={(e) => setPasswordForm({ ...passwordForm, current: e.target.value })}
                    className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">
                    New Password
                  </label>
                  <input
                    type="password"
                    value={passwordForm.new}
                    onChange={(e) => setPasswordForm({ ...passwordForm, new: e.target.value })}
                    className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    value={passwordForm.confirm}
                    onChange={(e) => setPasswordForm({ ...passwordForm, confirm: e.target.value })}
                    className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <button
                onClick={handleChangePassword}
                disabled={saving}
                className="mt-6 px-6 py-2 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {saving ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Lock className="w-4 h-4" />
                )}
                Update Password
              </button>
            </div>

            <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-800">
              <h2 className="text-xl font-semibold text-zinc-100 mb-6">Account</h2>
              
              <button
                onClick={handleSignOut}
                className="px-6 py-2 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition-colors flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          </div>
        )}

        {/* Privacy Settings */}
        {activeTab === 'privacy' && (
          <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-800">
            <h2 className="text-xl font-semibold text-zinc-100 mb-6">Privacy Settings</h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-zinc-100 mb-2">Profile Visibility</h3>
                <p className="text-sm text-zinc-400 mb-4">Control who can see your profile and assets</p>
                
                <div className="space-y-2">
                  <label className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="visibility"
                      className="w-4 h-4 text-blue-500"
                      checked={userPreferences.profile_visibility === 'public'}
                      onChange={() => setUserPreferences({ ...userPreferences, profile_visibility: 'public' })}
                    />
                    <div>
                      <p className="text-zinc-100">Public</p>
                      <p className="text-sm text-zinc-400">Anyone can see your profile and assets</p>
                    </div>
                  </label>
                  
                  <label className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="visibility"
                      className="w-4 h-4 text-blue-500"
                      checked={userPreferences.profile_visibility === 'private'}
                      onChange={() => setUserPreferences({ ...userPreferences, profile_visibility: 'private' })}
                    />
                    <div>
                      <p className="text-zinc-100">Private</p>
                      <p className="text-sm text-zinc-400">Only approved followers can see your assets</p>
                    </div>
                  </label>
                </div>
              </div>

              <div className="pt-4 border-t border-zinc-800">
                <h3 className="text-lg font-medium text-zinc-100 mb-4">Additional Privacy Options</h3>
                <div className="space-y-3">
                  <label className="flex items-center justify-between">
                    <div>
                      <p className="text-zinc-100">Show Email on Profile</p>
                      <p className="text-sm text-zinc-400">Allow others to see your email address</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={userPreferences.show_email}
                      onChange={(e) => setUserPreferences({ ...userPreferences, show_email: e.target.checked })}
                      className="w-4 h-4 text-blue-500 bg-zinc-700 border-zinc-600 rounded focus:ring-blue-500"
                    />
                  </label>
                  
                  <label className="flex items-center justify-between">
                    <div>
                      <p className="text-zinc-100">Analytics Tracking</p>
                      <p className="text-sm text-zinc-400">Help us improve by sharing usage data</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={userPreferences.show_analytics}
                      onChange={(e) => setUserPreferences({ ...userPreferences, show_analytics: e.target.checked })}
                      className="w-4 h-4 text-blue-500 bg-zinc-700 border-zinc-600 rounded focus:ring-blue-500"
                    />
                  </label>
                </div>
                
                <button
                  onClick={handleSavePrivacy}
                  disabled={saving}
                  className="mt-6 px-6 py-2 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {saving ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  Save Privacy Settings
                </button>
              </div>

              <div className="pt-4 border-t border-zinc-800">
                <h3 className="text-lg font-medium text-zinc-100 mb-2">Data & Privacy</h3>
                <div className="space-y-3">
                  <a href="#" className="text-blue-400 hover:text-blue-300 text-sm">Download your data</a>
                  <br />
                  <a href="#" className="text-blue-400 hover:text-blue-300 text-sm">Privacy Policy</a>
                  <br />
                  <a href="#" className="text-blue-400 hover:text-blue-300 text-sm">Terms of Service</a>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
