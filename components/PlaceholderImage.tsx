'use client';

import { useState } from 'react';
import Image from 'next/image';

interface PlaceholderImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  fallbackText?: string;
  priority?: boolean;
}

export default function PlaceholderImage({
  src,
  alt,
  width = 400,
  height = 300,
  className = '',
  fallbackText,
  priority = false
}: PlaceholderImageProps) {
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  // Generate a placeholder SVG data URL
  const placeholderSvg = `data:image/svg+xml,%3Csvg width='${width}' height='${height}' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='100%25' height='100%25' fill='%2318181b'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='system-ui' font-size='14' fill='%2371717a'%3E${fallbackText || alt || 'Image'}%3C/text%3E%3C/svg%3E`;

  // Handle various image source patterns
  const getImageSrc = () => {
    if (error) return placeholderSvg;
    
    // Handle /api/placeholder URLs
    if (src.startsWith('/api/placeholder/')) {
      const dimensions = src.replace('/api/placeholder/', '').split('/');
      const w = dimensions[0] || width;
      const h = dimensions[1] || height;
      return `https://via.placeholder.com/${w}x${h}/18181b/71717a?text=${encodeURIComponent(fallbackText || alt || 'ViralPik')}`;
    }
    
    // Handle Cloudflare R2 URLs that might be broken
    if (src.includes('r2.cloudflarestorage.com') && error) {
      return placeholderSvg;
    }
    
    return src;
  };

  if (src.startsWith('/api/placeholder/')) {
    // For placeholder URLs, use a div with background
    const dimensions = src.replace('/api/placeholder/', '').split('/');
    const w = parseInt(dimensions[0] || String(width));
    const h = parseInt(dimensions[1] || String(height));
    
    return (
      <div 
        className={`bg-zinc-900 flex items-center justify-center ${className}`}
        style={{ width: w, height: h }}
      >
        <span className="text-zinc-600 text-sm">
          {fallbackText || alt || 'Image'}
        </span>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`} style={{ width, height }}>
      {loading && (
        <div className="absolute inset-0 bg-zinc-900 animate-pulse flex items-center justify-center">
          <span className="text-zinc-600 text-sm">Loading...</span>
        </div>
      )}
      <Image
        src={getImageSrc()}
        alt={alt}
        width={width}
        height={height}
        className={className}
        onError={() => {
          setError(true);
          setLoading(false);
        }}
        onLoad={() => setLoading(false)}
        priority={priority}
        unoptimized={error || src.startsWith('/api/placeholder/')}
      />
    </div>
  );
}
