'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Settings, Share2, Grid3X3, Bookmark, Plus, Loader2, Lock, Globe, Folder, Trash2 } from 'lucide-react';
import MasonryGrid from '@/components/MasonryGrid';
import CollectionCard from '@/components/CollectionCard';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

type TabType = 'created' | 'collections';

export default function ProfilePage() {
  const params = useParams();
  const router = useRouter();
  const { user: currentUser } = useAuth();
  const username = params.username as string;
  const [activeTab, setActiveTab] = useState<TabType>('created');
  const [following, setFollowing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [userAssets, setUserAssets] = useState<any[]>([]);
  const [collections, setCollections] = useState<any[]>([]);
  const [collectionPreviews, setCollectionPreviews] = useState<Record<string, any[]>>({});
  const [stats, setStats] = useState({ followers: 0, following: 0, totalViews: 0 });

  useEffect(() => {
    const loadProfileData = async () => {
      try {
        // Load user profile
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('username', username)
          .single();

        if (profileError || !profileData) {
          router.push('/');
          return;
        }

        setProfile(profileData);

        // Load user's created assets
        const { data: createdAssets } = await supabase
          .from('assets')
          .select('*')
          .eq('creator_id', profileData.id)
          .eq('status', 'approved')
          .order('created_at', { ascending: false });

        setUserAssets(createdAssets || []);

        // Load collections - show all public collections or user's own collections
        let collectionsData: any[] = [];
        if (currentUser?.id === profileData.id) {
          // User viewing their own profile - show all their collections
          const { data: userCollections } = await supabase
            .from('collections')
            .select('*, collection_assets(count)')
            .eq('user_id', profileData.id)
            .order('created_at', { ascending: false });

          collectionsData = userCollections || [];
        } else {
          // Other users - only show public collections
          const { data: publicCollections } = await supabase
            .from('collections')
            .select('*, collection_assets(count)')
            .eq('user_id', profileData.id)
            .eq('is_public', true)
            .order('created_at', { ascending: false });

          collectionsData = publicCollections || [];
        }
        setCollections(collectionsData);

        // Load preview assets for each collection
        const previews: Record<string, any[]> = {};
        for (const collection of collectionsData) {
          const { data: assetPreviews } = await supabase
            .from('collection_assets')
            .select('asset:assets(*)')
            .eq('collection_id', collection.id)
            .limit(4)
            .order('created_at', { ascending: false });
          
          if (assetPreviews) {
            previews[collection.id] = assetPreviews.map(item => item.asset).filter(Boolean);
          }
        }
        setCollectionPreviews(previews);

        // Calculate stats
        const totalViews = createdAssets?.reduce((sum: number, asset: any) => sum + (asset.view_count || 0), 0) || 0;
        
        // Check if current user follows this profile
        if (currentUser && currentUser.id !== profileData.id) {
          const { data: followData } = await supabase
            .from('follows')
            .select('id')
            .eq('follower_id', currentUser.id)
            .eq('following_id', profileData.id)
            .single();

          setFollowing(!!followData);
        }

        // Get follower/following counts
        const { count: followerCount } = await supabase
          .from('follows')
          .select('*', { count: 'exact', head: true })
          .eq('following_id', profileData.id);

        const { count: followingCount } = await supabase
          .from('follows')
          .select('*', { count: 'exact', head: true })
          .eq('follower_id', profileData.id);

        setStats({
          followers: followerCount || 0,
          following: followingCount || 0,
          totalViews
        });

      } catch (error) {
        console.error('Error loading profile:', error);
        toast.error('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    loadProfileData();
  }, [username, currentUser, router]);

  const handleCollectionDelete = async (collectionId: string) => {
    try {
      const { error } = await supabase
        .from('collections')
        .delete()
        .eq('id', collectionId)
        .eq('user_id', currentUser?.id);
      
      if (!error) {
        setCollections(prev => prev.filter(c => c.id !== collectionId));
        toast.success('Collection deleted');
      } else {
        toast.error('Failed to delete collection');
      }
    } catch (error) {
      console.error('Error deleting collection:', error);
      toast.error('Failed to delete collection');
    }
  };

  const handlePrivacyToggle = (collectionId: string, isPublic: boolean) => {
    setCollections(prev => 
      prev.map(c => c.id === collectionId ? { ...c, is_public: isPublic } : c)
    );
  };

  const handleFollow = async () => {
    if (!currentUser) {
      toast.error('Please sign in to follow');
      return;
    }

    if (!profile) return;

    try {
      if (following) {
        await supabase
          .from('follows')
          .delete()
          .eq('follower_id', currentUser.id)
          .eq('following_id', profile.id);
        
        setFollowing(false);
        setStats(prev => ({ ...prev, followers: prev.followers - 1 }));
      } else {
        await supabase
          .from('follows')
          .insert({
            follower_id: currentUser.id,
            following_id: profile.id
          });
        
        setFollowing(true);
        setStats(prev => ({ ...prev, followers: prev.followers + 1 }));
      }
    } catch (error) {
      console.error('Error toggling follow:', error);
      toast.error('Failed to update follow status');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-zinc-100 mb-2">Profile not found</h2>
                <p className="text-zinc-400 mb-4">This user hasn&apos;t uploaded any assets yet</p>
          <button
            onClick={() => router.push('/')}
            className="px-4 py-2 bg-blue-500 text-white text-sm font-medium hover:bg-blue-600 transition-colors"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  const isOwnProfile = currentUser?.id === profile.id;

  return (
    <div className="min-h-screen bg-zinc-950">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Profile Header */}
        <div className="flex flex-col items-center mb-8">
          <div className="relative mb-6">
            <div className="w-20 h-20 bg-zinc-800 rounded-full border border-zinc-700 flex items-center justify-center">
              <span className="text-white font-medium text-2xl">
                {profile.username?.[0]?.toUpperCase() || 'U'}
              </span>
            </div>
            {profile.is_creator && (
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                <svg className="w-3.5 h-3.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
            )}
          </div>

          <h1 className="text-xl font-medium text-white mb-1">{profile.username}</h1>
          <p className="text-sm text-zinc-500 mb-3">@{profile.username}</p>
          {profile.bio && (
            <p className="text-sm text-zinc-400 text-center max-w-md mb-5">{profile.bio}</p>
          )}

          {/* Stats */}
          <div className="flex gap-8 mb-6 pb-6 border-b border-zinc-800">
            <div className="text-center">
              <div className="text-lg font-medium text-white">
                {stats.totalViews > 1000000 
                  ? `${(stats.totalViews / 1000000).toFixed(1)}M`
                  : stats.totalViews > 1000
                  ? `${(stats.totalViews / 1000).toFixed(1)}K`
                  : stats.totalViews.toLocaleString()}
              </div>
              <div className="text-xs text-zinc-500">views</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-medium text-white">{stats.followers.toLocaleString()}</div>
              <div className="text-xs text-zinc-500">followers</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-medium text-white">{stats.following}</div>
              <div className="text-xs text-zinc-500">following</div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            {isOwnProfile ? (
              <Link
                href="/settings"
                className="px-4 py-2 bg-zinc-800 text-zinc-400 text-sm font-medium hover:bg-zinc-700 hover:text-white transition-colors flex items-center gap-2"
              >
                <Settings className="w-3.5 h-3.5" />
                Edit Profile
              </Link>
            ) : (
              <>
                <button className="px-4 py-2 border border-zinc-800 text-zinc-400 text-sm font-medium hover:text-white hover:border-zinc-700 transition-colors">
                  <Share2 className="w-3.5 h-3.5 inline mr-1.5" />
                  Share
                </button>
                <button 
                  onClick={handleFollow}
                  className={`px-4 py-2 text-sm font-medium transition-colors ${
                    following 
                      ? 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-white' 
                      : 'bg-blue-500 text-white hover:bg-blue-600'
                  }`}
                >
                  {following ? 'Following' : 'Follow'}
                </button>
              </>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex justify-center gap-8 mb-8 border-b border-zinc-800">
          <button
            onClick={() => setActiveTab('created')}
            className={`px-2 py-3 text-sm font-medium transition-colors relative ${
              activeTab === 'created' 
                ? 'text-white' 
                : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            Created
            {activeTab === 'created' && (
              <div className="absolute bottom-0 left-0 right-0 h-px bg-white" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('collections')}
            className={`px-2 py-3 text-sm font-medium transition-colors relative ${
              activeTab === 'collections' 
                ? 'text-white' 
                : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            Collections
            {activeTab === 'collections' && (
              <div className="absolute bottom-0 left-0 right-0 h-px bg-white" />
            )}
          </button>
        </div>

        {/* Content */}
        {activeTab === 'created' ? (
          <MasonryGrid
            assets={userAssets}
            loading={false}
            hasMore={false}
            onDownload={() => {}}
            minimal={true}
          />
        ) : (
          <div>
            {/* Collections Grid */}
            {collections.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {collections.map((collection) => (
                  <CollectionCard
                    key={collection.id}
                    collection={collection}
                    previews={collectionPreviews[collection.id] || []}
                    isOwnProfile={isOwnProfile}
                    currentUserId={currentUser?.id}
                    onDelete={handleCollectionDelete}
                    onPrivacyToggle={handlePrivacyToggle}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                {isOwnProfile ? (
                  <>
                    <Folder className="w-10 h-10 text-zinc-700 mx-auto mb-3" />
                    <h3 className="text-sm font-medium text-zinc-300 mb-1">No collections yet</h3>
                    <p className="text-xs text-zinc-500">Save assets to create your first collection</p>
                  </>
                ) : (
                  <>
                    <p className="text-sm text-zinc-500">No public collections</p>
                  </>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
