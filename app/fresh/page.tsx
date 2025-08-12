'use client';

import { useState, useEffect, useCallback } from 'react';
import MasonryGrid from '@/components/MasonryGrid';
import { Asset, SupabaseAsset } from '@/types';
import { mockAssets, generateMockAssets } from '@/lib/mockData';

const ITEMS_PER_PAGE = 20;

export default function FreshPage() {
  const [assets, setAssets] = useState<SupabaseAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // Convert Asset to SupabaseAsset
  const convertToSupabaseAsset = (asset: Asset): SupabaseAsset => {
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
      creator: undefined
    };
  };

  // Initial load
  useEffect(() => {
    const loadInitialAssets = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const allAssets = [...mockAssets, ...generateMockAssets(50)];
      // Sort by created date (newest first)
      const sortedAssets = allAssets.sort((a, b) => 
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
      
      const convertedAssets = sortedAssets.slice(0, ITEMS_PER_PAGE).map(convertToSupabaseAsset);
      setAssets(convertedAssets);
      setLoading(false);
    };

    loadInitialAssets();
  }, []);

  // Load more assets
  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;
    
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const allAssets = [...mockAssets, ...generateMockAssets(50)];
    const sortedAssets = allAssets.sort((a, b) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
    
    const startIndex = page * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const newAssets = sortedAssets.slice(startIndex, endIndex);
    
    if (newAssets.length === 0) {
      setHasMore(false);
    } else {
      const convertedNewAssets = newAssets.map(convertToSupabaseAsset);
      setAssets(prev => [...prev, ...convertedNewAssets]);
      setPage(prev => prev + 1);
    }
    
    setLoading(false);
  }, [loading, hasMore, page]);

  // Handle download
  const handleDownload = async (assetId: string) => {
    setAssets(prev => prev.map(asset => 
      asset.id === assetId 
        ? { ...asset, download_count: (asset.download_count || 0) + 1 }
        : asset
    ));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Fresh <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Today</span>
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Just dropped! The newest templates and assets uploaded by creators today.
        </p>
      </div>

      {/* Assets Grid */}
      <MasonryGrid
        assets={assets}
        loading={loading}
        hasMore={hasMore}
        onLoadMore={loadMore}
        onDownload={handleDownload}
      />
    </div>
  );
}
