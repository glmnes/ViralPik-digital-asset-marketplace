export type Platform = 'youtube' | 'instagram' | 'tiktok' | 'twitter' | 'fx';

export interface Asset {
  id: string;
  title: string;
  preview_url: string;
  file_url: string;
  format: 'PNG' | 'PSD' | 'Template' | 'SVG' | 'GIF';
  category_id: string;
  platform: Platform;
  asset_type: string; // thumbnail, story, reel, overlay, etc.
  tags: string[];
  download_count: number;
  view_count: number;
  created_at: string;
  updated_at: string;
  file_size: number | null;
  dimensions: {
    width: number;
    height: number;
  } | null;
  is_trending: boolean;
  trending_rank: number | null;
  created_by: string | null;
  is_premium: boolean;
  price: number | null;
  // Joined data
  categories?: Category;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string | null;
  platform: Platform;
  created_at: string;
  updated_at: string;
}

export type SortOption = 'viral' | 'fresh' | 'legendary';

export interface FilterOptions {
  category?: string;
  format?: string;
  platform?: string;
  style?: string;
  assetType?: string;
}

// Supabase Types
export interface SupabaseAsset {
  id: string;
  title: string;
  description: string;
  preview_url: string;
  file_url: string;
  category: string;
  platform: string;
  asset_type?: string; // thumbnails, posts, stories, etc.
  format: string;
  platforms: string[];
  tags: string[];
  downloads: number;
  likes: number;
  download_count?: number;
  like_count?: number;
  view_count?: number;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  created_by: string;
  creator_id?: string;
  license?: string; // optional license code or name
  // AI enrichment (optional, incremental rollout)
  nsfw_score?: number;
  embedding?: number[]; // store as JSON array in DB to avoid pgvector dependency
  palette?: string[]; // top hex colors
  dimensions?: {
    width: number;
    height: number;
  } | string | null;
  creator?: {
    id: string;
    username: string;
    avatar_url: string | null;
    is_verified: boolean;
    is_creator?: boolean;
  };
}

export interface Profile {
  id: string;
  username: string;
  display_name?: string;
  avatar_url: string | null;
  bio: string | null;
  website?: string;
  twitter?: string;
  instagram?: string;
  youtube?: string;
  is_admin: boolean;
  is_creator: boolean;
  is_verified: boolean;
  is_approved?: boolean;
  approval_status?: 'pending' | 'approved' | 'rejected';
  follower_count?: number;
  following_count?: number;
  followers_count: number;
  created_at: string;
}

export interface Collection {
  id: string;
  name: string;
  description: string | null;
  user_id: string;
  is_public: boolean;
  created_at: string;
  updated_at: string;
  assets?: SupabaseAsset[];
}

export interface Comment {
  id: string;
  content: string;
  asset_id: string;
  user_id: string;
  created_at: string;
  user?: Profile;
}

export interface Like {
  id: string;
  asset_id: string;
  user_id: string;
  created_at: string;
}

export interface Follow {
  id: string;
  follower_id: string;
  following_id: string;
  created_at: string;
}

export interface Download {
  id: string;
  asset_id: string;
  user_id: string | null;
  downloaded_at: string;
}

export interface AnalyticsData {
  totalViews: number;
  totalDownloads: number;
  totalLikes: number;
  totalAssets: number;
  viewsChange: number;
  downloadsChange: number;
  likesChange: number;
  assetsChange: number;
  topAssets: SupabaseAsset[];
  recentActivity: ActivityItem[];
}

export interface ActivityItem {
  id: string;
  type: 'download' | 'like' | 'comment' | 'follow';
  asset?: SupabaseAsset;
  user?: Profile;
  created_at: string;
}

export interface EarningsData {
  totalEarnings: number;
  pendingEarnings: number;
  availableEarnings: number;
  earningsChange: number;
  transactions: Transaction[];
}

export interface Transaction {
  id: string;
  amount: number;
  type: 'download' | 'tip' | 'subscription';
  status: 'completed' | 'pending' | 'failed';
  created_at: string;
  asset?: SupabaseAsset;
}

export interface UserPreferences {
  id: string;
  user_id: string;
  email_notifications: boolean;
  push_notifications: boolean;
  newsletter: boolean;
  theme: 'light' | 'dark' | 'system';
  language: string;
  created_at: string;
  updated_at: string;
}

// Vision Board Types
export interface VisionBoard {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  goal_followers?: number;
  goal_platform?: Platform;
  target_date?: string;
  mood: 'energetic' | 'aesthetic' | 'professional' | 'edgy' | 'playful';
  assets: string[]; // asset IDs
  is_public: boolean;
  viral_score?: number;
  created_at: string;
  updated_at: string;
}

export interface ViralPrediction {
  score: number; // 0-100
  factors: {
    trend_alignment: number;
    platform_optimization: number;
    timing_score: number;
    aesthetic_coherence: number;
  };
  suggestions: string[];
  similar_viral_content?: SupabaseAsset[];
}

// Gamification Types
export type CreatorLevel = 'Aspiring' | 'Rising' | 'Viral' | 'Legendary';

export interface Achievement {
  id: string;
  slug: string;
  title: string;
  description: string;
  icon: string;
  xp_reward: number;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  unlocked_at?: string;
}

export interface CreatorJourney {
  user_id: string;
  level: CreatorLevel;
  xp: number;
  total_xp: number;
  achievements: Achievement[];
  streaks: {
    daily_login: number;
    weekly_creation: number;
    engagement: number;
  };
  milestones: Milestone[];
  next_milestone: Milestone;
  level_progress: number; // 0-100
}

export interface Milestone {
  id: string;
  title: string;
  description: string;
  xp_required: number;
  rewards: {
    badges?: string[];
    features?: string[];
    title?: string;
  };
  completed: boolean;
}

// Success Story Types
export interface SuccessStory {
  id: string;
  creator_id: string;
  creator: Profile;
  headline: string;
  story: string;
  key_asset: SupabaseAsset;
  metrics: {
    before_followers: number;
    after_followers: number;
    viral_views: number;
    platform: Platform;
    timeframe: string;
  };
  tips: string[];
  featured: boolean;
  created_at: string;
}
