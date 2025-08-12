export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      assets: {
        Row: {
          id: string
          title: string
          preview_url: string
          file_url: string
          format: 'PNG' | 'PSD' | 'Template' | 'SVG' | 'GIF'
          category_id: string
          platform: 'youtube' | 'instagram' | 'tiktok' | 'twitter' | 'fx'
          asset_type: string
          tags: string[]
          download_count: number
          view_count: number
          created_at: string
          updated_at: string
          file_size: number | null
          dimensions: Json | null
          is_trending: boolean
          trending_rank: number | null
          created_by: string | null
          is_premium: boolean
          price: number | null
        }
        Insert: {
          id?: string
          title: string
          preview_url: string
          file_url: string
          format: 'PNG' | 'PSD' | 'Template' | 'SVG' | 'GIF'
          category_id: string
          platform: 'youtube' | 'instagram' | 'tiktok' | 'twitter' | 'fx'
          asset_type: string
          tags?: string[]
          download_count?: number
          view_count?: number
          created_at?: string
          updated_at?: string
          file_size?: number | null
          dimensions?: Json | null
          is_trending?: boolean
          trending_rank?: number | null
          created_by?: string | null
          is_premium?: boolean
          price?: number | null
        }
        Update: {
          id?: string
          title?: string
          preview_url?: string
          file_url?: string
          format?: 'PNG' | 'PSD' | 'Template' | 'SVG' | 'GIF'
          category_id?: string
          platform?: 'youtube' | 'instagram' | 'tiktok' | 'twitter' | 'fx'
          asset_type?: string
          tags?: string[]
          download_count?: number
          view_count?: number
          created_at?: string
          updated_at?: string
          file_size?: number | null
          dimensions?: Json | null
          is_trending?: boolean
          trending_rank?: number | null
          created_by?: string | null
          is_premium?: boolean
          price?: number | null
        }
      }
      categories: {
        Row: {
          id: string
          name: string
          slug: string
          icon: string | null
          platform: 'youtube' | 'instagram' | 'tiktok' | 'twitter' | 'fx'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          icon?: string | null
          platform: 'youtube' | 'instagram' | 'tiktok' | 'twitter' | 'fx'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          icon?: string | null
          platform?: 'youtube' | 'instagram' | 'tiktok' | 'twitter' | 'fx'
          created_at?: string
          updated_at?: string
        }
      }
      users: {
        Row: {
          id: string
          email: string
          username: string | null
          avatar_url: string | null
          is_admin: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          username?: string | null
          avatar_url?: string | null
          is_admin?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          username?: string | null
          avatar_url?: string | null
          is_admin?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      downloads: {
        Row: {
          id: string
          asset_id: string
          user_id: string | null
          downloaded_at: string
          ip_address: string | null
        }
        Insert: {
          id?: string
          asset_id: string
          user_id?: string | null
          downloaded_at?: string
          ip_address?: string | null
        }
        Update: {
          id?: string
          asset_id?: string
          user_id?: string | null
          downloaded_at?: string
          ip_address?: string | null
        }
      }
      favorites: {
        Row: {
          id: string
          user_id: string
          asset_id: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          asset_id: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          asset_id?: string
          created_at?: string
        }
      }
    }
    Views: {
      trending_assets: {
        Row: {
          id: string
          title: string
          preview_url: string
          file_url: string
          format: 'PNG' | 'PSD' | 'Template' | 'SVG' | 'GIF'
          category_id: string
          platform: 'youtube' | 'instagram' | 'tiktok' | 'twitter' | 'fx'
          asset_type: string
          tags: string[]
          download_count: number
          view_count: number
          created_at: string
          updated_at: string
          file_size: number | null
          dimensions: Json | null
          is_trending: boolean
          trending_rank: number | null
          recent_downloads: number
          trending_score: number
        }
      }
    }
    Functions: {
      increment_download_count: {
        Args: {
          asset_id: string
        }
        Returns: void
      }
      increment_view_count: {
        Args: {
          asset_id: string
        }
        Returns: void
      }
      calculate_trending_scores: {
        Args: Record<PropertyKey, never>
        Returns: void
      }
    }
    Enums: {
      [_ in never]: never
    }
  }
}
