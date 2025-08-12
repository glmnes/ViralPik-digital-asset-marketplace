'use client';

import React, { useState } from 'react';
import { Download, Eye, TrendingUp, Flame } from 'lucide-react';
import Image from 'next/image';
import { Asset } from '@/types';
import { platformConfig } from '@/lib/mockData';

interface AssetCardProps {
  asset: Asset;
  onDownload?: (assetId: string) => void;
}

export default function AssetCard({ asset, onDownload }: AssetCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleDownload = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Increment download count
    if (onDownload) {
      onDownload(asset.id);
    }
    
    // Trigger download
    const link = document.createElement('a');
    link.href = asset.file_url;
    link.download = `${asset.title}.${asset.format.toLowerCase()}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const formatDownloadCount = (count: number): string => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    }
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };

  return (
    <div 
      className="group relative overflow-hidden rounded-lg bg-zinc-900 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/10 cursor-pointer border border-zinc-800 hover:border-zinc-700"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container */}
      <div className={`relative w-full ${
        asset.platform === 'youtube' && asset.asset_type === 'thumbnails' ? 'aspect-video' :
        asset.platform === 'youtube' && asset.asset_type === 'banners' ? 'aspect-video' :
        'aspect-video' // Default to 16:9 for FX assets
      }`}>
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
        
        {/* Platform & Format Badges */}
        <div className="absolute top-2 left-2 right-2 flex justify-between items-start">
          <div className="flex items-center gap-2">
            <div className="px-2 py-1 bg-zinc-900 rounded text-white text-sm border border-zinc-700">
              {(() => {
                const Icon = platformConfig[asset.platform]?.icon;
                return Icon ? <Icon className="w-4 h-4" /> : null;
              })()}
            </div>
            {asset.is_trending && (
              <div className="px-2 py-1 bg-orange-500 rounded text-white text-xs font-bold flex items-center gap-1">
                <Flame className="w-3 h-3" />
                <span>#{asset.trending_rank} on {platformConfig[asset.platform]?.name}</span>
              </div>
            )}
          </div>
          <div className="px-2 py-1 bg-zinc-900 rounded text-white text-xs font-medium border border-zinc-700">
            {asset.format}
          </div>
        </div>
        
      </div>
      
      {/* Card Footer */}
      <div className="p-3 bg-zinc-900">
        <h3 className="font-medium text-zinc-100 truncate text-sm mb-1">
          {asset.title}
        </h3>
        <div className="flex items-center justify-between text-xs text-zinc-400">
          <span className="text-blue-400 font-medium">
            {asset.asset_type.replace('-', ' ')}
          </span>
        </div>
      </div>
    </div>
  );
}
