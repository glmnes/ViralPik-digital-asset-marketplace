import { Asset, Category, Platform } from '@/types';
import { Youtube, Instagram, Music2, Twitter, Sparkles } from 'lucide-react';

export const platformConfig = {
  youtube: {
    name: 'YouTube',
    icon: Youtube,
    color: 'from-red-600 to-red-500',
    assetTypes: ['thumbnails', 'end-screens', 'banners'],
    dimensions: {
      thumbnails: { width: 1280, height: 720, aspect: '16:9' },
      banners: { width: 2560, height: 1440, aspect: '16:9' },
      'end-screens': { width: 1920, height: 1080, aspect: '16:9' }
    }
  },
  instagram: {
    name: 'Instagram',
    icon: Instagram,
    color: 'from-pink-600 to-purple-600',
    assetTypes: ['stories', 'posts', 'reels', 'highlights'],
    dimensions: {
      stories: { width: 1080, height: 1920, aspect: '9:16' },
      posts: { width: 1080, height: 1080, aspect: '1:1' },
      reels: { width: 1080, height: 1920, aspect: '9:16' },
      highlights: { width: 1080, height: 1920, aspect: '9:16' }
    }
  },
  tiktok: {
    name: 'TikTok',
    icon: Music2,
    color: 'from-gray-900 to-gray-700',
    assetTypes: ['templates'],
    dimensions: {
      templates: { width: 1080, height: 1920, aspect: '9:16' }
    }
  },
  twitter: {
    name: 'X',
    icon: Twitter,
    color: 'from-gray-800 to-gray-900',
    assetTypes: ['headers', 'posts'],
    dimensions: {
      headers: { width: 1500, height: 500, aspect: '3:1' },
      posts: { width: 1200, height: 675, aspect: '16:9' }
    }
  },
  fx: {
    name: 'FX Pack',
    icon: Sparkles,
    color: 'from-purple-600 to-blue-600',
    assetTypes: [
      'transitions', 'sound-effects', 'motion-graphics',
      'textures', 'particles'
    ],
    dimensions: {
      default: { width: 1920, height: 1080, aspect: '16:9' },
      vertical: { width: 1080, height: 1920, aspect: '9:16' }
    }
  }
};

export const mockCategories: Category[] = [
  // YouTube categories
  { id: '1', name: 'Thumbnails', slug: 'thumbnails', icon: '🖼️', platform: 'youtube', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: '2', name: 'Banners', slug: 'banners', icon: '🎆', platform: 'youtube', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: '3', name: 'End Screens', slug: 'end-screens', icon: '🎬', platform: 'youtube', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  
  // Instagram categories
  { id: '5', name: 'Stories', slug: 'stories', icon: '📱', platform: 'instagram', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: '6', name: 'Posts', slug: 'posts', icon: '📷', platform: 'instagram', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: '7', name: 'Reels', slug: 'reels', icon: '🎥', platform: 'instagram', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: '8', name: 'Highlights', slug: 'highlights', icon: '✨', platform: 'instagram', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  
  // TikTok categories
  { id: '11', name: 'Templates', slug: 'templates', icon: '📋', platform: 'tiktok', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  
  // Twitter/X categories
  { id: '12', name: 'Headers', slug: 'headers', icon: '🏷️', platform: 'twitter', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: '13', name: 'Posts', slug: 'twitter-posts', icon: '💬', platform: 'twitter', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  
  // FX categories
  { id: '14', name: 'Transitions', slug: 'transitions', icon: '🔄', platform: 'fx', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: '15', name: 'Sound Effects', slug: 'sound-effects', icon: '🔊', platform: 'fx', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: '17', name: 'Motion Graphics', slug: 'motion-graphics', icon: '🎞️', platform: 'fx', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
];

// Generate a placeholder image data URL
const createPlaceholder = (width: number, height: number, color: string, text: string) => {
  return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='${width}' height='${height}'%3E%3Crect width='100%25' height='100%25' fill='%23${color}'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial' font-size='48' fill='white'%3E${encodeURIComponent(text)}%3C/text%3E%3C/svg%3E`;
};

export const mockAssets: Asset[] = [
  {
    id: '1',
    title: 'Viral YouTube Thumbnail Pack',
    preview_url: createPlaceholder(1280, 720, 'ff0000', 'YouTube Thumbnail'),
    file_url: 'https://example.com/youtube-thumbnail.psd',
    format: 'PSD',
    category_id: '1',
    platform: 'youtube',
    asset_type: 'thumbnails',
    tags: ['youtube', 'thumbnail', 'viral', 'clickbait'],
    download_count: 24567,
    view_count: 125000,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    file_size: null,
    dimensions: { width: 1280, height: 720 },
    is_trending: true,
    trending_rank: 1,
    created_by: null,
    is_premium: false,
    price: null,
  },
  {
    id: '2',
    title: 'YouTube Channel Banner Kit',
    preview_url: createPlaceholder(2560, 1440, 'ff0000', 'YouTube Banner'),
    file_url: 'https://example.com/youtube-banner.psd',
    format: 'PSD',
    category_id: '2',
    platform: 'youtube',
    asset_type: 'banners',
    tags: ['youtube', 'banner', 'channel', 'professional'],
    download_count: 18234,
    view_count: 95000,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    file_size: null,
    dimensions: { width: 2560, height: 1440 },
    is_trending: false,
    trending_rank: null,
    created_by: null,
    is_premium: false,
    price: null,
  },
  {
    id: '3',
    title: 'Glitch Text Overlays FX',
    preview_url: createPlaceholder(1920, 1080, '7c3aed', 'Glitch FX'),
    file_url: 'https://example.com/glitch-overlays.png',
    format: 'PNG',
    category_id: '3',
    platform: 'fx',
    asset_type: 'overlays',
    tags: ['glitch', 'overlay', 'effects', 'cyberpunk'],
    download_count: 31456,
    view_count: 185000,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    file_size: null,
    dimensions: { width: 1920, height: 1080 },
    is_trending: true,
    trending_rank: 2,
    created_by: null,
    is_premium: false,
    price: null,
  },
  {
    id: '4',
    title: 'Neon Texture Pack FX',
    preview_url: createPlaceholder(1920, 1080, '3b82f6', 'Neon Textures'),
    file_url: 'https://example.com/neon-textures.png',
    format: 'PNG',
    category_id: '4',
    platform: 'fx',
    asset_type: 'textures',
    tags: ['neon', 'texture', 'cyberpunk', 'glow'],
    download_count: 28901,
    view_count: 156000,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    file_size: null,
    dimensions: { width: 1920, height: 1080 },
    is_trending: false,
    trending_rank: null,
    created_by: null,
    is_premium: false,
    price: null,
  },
  {
    id: '5',
    title: 'YouTube Gaming Thumbnail Templates',
    preview_url: createPlaceholder(1280, 720, 'ff0000', 'Gaming Thumbnails'),
    file_url: 'https://example.com/gaming-thumbnails.psd',
    format: 'PSD',
    category_id: '1',
    platform: 'youtube',
    asset_type: 'thumbnails',
    tags: ['youtube', 'gaming', 'thumbnail', 'template'],
    download_count: 45678,
    view_count: 234000,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    file_size: null,
    dimensions: { width: 1280, height: 720 },
    is_trending: false,
    trending_rank: null,
    created_by: null,
    is_premium: false,
    price: null,
  },
];

// Helper function to get dimensions for an asset
function getDimensionsForAsset(platform: Platform, assetType: string): { width: number; height: number } {
  const platformData = platformConfig[platform];
  
  // Check if there's a specific dimension for this asset type
  if (platformData.dimensions) {
    const dims = platformData.dimensions as any;
    if (dims[assetType]) {
      return dims[assetType];
    }
    // For fx platform, use default dimensions
    if (dims.default) {
      return dims.default;
    }
  }
  
  // Return default dimensions based on platform
  switch (platform) {
    case 'youtube':
      return { width: 1280, height: 720 }; // 16:9
    case 'instagram':
    case 'tiktok':
      return { width: 1080, height: 1920 }; // 9:16
    case 'twitter':
      return { width: 1200, height: 675 }; // 16:9
    case 'fx':
    default:
      return { width: 1920, height: 1080 }; // 16:9
  }
}

// Generate more mock data
export function generateMockAssets(count: number): Asset[] {
  const assets: Asset[] = [];
  const formats: Asset['format'][] = ['PNG', 'PSD', 'Template', 'SVG', 'GIF'];
  const adjectives = ['Viral', 'Trending', 'Aesthetic', 'Modern', 'Retro', 'Minimal', 'Bold'];
  const types = ['Template', 'Pack', 'Bundle', 'Collection', 'Set', 'Kit'];
  const platforms = Object.keys(platformConfig) as Platform[];
  
  for (let i = 0; i < count; i++) {
    const platform = platforms[Math.floor(Math.random() * platforms.length)];
    const platformData = platformConfig[platform];
    const assetType = platformData.assetTypes[Math.floor(Math.random() * platformData.assetTypes.length)];
    const category = mockCategories.find(c => c.platform === platform) || mockCategories[0];
    const format = formats[Math.floor(Math.random() * formats.length)];
    const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
    const type = types[Math.floor(Math.random() * types.length)];
    
    // Calculate if asset is trending (30% chance)
    const is_trending = Math.random() < 0.3;
    const trending_rank = is_trending ? Math.floor(Math.random() * 10) + 1 : null;
    
    // Get appropriate dimensions
    const dimensions = getDimensionsForAsset(platform, assetType);
    
    assets.push({
      id: `generated-${i}`,
      title: `${adjective} ${assetType.replace('-', ' ')} ${type}`,
      preview_url: createPlaceholder(dimensions.width, dimensions.height, Math.floor(Math.random()*16777215).toString(16), `${adjective} ${type}`),
      file_url: `https://example.com/asset-${i}.${format.toLowerCase()}`,
      format,
      category_id: category.id,
      platform,
      asset_type: assetType,
      tags: [adjective.toLowerCase(), platform, assetType, 'trending'],
      download_count: Math.floor(Math.random() * 100000),
      view_count: Math.floor(Math.random() * 500000),
      created_at: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date().toISOString(),
      file_size: null,
      dimensions,
      is_trending,
      trending_rank,
      created_by: null,
      is_premium: false,
      price: null,
    });
  }
  
  return assets;
}
