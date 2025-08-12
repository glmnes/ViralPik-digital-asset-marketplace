'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Lock, Globe, MoreHorizontal, UserPlus, Link2 } from 'lucide-react';
import MasonryGrid from '@/components/MasonryGrid';
import { mockAssets } from '@/lib/mockData';
import { SupabaseAsset } from '@/types';

export default function BoardPage() {
  const params = useParams();
  const router = useRouter();
  const boardId = params.id as string;
  
  const [isFollowing, setFollowing] = useState(false);

  // Mock board data
  const board = {
    id: boardId,
    name: 'Viral YouTube Pack 2024',
    description: 'My collection of the best YouTube thumbnails and assets that have helped me get millions of views',
    owner: {
      name: 'Alex Creator',
      username: 'alexcreator',
      avatar: 'https://ui-avatars.com/api/?name=Alex+Creator&background=ef4444&color=fff',
    },
    collaborators: [
      { name: 'Sarah Design', avatar: 'https://ui-avatars.com/api/?name=Sarah+Design' },
      { name: 'Mike Creator', avatar: 'https://ui-avatars.com/api/?name=Mike+Creator' },
    ],
    stats: {
      pins: 48,
      followers: 1250,
      lastActivity: '2 hours ago'
    },
    isPrivate: false
  };

  // Convert mockAssets to SupabaseAsset format
  const boardAssets: SupabaseAsset[] = mockAssets.slice(0, 20).map(asset => ({
    id: asset.id,
    title: asset.title,
    description: '',
    preview_url: asset.preview_url,
    file_url: asset.file_url,
    category: asset.asset_type,
    platform: asset.platform,
    format: asset.format,
    platforms: [asset.platform],
    tags: asset.tags,
    downloads: asset.download_count,
    likes: 0,
    download_count: asset.download_count,
    like_count: 0,
    view_count: asset.view_count,
    status: 'approved' as const,
    created_at: asset.created_at,
    created_by: asset.created_by || '',
    creator_id: asset.created_by || undefined
  }));

  return (
    <div className="min-h-screen bg-zinc-950">
      {/* Header */}
      <div className="sticky top-16 z-40 bg-zinc-950 border-b border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.back()}
                className="p-2 hover:bg-zinc-800 rounded-full transition-colors">
                <ArrowLeft className="w-5 h-5 text-zinc-400" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-zinc-100">{board.name}</h1>
                <div className="flex items-center gap-4 mt-1 text-sm text-zinc-400">
                  <span>{board.stats.pins} Pins</span>
                  <span>•</span>
                  <span>{board.stats.followers.toLocaleString()} followers</span>
                  <span>•</span>
                  <span>Last updated {board.stats.lastActivity}</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <button className="p-2 hover:bg-zinc-800 rounded-full transition-colors">
                <UserPlus className="w-5 h-5 text-zinc-400" />
              </button>
              <button className="p-2 hover:bg-zinc-800 rounded-full transition-colors">
                <Link2 className="w-5 h-5 text-zinc-400" />
              </button>
              <button className="p-2 hover:bg-zinc-800 rounded-full transition-colors">
                <MoreHorizontal className="w-5 h-5 text-zinc-400" />
              </button>
              <button
                onClick={() => setFollowing(!isFollowing)}
                className={`px-6 py-2 rounded-full font-medium transition-colors ${
                  isFollowing 
                    ? 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700' 
                    : 'bg-blue-500 text-white hover:bg-blue-600'
                }`}
              >
                {isFollowing ? 'Following' : 'Follow'}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Board Info */}
        <div className="mb-8">
          <p className="text-zinc-300 mb-4 max-w-3xl">{board.description}</p>
          
          {/* Owner & Collaborators */}
          <div className="flex items-center gap-6">
            <Link href={`/profile/${board.owner.username}`} className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <Image
                src={board.owner.avatar}
                alt={board.owner.name}
                width={32}
                height={32}
                className="rounded-full"
              />
              <div>
                <p className="text-sm font-medium text-zinc-100">{board.owner.name}</p>
                <p className="text-xs text-zinc-400">Owner</p>
              </div>
            </Link>
            
            {board.collaborators.length > 0 && (
              <>
                <div className="w-px h-8 bg-zinc-700" />
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-2">
                    {board.collaborators.map((collab, index) => (
                      <Image
                        key={index}
                        src={collab.avatar}
                        alt={collab.name}
                        width={32}
                        height={32}
                        className="rounded-full border-2 border-zinc-950"
                      />
                    ))}
                  </div>
                  <p className="text-sm text-zinc-400">
                    +{board.collaborators.length} collaborators
                  </p>
                </div>
              </>
            )}
            
            <div className="ml-auto flex items-center gap-1 text-sm text-zinc-400">
              {board.isPrivate ? (
                <>
                  <Lock className="w-4 h-4" />
                  <span>Private</span>
                </>
              ) : (
                <>
                  <Globe className="w-4 h-4" />
                  <span>Public</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Assets Grid */}
        <MasonryGrid
          assets={boardAssets}
          loading={false}
          hasMore={false}
          onDownload={() => {}}
          minimal={true}
        />
      </div>
    </div>
  );
}
