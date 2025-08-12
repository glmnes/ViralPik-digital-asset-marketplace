'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Download, Share2, Plus, X, Check, Lock, Globe, Heart, MessageCircle, Bookmark } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabaseClient';
import { toast } from 'sonner';
import PlatformIcon from './PlatformIcon';
import { SupabaseAsset } from '@/types';
import AuthModalWithPricing from './AuthModalWithPricing';
import ModalPortal from './ModalPortal';

interface Collection {
  id: string;
  name: string;
  description?: string;
  user_id: string;
  is_public: boolean;
  created_at: string;
}


interface PinterestCardProps {
  asset: SupabaseAsset;
  onDownload?: (assetId: string) => void;
  hideOverlays?: boolean;
}

export default function PinterestCard({ asset, onDownload, hideOverlays = false }: PinterestCardProps) {
  // Consider an asset NEW if created within the last 7 days (homepage only)
  const isNew = (() => {
    try {
      if (!asset.created_at) return false;
      const createdAt = new Date(asset.created_at).getTime();
      const sevenDaysMs = 7 * 24 * 60 * 60 * 1000;
      return Date.now() - createdAt < sevenDaysMs;
    } catch {
      return false;
    }
  })();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [showSaveMenu, setShowSaveMenu] = useState(false);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [creatingNew, setCreatingNew] = useState(false);
  const [newCollectionName, setNewCollectionName] = useState('');
  const [isPublicCollection, setIsPublicCollection] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(asset.like_count || 0);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authModalAction, setAuthModalAction] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();

  // Platform-specific gradient colors
  const getPlatformGradient = () => {
    switch (asset.platform) {
      case 'youtube':
        return 'from-red-500/20 to-red-600/20';
      case 'tiktok':
        return 'from-pink-500/20 via-purple-500/20 to-cyan-500/20';
      case 'instagram':
        return 'from-purple-500/20 via-pink-500/20 to-orange-500/20';
      case 'twitter':
        return 'from-blue-400/20 to-blue-500/20';
      case 'spotify':
        return 'from-green-500/20 to-green-600/20';
      case 'linkedin':
        return 'from-blue-600/20 to-blue-700/20';
      case 'pinterest':
        return 'from-red-600/20 to-red-700/20';
      default:
        return 'from-zinc-600/20 to-zinc-700/20';
    }
  };

  // Platform-specific accent colors
  const getPlatformAccent = () => {
    switch (asset.platform) {
      case 'youtube':
        return 'bg-red-500';
      case 'tiktok':
        return 'bg-gradient-to-r from-pink-500 to-cyan-500';
      case 'instagram':
        return 'bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500';
      case 'twitter':
        return 'bg-blue-400';
      case 'spotify':
        return 'bg-green-500';
      case 'linkedin':
        return 'bg-blue-600';
      case 'pinterest':
        return 'bg-red-600';
      default:
        return 'bg-zinc-600';
    }
  };

  // Load user's collections
  useEffect(() => {
    if (user && showSaveMenu) {
      loadCollections();
    }
  }, [user, showSaveMenu]);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowSaveMenu(false);
        setCreatingNew(false);
      }
    };

    if (showSaveMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showSaveMenu]);

  const loadCollections = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('collections')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (!error && data) {
        setCollections(data);
      }
    } catch (error) {
      console.error('Error loading collections:', error);
    }
  };

  const handleSaveToCollection = async (collectionId: string) => {
    if (!user) {
      toast.error('Please sign in to save assets');
      return;
    }

    try {
      // Check if already saved
      const { data: existing } = await supabase
        .from('collection_assets')
        .select('id')
        .eq('collection_id', collectionId)
        .eq('asset_id', asset.id)
        .single();

      if (existing) {
        toast.info('Already saved to this collection');
        return;
      }

      // Save to collection
      const { error } = await supabase
        .from('collection_assets')
        .insert({
          collection_id: collectionId,
          asset_id: asset.id
        });

      if (!error) {
        setIsSaved(true);
        setShowSaveMenu(false);
        toast.success('Saved to collection!');
      }
    } catch (error) {
      console.error('Error saving to collection:', error);
      toast.error('Failed to save');
    }
  };

  const handleCreateCollection = async () => {
    if (!user || !newCollectionName.trim()) return;

    try {
      const { data, error } = await supabase
        .from('collections')
        .insert({
          user_id: user.id,
          name: newCollectionName,
          is_public: isPublicCollection
        })
        .select()
        .single();

      if (!error && data) {
        await handleSaveToCollection(data.id);
        setNewCollectionName('');
        setIsPublicCollection(false);
        setCreatingNew(false);
        setCollections([data, ...collections]);
      }
    } catch (error) {
      console.error('Error creating collection:', error);
      toast.error('Failed to create collection');
    }
  };

  const handleDownload = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Check if user is authenticated
    if (!user) {
      setAuthModalAction('download assets');
      setShowAuthModal(true);
      return;
    }
    
    // Call the download API with limits
    try {
      const response = await fetch('/api/download', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ assetId: asset.id })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        if (response.status === 429) {
          toast.error(data.message || 'Download limit reached');
          toast.info(`Upgrade to ${data.tier === 'free' ? 'Pro' : 'Premium'} for more downloads`);
          return;
        }
        throw new Error(data.error);
      }
      
      // Download the file
      const fileResponse = await fetch(data.downloadUrl);
      const blob = await fileResponse.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${asset.title}.${asset.format?.toLowerCase() || 'png'}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      if (onDownload) {
        onDownload(asset.id);
      }
      
      toast.success(`Download started! ${data.remaining} downloads left today`);
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Failed to download');
    }
  };

  const handleShare = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const url = `${window.location.origin}/asset/${asset.id}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: asset.title,
          text: `Check out ${asset.title}`,
          url: url
        });
      } catch (error) {
        console.log('Share cancelled');
      }
    } else {
      // Fallback to clipboard
      navigator.clipboard.writeText(url);
      toast.success('Link copied to clipboard!');
    }
  };

  // Calculate aspect ratio based on asset dimensions or use default
  const getImageHeight = () => {
    // If we have dimensions, calculate aspect ratio
    if (asset.dimensions) {
      let width, height;
      
      // Handle different dimension formats
      if (typeof asset.dimensions === 'string') {
        // String format like "1920x1080"
        const parts = asset.dimensions.split('x').map(Number);
        width = parts[0];
        height = parts[1];
      } else if (typeof asset.dimensions === 'object' && asset.dimensions !== null) {
        // Object format like { width: 1920, height: 1080 }
        width = asset.dimensions.width;
        height = asset.dimensions.height;
      }
      
      if (width && height) {
        const aspectRatio = height / width;
        // Return appropriate Tailwind class based on aspect ratio
        if (aspectRatio < 0.7) return 'aspect-video';
        if (aspectRatio < 1) return 'aspect-[4/3]';
        if (aspectRatio === 1) return 'aspect-square';
        if (aspectRatio < 1.5) return 'aspect-[3/4]';
        return 'aspect-[2/3]';
      }
    }
    // Default aspect ratio for assets without dimensions
    return 'aspect-[3/4]';
  };

  const handleLike = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) {
      setAuthModalAction('like assets');
      setShowAuthModal(true);
      return;
    }

    try {
      if (isLiked) {
        // Unlike
        await supabase
          .from('likes')
          .delete()
          .eq('asset_id', asset.id)
          .eq('user_id', user.id);
        
        setIsLiked(false);
        setLikeCount(Math.max(0, likeCount - 1));
      } else {
        // Like
        await supabase
          .from('likes')
          .insert({
            asset_id: asset.id,
            user_id: user.id
          });
        
        setIsLiked(true);
        setLikeCount(likeCount + 1);
      }
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  return (
    <div className="group relative cursor-pointer transition-transform duration-200 will-change-transform hover:-translate-y-0.5">
      {/* Image Container */}
      <div className={`relative w-full ${getImageHeight()} overflow-hidden bg-zinc-900 rounded-xl ring-1 ring-zinc-800/60 group-hover:ring-zinc-700/80 transition-colors shadow-sm group-hover:shadow-zinc-900/30`}>
          {!imageLoaded && (
            <div className="absolute inset-0 animate-pulse bg-zinc-800" />
          )}
          <Image
            src={asset.preview_url}
            alt={asset.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className={`object-cover transition-opacity duration-300 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
          onLoad={() => setImageLoaded(true)}
          />
          
          {/* Clickable overlay for navigation */}
          <Link href={`/asset/${asset.id}`} className="absolute inset-0 z-[5]" aria-label={`View ${asset.title}`} />
          
          {/* Platform gradient overlay */}
          <div className={`absolute inset-0 bg-gradient-to-t ${getPlatformGradient()} opacity-50 z-[1]`} />
          
          {/* Platform Icon Badge - More prominent with color */}
          {!hideOverlays && (
            <div className={`absolute top-3 left-3 px-2.5 py-1.5 ${getPlatformAccent()} backdrop-blur-sm rounded-full flex items-center gap-1.5 z-10 shadow-lg`}>
              <PlatformIcon platform={asset.platform} className="w-3.5 h-3.5 text-white" />
              <span className="text-xs font-medium text-white capitalize">{asset.platform}</span>
            </div>
          )}

        {/* Hover Overlay - More vibrant with social actions */}
        <div className={`absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/30 transition-all duration-200 opacity-0 group-hover:opacity-100 z-10 pointer-events-none`}>
          {/* Save Button with Dropdown - Top Right */}
          <div className="absolute top-3 right-3 z-20 pointer-events-auto" ref={dropdownRef}>
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if (!user) {
                  setAuthModalAction('save assets');
                  setShowAuthModal(true);
                  return;
                }
                setShowSaveMenu(!showSaveMenu);
              }}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all backdrop-blur-sm shadow-lg ${
                isSaved 
                  ? 'bg-white text-black' 
                  : 'bg-blue-500 text-white hover:bg-blue-600'
              }`}
            >
              {isSaved ? 'Saved' : 'Save'}
            </button>
            
            {/* Collections Dropdown */}
            {showSaveMenu && (
              <div className="absolute top-full right-0 mt-2 w-64 bg-zinc-900 border border-zinc-700 rounded-lg shadow-xl overflow-hidden" style={{ zIndex: 9999 }}>
                {creatingNew ? (
                  <div className="p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <input
                        type="text"
                        value={newCollectionName}
                        onChange={(e) => setNewCollectionName(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            handleCreateCollection();
                          }
                        }}
                        placeholder="Collection name"
                        className="flex-1 px-3 py-1.5 bg-zinc-800 border border-zinc-700 rounded text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        autoFocus
                        onClick={(e) => e.stopPropagation()}
                      />
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCreateCollection();
                        }}
                        className="p-1.5 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setCreatingNew(false);
                          setNewCollectionName('');
                          setIsPublicCollection(false);
                        }}
                        className="p-1.5 bg-zinc-700 text-zinc-300 rounded hover:bg-zinc-600 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsPublicCollection(!isPublicCollection);
                      }}
                      className="flex items-center gap-2 text-xs text-zinc-400 hover:text-zinc-200 transition-colors"
                    >
                      {isPublicCollection ? (
                        <>
                          <Globe className="w-3 h-3" />
                          <span>Public collection</span>
                        </>
                      ) : (
                        <>
                          <Lock className="w-3 h-3" />
                          <span>Private collection</span>
                        </>
                      )}
                    </button>
                  </div>
                ) : (
                  <>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setCreatingNew(true);
                      }}
                      className="w-full px-4 py-2.5 text-left text-sm text-zinc-100 hover:bg-zinc-800 transition-colors flex items-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      Create new collection
                    </button>
                    
                    {collections.length > 0 && (
                      <>
                        <div className="border-t border-zinc-700" />
                        <div className="max-h-64 overflow-y-auto">
                          {collections.map((collection) => (
                            <button
                              key={collection.id}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleSaveToCollection(collection.id);
                              }}
                              className="w-full px-4 py-2.5 text-left text-sm text-zinc-100 hover:bg-zinc-800 transition-colors"
                            >
                              {collection.name}
                            </button>
                          ))}
                        </div>
                      </>
                    )}
                  </>
                )}
              </div>
            )}
          </div>

          {/* Social Actions - Bottom */}
          <div className="absolute bottom-3 left-3 right-3 pointer-events-auto flex items-center justify-between">
            {/* Left side - Like button (hidden on homepage) */}
            {!hideOverlays ? (
              <button
                onClick={handleLike}
                className={`p-2 rounded-full backdrop-blur-sm transition-all ${
                  isLiked 
                    ? 'bg-red-500 text-white' 
                    : 'bg-white/20 text-white hover:bg-red-500'
                }`}>
                <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
              </button>
            ) : (
              <div />
            )}
            
            {/* Right side - Actions */}
            <div className="flex gap-1">
              <button
                onClick={handleShare}
                className="p-2 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-colors">
                <Share2 className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Card Footer - Title and optional license */}
      <Link href={`/asset/${asset.id}`} className="block mt-2">
        <h3 className="text-sm font-medium text-white line-clamp-1">
          {asset.title}
        </h3>
        {asset.license && (
          <div className="mt-1">
            <span className="inline-block px-1.5 py-0.5 rounded text-[10px] bg-blue-500/10 text-blue-400 border border-blue-500/20">
              {asset.license}
            </span>
          </div>
        )}
      </Link>
      
      {/* Auth Modal - Rendered in Portal */}
      {showAuthModal && (
        <ModalPortal>
          <AuthModalWithPricing 
            isOpen={showAuthModal}
            onClose={() => setShowAuthModal(false)}
            onSuccess={() => {
              setShowAuthModal(false);
              // Retry the action after successful auth
              if (authModalAction === 'download assets') {
                handleDownload({ preventDefault: () => {}, stopPropagation: () => {} } as React.MouseEvent);
              } else if (authModalAction === 'like assets') {
                handleLike({ preventDefault: () => {}, stopPropagation: () => {} } as React.MouseEvent);
              }
            }}
            triggerAction={authModalAction}
          />
        </ModalPortal>
      )}
    </div>
  );
}
