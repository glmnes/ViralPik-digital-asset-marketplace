'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  TrendingUp,
  BarChart3,
  Package,
  Upload,
  DollarSign,
  Settings,
  Eye,
  Download,
  Heart,
  Users,
  Globe,
  Calendar,
  ArrowUp,
  ArrowDown,
  Activity,
  PieChart
} from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabaseClient';
import { toast } from 'sonner';

interface AnalyticsData {
  overview: {
    total_views: number;
    total_downloads: number;
    total_likes: number;
    engagement_rate: number;
    conversion_rate: number;
    avg_rating: number;
  };
  performance: {
    views_change: number;
    downloads_change: number;
    likes_change: number;
    earnings_change: number;
  };
  top_assets: {
    id: string;
    title: string;
    views: number;
    downloads: number;
    likes: number;
    earnings: number;
  }[];
  platforms: {
    platform: string;
    assets: number;
    views: number;
    downloads: number;
  }[];
  daily_stats: {
    date: string;
    views: number;
    downloads: number;
  }[];
  demographics: {
    country: string;
    downloads: number;
    percentage: number;
  }[];
}

export default function ContributorAnalyticsPage() {
  const router = useRouter();
  const { user, profile, loading } = useAuth();
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData>({
    overview: {
      total_views: 0,
      total_downloads: 0,
      total_likes: 0,
      engagement_rate: 0,
      conversion_rate: 0,
      avg_rating: 0
    },
    performance: {
      views_change: 0,
      downloads_change: 0,
      likes_change: 0,
      earnings_change: 0
    },
    top_assets: [],
    platforms: [],
    daily_stats: [],
    demographics: []
  });
  const [loadingData, setLoadingData] = useState(true);
  const [timeRange, setTimeRange] = useState('30d');

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
      fetchAnalyticsData();
    }
  }, [user, profile, loading, router, timeRange]);

  const fetchAnalyticsData = async () => {
    try {
      // Fetch all assets for the user
      const { data: assets, error } = await supabase
        .from('assets')
        .select('*')
        .eq('creator_id', user?.id);

      if (error) throw error;

      if (assets && assets.length > 0) {
        // Calculate overview stats
        const totalViews = assets.reduce((sum: number, a: any) => sum + a.view_count, 0);
        const totalDownloads = assets.reduce((sum: number, a: any) => sum + a.download_count, 0);
        const totalLikes = assets.reduce((sum: number, a: any) => sum + a.like_count, 0);
        const engagementRate = totalViews > 0 ? ((totalLikes + totalDownloads) / totalViews) * 100 : 0;
        const conversionRate = totalViews > 0 ? (totalDownloads / totalViews) * 100 : 0;

        // Calculate performance changes (mock data)
        const performance = {
          views_change: Math.random() * 40 - 10, // -10% to +30%
          downloads_change: Math.random() * 30 - 5, // -5% to +25%
          likes_change: Math.random() * 50 - 10, // -10% to +40%
          earnings_change: Math.random() * 35 - 5 // -5% to +30%
        };

        // Get top performing assets
        const topAssets = assets
          .sort((a: any, b: any) => b.download_count - a.download_count)
          .slice(0, 5)
          .map((asset: any) => ({
            id: asset.id,
            title: asset.title,
            views: asset.view_count,
            downloads: asset.download_count,
            likes: asset.like_count,
            earnings: asset.is_premium ? asset.download_count * asset.price * 0.7 : 0
          }));

        // Group by platform
        const platformMap = new Map();
        assets.forEach((asset: any) => {
          const existing = platformMap.get(asset.platform) || {
            platform: asset.platform,
            assets: 0,
            views: 0,
            downloads: 0
          };
          existing.assets += 1;
          existing.views += asset.view_count;
          existing.downloads += asset.download_count;
          platformMap.set(asset.platform, existing);
        });
        const platforms = Array.from(platformMap.values());

        // Generate daily stats (mock data)
        const dailyStats = [];
        const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90;
        for (let i = days - 1; i >= 0; i--) {
          const date = new Date();
          date.setDate(date.getDate() - i);
          dailyStats.push({
            date: date.toISOString().split('T')[0],
            views: Math.floor(Math.random() * 100) + 20,
            downloads: Math.floor(Math.random() * 20) + 2
          });
        }

        // Mock demographics data
        const demographics = [
          { country: 'United States', downloads: Math.floor(totalDownloads * 0.35), percentage: 35 },
          { country: 'United Kingdom', downloads: Math.floor(totalDownloads * 0.15), percentage: 15 },
          { country: 'Canada', downloads: Math.floor(totalDownloads * 0.12), percentage: 12 },
          { country: 'Germany', downloads: Math.floor(totalDownloads * 0.10), percentage: 10 },
          { country: 'France', downloads: Math.floor(totalDownloads * 0.08), percentage: 8 },
          { country: 'Others', downloads: Math.floor(totalDownloads * 0.20), percentage: 20 }
        ];

        setAnalyticsData({
          overview: {
            total_views: totalViews,
            total_downloads: totalDownloads,
            total_likes: totalLikes,
            engagement_rate: engagementRate,
            conversion_rate: conversionRate,
            avg_rating: 4.5 + Math.random() * 0.5 // Mock rating between 4.5-5.0
          },
          performance,
          top_assets: topAssets,
          platforms,
          daily_stats: dailyStats,
          demographics
        });
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
      toast.error('Failed to load analytics data');
    } finally {
      setLoadingData(false);
    }
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const getChangeIcon = (change: number) => {
    return change >= 0 ? (
      <ArrowUp className="w-4 h-4 text-green-400" />
    ) : (
      <ArrowDown className="w-4 h-4 text-red-400" />
    );
  };

  if (loading || loadingData) {
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
              <Link href="/contributor/analytics" className="flex items-center gap-3 px-3 py-2 bg-zinc-800 text-zinc-100 rounded-lg">
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
                <h1 className="text-2xl font-bold text-zinc-100">Analytics</h1>
                <p className="text-zinc-400 mt-1">Track your performance and insights</p>
              </div>
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
              </select>
            </div>
          </div>

          <div className="p-8">
            {/* Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
              <div className="bg-zinc-900 rounded-xl p-4 border border-zinc-800">
                <div className="flex items-center justify-between mb-2">
                  <Eye className="w-5 h-5 text-zinc-500" />
                  <div className="flex items-center gap-1">
                    {getChangeIcon(analyticsData.performance.views_change)}
                    <span className={`text-xs ${analyticsData.performance.views_change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {Math.abs(analyticsData.performance.views_change).toFixed(1)}%
                    </span>
                  </div>
                </div>
                <p className="text-zinc-400 text-sm mb-1">Total Views</p>
                <p className="text-2xl font-bold text-zinc-100">
                  {formatNumber(analyticsData.overview.total_views)}
                </p>
              </div>

              <div className="bg-zinc-900 rounded-xl p-4 border border-zinc-800">
                <div className="flex items-center justify-between mb-2">
                  <Download className="w-5 h-5 text-zinc-500" />
                  <div className="flex items-center gap-1">
                    {getChangeIcon(analyticsData.performance.downloads_change)}
                    <span className={`text-xs ${analyticsData.performance.downloads_change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {Math.abs(analyticsData.performance.downloads_change).toFixed(1)}%
                    </span>
                  </div>
                </div>
                <p className="text-zinc-400 text-sm mb-1">Downloads</p>
                <p className="text-2xl font-bold text-zinc-100">
                  {formatNumber(analyticsData.overview.total_downloads)}
                </p>
              </div>

              <div className="bg-zinc-900 rounded-xl p-4 border border-zinc-800">
                <div className="flex items-center justify-between mb-2">
                  <Heart className="w-5 h-5 text-zinc-500" />
                  <div className="flex items-center gap-1">
                    {getChangeIcon(analyticsData.performance.likes_change)}
                    <span className={`text-xs ${analyticsData.performance.likes_change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {Math.abs(analyticsData.performance.likes_change).toFixed(1)}%
                    </span>
                  </div>
                </div>
                <p className="text-zinc-400 text-sm mb-1">Total Likes</p>
                <p className="text-2xl font-bold text-zinc-100">
                  {formatNumber(analyticsData.overview.total_likes)}
                </p>
              </div>

              <div className="bg-zinc-900 rounded-xl p-4 border border-zinc-800">
                <div className="flex items-center justify-between mb-2">
                  <Activity className="w-5 h-5 text-zinc-500" />
                </div>
                <p className="text-zinc-400 text-sm mb-1">Engagement</p>
                <p className="text-2xl font-bold text-zinc-100">
                  {analyticsData.overview.engagement_rate.toFixed(1)}%
                </p>
              </div>

              <div className="bg-zinc-900 rounded-xl p-4 border border-zinc-800">
                <div className="flex items-center justify-between mb-2">
                  <TrendingUp className="w-5 h-5 text-zinc-500" />
                </div>
                <p className="text-zinc-400 text-sm mb-1">Conversion</p>
                <p className="text-2xl font-bold text-zinc-100">
                  {analyticsData.overview.conversion_rate.toFixed(1)}%
                </p>
              </div>

              <div className="bg-zinc-900 rounded-xl p-4 border border-zinc-800">
                <div className="flex items-center justify-between mb-2">
                  <PieChart className="w-5 h-5 text-zinc-500" />
                </div>
                <p className="text-zinc-400 text-sm mb-1">Avg Rating</p>
                <p className="text-2xl font-bold text-zinc-100">
                  {analyticsData.overview.avg_rating.toFixed(1)}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {/* Views & Downloads Chart */}
              <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-800">
                <h2 className="text-lg font-semibold text-zinc-100 mb-4">Views & Downloads Trend</h2>
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {analyticsData.daily_stats.map((stat, index) => (
                    <div key={stat.date} className="flex items-center justify-between">
                      <span className="text-sm text-zinc-400">
                        {new Date(stat.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </span>
                      <div className="flex-1 mx-4 flex gap-2">
                        <div className="flex-1 bg-zinc-800 rounded-full h-6 relative">
                          <div 
                            className="absolute inset-y-0 left-0 bg-blue-500 rounded-full"
                            style={{ width: `${(stat.views / Math.max(...analyticsData.daily_stats.map(s => s.views))) * 100}%` }}
                          />
                          <span className="absolute inset-0 flex items-center justify-center text-xs text-zinc-300">
                            {stat.views}
                          </span>
                        </div>
                        <div className="flex-1 bg-zinc-800 rounded-full h-6 relative">
                          <div 
                            className="absolute inset-y-0 left-0 bg-green-500 rounded-full"
                            style={{ width: `${(stat.downloads / Math.max(...analyticsData.daily_stats.map(s => s.downloads))) * 100}%` }}
                          />
                          <span className="absolute inset-0 flex items-center justify-center text-xs text-zinc-300">
                            {stat.downloads}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-center gap-6 mt-4 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span className="text-zinc-400">Views</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-zinc-400">Downloads</span>
                  </div>
                </div>
              </div>

              {/* Top Assets */}
              <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-800">
                <h2 className="text-lg font-semibold text-zinc-100 mb-4">Top Performing Assets</h2>
                <div className="space-y-3">
                  {analyticsData.top_assets.length === 0 ? (
                    <p className="text-zinc-400 text-center py-8">No assets data available</p>
                  ) : (
                    analyticsData.top_assets.map((asset, index) => (
                      <div key={asset.id} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="text-zinc-500 font-medium w-6">#{index + 1}</span>
                          <div>
                            <p className="text-zinc-100 font-medium text-sm truncate max-w-[200px]">
                              {asset.title}
                            </p>
                            <div className="flex items-center gap-3 text-xs text-zinc-500 mt-1">
                              <span className="flex items-center gap-1">
                                <Eye className="w-3 h-3" />
                                {formatNumber(asset.views)}
                              </span>
                              <span className="flex items-center gap-1">
                                <Download className="w-3 h-3" />
                                {formatNumber(asset.downloads)}
                              </span>
                              <span className="flex items-center gap-1">
                                <Heart className="w-3 h-3" />
                                {formatNumber(asset.likes)}
                              </span>
                            </div>
                          </div>
                        </div>
                        {asset.earnings > 0 && (
                          <span className="text-green-400 font-medium text-sm">
                            ${asset.earnings.toFixed(2)}
                          </span>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Platform Distribution */}
              <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-800">
                <h2 className="text-lg font-semibold text-zinc-100 mb-4">Platform Distribution</h2>
                <div className="space-y-4">
                  {analyticsData.platforms.map((platform) => (
                    <div key={platform.platform}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-zinc-100 font-medium">{platform.platform}</span>
                        <span className="text-zinc-400">{platform.assets} assets</span>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-xs">
                        <div className="bg-zinc-800 rounded px-2 py-1">
                          <span className="text-zinc-500">Views: </span>
                          <span className="text-zinc-300">{formatNumber(platform.views)}</span>
                        </div>
                        <div className="bg-zinc-800 rounded px-2 py-1">
                          <span className="text-zinc-500">Downloads: </span>
                          <span className="text-zinc-300">{formatNumber(platform.downloads)}</span>
                        </div>
                        <div className="bg-zinc-800 rounded px-2 py-1">
                          <span className="text-zinc-500">Conv: </span>
                          <span className="text-zinc-300">
                            {platform.views > 0 ? ((platform.downloads / platform.views) * 100).toFixed(1) : 0}%
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Geographic Distribution */}
              <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-800">
                <h2 className="text-lg font-semibold text-zinc-100 mb-4">Geographic Distribution</h2>
                <div className="space-y-3">
                  {analyticsData.demographics.map((country) => (
                    <div key={country.country}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-zinc-100 flex items-center gap-2">
                          <Globe className="w-4 h-4 text-zinc-500" />
                          {country.country}
                        </span>
                        <span className="text-zinc-400">{country.percentage}%</span>
                      </div>
                      <div className="w-full bg-zinc-800 rounded-full h-2">
                        <div 
                          className="bg-blue-500 h-2 rounded-full"
                          style={{ width: `${country.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
