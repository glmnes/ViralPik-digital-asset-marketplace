'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Trash2, Globe, Lock, Edit } from 'lucide-react';
import MasonryGrid from '@/components/MasonryGrid';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export default function CollectionPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const collectionId = params.id as string;
  
  const [collection, setCollection] = useState<any>(null);
  const [assets, setAssets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOwner, setIsOwner] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (collectionId) {
      console.log('Loading collection with ID:', collectionId);
      loadCollection();
    }
  }, [collectionId, user]);

  const loadCollection = async () => {
    try {
      console.log('Fetching collection with ID:', collectionId);
      
      // Load collection details with user profile
      const { data: collectionData, error: collectionError } = await supabase
        .from('collections')
        .select('*')
        .eq('id', collectionId)
        .single();

      if (collectionError || !collectionData) {
        console.error('Collection error:', collectionError);
        toast.error('Collection not found');
        router.push('/');
        return;
      }

      // Get the owner's profile separately
      const { data: profileData } = await supabase
        .from('profiles')
        .select('username')
        .eq('id', collectionData.user_id)
        .single();

      if (profileData) {
        collectionData.profiles = profileData;
      }

      // Check if collection is private and user is not the owner
      if (!collectionData.is_public && (!user || user.id !== collectionData.user_id)) {
        toast.error('This collection is private');
        router.push('/');
        return;
      }

      setCollection(collectionData);
      setIsOwner(user?.id === collectionData.user_id);

      // Load assets in collection
      const { data: collectionAssets, error: assetsError } = await supabase
        .from('collection_assets')
        .select('*')
        .eq('collection_id', collectionId);

      console.log('Collection assets query result:', collectionAssets, 'Error:', assetsError);
      
      if (assetsError) {
        console.error('Detailed error:', assetsError.message, assetsError.details, assetsError.hint);

      }
      
      if (!assetsError && collectionAssets && collectionAssets.length > 0) {
        // Get the asset IDs
        const assetIds = collectionAssets.map((ca: any) => ca.asset_id);
        
        // Fetch the actual assets
        const { data: assetsData, error: assetsDataError } = await supabase
          .from('assets')
          .select('*')
          .in('id', assetIds);
        
        console.log('Assets data:', assetsData, 'Error:', assetsDataError);
        
        if (!assetsDataError && assetsData) {
          setAssets(assetsData);
        }
      } else {
        setAssets([]);
      }
    } catch (error) {
      console.error('Error loading collection:', error);
      toast.error('Failed to load collection');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!isOwner || !user) return;
    
    const confirmDelete = confirm(`Are you sure you want to delete "${collection.name}"? This action cannot be undone.`);
    if (!confirmDelete) return;

    setDeleting(true);
    try {
      // Delete collection (cascade will handle collection_assets)
      const { error } = await supabase
        .from('collections')
        .delete()
        .eq('id', collectionId)
        .eq('user_id', user.id); // Extra safety check

      if (error) throw error;

      toast.success('Collection deleted successfully');
      router.push(`/profile/${collection.profiles?.username || 'me'}`);
    } catch (error) {
      console.error('Error deleting collection:', error);
      toast.error('Failed to delete collection');
    } finally {
      setDeleting(false);
    }
  };

  const handleRemoveAsset = async (assetId: string) => {
    if (!isOwner) return;

    try {
      const { error } = await supabase
        .from('collection_assets')
        .delete()
        .eq('collection_id', collectionId)
        .eq('asset_id', assetId);

      if (error) throw error;

      setAssets(prev => prev.filter(a => a.id !== assetId));
      toast.success('Asset removed from collection');
    } catch (error) {
      console.error('Error removing asset:', error);
      toast.error('Failed to remove asset');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!collection) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-zinc-100 mb-2">Collection not found</h2>
          <p className="text-zinc-400 mb-4">This collection doesn&apos;t exist or has been removed.</p>
          <Link
            href="/"
            className="px-6 py-3 bg-blue-500 text-white rounded-full font-medium hover:bg-blue-600 transition-colors"
          >
            Go Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href={`/profile/${collection.profiles?.username || 'me'}`}
            className="inline-flex items-center gap-2 text-zinc-400 hover:text-zinc-100 transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to profile
          </Link>

          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold text-zinc-100">{collection.name}</h1>
                <div className="flex items-center gap-2">
                  {collection.is_public ? (
                    <div className="flex items-center gap-1 px-2 py-1 bg-green-500/10 text-green-400 rounded-full text-sm">
                      <Globe className="w-3 h-3" />
                      <span>Public</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1 px-2 py-1 bg-zinc-800 text-zinc-400 rounded-full text-sm">
                      <Lock className="w-3 h-3" />
                      <span>Private</span>
                    </div>
                  )}
                </div>
              </div>
              {collection.profiles && (
                <p className="text-zinc-400">
                  By <Link href={`/profile/${collection.profiles.username}`} className="text-blue-400 hover:text-blue-300">
                    @{collection.profiles.username}
                  </Link>
                </p>
              )}
              <p className="text-sm text-zinc-500 mt-1">
                {assets.length} {assets.length === 1 ? 'asset' : 'assets'} • Created {new Date(collection.created_at).toLocaleDateString()}
              </p>
            </div>

            {isOwner && (
              <div className="flex items-center gap-2">
                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className="px-4 py-2 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 transition-colors flex items-center gap-2 disabled:opacity-50"
                >
                  <Trash2 className="w-4 h-4" />
                  {deleting ? 'Deleting...' : 'Delete Collection'}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Assets Grid */}
        {assets.length > 0 ? (
          <MasonryGrid
            assets={assets}
            loading={false}
            hasMore={false}
            onDownload={() => {}}
            minimal={true}
          />
        ) : (
          <div className="text-center py-20">
            <h3 className="text-xl font-semibold text-zinc-100 mb-2">No assets in this collection</h3>
            <p className="text-zinc-400">
              {isOwner ? 'Start saving assets to add them to this collection' : 'This collection is empty'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
