'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabaseClient';
import { 
  TrendingUp, 
  Download, 
  Eye, 
  Heart, 
  DollarSign,
  Upload,
  FileText,
  Users,
  Calendar,
  BarChart3,
  Package,
  Settings,
  LogOut,
  ChevronRight,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import { SupabaseAsset, Profile } from '@/types';

interface Stats {
  totalDownloads: number;
  monthlyDownloads: number;
  totalViews: number;
  totalLikes: number;
  totalEarnings: number;
  monthlyEarnings: number;
  totalAssets: number;
  approvedAssets: number;
  pendingAssets: number;
  followers: number;
}

interface RecentAsset {
  id: string;
  title: string;
  preview_url: string;
  download_count: number;
  view_count: number;
  status: string;
  created_at: string;
}

export default function ContributorDashboard() {
  const { user, profile, loading } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState<Stats>({
    totalDownloads: 0,
    monthlyDownloads: 0,
    totalViews: 0,
    totalLikes: 0,
    totalEarnings: 0,
    monthlyEarnings: 0,
    totalAssets: 0,
    approvedAssets: 0,
    pendingAssets: 0,
    followers: 0
  });
  const [recentAssets, setRecentAssets] = useState<RecentAsset[]>([]);
  const [chartData, setChartData] = useState<any[]>([]);
  const [loadingStats, setLoadingStats] = useState(true);

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

    if (user) {
      loadDashboardData();
    }
  }, [user, profile, loading, router]);

  const loadDashboardData = async () => {
    if (!user) return;
    
    setLoadingStats(true);
    try {
      // Load user's assets
      const { data: assets, error: assetsError } = await supabase
        .from('assets')
        .select('*')
        .eq('creator_id', user.id)
        .order('created_at', { ascending: false });

      if (assetsError) throw assetsError;

      // Calculate stats
      const totalDownloads = assets?.reduce((sum: number, asset: SupabaseAsset) => sum + (asset.download_count || 0), 0) || 0;
      const totalViews = assets?.reduce((sum: number, asset: SupabaseAsset) => sum + (asset.view_count || 0), 0) || 0;
      const totalLikes = assets?.reduce((sum: number, asset: SupabaseAsset) => sum + (asset.like_count || 0), 0) || 0;
      const totalAssets = assets?.length || 0;
      const approvedAssets = assets?.filter((a: SupabaseAsset) => a.status === 'approved').length || 0;
      const pendingAssets = assets?.filter((a: SupabaseAsset) => a.status === 'pending').length || 0;

      // Get downloads from last 30 days
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const { data: recentDownloads, error: downloadsError } = await supabase
        .from('downloads')
        .select('*')
        .in('asset_id', assets?.map((a: SupabaseAsset) => a.id) || [])
        .gte('downloaded_at', thirtyDaysAgo.toISOString());

      const monthlyDownloads = recentDownloads?.length || 0;

      // Calculate earnings (example: $0.10 per download)
      const earningsPerDownload = 0.10;
      const totalEarnings = totalDownloads * earningsPerDownload;
      const monthlyEarnings = monthlyDownloads * earningsPerDownload;

      setStats({
        totalDownloads,
        monthlyDownloads,
        totalViews,
        totalLikes,
        totalEarnings,
        monthlyEarnings,
        totalAssets,
        approvedAssets,
        pendingAssets,
        followers: profile?.follower_count || 0
      });

      setRecentAssets(assets?.slice(0, 5) || []);

      // Generate chart data for last 30 days
      const chartData = [];
      for (let i = 29; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dayDownloads = recentDownloads?.filter((d: any) => {
          const downloadDate = new Date(d.downloaded_at);
          return downloadDate.toDateString() === date.toDateString();
        }).length || 0;
        
        chartData.push({
          day: date.getDate(),
          downloads: dayDownloads,
          earnings: dayDownloads * earningsPerDownload
        });
      }
      setChartData(chartData);

    } catch (error) {
      console.error('Error loading dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoadingStats(false);
    }
  };

  if (loading || loadingStats) {
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
              <Link href="/contributor" className="flex items-center gap-3 px-3 py-2 bg-zinc-800 text-zinc-100 rounded-lg">
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
              <Link href="/contributor/settings" className="flex items-center gap-3 px-3 py-2 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100 rounded-lg transition-colors">
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
                <h1 className="text-2xl font-bold text-zinc-100">Contributor Dashboard</h1>
                <p className="text-zinc-400 mt-1">Track your performance and manage your assets</p>
              </div>
              <Link 
                href="/contributor/upload"
                className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
              >
                <Upload className="w-5 h-5" />
                Upload Asset
              </Link>
            </div>
          </div>

          <div className="p-8">
            {/* Exclusivity Warning */}
            {profile?.is_approved ? (
              <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4 mb-8 flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-400 mt-0.5" />
                <div className="text-sm text-green-400">
                  Your exclusivity request has been approved. You can now earn from your assets.
                </div>
              </div>
            ) : (
              <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4 mb-8 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-yellow-400 mt-0.5" />
                <div className="text-sm text-yellow-400">
                  Your exclusivity request is pending. Earn features will be enabled once approved.
                </div>
              </div>
            )}

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-800">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-zinc-400 text-sm">Today</span>
                  <Download className="w-5 h-5 text-zinc-500" />
                </div>
                <div className="text-2xl font-bold text-zinc-100">
                  {stats.monthlyDownloads}
                </div>
                <div className="text-xs text-zinc-500 mt-1">
                  {stats.totalDownloads} total downloads
                </div>
              </div>

              <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-800">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-zinc-400 text-sm">This Month</span>
                  <DollarSign className="w-5 h-5 text-zinc-500" />
                </div>
                <div className="text-2xl font-bold text-zinc-100">
                  ${stats.monthlyEarnings.toFixed(2)}
                </div>
                <div className="text-xs text-zinc-500 mt-1">
                  ${stats.totalEarnings.toFixed(2)} total earnings
                </div>
              </div>

              <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-800">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-zinc-400 text-sm">Last 7 days</span>
                  <Eye className="w-5 h-5 text-zinc-500" />
                </div>
                <div className="text-2xl font-bold text-zinc-100">
                  {stats.totalViews}
                </div>
                <div className="text-xs text-zinc-500 mt-1">
                  Total views
                </div>
              </div>

              <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-800">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-zinc-400 text-sm">Last 30 days</span>
                  <Heart className="w-5 h-5 text-zinc-500" />
                </div>
                <div className="text-2xl font-bold text-zinc-100">
                  {stats.totalLikes}
                </div>
                <div className="text-xs text-zinc-500 mt-1">
                  Total likes
                </div>
              </div>
            </div>

            {/* Chart */}
            <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-800 mb-8">
              <h2 className="text-lg font-semibold text-zinc-100 mb-6">Performance (Last 30 days)</h2>
              <div className="h-64 flex items-end gap-1">
                {chartData.map((day, index) => (
                  <div key={index} className="flex-1 flex flex-col items-center">
                    <div 
                      className="w-full bg-blue-500 rounded-t transition-all hover:bg-blue-400"
                      style={{ 
                        height: `${Math.max(10, (day.downloads / Math.max(...chartData.map(d => d.downloads)) * 100))}%` 
                      }}
                    />
                    {index % 5 === 0 && (
                      <span className="text-xs text-zinc-500 mt-2">{day.day}</span>
                    )}
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-6 mt-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full" />
                  <span className="text-sm text-zinc-400">Downloads</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full" />
                  <span className="text-sm text-zinc-400">Earnings</span>
                </div>
              </div>
            </div>

            {/* Recent Assets */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-800">
                <h2 className="text-lg font-semibold text-zinc-100 mb-4">Your Top Assets</h2>
                <div className="space-y-3">
                  {recentAssets.slice(0, 3).map((asset) => (
                    <div key={asset.id} className="flex items-center gap-3 p-3 bg-zinc-800 rounded-lg">
                      <img 
                        src={asset.preview_url} 
                        alt={asset.title}
                        className="w-12 h-12 rounded object-cover"
                      />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-zinc-100">{asset.title}</p>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="text-xs text-zinc-400 flex items-center gap-1">
                            <Download className="w-3 h-3" />
                            {asset.download_count}
                          </span>
                          <span className="text-xs text-zinc-400 flex items-center gap-1">
                            <Eye className="w-3 h-3" />
                            {asset.view_count}
                          </span>
                        </div>
                      </div>
                      <Link href={`/contributor/assets/${asset.id}`}>
                        <ChevronRight className="w-5 h-5 text-zinc-400" />
                      </Link>
                    </div>
                  ))}
                </div>
                <Link 
                  href="/contributor/assets"
                  className="block text-center text-sm text-blue-400 hover:text-blue-300 mt-4"
                >
                  View all assets
                </Link>
              </div>

              <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-800">
                <h2 className="text-lg font-semibold text-zinc-100 mb-4">Quick Stats</h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-400">Total Assets</span>
                    <span className="text-zinc-100 font-medium">{stats.totalAssets}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-400">Approved</span>
                    <span className="text-green-400 font-medium">{stats.approvedAssets}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-400">Pending Review</span>
                    <span className="text-yellow-400 font-medium">{stats.pendingAssets}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-400">Followers</span>
                    <span className="text-zinc-100 font-medium">{stats.followers}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-400">Avg. Downloads/Asset</span>
                    <span className="text-zinc-100 font-medium">
                      {stats.totalAssets > 0 ? (stats.totalDownloads / stats.totalAssets).toFixed(1) : 0}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
