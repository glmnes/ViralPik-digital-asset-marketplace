import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface Profile {
  id: string;
  username: string;
  display_name?: string;
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

export interface Asset {
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
  created_at: string;
  updated_at: string;
  creator?: Profile;
}

export interface Board {
  id: string;
  owner_id: string;
  name: string;
  description?: string;
  is_private: boolean;
  follower_count: number;
  created_at: string;
  updated_at: string;
  owner?: Profile;
}
