'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import MasonryGrid from '@/components/MasonryGrid';
import ContentTypeFilter from '@/components/ContentTypeFilter';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { SupabaseAsset } from '@/types';


function HomeContent() {
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get('search') || '';
  const { user } = useAuth();
  
  const [allAssets, setAllAssets] = useState<SupabaseAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedContentTypes, setSelectedContentTypes] = useState<string[]>([]);

  // Load assets on mount
  useEffect(() => {
    loadAssets();
  }, []);

  const loadAssets = async () => {
    setLoading(true);
    try {
      // Fetch trending assets from Supabase
      const { data: assets, error } = await supabase
        .from('assets')
        .select(`
          *,
          creator:profiles!creator_id(*)
        `)
        .eq('status', 'approved')
        .order('created_at', { ascending: false })
        .limit(100);
      
      if (!error && assets) {
        setAllAssets(transformAssets(assets));
      }
    } catch (error) {
      console.error('Error loading assets:', error);
    } finally {
      setLoading(false);
    }
  };

  const transformAssets = (assets: SupabaseAsset[]): SupabaseAsset[] => {
    return assets.map(asset => ({
      id: asset.id,
      title: asset.title,
      description: asset.description || '',
      preview_url: asset.preview_url || '/api/placeholder/400/300',
      file_url: asset.file_url,
      category: asset.category || '',
      platform: asset.platform,
      format: asset.format || 'PNG',
      platforms: asset.platforms || [asset.platform],
      tags: asset.tags || [],
      downloads: asset.downloads || 0,
      likes: asset.likes || 0,
      download_count: asset.download_count || 0,
      like_count: asset.like_count || 0,
      view_count: asset.view_count || 0,
      status: asset.status || 'approved',
      created_at: asset.created_at,
      created_by: asset.created_by || asset.creator_id || '',
      creator_id: asset.creator_id || '',
      license: (asset as any).license || undefined,
      creator: asset.creator
    }));
  };

  // Get filtered assets
  const getFilteredAssets = () => {
    let filtered = allAssets;

    // Content type filter
    if (selectedContentTypes.length > 0) {
      filtered = filtered.filter(asset => {
        // Check if the asset's asset_type matches the selected content types
        return selectedContentTypes.some(type => {
          // Direct match on asset_type
          if (asset.asset_type && asset.asset_type.toLowerCase().includes(type)) {
            return true;
          }
          // Also check tags for backward compatibility
          return asset.tags.some(tag => tag.toLowerCase().includes(type)) ||
                 asset.title.toLowerCase().includes(type);
        });
      });
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(asset => 
        asset.title.toLowerCase().includes(query) ||
        asset.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }
    
    return filtered;
  };

  // Handle download and track interaction
  const handleDownload = async (assetId: string) => {
    try {
      // Record interaction
      if (user) {
        await supabase.rpc('record_interaction', {
          p_user_id: user.id,
          p_asset_id: assetId,
          p_type: 'download'
        });
      }
      
      // Record download in database
      const { error } = await supabase
        .from('downloads')
        .insert([
          {
            asset_id: assetId,
            user_id: user?.id || null
          }
        ]);
      
      if (!error) {
        // Update local state
        setAllAssets(prev => prev.map(asset => 
          asset.id === assetId 
            ? { ...asset, download_count: (asset.download_count || 0) + 1 }
            : asset
        ));
        
        // Increment download count in database
        await supabase.rpc('increment_download_count', { asset_id: assetId });
      }
    } catch (error) {
      console.error('Error recording download:', error);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950">
      {/* Main Content */}
      <div className="max-w-[2520px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Quick Filters */}
        <div className="mb-4">
          {/* Content Type Filter */}
          <ContentTypeFilter
            selectedTypes={selectedContentTypes}
            onToggleType={(type) => {
              setSelectedContentTypes(prev => 
                prev.includes(type) 
                  ? prev.filter(t => t !== type)
                  : [...prev, type]
              );
            }}
            onClearAll={() => setSelectedContentTypes([])}
          />
        </div>

        {/* Masonry Grid with Animation */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <MasonryGrid
            assets={getFilteredAssets()}
            loading={loading}
            hasMore={false}
            onDownload={handleDownload}
            minimal={true}
          />
        </motion.div>

        {/* Load More */}
        {!loading && getFilteredAssets().length >= 20 && (
          <div className="text-center mt-16 pb-12">
            <button className="px-6 py-2 border border-zinc-800 text-zinc-400 text-sm font-medium hover:text-white hover:border-zinc-700 transition-all">
              Load more
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function HomePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-zinc-950 flex items-center justify-center"><div className="text-zinc-400">Loading...</div></div>}>
      <HomeContent />
    </Suspense>
  );
}
