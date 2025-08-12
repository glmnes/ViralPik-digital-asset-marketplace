import { supabase } from '@/lib/supabase';
import { Database } from '@/types/database';

type Asset = Database['public']['Tables']['assets']['Row'];
type AssetInsert = Database['public']['Tables']['assets']['Insert'];
type AssetUpdate = Database['public']['Tables']['assets']['Update'];

export const assetsApi = {
  // Fetch assets with filters
  async getAssets({
    platform,
    assetType,
    categoryId,
    sortBy = 'created_at',
    limit = 12,
    offset = 0,
  }: {
    platform?: string;
    assetType?: string;
    categoryId?: string;
    sortBy?: 'created_at' | 'download_count' | 'trending';
    limit?: number;
    offset?: number;
  }) {
    let query = supabase
      .from('assets')
      .select('*, categories(name, slug)')
      .range(offset, offset + limit - 1);

    if (platform) {
      query = query.eq('platform', platform);
    }

    if (assetType) {
      query = query.eq('asset_type', assetType);
    }

    if (categoryId) {
      query = query.eq('category_id', categoryId);
    }

    // Apply sorting
    switch (sortBy) {
      case 'download_count':
        query = query.order('download_count', { ascending: false });
        break;
      case 'trending':
        query = query.eq('is_trending', true).order('trending_rank', { ascending: true });
        break;
      default:
        query = query.order('created_at', { ascending: false });
    }

    const { data, error, count } = await query;

    return { data, error, count };
  },

  // Get trending assets
  async getTrendingAssets(limit = 12) {
    const { data, error } = await supabase
      .from('trending_assets')
      .select('*')
      .limit(limit);

    return { data, error };
  },

  // Search assets
  async searchAssets(searchQuery: string, limit = 20) {
    const { data, error } = await supabase
      .from('assets')
      .select('*, categories(name, slug)')
      .or(`title.ilike.%${searchQuery}%,tags.cs.{${searchQuery}}`)
      .limit(limit);

    return { data, error };
  },

  // Get single asset
  async getAsset(id: string) {
    const { data, error } = await supabase
      .from('assets')
      .select('*, categories(name, slug)')
      .eq('id', id)
      .single();

    // Increment view count
    if (data) {
      await supabase.rpc('increment_view_count', { asset_id: id });
    }

    return { data, error };
  },

  // Track download
  async trackDownload(assetId: string, userId?: string) {
    // Insert download record
    const { error: downloadError } = await supabase
      .from('downloads')
      .insert({
        asset_id: assetId,
        user_id: userId,
      });

    // Increment download count
    if (!downloadError) {
      await supabase.rpc('increment_download_count', { asset_id: assetId });
    }

    return { error: downloadError };
  },

  // Create asset (admin only)
  async createAsset(asset: AssetInsert) {
    const { data, error } = await supabase
      .from('assets')
      .insert(asset)
      .select()
      .single();

    return { data, error };
  },

  // Update asset (admin only)
  async updateAsset(id: string, updates: AssetUpdate) {
    const { data, error } = await supabase
      .from('assets')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    return { data, error };
  },

  // Delete asset (admin only)
  async deleteAsset(id: string) {
    const { error } = await supabase
      .from('assets')
      .delete()
      .eq('id', id);

    return { error };
  },

  // Get user's favorites
  async getUserFavorites(userId: string) {
    const { data, error } = await supabase
      .from('favorites')
      .select('*, assets(*)')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    return { data, error };
  },

  // Toggle favorite
  async toggleFavorite(assetId: string, userId: string) {
    // Check if already favorited
    const { data: existing } = await supabase
      .from('favorites')
      .select('id')
      .eq('user_id', userId)
      .eq('asset_id', assetId)
      .single();

    if (existing) {
      // Remove favorite
      const { error } = await supabase
        .from('favorites')
        .delete()
        .eq('id', existing.id);

      return { favorited: false, error };
    } else {
      // Add favorite
      const { error } = await supabase
        .from('favorites')
        .insert({
          user_id: userId,
          asset_id: assetId,
        });

      return { favorited: true, error };
    }
  },

  // Get categories
  async getCategories(platform?: string) {
    let query = supabase.from('categories').select('*');

    if (platform) {
      query = query.eq('platform', platform);
    }

    const { data, error } = await query.order('name');

    return { data, error };
  },
};
