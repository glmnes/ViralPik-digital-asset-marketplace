'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Globe, Lock, Folder, Trash2, Edit2, MoreVertical, Eye, EyeOff } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';
import { toast } from 'sonner';

interface CollectionCardProps {
  collection: any;
  previews: any[];
  isOwnProfile: boolean;
  currentUserId?: string;
  onDelete: (collectionId: string) => void;
  onPrivacyToggle: (collectionId: string, isPublic: boolean) => void;
}

export default function CollectionCard({
  collection,
  previews,
  isOwnProfile,
  currentUserId,
  onDelete,
  onPrivacyToggle
}: CollectionCardProps) {
  const [showMenu, setShowMenu] = useState(false);
  const [isPublic, setIsPublic] = useState(collection.is_public);
  const [isUpdating, setIsUpdating] = useState(false);
  const [hoveredAsset, setHoveredAsset] = useState<number | null>(null);

  const handlePrivacyToggle = async () => {
    if (!currentUserId || isUpdating) return;
    
    setIsUpdating(true);
    try {
      const newPrivacy = !isPublic;
      const { error } = await supabase
        .from('collections')
        .update({ is_public: newPrivacy })
        .eq('id', collection.id)
        .eq('user_id', currentUserId);

      if (!error) {
        setIsPublic(newPrivacy);
        onPrivacyToggle(collection.id, newPrivacy);
        toast.success(`Collection is now ${newPrivacy ? 'public' : 'private'}`);
      } else {
        toast.error('Failed to update privacy');
      }
    } catch (error) {
      console.error('Error updating privacy:', error);
      toast.error('Failed to update privacy');
    } finally {
      setIsUpdating(false);
      setShowMenu(false);
    }
  };

  const handleDelete = () => {
    const confirmDelete = confirm(`Delete "${collection.name}"?`);
    if (confirmDelete) {
      onDelete(collection.id);
      setShowMenu(false);
    }
  };

  // Create dynamic grid layout based on number of previews
  const getGridLayout = () => {
    if (previews.length === 0) return null;
    if (previews.length === 1) return 'grid-cols-1';
    if (previews.length === 2) return 'grid-cols-2';
    if (previews.length === 3) return 'grid-cols-2'; // 2x2 grid with one empty
    return 'grid-cols-2'; // 2x2 grid for 4 or more
  };

  return (
    <div className="group relative bg-zinc-900/50 rounded-lg overflow-hidden hover:bg-zinc-900 transition-all border border-zinc-800">
      {/* Preview Section */}
      <Link href={`/collection/${collection.id}`} className="block">
        <div className="aspect-[4/3] bg-zinc-900 relative overflow-hidden">
          {previews.length > 0 ? (
            <div className={`grid ${getGridLayout()} gap-0.5 h-full`}>
              {previews.slice(0, 4).map((asset, idx) => (
                <div 
                  key={asset.id} 
                  className={`relative bg-zinc-800 overflow-hidden ${
                    previews.length === 3 && idx === 2 ? 'col-span-2' : ''
                  }`}
                  onMouseEnter={() => setHoveredAsset(idx)}
                  onMouseLeave={() => setHoveredAsset(null)}
                >
                  <Image
                    src={asset.preview_url}
                    alt={asset.title}
                    fill
                    className={`object-cover transition-transform duration-300 ${
                      hoveredAsset === idx ? 'scale-110' : ''
                    }`}
                  />
                  {/* Subtle gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              ))}
              {/* Fill empty spaces if less than 4 */}
              {previews.length < 4 && previews.length !== 3 && 
                Array.from({ length: 4 - previews.length }).map((_, idx) => (
                  <div key={`empty-${idx}`} className="bg-zinc-800/50" />
                ))
              }
            </div>
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <Folder className="w-12 h-12 text-zinc-700 mb-2" />
              <span className="text-xs text-zinc-600">Empty collection</span>
            </div>
          )}
          
          {/* Overlay showing more count */}
          {previews.length > 4 && (
            <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/80 backdrop-blur-sm rounded-md">
              <span className="text-xs text-white font-medium">
                +{previews.length - 4} more
              </span>
            </div>
          )}

          {/* Hover effect - subtle zoom on entire preview */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
        </div>
      </Link>

      {/* Collection Info */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1 min-w-0">
            <Link href={`/collection/${collection.id}`}>
              <h3 className="font-medium text-sm text-white group-hover:text-blue-400 transition-colors truncate">
                {collection.name}
              </h3>
            </Link>
            <div className="flex items-center gap-3 mt-1">
              <span className="text-xs text-zinc-500">
                {collection.collection_assets?.[0]?.count || previews.length || 0} assets
              </span>
              <div className="flex items-center gap-1">
                {isPublic ? (
                  <>
                    <Globe className="w-3 h-3 text-blue-500" />
                    <span className="text-xs text-blue-500">Public</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-3 h-3 text-zinc-500" />
                    <span className="text-xs text-zinc-500">Private</span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Actions Menu for own profile */}
          {isOwnProfile && currentUserId && (
            <div className="relative">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowMenu(!showMenu);
                }}
                className="p-1.5 rounded hover:bg-zinc-800 transition-colors opacity-0 group-hover:opacity-100"
              >
                <MoreVertical className="w-4 h-4 text-zinc-400" />
              </button>

              {showMenu && (
                <>
                  {/* Click outside to close */}
                  <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setShowMenu(false)} 
                  />
                  
                  {/* Dropdown Menu */}
                  <div className="absolute right-0 top-full mt-1 w-48 bg-zinc-900 border border-zinc-800 rounded-lg shadow-xl z-50 py-1">
                    <button
                      onClick={handlePrivacyToggle}
                      disabled={isUpdating}
                      className="w-full px-4 py-2 text-left text-sm text-zinc-300 hover:bg-zinc-800 hover:text-white transition-colors flex items-center gap-2 disabled:opacity-50"
                    >
                      {isPublic ? (
                        <>
                          <EyeOff className="w-4 h-4" />
                          Make Private
                        </>
                      ) : (
                        <>
                          <Eye className="w-4 h-4" />
                          Make Public
                        </>
                      )}
                    </button>
                    
                    <Link
                      href={`/collection/${collection.id}`}
                      className="w-full px-4 py-2 text-left text-sm text-zinc-300 hover:bg-zinc-800 hover:text-white transition-colors flex items-center gap-2"
                      onClick={() => setShowMenu(false)}
                    >
                      <Edit2 className="w-4 h-4" />
                      Edit Collection
                    </Link>
                    
                    <hr className="my-1 border-zinc-800" />
                    
                    <button
                      onClick={handleDelete}
                      className="w-full px-4 py-2 text-left text-sm text-red-400 hover:bg-zinc-800 hover:text-red-300 transition-colors flex items-center gap-2"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete Collection
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        {/* Description if exists */}
        {collection.description && (
          <p className="text-xs text-zinc-600 line-clamp-2 mb-2">
            {collection.description}
          </p>
        )}

        {/* Timestamp */}
        <p className="text-xs text-zinc-600">
          Updated {new Date(collection.updated_at || collection.created_at).toLocaleDateString()}
        </p>
      </div>
    </div>
  );
}
