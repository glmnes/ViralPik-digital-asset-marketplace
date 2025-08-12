'use client';

import Link from 'next/link';
import { Hash } from 'lucide-react';

interface TagCardProps {
  tag: string;
  count?: number;
  gradient?: string;
}

export default function TagCard({ tag, count, gradient }: TagCardProps) {
  // Social media inspired vibrant gradients
  const defaultGradients = [
    'linear-gradient(135deg, #FF0069 0%, #FF5E00 100%)', // TikTok inspired
    'linear-gradient(135deg, #833AB4 0%, #FD1D1D 50%, #FCB045 100%)', // Instagram
    'linear-gradient(135deg, #1DA1F2 0%, #14BEF0 100%)', // Twitter/X
    'linear-gradient(135deg, #FF6900 0%, #FCB900 100%)', // Snapchat
    'linear-gradient(135deg, #25D366 0%, #128C7E 100%)', // WhatsApp
    'linear-gradient(135deg, #FF0000 0%, #FF4500 100%)', // YouTube
    'linear-gradient(135deg, #5865F2 0%, #7289DA 100%)', // Discord
    'linear-gradient(135deg, #0088CC 0%, #0DA6EA 100%)', // Telegram
    'linear-gradient(135deg, #FF4500 0%, #FF8717 100%)', // Reddit
    'linear-gradient(135deg, #E60023 0%, #FF2D55 100%)', // Pinterest
    'linear-gradient(135deg, #00F260 0%, #0575E6 100%)', // Vibrant Blue-Green
    'linear-gradient(135deg, #FC466B 0%, #3F5EFB 100%)', // Pink to Blue
    'linear-gradient(135deg, #FDBB2D 0%, #22C1C3 100%)', // Yellow to Cyan
    'linear-gradient(135deg, #F857A6 0%, #FF5858 100%)', // Hot Pink
    'linear-gradient(135deg, #00C9FF 0%, #92FE9D 100%)' // Cyan to Green
  ];

  const tagGradient = gradient || defaultGradients[Math.floor(Math.random() * defaultGradients.length)];

  return (
    <Link 
      href={`/explore/tag/${encodeURIComponent(tag)}`}
      className="group block w-full relative overflow-hidden rounded-lg transition-transform hover:scale-105"
      style={{ 
        background: tagGradient,
        aspectRatio: '1 / 1.2' // Fixed aspect ratio instead of min-height
      }}
    >
      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors" />
      
      <div className="relative h-full flex flex-col justify-center items-center p-6 text-center">
        <Hash className="w-8 h-8 text-white/80 mb-3" />
        <h3 className="text-xl font-bold text-white mb-2">
          {tag}
        </h3>
        {count && (
          <p className="text-sm text-white/80">
            {count.toLocaleString()} assets
          </p>
        )}
        <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
          <span className="text-xs text-white/80">Explore →</span>
        </div>
      </div>
    </Link>
  );
}
