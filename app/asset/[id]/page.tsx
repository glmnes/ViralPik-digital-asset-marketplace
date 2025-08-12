'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Download, Heart, Share2, Send, Loader2, Bookmark, Eye, Trash2, Check, Youtube, Music, Camera, Video, FileText, Hash } from 'lucide-react';
import MasonryGrid from '@/components/MasonryGrid';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import SaveModal from '@/components/SaveModal';
import { SupabaseAsset, Profile, Comment } from '@/types';

// Platform configuration
const platformConfig: Record<string, { icon: React.ComponentType<{ className?: string }>; color: string }> = {
  youtube: { icon: Youtube, color: 'bg-red-500' },
  tiktok: { icon: Video, color: 'bg-black' },
  instagram: { icon: Camera, color: 'bg-gradient-to-r from-purple-500 to-pink-500' },
  twitter: { icon: Hash, color: 'bg-blue-400' },
  spotify: { icon: Music, color: 'bg-green-500' },
  default: { icon: FileText, color: 'bg-zinc-700' }
};

export default function AssetDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const assetId = params.id as string;
  
  const [asset, setAsset] = useState<SupabaseAsset | null>(null);
  const [creator, setCreator] = useState<Profile | null>(null);
  const [relatedAssets, setRelatedAssets] = useState<SupabaseAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState<Comment[]>([]);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);

  // Load asset data
  useEffect(() => {
    const loadAssetData = async () => {
      try {
        // Load asset with creator info
        const { data: assetData, error: assetError } = await supabase
          .from('assets')
          .select(`
            *,
            creator:profiles!creator_id(*)
          `)
          .eq('id', assetId)
          .single();

        if (assetError) throw assetError;
        if (!assetData) {
          router.push('/');
          return;
        }

        setAsset(assetData);
        setCreator(assetData.creator);

        // Load related assets from same creator or platform
        const { data: related } = await supabase
          .from('assets')
          .select('*')
          .eq('platform', assetData.platform)
          .neq('id', assetId)
          .eq('status', 'approved')
          .limit(12);

        setRelatedAssets(related || []);

        // Load comments
        const { data: commentsData } = await supabase
          .from('comments')
          .select(`
            *,
            user:profiles!user_id(*)
          `)
          .eq('asset_id', assetId)
          .order('created_at', { ascending: false });

        setComments(commentsData || []);

        // Check if user has liked/saved/following
        if (user) {
          const { data: likeData } = await supabase
            .from('likes')
            .select('id')
            .eq('asset_id', assetId)
            .eq('user_id', user.id)
            .single();

          setIsLiked(!!likeData);

          const { data: saveData } = await supabase
            .from('saves')
            .select('id')
            .eq('asset_id', assetId)
            .eq('user_id', user.id);

          setIsSaved(!!saveData && saveData.length > 0);
          
          // Check if following creator
          if (assetData.creator_id) {
            const { data: followData } = await supabase
              .from('follows')
              .select('id')
              .eq('follower_id', user.id)
              .eq('following_id', assetData.creator_id)
              .single();
            
            setIsFollowing(!!followData);
          }
        }

        // Increment view count
        await supabase.rpc('increment_view_count', { asset_id: assetId });

      } catch (error) {
        console.error('Error loading asset:', error);
        toast.error('Failed to load asset');
      } finally {
        setLoading(false);
      }
    };

    loadAssetData();
  }, [assetId, user, router]);

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please sign in to comment');
      return;
    }
    if (comment.trim()) {
      try {
        const { data, error } = await supabase
          .from('comments')
          .insert({
            asset_id: assetId,
            user_id: user.id,
            content: comment
          })
          .select(`
            *,
            user:profiles!user_id(*)
          `)
          .single();

        if (error) throw error;
        
        setComments([data, ...comments]);
        setComment('');
        toast.success('Comment added');
      } catch (error) {
        console.error('Error adding comment:', error);
        toast.error('Failed to add comment');
      }
    }
  };

  const handleSave = async () => {
    if (!user) {
      toast.error('Please sign in to save');
      return;
    }

    if (isSaved) {
      // Unsave
      try {
        await supabase
          .from('saves')
          .delete()
          .eq('asset_id', assetId)
          .eq('user_id', user.id);
        
        setIsSaved(false);
        toast.success('Removed from saved');
      } catch (error) {
        console.error('Error unsaving:', error);
        toast.error('Failed to unsave');
      }
    } else {
      // Show save modal
      setShowSaveModal(true);
    }
  };

  const handleSaveComplete = () => {
    setIsSaved(true);
    setShowSaveModal(false);
  };
  
  const handleFollow = async () => {
    if (!user) {
      toast.error('Please sign in to follow');
      return;
    }
    if (!creator) return;
    
    // Prevent self-following
    if (creator.id === user.id) {
      toast.error('You cannot follow yourself');
      return;
    }
    
    try {
      if (isFollowing) {
        await supabase
          .from('follows')
          .delete()
          .eq('follower_id', user.id)
          .eq('following_id', creator.id);
        
        setIsFollowing(false);
        // Update follower count locally
        setCreator({
          ...creator,
          follower_count: Math.max(0, (creator.follower_count || 0) - 1)
        });
        toast.success('Unfollowed');
      } else {
        await supabase
          .from('follows')
          .insert({
            follower_id: user.id,
            following_id: creator.id
          });
        
        setIsFollowing(true);
        // Update follower count locally
        setCreator({
          ...creator,
          follower_count: (creator.follower_count || 0) + 1
        });
        toast.success('Following');
      }
    } catch (error) {
      console.error('Error toggling follow:', error);
      toast.error('Failed to update follow status');
    }
  };

  const handleShare = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    setCopied(true);
    toast.success('Link copied!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!user) return;
    try {
      await supabase
        .from('comments')
        .delete()
        .eq('id', commentId)
        .eq('user_id', user.id);
      
      setComments(comments.filter(c => c.id !== commentId));
      toast.success('Comment deleted');
    } catch (error) {
      console.error('Error deleting comment:', error);
      toast.error('Failed to delete comment');
    }
  };

  const handleLike = async () => {
    if (!user) {
      toast.error('Please sign in to like');
      return;
    }

    try {
      if (isLiked) {
        await supabase
          .from('likes')
          .delete()
          .eq('asset_id', assetId)
          .eq('user_id', user.id);
        
        setIsLiked(false);
        if (asset) {
          setAsset({ ...asset, like_count: Math.max(0, (asset.like_count || 0) - 1) });
        }
      } else {
        await supabase
          .from('likes')
          .insert({
            asset_id: assetId,
            user_id: user.id
          });
        
        setIsLiked(true);
        if (asset) {
          setAsset({ ...asset, like_count: (asset.like_count || 0) + 1 });
        }
      }
    } catch (error) {
      console.error('Error toggling like:', error);
      toast.error('Failed to update like');
    }
  };


  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (!asset) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-zinc-100 mb-2">Asset not found</h2>
          <p className="text-zinc-400 mb-4">This asset may have been removed or is not available.</p>
          <button
            onClick={() => router.push('/')}
            className="px-4 py-2 bg-blue-500 text-white rounded-full text-sm font-medium hover:bg-blue-600 transition-colors">
            Go Home
          </button>
        </div>
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-zinc-950">
      {/* Back button */}
      <Link
        href="/"
        className="fixed top-20 left-4 z-50 w-10 h-10 bg-zinc-900 border border-zinc-800 rounded-full flex items-center justify-center hover:bg-zinc-800 transition-colors">
        <ArrowLeft className="w-4 h-4 text-zinc-400" />
      </Link>
      
      {/* Save Modal */}
      {showSaveModal && (
        <SaveModal 
          assetId={assetId}
          onClose={() => setShowSaveModal(false)}
          onSave={handleSaveComplete}
        />
      )}

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left: Asset Preview */}
          <div>
            <div className="sticky top-24">
              <div className="relative overflow-hidden bg-zinc-900 border border-zinc-800 rounded-2xl">
                <Image
                  src={asset.preview_url}
                  alt={asset.title}
                  width={800}
                  height={600}
                  className="w-full h-auto"
                />
              </div>
            </div>
          </div>

          {/* Right: Asset Details */}
          <div>
            {/* Actions Bar */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex gap-1">
                <button 
                  onClick={handleLike}
                  className={`p-2 transition-colors ${
                    isLiked ? 'text-red-500' : 'text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
                </button>
                <button 
                  onClick={handleShare}
                  className="p-2 text-zinc-500 hover:text-zinc-300 transition-colors"
                >
                  {copied ? <Check className="w-4 h-4 text-green-500" /> : <Share2 className="w-4 h-4" />}
                </button>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleSave}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    isSaved 
                      ? 'bg-zinc-800 text-white' 
                      : 'border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700'
                  }`}
                >
                  {isSaved ? 'Saved' : 'Save'}
                </button>
              </div>
            </div>

            {/* Title and Description */}
            <h1 className="text-2xl font-medium text-white mb-2">{asset.title}</h1>
            <p className="text-sm text-zinc-500 mb-6">
              {asset.description || 'No description available'}
            </p>

            {/* Asset Stats */}
            <div className="flex gap-6 mb-6 py-3 border-y border-zinc-800">
              <div className="flex items-center gap-2">
                <Eye className="w-3.5 h-3.5 text-zinc-600" />
                <span className="text-sm text-zinc-400">{asset.view_count || 0} views</span>
              </div>
              <div className="flex items-center gap-2">
                <Heart className="w-3.5 h-3.5 text-zinc-600" />
                <span className="text-sm text-zinc-400">{asset.like_count || 0} likes</span>
              </div>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-1.5 mb-8">
              {asset.tags && asset.tags.length > 0 ? (
                asset.tags.map((tag: string) => (
                  <span
                    key={tag}
                    className="px-2.5 py-1 bg-zinc-900 border border-zinc-800 rounded-full text-zinc-400 text-xs hover:text-white hover:border-zinc-700 cursor-pointer transition-colors"
                  >
                    {tag}
                  </span>
                ))
              ) : (
                <span className="text-zinc-600 text-xs">No tags</span>
              )}
            </div>

            {/* Creator Info */}
            {creator && (
              <div className="p-4 bg-zinc-900/50 border border-zinc-800 rounded-xl mb-8">
                <div className="flex items-center gap-3">
                  <Link href={`/profile/${creator.username}`} className="flex items-center gap-3 flex-1 hover:opacity-80 transition-opacity">
                    <div className="w-10 h-10 bg-zinc-800 rounded-full flex items-center justify-center">
                      <span className="text-white font-medium text-sm">
                        {creator.username?.[0]?.toUpperCase() || 'U'}
                      </span>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-white text-sm">{creator.username || 'Unknown Creator'}</h3>
                      <div className="flex items-center gap-2 text-xs text-zinc-500">
                        <span>{creator.follower_count || 0} followers</span>
                        {creator.is_creator && (
                          <>
                            <span>·</span>
                            <span className="text-blue-400">Creator</span>
                          </>
                        )}
                      </div>
                    </div>
                  </Link>
                  {/* Only show follow button if not the current user */}
                  {user && creator.id !== user.id && (
                    <button
                      onClick={handleFollow}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                        isFollowing 
                          ? 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700' 
                          : 'bg-blue-500 text-white hover:bg-blue-600'
                      }`}
                    >
                      {isFollowing ? 'Following' : 'Follow'}
                    </button>
                  )}
                  {/* Show 'You' badge if it's the current user */}
                  {user && creator.id === user.id && (
                    <span className="px-3 py-1.5 bg-zinc-800 rounded-full text-zinc-500 text-xs">
                      You
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Comments Section */}
            <div className="border-t border-zinc-800 pt-6">
              <h3 className="text-sm font-medium text-white mb-4">
                Comments <span className="text-zinc-500">({comments.length})</span>
              </h3>

              {/* Add Comment */}
              <form onSubmit={handleAddComment} className="mb-6">
                <div className="flex gap-2">
                  <div className="w-8 h-8 bg-zinc-800 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-xs text-zinc-400">You</span>
                  </div>
                  <div className="flex-1">
                    <input
                      type="text"
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="Add a comment..."
                      className="w-full px-3 py-2 bg-zinc-900/50 border border-zinc-800 text-sm text-white focus:outline-none focus:border-zinc-700 placeholder-zinc-600 transition-all"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={!comment.trim()}
                    className="px-3 py-2 text-zinc-500 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </form>

              {/* Comments List */}
              <div className="space-y-3">
                {comments.map((comment) => (
                  <div key={comment.id} className="flex gap-2">
                    <div className="w-8 h-8 bg-zinc-800 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-xs text-zinc-400">
                        {comment.user?.username?.[0]?.toUpperCase() || 'U'}
                      </span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium text-zinc-300">
                          {comment.user?.username || 'Anonymous'}
                        </span>
                        <span className="text-xs text-zinc-600">
                          {new Date(comment.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-sm text-zinc-400">{comment.content}</p>
                      {user?.id === comment.user_id && (
                        <button 
                          onClick={() => handleDeleteComment(comment.id)}
                          className="text-xs text-zinc-600 hover:text-red-500 mt-1 transition-colors"
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Related Assets */}
        {relatedAssets.length > 0 && (
          <div className="mt-16 border-t border-zinc-800 pt-8">
            <h2 className="text-lg font-medium text-white mb-6">More like this</h2>
            <MasonryGrid
              assets={relatedAssets}
              loading={false}
              hasMore={false}
              onDownload={() => {}}
              minimal={true}
            />
          </div>
        )}
      </div>
    </div>
  );
}
