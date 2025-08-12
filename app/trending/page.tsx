'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  Flame, 
  TrendingUp, 
  Clock, 
  Calendar,
  Star,
  Eye,
  Heart,
  Download,
  ArrowUp,
  ArrowDown,
  Minus,
  Zap,
  Award
} from 'lucide-react';

interface TrendingAsset {
  id: string;
  title: string;
  creator: string;
  price: number;
  image: string;
  currentRank: number;
  previousRank: number;
  views: number;
  viewsGrowth: number;
  likes: number;
  likesGrowth: number;
  downloads: number;
  downloadsGrowth: number;
  rating: number;
  category: string;
  tags: string[];
  trendScore: number;
  isHot?: boolean;
  isRising?: boolean;
}

const mockTrendingAssets: TrendingAsset[] = [
  {
    id: '1',
    title: 'Viral TikTok Dance Template',
    creator: 'TrendMaster',
    price: 34.99,
    image: 'https://picsum.photos/400/600?random=10',
    currentRank: 1,
    previousRank: 3,
    views: 45678,
    viewsGrowth: 234,
    likes: 8923,
    likesGrowth: 156,
    downloads: 3456,
    downloadsGrowth: 89,
    rating: 4.9,
    category: 'reels',
    tags: ['tiktok', 'dance', 'viral', 'trending'],
    trendScore: 98,
    isHot: true,
    isRising: true
  },
  {
    id: '2',
    title: 'YouTube Gaming Thumbnail Pack',
    creator: 'GamingDesigns',
    price: 29.99,
    image: 'https://picsum.photos/400/600?random=11',
    currentRank: 2,
    previousRank: 2,
    views: 38234,
    viewsGrowth: 45,
    likes: 7234,
    likesGrowth: 67,
    downloads: 2890,
    downloadsGrowth: 34,
    rating: 4.8,
    category: 'thumbnails',
    tags: ['youtube', 'gaming', 'thumbnails'],
    trendScore: 92,
    isHot: true
  },
  {
    id: '3',
    title: 'Instagram Story Highlights',
    creator: 'StoryPro',
    price: 19.99,
    image: 'https://picsum.photos/400/600?random=12',
    currentRank: 3,
    previousRank: 5,
    views: 32456,
    viewsGrowth: 178,
    likes: 6123,
    likesGrowth: 134,
    downloads: 2345,
    downloadsGrowth: 78,
    rating: 4.7,
    category: 'stories',
    tags: ['instagram', 'stories', 'highlights'],
    trendScore: 88,
    isRising: true
  },
  {
    id: '4',
    title: 'Podcast Intro Music Pack',
    creator: 'AudioMaster',
    price: 49.99,
    image: 'https://picsum.photos/400/600?random=13',
    currentRank: 4,
    previousRank: 1,
    views: 28934,
    viewsGrowth: -23,
    likes: 5234,
    likesGrowth: -12,
    downloads: 1987,
    downloadsGrowth: -5,
    rating: 4.9,
    category: 'audio',
    tags: ['podcast', 'intro', 'music', 'audio'],
    trendScore: 84
  },
  {
    id: '5',
    title: 'Twitch Stream Alerts Bundle',
    creator: 'StreamerHub',
    price: 39.99,
    image: 'https://picsum.photos/400/600?random=14',
    currentRank: 5,
    previousRank: 8,
    views: 26789,
    viewsGrowth: 198,
    likes: 4892,
    likesGrowth: 145,
    downloads: 1823,
    downloadsGrowth: 92,
    rating: 4.8,
    category: 'streaming',
    tags: ['twitch', 'alerts', 'streaming'],
    trendScore: 82,
    isRising: true
  }
];

const timeFilters = [
  { value: '24h', label: 'Last 24 Hours', icon: Clock },
  { value: '7d', label: 'Last 7 Days', icon: Calendar },
  { value: '30d', label: 'Last 30 Days', icon: Calendar },
  { value: 'all', label: 'All Time', icon: Flame }
];

const categoryFilters = [
  { value: 'all', label: 'All Categories' },
  { value: 'reels', label: 'Reels & TikToks' },
  { value: 'stories', label: 'Stories' },
  { value: 'thumbnails', label: 'Thumbnails' },
  { value: 'streaming', label: 'Streaming' },
  { value: 'audio', label: 'Audio' },
  { value: 'graphics', label: 'Graphics' }
];

export default function TrendingPage() {
  const [timeFilter, setTimeFilter] = useState('7d');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [assets] = useState<TrendingAsset[]>(mockTrendingAssets);

  const getRankChange = (current: number, previous: number) => {
    const change = previous - current;
    if (change > 0) {
      return { icon: ArrowUp, color: 'text-green-500', text: `+${change}` };
    } else if (change < 0) {
      return { icon: ArrowDown, color: 'text-red-500', text: `${change}` };
    }
    return { icon: Minus, color: 'text-zinc-500', text: '—' };
  };

  const getGrowthIndicator = (growth: number) => {
    if (growth > 100) {
      return { color: 'text-green-500', icon: '🔥' };
    } else if (growth > 50) {
      return { color: 'text-green-400', icon: '📈' };
    } else if (growth > 0) {
      return { color: 'text-yellow-500', icon: '↗' };
    } else if (growth < 0) {
      return { color: 'text-red-500', icon: '↘' };
    }
    return { color: 'text-zinc-500', icon: '→' };
  };

  return (
    <div className="min-h-screen bg-zinc-950">
      {/* Header */}
      <div className="border-b border-zinc-800 bg-zinc-900/50 backdrop-blur-sm sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                <Flame className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-zinc-100">ViralPik</span>
            </Link>
            <Link href="/explore" className="text-zinc-400 hover:text-zinc-100 transition-colors">
              Explore All →
            </Link>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="bg-gradient-to-b from-zinc-900 to-zinc-950 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-orange-500 to-red-500 rounded-full mb-6">
              <TrendingUp className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-zinc-100 mb-4">Trending Now</h1>
            <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
              Discover what's hot in the creator economy right now
            </p>
          </div>

          {/* Time Filter Tabs */}
          <div className="flex items-center justify-center gap-2 mt-8">
            {timeFilters.map((filter) => {
              const Icon = filter.icon;
              return (
                <button
                  key={filter.value}
                  onClick={() => setTimeFilter(filter.value)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
                    timeFilter === filter.value
                      ? 'bg-blue-500 text-white'
                      : 'bg-zinc-900 text-zinc-400 hover:text-zinc-100 border border-zinc-800'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {filter.label}
                </button>
              );
            })}
          </div>

          {/* Category Filter */}
          <div className="flex items-center justify-center gap-2 mt-4 flex-wrap">
            {categoryFilters.map((filter) => (
              <button
                key={filter.value}
                onClick={() => setCategoryFilter(filter.value)}
                className={`px-3 py-1 rounded-full text-sm transition-all ${
                  categoryFilter === filter.value
                    ? 'bg-zinc-800 text-zinc-100'
                    : 'text-zinc-500 hover:text-zinc-300'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Trending Metrics */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-gradient-to-br from-red-500/10 to-orange-500/10 border border-red-500/20 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-red-500/20 rounded-lg">
                <Flame className="w-6 h-6 text-red-500" />
              </div>
              <h3 className="text-lg font-semibold text-zinc-100">Hottest Assets</h3>
            </div>
            <p className="text-3xl font-bold text-zinc-100 mb-1">156</p>
            <p className="text-sm text-zinc-400">Assets trending up</p>
          </div>

          <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-green-500/20 rounded-lg">
                <Zap className="w-6 h-6 text-green-500" />
              </div>
              <h3 className="text-lg font-semibold text-zinc-100">Viral Growth</h3>
            </div>
            <p className="text-3xl font-bold text-zinc-100 mb-1">+234%</p>
            <p className="text-sm text-zinc-400">Average growth rate</p>
          </div>

          <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-purple-500/20 rounded-lg">
                <Award className="w-6 h-6 text-purple-500" />
              </div>
              <h3 className="text-lg font-semibold text-zinc-100">Top Category</h3>
            </div>
            <p className="text-3xl font-bold text-zinc-100 mb-1">Reels</p>
            <p className="text-sm text-zinc-400">Most trending category</p>
          </div>
        </div>

        {/* Trending List */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-zinc-100 mb-6">Top Trending Assets</h2>
          
          {assets.map((asset) => {
            const rankChange = getRankChange(asset.currentRank, asset.previousRank);
            const RankIcon = rankChange.icon;
            
            return (
              <div
                key={asset.id}
                className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 hover:border-zinc-700 transition-all"
              >
                <div className="flex items-center gap-6">
                  {/* Rank */}
                  <div className="text-center">
                    <div className={`text-3xl font-bold ${
                      asset.currentRank === 1 ? 'text-yellow-500' :
                      asset.currentRank === 2 ? 'text-gray-400' :
                      asset.currentRank === 3 ? 'text-orange-600' :
                      'text-zinc-400'
                    }`}>
                      #{asset.currentRank}
                    </div>
                    <div className={`flex items-center gap-1 text-sm ${rankChange.color}`}>
                      <RankIcon className="w-3 h-3" />
                      <span>{rankChange.text}</span>
                    </div>
                  </div>

                  {/* Image */}
                  <div className="relative w-24 h-24 flex-shrink-0">
                    <img
                      src={asset.image}
                      alt={asset.title}
                      className="w-full h-full object-cover rounded-lg"
                    />
                    {asset.isHot && (
                      <div className="absolute -top-2 -right-2 p-1 bg-red-500 rounded-full">
                        <Flame className="w-4 h-4 text-white" />
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="text-lg font-semibold text-zinc-100 hover:text-blue-400 transition-colors">
                          <Link href={`/asset/${asset.id}`}>{asset.title}</Link>
                        </h3>
                        <p className="text-sm text-zinc-400">
                          by <Link href={`/creator/${asset.creator}`} className="hover:text-blue-400">
                            {asset.creator}
                          </Link>
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-zinc-100">${asset.price}</div>
                        <div className="flex items-center gap-1 text-sm text-yellow-500">
                          <Star className="w-3 h-3 fill-current" />
                          <span>{asset.rating}</span>
                        </div>
                      </div>
                    </div>

                    {/* Metrics */}
                    <div className="flex items-center gap-6 text-sm">
                      <div className="flex items-center gap-2">
                        <Eye className="w-4 h-4 text-zinc-500" />
                        <span className="text-zinc-300">{asset.views.toLocaleString()}</span>
                        <span className={getGrowthIndicator(asset.viewsGrowth).color}>
                          {getGrowthIndicator(asset.viewsGrowth).icon} {Math.abs(asset.viewsGrowth)}%
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Heart className="w-4 h-4 text-zinc-500" />
                        <span className="text-zinc-300">{asset.likes.toLocaleString()}</span>
                        <span className={getGrowthIndicator(asset.likesGrowth).color}>
                          {getGrowthIndicator(asset.likesGrowth).icon} {Math.abs(asset.likesGrowth)}%
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Download className="w-4 h-4 text-zinc-500" />
                        <span className="text-zinc-300">{asset.downloads.toLocaleString()}</span>
                        <span className={getGrowthIndicator(asset.downloadsGrowth).color}>
                          {getGrowthIndicator(asset.downloadsGrowth).icon} {Math.abs(asset.downloadsGrowth)}%
                        </span>
                      </div>
                    </div>

                    {/* Trend Score */}
                    <div className="mt-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-zinc-500">Trend Score</span>
                        <span className="text-xs font-semibold text-zinc-300">{asset.trendScore}/100</span>
                      </div>
                      <div className="w-full bg-zinc-800 rounded-full h-2">
                        <div 
                          className={`h-full rounded-full transition-all ${
                            asset.trendScore > 90 ? 'bg-gradient-to-r from-red-500 to-orange-500' :
                            asset.trendScore > 70 ? 'bg-gradient-to-r from-yellow-500 to-orange-500' :
                            'bg-gradient-to-r from-blue-500 to-purple-500'
                          }`}
                          style={{ width: `${asset.trendScore}%` }}
                        />
                      </div>
                    </div>

                    {/* Tags */}
                    <div className="flex items-center gap-2 mt-3">
                      {asset.tags.slice(0, 4).map((tag) => (
                        <span key={tag} className="px-2 py-1 bg-zinc-800 text-zinc-400 rounded-full text-xs">
                          {tag}
                        </span>
                      ))}
                      {asset.isRising && (
                        <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded-full text-xs flex items-center gap-1">
                          <TrendingUp className="w-3 h-3" />
                          Rising Fast
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Load More */}
        <div className="text-center mt-12">
          <button className="px-6 py-3 bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-100 hover:bg-zinc-800 transition-colors">
            Load More Trending Assets
          </button>
        </div>
      </div>
    </div>
  );
}
