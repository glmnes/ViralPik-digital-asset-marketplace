// Comprehensive type definitions for the entire application

// Database row types
export interface AssetRow {
  id: string;
  creator_id: string;
  title: string;
  description?: string;
  platform: string;
  asset_type: string;
  file_url: string;
  preview_url?: string;
  file_size?: number;
  format?: string;
  dimensions?: { width: number; height: number };
  status: 'pending' | 'approved' | 'rejected';
  rejection_reason?: string;
  download_count: number;
  view_count: number;
  like_count: number;
  tags: string[];
  is_trending: boolean;
  trending_rank?: number;
  price: number;
  is_free: boolean;
  is_premium?: boolean;
  created_at: string;
  updated_at: string;
  creator?: ProfileRow;
}

export interface ProfileRow {
  id: string;
  username: string;
  display_name?: string;
  email?: string;
  bio?: string;
  avatar_url?: string;
  website?: string;
  twitter?: string;
  instagram?: string;
  youtube?: string;
  portfolio_links?: string[];
  follower_count: number;
  following_count: number;
  is_creator: boolean;
  is_admin?: boolean;
  is_verified?: boolean;
  is_approved: boolean;
  approval_status: 'pending' | 'approved' | 'rejected';
  badge_level: 'none' | 'blue' | 'silver' | 'gold';
  can_earn: boolean;
  total_earnings: number;
  created_at: string;
  updated_at: string;
}

export interface CollectionRow {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  is_public: boolean;
  created_at: string;
  updated_at: string;
  collection_assets?: { count: number }[];
  profiles?: ProfileRow;
}

export interface SaveRow {
  collection_id: string;
  asset_id: string;
  user_id: string;
}

export interface DownloadRow {
  id: string;
  asset_id: string;
  user_id?: string;
  downloaded_at: string;
}

export interface CollectionAssetRow {
  collection_id: string;
  asset_id: string;
}

// Array method parameter types
export type AssetMapFn = (asset: AssetRow) => any;
export type AssetFilterFn = (asset: AssetRow) => boolean;
export type AssetReduceFn<T> = (sum: T, asset: AssetRow) => T;
export type AssetForEachFn = (asset: AssetRow) => void;

export type ProfileMapFn = (profile: ProfileRow) => any;
export type ProfileFilterFn = (profile: ProfileRow) => boolean;

export type CollectionMapFn = (collection: CollectionRow) => any;
export type SaveMapFn = (save: SaveRow) => any;
export type DownloadFilterFn = (download: DownloadRow) => boolean;

// Generic array method types
export type GenericMapFn<T, R> = (item: T) => R;
export type GenericFilterFn<T> = (item: T) => boolean;
export type GenericReduceFn<T, R> = (accumulator: R, item: T) => R;
export type GenericForEachFn<T> = (item: T) => void;

// Component prop types
export interface AssetCardProps {
  asset: AssetRow;
  onDownload?: (assetId: string) => void;
  onLike?: (assetId: string) => void;
  onSave?: (assetId: string) => void;
}

export interface CollectionCardProps {
  collection: CollectionRow;
  onDelete?: (collectionId: string) => void;
}

// Supabase response types
export interface SupabaseAuthResponse {
  data: {
    session: {
      user: any;
    } | null;
  };
}

export interface SupabaseAuthStateChange {
  event: string;
  session: {
    user: any;
  } | null;
}

// Chart data types
export interface ChartDataPoint {
  day: number;
  downloads: number;
  earnings: number;
}

export interface DailyStatPoint {
  date: string;
  views: number;
  downloads: number;
}

export interface PlatformStat {
  platform: string;
  assets: number;
  views: number;
  downloads: number;
}

export interface CountryDemographic {
  country: string;
  downloads: number;
  percentage: number;
}

export interface MonthlyEarning {
  month: string;
  earnings: number;
}

// Transaction types
export interface Transaction {
  id: string;
  asset_id: string;
  asset_title: string;
  amount: number;
  type: 'sale' | 'payout';
  status: 'completed' | 'pending' | 'failed';
  created_at: string;
}
