'use client';

import { useState, useEffect, useCallback } from 'react';
import { Check, X, User, FileText, Shield, TrendingUp, Eye, Trash2, Download } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { SupabaseAsset, Profile } from '@/types';

export default function AdminPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'assets' | 'users' | 'stats'>('assets');
  const [pendingAssets, setPendingAssets] = useState<SupabaseAsset[]>([]);
  const [approvedAssets, setApprovedAssets] = useState<SupabaseAsset[]>([]);
  const [users, setUsers] = useState<Profile[]>([]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalAssets: 0,
    totalDownloads: 0,
    pendingApprovals: 0,
    totalLikes: 0,
    totalComments: 0
  });
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch pending assets
      const { data: pending } = await supabase
        .from('assets')
        .select('*, creator:profiles!creator_id(username, is_creator)')
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

      // Fetch approved assets
      const { data: approved } = await supabase
        .from('assets')
        .select('*, creator:profiles!creator_id(username, is_creator)')
        .eq('status', 'approved')
        .order('created_at', { ascending: false })
        .limit(10);

      // Fetch all users
      const { data: allUsers } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      // Fetch stats
      const { count: userCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      const { count: assetCount } = await supabase
        .from('assets')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'approved');

      const { data: downloads } = await supabase
        .from('assets')
        .select('download_count');

      const { data: likes } = await supabase
        .from('assets')
        .select('like_count');

      const { count: commentCount } = await supabase
        .from('comments')
        .select('*', { count: 'exact', head: true });

      const totalDownloads = downloads?.reduce((sum: number, asset: any) => sum + (asset.download_count || 0), 0) || 0;
      const totalLikes = likes?.reduce((sum: number, asset: any) => sum + (asset.like_count || 0), 0) || 0;

      setPendingAssets(pending || []);
      setApprovedAssets(approved || []);
      setUsers(allUsers || []);
      setStats({
        totalUsers: userCount || 0,
        totalAssets: assetCount || 0,
        totalDownloads,
        pendingApprovals: pending?.length || 0,
        totalLikes,
        totalComments: commentCount || 0
      });
    } catch (error) {
      console.error('Error fetching admin data:', error);
      toast.error('Failed to load admin data');
    } finally {
      setLoading(false);
    }
  };

  const checkAdminAccess = useCallback(async () => {
    if (!user) {
      toast.error('Please sign in first');
      router.push('/');
      return;
    }

    try {
      // Check if user is admin in profiles table
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('id', user.id)
        .single();

      if (error || !profile?.is_admin) {
        toast.error('Access denied. Admin only.');
        router.push('/');
        return;
      }

      fetchData();
    } catch (error) {
      console.error('Error checking admin access:', error);
      router.push('/');
    }
  }, [user, router]);

  useEffect(() => {
    checkAdminAccess();
  }, [checkAdminAccess]);


  const approveAsset = async (assetId: string) => {
    try {
      const { error } = await supabase
        .from('assets')
        .update({ status: 'approved' })
        .eq('id', assetId);

      if (error) throw error;

      toast.success('Asset approved successfully');
      fetchData();
    } catch (error) {
      console.error('Error approving asset:', error);
      toast.error('Failed to approve asset');
    }
  };

  const rejectAsset = async (assetId: string) => {
    try {
      const { error } = await supabase
        .from('assets')
        .update({ status: 'rejected' })
        .eq('id', assetId);

      if (error) throw error;

      toast.success('Asset rejected');
      fetchData();
    } catch (error) {
      console.error('Error rejecting asset:', error);
      toast.error('Failed to reject asset');
    }
  };

  const deleteAsset = async (assetId: string) => {
    if (!confirm('Are you sure you want to permanently delete this asset?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('assets')
        .delete()
        .eq('id', assetId);

      if (error) throw error;

      toast.success('Asset deleted permanently');
      fetchData();
    } catch (error) {
      console.error('Error deleting asset:', error);
      toast.error('Failed to delete asset');
    }
  };

  const toggleUserAdmin = async (userId: string, makeAdmin: boolean) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ is_admin: makeAdmin })
        .eq('id', userId);

      if (error) throw error;

      toast.success(makeAdmin ? 'User granted admin access' : 'Admin access revoked');
      fetchData();
    } catch (error) {
      console.error('Error updating user admin status:', error);
      toast.error('Failed to update user admin status');
    }
  };

  const toggleUserCreator = async (userId: string, makeCreator: boolean) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ is_creator: makeCreator })
        .eq('id', userId);

      if (error) throw error;

      toast.success(makeCreator ? 'User granted creator status' : 'Creator status revoked');
      fetchData();
    } catch (error) {
      console.error('Error updating user creator status:', error);
      toast.error('Failed to update user creator status');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="text-zinc-400">Loading admin dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-zinc-100 mb-2">Admin Dashboard</h1>
          <p className="text-zinc-400">Manage creators, assets, and platform settings</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-zinc-400 text-sm">Total Users</p>
                <p className="text-2xl font-bold text-zinc-100">{stats.totalUsers}</p>
              </div>
              <User className="w-8 h-8 text-blue-500" />
            </div>
          </div>
          <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-zinc-400 text-sm">Total Assets</p>
                <p className="text-2xl font-bold text-zinc-100">{stats.totalAssets}</p>
              </div>
              <FileText className="w-8 h-8 text-green-500" />
            </div>
          </div>
          <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-zinc-400 text-sm">Total Downloads</p>
                <p className="text-2xl font-bold text-zinc-100">{stats.totalDownloads}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-purple-500" />
            </div>
          </div>
          <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-zinc-400 text-sm">Pending</p>
                <p className="text-2xl font-bold text-zinc-100">{stats.pendingApprovals}</p>
              </div>
              <Shield className="w-8 h-8 text-orange-500" />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setActiveTab('assets')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'assets'
                ? 'bg-blue-500 text-white'
                : 'bg-zinc-900 text-zinc-400 hover:text-zinc-100'
            }`}
          >
            Assets ({pendingAssets.length} pending)
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'users'
                ? 'bg-blue-500 text-white'
                : 'bg-zinc-900 text-zinc-400 hover:text-zinc-100'
            }`}
          >
            Users ({users.length})
          </button>
          <button
            onClick={() => setActiveTab('stats')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'stats'
                ? 'bg-blue-500 text-white'
                : 'bg-zinc-900 text-zinc-400 hover:text-zinc-100'
            }`}
          >
            Statistics
          </button>
        </div>

        {/* Content */}
        <div className="bg-zinc-900 rounded-xl border border-zinc-800">

          {activeTab === 'assets' && (
            <div className="p-6">
              <h2 className="text-xl font-bold text-zinc-100 mb-4">Asset Management</h2>
              
              {/* Pending Assets */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-zinc-200 mb-3">Pending Approval ({pendingAssets.length})</h3>
                {pendingAssets.length === 0 ? (
                  <p className="text-zinc-400">No pending assets</p>
                ) : (
                  <div className="space-y-4">
                    {pendingAssets.map((asset) => (
                      <div key={asset.id} className="bg-zinc-800 rounded-lg p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex gap-4">
                            {asset.preview_url && (
                              <img
                                src={asset.preview_url}
                                alt={asset.title}
                                className="w-20 h-20 rounded-lg object-cover"
                              />
                            )}
                            <div>
                              <h3 className="font-medium text-zinc-100">{asset.title}</h3>
                              <p className="text-sm text-zinc-400">By {asset.creator?.username || 'Unknown'}</p>
                              <p className="text-sm text-zinc-500 mt-1">{asset.description}</p>
                              <div className="flex gap-2 mt-2">
                                <span className="px-2 py-1 bg-zinc-700 text-zinc-300 rounded text-xs">
                                  {asset.platform}
                                </span>
                                <span className="px-2 py-1 bg-zinc-700 text-zinc-300 rounded text-xs">
                                  {asset.format}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <a
                              href={asset.preview_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-2 bg-zinc-700 text-zinc-300 rounded-lg hover:bg-zinc-600 transition-colors"
                              title="View Preview"
                            >
                              <Eye className="w-5 h-5" />
                            </a>
                            <a
                              href={asset.file_url}
                              download
                              className="p-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors"
                              title="Download Asset"
                            >
                              <Download className="w-5 h-5" />
                            </a>
                            <button
                              onClick={() => approveAsset(asset.id)}
                              className="p-2 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30 transition-colors"
                              title="Approve"
                            >
                              <Check className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => rejectAsset(asset.id)}
                              className="p-2 bg-orange-500/20 text-orange-400 rounded-lg hover:bg-orange-500/30 transition-colors"
                              title="Reject"
                            >
                              <X className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => deleteAsset(asset.id)}
                              className="p-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
                              title="Delete Permanently"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Recently Approved */}
              <div>
                <h3 className="text-lg font-semibold text-zinc-200 mb-3">Recently Approved</h3>
                {approvedAssets.length === 0 ? (
                  <p className="text-zinc-400">No approved assets yet</p>
                ) : (
                  <div className="space-y-2">
                    {approvedAssets.map((asset) => (
                      <div key={asset.id} className="bg-zinc-800 rounded-lg p-3 flex items-center gap-3">
                        {asset.preview_url && (
                          <img
                            src={asset.preview_url}
                            alt={asset.title}
                            className="w-12 h-12 rounded object-cover"
                          />
                        )}
                        <div className="flex-1">
                          <h4 className="text-sm font-medium text-zinc-100">{asset.title}</h4>
                          <p className="text-xs text-zinc-400">{asset.creator?.username}</p>
                        </div>
                        <div className="flex gap-1">
                          <a
                            href={asset.file_url}
                            download
                            className="p-1.5 bg-blue-500/20 text-blue-400 rounded hover:bg-blue-500/30 transition-colors"
                            title="Download"
                          >
                            <Download className="w-4 h-4" />
                          </a>
                          <button
                            onClick={() => deleteAsset(asset.id)}
                            className="p-1.5 bg-red-500/20 text-red-400 rounded hover:bg-red-500/30 transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'users' && (
            <div className="p-6">
              <h2 className="text-xl font-bold text-zinc-100 mb-4">User Management</h2>
              <div className="space-y-2">
                {users.map((user) => (
                  <div key={user.id} className="bg-zinc-800 rounded-lg p-4 flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-zinc-100">{user.username || user.display_name || 'No username'}</h3>
                      <div className="flex gap-4 mt-1">
                        <span className="text-sm text-zinc-400">
                          Followers: {user.follower_count || 0}
                        </span>
                        <span className="text-sm text-zinc-400">
                          Following: {user.following_count || 0}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {user.is_admin ? (
                        <span className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full text-sm">Admin</span>
                      ) : (
                        <button
                          onClick={() => toggleUserAdmin(user.id, true)}
                          className="px-3 py-1 bg-zinc-700 text-zinc-300 rounded-full text-sm hover:bg-purple-500/20 hover:text-purple-400"
                        >
                          Make Admin
                        </button>
                      )}
                      {user.is_creator ? (
                        <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm">Creator</span>
                      ) : (
                        <button
                          onClick={() => toggleUserCreator(user.id, true)}
                          className="px-3 py-1 bg-zinc-700 text-zinc-300 rounded-full text-sm hover:bg-blue-500/20 hover:text-blue-400"
                        >
                          Make Creator
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'stats' && (
            <div className="p-6">
              <h2 className="text-xl font-bold text-zinc-100 mb-4">Platform Statistics</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-zinc-800 rounded-lg p-4">
                  <p className="text-zinc-400 text-sm mb-1">Total Likes</p>
                  <p className="text-2xl font-bold text-zinc-100">{stats.totalLikes}</p>
                </div>
                <div className="bg-zinc-800 rounded-lg p-4">
                  <p className="text-zinc-400 text-sm mb-1">Total Comments</p>
                  <p className="text-2xl font-bold text-zinc-100">{stats.totalComments}</p>
                </div>
                <div className="bg-zinc-800 rounded-lg p-4">
                  <p className="text-zinc-400 text-sm mb-1">Avg Downloads/Asset</p>
                  <p className="text-2xl font-bold text-zinc-100">
                    {stats.totalAssets > 0 ? Math.round(stats.totalDownloads / stats.totalAssets) : 0}
                  </p>
                </div>
                <div className="bg-zinc-800 rounded-lg p-4">
                  <p className="text-zinc-400 text-sm mb-1">Approval Rate</p>
                  <p className="text-2xl font-bold text-zinc-100">
                    {approvedAssets.length > 0 ? 
                      Math.round((approvedAssets.length / (approvedAssets.length + pendingAssets.length)) * 100) : 0}%
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
