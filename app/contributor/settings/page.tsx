'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Settings,
  BarChart3,
  Package,
  Upload,
  DollarSign,
  TrendingUp,
  User,
  Mail,
  Lock,
  Bell,
  CreditCard,
  Shield,
  Globe,
  Save,
  Camera,
  AlertCircle,
  Check,
  X
} from 'lucide-react';
import Link from 'next/link';
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

interface NotificationSettings {
  email_sales: boolean;
  email_reviews: boolean;
  email_updates: boolean;
  email_marketing: boolean;
}

interface PayoutSettings {
  payout_method: 'paypal' | 'bank' | 'stripe';
  paypal_email: string;
  bank_account: string;
  stripe_account: string;
  minimum_payout: number;
}

export default function ContributorSettingsPage() {
  const router = useRouter();
  const { user, profile, loading } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [saving, setSaving] = useState(false);
  
  const [profileSettings, setProfileSettings] = useState<ProfileSettings>({
    username: '',
    email: '',
    bio: '',
    website: '',
    twitter: '',
    instagram: '',
    youtube: ''
  });

  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
    email_sales: true,
    email_reviews: true,
    email_updates: true,
    email_marketing: false
  });

  const [payoutSettings, setPayoutSettings] = useState<PayoutSettings>({
    payout_method: 'paypal',
    paypal_email: '',
    bank_account: '',
    stripe_account: '',
    minimum_payout: 10
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

    if (user && profile && !profile.is_creator) {
      toast.error('You need to be a verified creator to access this page');
      router.push('/');
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
    }
  }, [user, profile, loading, router]);

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
    setSaving(true);
    try {
      // In a real app, you'd save these to a user_preferences table
      toast.success('Notification preferences updated');
    } catch (error) {
      console.error('Error updating notifications:', error);
      toast.error('Failed to update notification preferences');
    } finally {
      setSaving(false);
    }
  };

  const handleSavePayout = async () => {
    if (!profile?.can_earn) {
      toast.error('Earnings are not enabled for your account');
      return;
    }

    setSaving(true);
    try {
      // In a real app, you'd save these to a payout_settings table
      toast.success('Payout settings updated');
    } catch (error) {
      console.error('Error updating payout settings:', error);
      toast.error('Failed to update payout settings');
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

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-zinc-900 min-h-screen border-r border-zinc-800">
          <div className="p-6">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">
                  {profile?.username?.[0]?.toUpperCase() || 'C'}
                </span>
              </div>
              <div>
                <h3 className="text-zinc-100 font-semibold">{profile?.username}</h3>
                <p className="text-zinc-400 text-sm">Contributor</p>
              </div>
            </div>

            <nav className="space-y-2">
              <Link href="/contributor" className="flex items-center gap-3 px-3 py-2 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100 rounded-lg transition-colors">
                <BarChart3 className="w-5 h-5" />
                <span>Dashboard</span>
              </Link>
              <Link href="/contributor/assets" className="flex items-center gap-3 px-3 py-2 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100 rounded-lg transition-colors">
                <Package className="w-5 h-5" />
                <span>My Assets</span>
              </Link>
              <Link href="/contributor/upload" className="flex items-center gap-3 px-3 py-2 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100 rounded-lg transition-colors">
                <Upload className="w-5 h-5" />
                <span>Upload</span>
              </Link>
              <Link href="/contributor/earnings" className="flex items-center gap-3 px-3 py-2 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100 rounded-lg transition-colors">
                <DollarSign className="w-5 h-5" />
                <span>Earnings</span>
              </Link>
              <Link href="/contributor/analytics" className="flex items-center gap-3 px-3 py-2 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100 rounded-lg transition-colors">
                <TrendingUp className="w-5 h-5" />
                <span>Analytics</span>
              </Link>
              <Link href="/contributor/settings" className="flex items-center gap-3 px-3 py-2 bg-zinc-800 text-zinc-100 rounded-lg">
                <Settings className="w-5 h-5" />
                <span>Settings</span>
              </Link>
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          {/* Header */}
          <div className="bg-zinc-900 border-b border-zinc-800 px-8 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-zinc-100">Settings</h1>
                <p className="text-zinc-400 mt-1">Manage your account and preferences</p>
              </div>
            </div>
          </div>

          <div className="p-8">
            <div className="max-w-4xl mx-auto">
              {/* Tabs */}
              <div className="flex gap-1 mb-8 bg-zinc-900 p-1 rounded-lg">
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`flex-1 px-4 py-2 rounded-md transition-colors ${
                    activeTab === 'profile' 
                      ? 'bg-zinc-800 text-zinc-100' 
                      : 'text-zinc-400 hover:text-zinc-100'
                  }`}
                >
                  <User className="w-4 h-4 inline mr-2" />
                  Profile
                </button>
                <button
                  onClick={() => setActiveTab('security')}
                  className={`flex-1 px-4 py-2 rounded-md transition-colors ${
                    activeTab === 'security' 
                      ? 'bg-zinc-800 text-zinc-100' 
                      : 'text-zinc-400 hover:text-zinc-100'
                  }`}
                >
                  <Lock className="w-4 h-4 inline mr-2" />
                  Security
                </button>
                <button
                  onClick={() => setActiveTab('notifications')}
                  className={`flex-1 px-4 py-2 rounded-md transition-colors ${
                    activeTab === 'notifications' 
                      ? 'bg-zinc-800 text-zinc-100' 
                      : 'text-zinc-400 hover:text-zinc-100'
                  }`}
                >
                  <Bell className="w-4 h-4 inline mr-2" />
                  Notifications
                </button>
                {profile?.can_earn && (
                  <button
                    onClick={() => setActiveTab('payout')}
                    className={`flex-1 px-4 py-2 rounded-md transition-colors ${
                      activeTab === 'payout' 
                        ? 'bg-zinc-800 text-zinc-100' 
                        : 'text-zinc-400 hover:text-zinc-100'
                    }`}
                  >
                    <CreditCard className="w-4 h-4 inline mr-2" />
                    Payout
                  </button>
                )}
              </div>

              {/* Profile Tab */}
              {activeTab === 'profile' && (
                <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-800">
                  <h2 className="text-lg font-semibold text-zinc-100 mb-6">Profile Information</h2>
                  
                  <div className="space-y-6">
                    {/* Profile Picture */}
                    <div className="flex items-center gap-6">
                      <div className="w-24 h-24 bg-zinc-800 rounded-full flex items-center justify-center">
                        <span className="text-3xl font-bold text-zinc-400">
                          {profileSettings.username?.[0]?.toUpperCase() || 'U'}
                        </span>
                      </div>
                      <button className="px-4 py-2 bg-zinc-800 text-zinc-300 rounded-lg hover:bg-zinc-700 transition-colors flex items-center gap-2">
                        <Camera className="w-4 h-4" />
                        Change Avatar
                      </button>
                    </div>

                    {/* Username */}
                    <div>
                      <label className="block text-sm font-medium text-zinc-300 mb-2">
                        Username
                      </label>
                      <input
                        type="text"
                        value={profileSettings.username}
                        onChange={(e) => setProfileSettings({ ...profileSettings, username: e.target.value })}
                        className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-sm font-medium text-zinc-300 mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        value={profileSettings.email}
                        disabled
                        className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-400 cursor-not-allowed"
                      />
                      <p className="text-xs text-zinc-500 mt-1">Email cannot be changed</p>
                    </div>

                    {/* Bio */}
                    <div>
                      <label className="block text-sm font-medium text-zinc-300 mb-2">
                        Bio
                      </label>
                      <textarea
                        value={profileSettings.bio}
                        onChange={(e) => setProfileSettings({ ...profileSettings, bio: e.target.value })}
                        rows={3}
                        className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Tell us about yourself..."
                      />
                    </div>

                    {/* Social Links */}
                    <div className="space-y-4">
                      <h3 className="text-sm font-medium text-zinc-300">Social Links</h3>
                      
                      <div>
                        <label className="block text-xs text-zinc-400 mb-1">Website</label>
                        <input
                          type="url"
                          value={profileSettings.website}
                          onChange={(e) => setProfileSettings({ ...profileSettings, website: e.target.value })}
                          className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="https://yourwebsite.com"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-xs text-zinc-400 mb-1">Twitter</label>
                          <input
                            type="text"
                            value={profileSettings.twitter}
                            onChange={(e) => setProfileSettings({ ...profileSettings, twitter: e.target.value })}
                            className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="@username"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-zinc-400 mb-1">Instagram</label>
                          <input
                            type="text"
                            value={profileSettings.instagram}
                            onChange={(e) => setProfileSettings({ ...profileSettings, instagram: e.target.value })}
                            className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="@username"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-zinc-400 mb-1">YouTube</label>
                          <input
                            type="text"
                            value={profileSettings.youtube}
                            onChange={(e) => setProfileSettings({ ...profileSettings, youtube: e.target.value })}
                            className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Channel URL"
                          />
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={handleSaveProfile}
                      disabled={saving}
                      className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      {saving ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      ) : (
                        <Save className="w-4 h-4" />
                      )}
                      Save Changes
                    </button>
                  </div>
                </div>
              )}

              {/* Security Tab */}
              {activeTab === 'security' && (
                <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-800">
                  <h2 className="text-lg font-semibold text-zinc-100 mb-6">Security Settings</h2>
                  
                  <div className="space-y-6">
                    {/* Change Password */}
                    <div>
                      <h3 className="text-sm font-medium text-zinc-300 mb-4">Change Password</h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm text-zinc-400 mb-2">
                            Current Password
                          </label>
                          <input
                            type="password"
                            value={passwordForm.current}
                            onChange={(e) => setPasswordForm({ ...passwordForm, current: e.target.value })}
                            className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-zinc-400 mb-2">
                            New Password
                          </label>
                          <input
                            type="password"
                            value={passwordForm.new}
                            onChange={(e) => setPasswordForm({ ...passwordForm, new: e.target.value })}
                            className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-zinc-400 mb-2">
                            Confirm New Password
                          </label>
                          <input
                            type="password"
                            value={passwordForm.confirm}
                            onChange={(e) => setPasswordForm({ ...passwordForm, confirm: e.target.value })}
                            className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <button
                          onClick={handleChangePassword}
                          disabled={saving || !passwordForm.current || !passwordForm.new || !passwordForm.confirm}
                          className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                          {saving ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          ) : (
                            <Lock className="w-4 h-4" />
                          )}
                          Update Password
                        </button>
                      </div>
                    </div>

                    {/* Two-Factor Authentication */}
                    <div className="pt-6 border-t border-zinc-800">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="text-sm font-medium text-zinc-300">Two-Factor Authentication</h3>
                          <p className="text-xs text-zinc-500 mt-1">Add an extra layer of security to your account</p>
                        </div>
                        <button className="px-4 py-2 bg-zinc-800 text-zinc-300 rounded-lg hover:bg-zinc-700 transition-colors">
                          Enable 2FA
                        </button>
                      </div>
                    </div>

                    {/* Active Sessions */}
                    <div className="pt-6 border-t border-zinc-800">
                      <h3 className="text-sm font-medium text-zinc-300 mb-4">Active Sessions</h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-zinc-800 rounded-lg">
                          <div className="flex items-center gap-3">
                            <Shield className="w-5 h-5 text-green-400" />
                            <div>
                              <p className="text-zinc-100 text-sm">Current Session</p>
                              <p className="text-zinc-500 text-xs">Windows • Chrome • Active now</p>
                            </div>
                          </div>
                          <span className="text-xs text-green-400">Active</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Notifications Tab */}
              {activeTab === 'notifications' && (
                <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-800">
                  <h2 className="text-lg font-semibold text-zinc-100 mb-6">Notification Preferences</h2>
                  
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <label className="flex items-center justify-between p-4 bg-zinc-800 rounded-lg cursor-pointer hover:bg-zinc-700">
                        <div className="flex items-center gap-3">
                          <Mail className="w-5 h-5 text-zinc-400" />
                          <div>
                            <p className="text-zinc-100 font-medium">Sales Notifications</p>
                            <p className="text-zinc-500 text-sm">Get notified when someone purchases your assets</p>
                          </div>
                        </div>
                        <input
                          type="checkbox"
                          checked={notificationSettings.email_sales}
                          onChange={(e) => setNotificationSettings({ ...notificationSettings, email_sales: e.target.checked })}
                          className="w-4 h-4 text-blue-500"
                        />
                      </label>

                      <label className="flex items-center justify-between p-4 bg-zinc-800 rounded-lg cursor-pointer hover:bg-zinc-700">
                        <div className="flex items-center gap-3">
                          <Mail className="w-5 h-5 text-zinc-400" />
                          <div>
                            <p className="text-zinc-100 font-medium">Review Notifications</p>
                            <p className="text-zinc-500 text-sm">Get notified when someone reviews your assets</p>
                          </div>
                        </div>
                        <input
                          type="checkbox"
                          checked={notificationSettings.email_reviews}
                          onChange={(e) => setNotificationSettings({ ...notificationSettings, email_reviews: e.target.checked })}
                          className="w-4 h-4 text-blue-500"
                        />
                      </label>

                      <label className="flex items-center justify-between p-4 bg-zinc-800 rounded-lg cursor-pointer hover:bg-zinc-700">
                        <div className="flex items-center gap-3">
                          <Mail className="w-5 h-5 text-zinc-400" />
                          <div>
                            <p className="text-zinc-100 font-medium">Platform Updates</p>
                            <p className="text-zinc-500 text-sm">Important updates about platform changes and features</p>
                          </div>
                        </div>
                        <input
                          type="checkbox"
                          checked={notificationSettings.email_updates}
                          onChange={(e) => setNotificationSettings({ ...notificationSettings, email_updates: e.target.checked })}
                          className="w-4 h-4 text-blue-500"
                        />
                      </label>

                      <label className="flex items-center justify-between p-4 bg-zinc-800 rounded-lg cursor-pointer hover:bg-zinc-700">
                        <div className="flex items-center gap-3">
                          <Mail className="w-5 h-5 text-zinc-400" />
                          <div>
                            <p className="text-zinc-100 font-medium">Marketing Emails</p>
                            <p className="text-zinc-500 text-sm">Tips, promotions, and news from our team</p>
                          </div>
                        </div>
                        <input
                          type="checkbox"
                          checked={notificationSettings.email_marketing}
                          onChange={(e) => setNotificationSettings({ ...notificationSettings, email_marketing: e.target.checked })}
                          className="w-4 h-4 text-blue-500"
                        />
                      </label>
                    </div>

                    <button
                      onClick={handleSaveNotifications}
                      disabled={saving}
                      className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      {saving ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      ) : (
                        <Save className="w-4 h-4" />
                      )}
                      Save Preferences
                    </button>
                  </div>
                </div>
              )}

              {/* Payout Tab */}
              {activeTab === 'payout' && profile?.can_earn && (
                <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-800">
                  <h2 className="text-lg font-semibold text-zinc-100 mb-6">Payout Settings</h2>
                  
                  <div className="space-y-6">
                    {/* Payout Method */}
                    <div>
                      <label className="block text-sm font-medium text-zinc-300 mb-3">
                        Payout Method
                      </label>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <label className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                          payoutSettings.payout_method === 'paypal' 
                            ? 'bg-zinc-800 border-blue-500' 
                            : 'bg-zinc-900 border-zinc-700 hover:border-zinc-600'
                        }`}>
                          <input
                            type="radio"
                            name="payout"
                            checked={payoutSettings.payout_method === 'paypal'}
                            onChange={() => setPayoutSettings({ ...payoutSettings, payout_method: 'paypal' })}
                            className="sr-only"
                          />
                          <div className="text-center">
                            <CreditCard className="w-8 h-8 mx-auto mb-2 text-zinc-400" />
                            <p className="text-zinc-100 font-medium">PayPal</p>
                          </div>
                        </label>
                        <label className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                          payoutSettings.payout_method === 'bank' 
                            ? 'bg-zinc-800 border-blue-500' 
                            : 'bg-zinc-900 border-zinc-700 hover:border-zinc-600'
                        }`}>
                          <input
                            type="radio"
                            name="payout"
                            checked={payoutSettings.payout_method === 'bank'}
                            onChange={() => setPayoutSettings({ ...payoutSettings, payout_method: 'bank' })}
                            className="sr-only"
                          />
                          <div className="text-center">
                            <CreditCard className="w-8 h-8 mx-auto mb-2 text-zinc-400" />
                            <p className="text-zinc-100 font-medium">Bank Transfer</p>
                          </div>
                        </label>
                        <label className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                          payoutSettings.payout_method === 'stripe' 
                            ? 'bg-zinc-800 border-blue-500' 
                            : 'bg-zinc-900 border-zinc-700 hover:border-zinc-600'
                        }`}>
                          <input
                            type="radio"
                            name="payout"
                            checked={payoutSettings.payout_method === 'stripe'}
                            onChange={() => setPayoutSettings({ ...payoutSettings, payout_method: 'stripe' })}
                            className="sr-only"
                          />
                          <div className="text-center">
                            <CreditCard className="w-8 h-8 mx-auto mb-2 text-zinc-400" />
                            <p className="text-zinc-100 font-medium">Stripe</p>
                          </div>
                        </label>
                      </div>
                    </div>

                    {/* Payout Details */}
                    {payoutSettings.payout_method === 'paypal' && (
                      <div>
                        <label className="block text-sm font-medium text-zinc-300 mb-2">
                          PayPal Email
                        </label>
                        <input
                          type="email"
                          value={payoutSettings.paypal_email}
                          onChange={(e) => setPayoutSettings({ ...payoutSettings, paypal_email: e.target.value })}
                          className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="your@email.com"
                        />
                      </div>
                    )}

                    {payoutSettings.payout_method === 'bank' && (
                      <div>
                        <label className="block text-sm font-medium text-zinc-300 mb-2">
                          Bank Account Details
                        </label>
                        <textarea
                          value={payoutSettings.bank_account}
                          onChange={(e) => setPayoutSettings({ ...payoutSettings, bank_account: e.target.value })}
                          rows={3}
                          className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Enter your bank account details..."
                        />
                      </div>
                    )}

                    {payoutSettings.payout_method === 'stripe' && (
                      <div>
                        <label className="block text-sm font-medium text-zinc-300 mb-2">
                          Stripe Account ID
                        </label>
                        <input
                          type="text"
                          value={payoutSettings.stripe_account}
                          onChange={(e) => setPayoutSettings({ ...payoutSettings, stripe_account: e.target.value })}
                          className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="acct_..."
                        />
                      </div>
                    )}

                    {/* Minimum Payout */}
                    <div>
                      <label className="block text-sm font-medium text-zinc-300 mb-2">
                        Minimum Payout Amount
                      </label>
                      <select
                        value={payoutSettings.minimum_payout}
                        onChange={(e) => setPayoutSettings({ ...payoutSettings, minimum_payout: Number(e.target.value) })}
                        className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value={10}>$10</option>
                        <option value={25}>$25</option>
                        <option value={50}>$50</option>
                        <option value={100}>$100</option>
                      </select>
                      <p className="text-xs text-zinc-500 mt-1">
                        Payouts will be processed when your balance reaches this amount
                      </p>
                    </div>

                    <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4 flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-yellow-400 mt-0.5" />
                      <div className="text-sm text-yellow-400">
                        <p className="font-medium mb-1">Important:</p>
                        <ul className="list-disc list-inside space-y-1 text-yellow-400/80">
                          <li>Payouts are processed weekly on Fridays</li>
                          <li>Processing time is 3-5 business days</li>
                          <li>Tax documents required for earnings over $600/year</li>
                        </ul>
                      </div>
                    </div>

                    <button
                      onClick={handleSavePayout}
                      disabled={saving}
                      className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      {saving ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      ) : (
                        <Save className="w-4 h-4" />
                      )}
                      Save Payout Settings
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
