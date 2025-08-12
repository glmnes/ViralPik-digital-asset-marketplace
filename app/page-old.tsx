'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import MasonryGrid from '@/components/MasonryGrid';
import { Asset, Platform, SupabaseAsset } from '@/types';
import { mockAssets, generateMockAssets, platformConfig } from '@/lib/mockData';
import { Sparkles, X } from 'lucide-react';

export default function Home() {
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get('search') || '';
  
  const [allAssets, setAllAssets] = useState<(SupabaseAsset & { asset_type?: string })[]>([]);

  // Convert Asset to SupabaseAsset
  const convertToSupabaseAsset = (asset: Asset): SupabaseAsset & { asset_type?: string } => {
    return {
      id: asset.id,
      title: asset.title,
      description: '',
      preview_url: asset.preview_url,
      file_url: asset.file_url,
      category: asset.category_id || '',
      platform: asset.platform,
      format: asset.format || 'PNG',
      platforms: [asset.platform],
      tags: asset.tags || [],
      downloads: asset.download_count || 0,
      likes: 0,
      download_count: asset.download_count || 0,
      like_count: 0,
      view_count: asset.view_count || 0,
      status: 'approved',
      created_at: asset.created_at,
      created_by: asset.created_by || '',
      creator_id: asset.created_by || '',
      creator: undefined,
      asset_type: asset.asset_type // Keep asset_type for filtering
    };
  };
  const [activePlatform, setActivePlatform] = useState<Platform>('youtube');
  const [activeAssetType, setActiveAssetType] = useState<string>('');
  const [activeSort, setActiveSort] = useState<'viral' | 'fresh' | 'legendary'>('viral');
  const [loading, setLoading] = useState(true);

  // Load all assets on mount
  useEffect(() => {
    const loadAssets = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const assets = [...mockAssets, ...generateMockAssets(200)];
      const convertedAssets = assets.map(convertToSupabaseAsset);
      setAllAssets(convertedAssets);
      setLoading(false);
    };

    loadAssets();
  }, []);

  // Set default asset type when platform changes
  useEffect(() => {
    const platformData = platformConfig[activePlatform];
    setActiveAssetType(platformData.assetTypes[0]);
  }, [activePlatform]);

  // Get filtered and sorted assets
  const getFilteredAssets = () => {
    let filtered = allAssets;
    
    // Apply search filter if there's a search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(asset => 
        asset.title.toLowerCase().includes(query) ||
        asset.tags.some(tag => tag.toLowerCase().includes(query)) ||
        (asset.asset_type && asset.asset_type.toLowerCase().includes(query)) ||
        asset.platform.toLowerCase().includes(query)
      );
    } else {
      // Apply platform and asset type filters only when not searching
      filtered = filtered.filter(asset => 
        asset.platform === activePlatform && 
        (activeAssetType === '' || asset.asset_type === activeAssetType)
      );
    }
    
    switch (activeSort) {
      case 'viral':
        // Viral Now - trending algorithm
        return filtered.sort((a, b) => {
          const scoreA = (a.download_count || 0) * 0.7 + (new Date().getTime() - new Date(a.created_at).getTime()) / 100000000;
          const scoreB = (b.download_count || 0) * 0.7 + (new Date().getTime() - new Date(b.created_at).getTime()) / 100000000;
          return scoreB - scoreA;
        }).slice(0, 12);
      
      case 'fresh':
        // Fresh Drops - newest first
        return filtered.sort((a, b) => 
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        ).slice(0, 12);
      
      case 'legendary':
        // Legendary - most downloaded
        return filtered.sort((a, b) => (b.download_count || 0) - (a.download_count || 0)).slice(0, 12);
      
      default:
        return filtered.slice(0, 12);
    }
  };

  // Handle download
  const handleDownload = async (assetId: string) => {
    setAllAssets(prev => prev.map(asset => 
      asset.id === assetId 
        ? { ...asset, download_count: (asset.download_count || 0) + 1 }
        : asset
    ));
  };

  const sortOptions = [
    {
      id: 'viral' as const,
      title: '🔥 Viral Now',
      description: 'Catching fire right now'
    },
    {
      id: 'fresh' as const,
      title: '⚡ Fresh Drops',
      description: 'Just landed'
    },
    {
      id: 'legendary' as const,
      title: '👑 Legendary',
      description: 'Hall of fame worthy'
    }
  ];

  const platforms = Object.entries(platformConfig).map(([key, config]) => ({
    id: key as Platform,
    ...config
  }));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <div className="flex items-center justify-center mb-4">
          <Sparkles className="w-8 h-8 text-blue-400 mr-2" />
          <h1 className="text-4xl font-bold text-zinc-100">
            Go <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">Viral</span> or Go Home
          </h1>
        </div>
        <p className="text-lg text-zinc-400 max-w-2xl mx-auto">
          The secret sauce to your next viral moment. Platform-specific assets that actually work.
        </p>
      </div>

      {/* Platform Selector */}
      <div className="flex flex-wrap justify-center gap-3 mb-8">
        {platforms.map((platform) => (
          <button
            key={platform.id}
            onClick={() => setActivePlatform(platform.id)}
            className={`
              relative px-6 py-3 rounded-xl font-medium transition-all duration-300
              ${
                activePlatform === platform.id
                  ? 'bg-zinc-900 text-white border-2 border-zinc-700 shadow-lg shadow-blue-500/10'
                  : 'bg-zinc-900/50 text-zinc-400 border-2 border-zinc-800 hover:border-zinc-700 hover:text-zinc-200'
              }
            `}
          >
            <div className="flex items-center space-x-2">
              {(() => {
                const Icon = platform.icon;
                return Icon ? <Icon className="w-5 h-5" /> : null;
              })()}
              <span>{platform.name}</span>
            </div>
            {activePlatform === platform.id && (
              <div className={`absolute -bottom-0.5 left-2 right-2 h-0.5 bg-gradient-to-r ${platform.color}`} />
            )}
          </button>
        ))}
      </div>

      {/* Asset Type Tabs */}
      <div className="flex flex-wrap justify-center gap-2 mb-6">
        {platformConfig[activePlatform].assetTypes.map((type) => (
          <button
            key={type}
            onClick={() => setActiveAssetType(type)}
            className={`
              px-4 py-2 rounded-lg text-sm font-medium transition-all capitalize
              ${
                activeAssetType === type
                  ? 'bg-blue-500/20 text-blue-400 border border-blue-500/50'
                  : 'bg-zinc-800/50 text-zinc-500 border border-zinc-800 hover:text-zinc-300 hover:border-zinc-700'
              }
            `}
          >
            {type.replace('-', ' ')}
          </button>
        ))}
      </div>

      {/* Sort Options */}
      <div className="flex flex-wrap justify-center gap-3 mb-8">
        {sortOptions.map((option) => (
          <button
            key={option.id}
            onClick={() => setActiveSort(option.id)}
            className={`
              px-4 py-2 rounded-lg text-sm transition-all
              ${
                activeSort === option.id
                  ? 'bg-zinc-800 text-white border border-zinc-700'
                  : 'text-zinc-500 hover:text-zinc-300'
              }
            `}
          >
            {option.title}
          </button>
        ))}
      </div>

      {/* Search Results Indicator */}
      {searchQuery && (
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-zinc-900 rounded-lg border border-zinc-800">
            <span className="text-zinc-400">Searching for:</span>
            <span className="text-white font-medium">&quot;{searchQuery}&quot;</span>
            <Link 
              href="/"
              className="ml-2 p-1 hover:bg-zinc-800 rounded transition-colors"
            >
              <X className="w-4 h-4 text-zinc-500" />
            </Link>
          </div>
          <p className="text-sm text-zinc-500 mt-2">
            {getFilteredAssets().length} results found
          </p>
        </div>
      )}

      {/* Sort Description */}
      {!searchQuery && (
        <div className="text-center mb-8">
          <p className="text-sm text-zinc-500">
            {sortOptions.find(s => s.id === activeSort)?.description}
          </p>
        </div>
      )}

      {/* Assets Grid */}
      <MasonryGrid
        assets={getFilteredAssets()}
        loading={loading}
        hasMore={false}
        onDownload={handleDownload}
      />

      {/* View More */}
      {!loading && getFilteredAssets().length >= 12 && (
        <div className="text-center mt-12">
          <button className="px-8 py-3 bg-zinc-900 text-zinc-300 rounded-lg border border-zinc-800 hover:border-zinc-700 hover:text-white transition-all duration-300">
            Load More {activePlatform === 'fx' ? 'Effects' : platformConfig[activePlatform].name} Assets
          </button>
        </div>
      )}
    </div>
  );
}
