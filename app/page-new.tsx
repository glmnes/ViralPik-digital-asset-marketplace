'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import MasonryGrid from '@/components/MasonryGrid';
import { Asset, SupabaseAsset } from '@/types';
import { mockAssets, generateMockAssets } from '@/lib/mockData';
import CategoryPills from '@/components/CategoryPills';

// Topic suggestions for each platform - currently unused but kept for future reference
// const topicSuggestions = {
//   youtube: ['Gaming Thumbnails', 'Tech Reviews', 'Vlogs', 'Music Videos', 'Tutorials', 'Shorts'],
//   instagram: ['Stories', 'Reels', 'IGTV', 'Posts', 'Highlights', 'Ads'],
//   tiktok: ['Viral Effects', 'Transitions', 'Green Screen', 'Duet Templates', 'Filters'],
//   twitter: ['Thread Headers', 'Quote Cards', 'Memes', 'Infographics'],
//   fx: ['Glitch Effects', 'Transitions', 'Overlays', 'Sound Effects', 'Motion Graphics']
// };

export default function Home() {
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get('search') || '';
  
  const [allAssets, setAllAssets] = useState<SupabaseAsset[]>([]);
  const [selectedTopic, setSelectedTopic] = useState<string>('');
  const [loading, setLoading] = useState(true);

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

  // Load all assets on mount
  useEffect(() => {
    const loadAssets = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const assets = [...mockAssets, ...generateMockAssets(50)];
      const convertedAssets = assets.map(convertToSupabaseAsset);
      setAllAssets(convertedAssets);
      setLoading(false);
    };

    loadAssets();
  }, []);

  // Get filtered assets
  const getFilteredAssets = () => {
    let filtered = allAssets;
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(asset => 
        asset.title.toLowerCase().includes(query) ||
        asset.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }
    
    if (selectedTopic) {
      filtered = filtered.filter(asset => 
        asset.tags.some(tag => tag.toLowerCase().includes(selectedTopic.toLowerCase()))
      );
    }
    
    return filtered;
  };

  // Get all unique topics from assets
  const getAllTopics = () => {
    const topics = new Set<string>();
    allAssets.forEach(asset => {
      asset.tags.forEach(tag => topics.add(tag));
    });
    return Array.from(topics).slice(0, 20); // Limit to 20 topics
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Topic Pills - Pinterest Style */}
      <div className="sticky top-16 z-40 bg-white/95 backdrop-blur-sm border-b border-gray-100">
        <CategoryPills
          topics={getAllTopics()}
          selectedTopic={selectedTopic}
          onSelectTopic={setSelectedTopic}
        />
      </div>

      {/* Main Content */}
      <div className="max-w-[2520px] mx-auto px-4 sm:px-6 lg:px-8 py-4">
        {searchQuery && (
          <div className="text-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-900">
              Results for &quot;{searchQuery}&quot;
            </h2>
            <p className="text-gray-600 mt-1">
              {getFilteredAssets().length} assets found
            </p>
          </div>
        )}

        {/* Masonry Grid */}
        <MasonryGrid
          assets={getFilteredAssets()}
          loading={loading}
          hasMore={false}
          onDownload={() => {}}
          minimal={true}
        />

        {/* Load More */}
        {!loading && getFilteredAssets().length >= 20 && (
          <div className="text-center mt-12 pb-8">
            <button className="px-8 py-3 bg-gray-900 text-white rounded-full font-medium hover:bg-gray-800 transition-colors">
              Show more
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
