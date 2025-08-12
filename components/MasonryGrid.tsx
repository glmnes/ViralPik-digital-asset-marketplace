'use client';

import React, { useEffect, useMemo } from 'react';
import Masonry from 'react-masonry-css';
import { useInView } from 'react-intersection-observer';
import AssetCard from './AssetCard';
import PinterestCard from './PinterestCard';
import TagCard from './TagCard';
import { Box, Flex, Text, Spinner } from '@/components/ui';
import { SupabaseAsset } from '@/types';

interface MasonryGridProps {
  assets: SupabaseAsset[];
  loading?: boolean;
  hasMore?: boolean;
  onLoadMore?: () => void;
  onDownload?: (assetId: string) => void;
  minimal?: boolean;
}


export default function MasonryGrid({ 
  assets, 
  loading = false, 
  hasMore = false, 
  onLoadMore,
  onDownload,
  minimal = false
}: MasonryGridProps) {
  const breakpointColumns = minimal ? {
    default: 6,
    1920: 6,
    1536: 5,
    1280: 4,
    1024: 3,
    768: 2,
    640: 2,
  } : {
    default: 4,
    1920: 4,
    1536: 4,
    1280: 3,
    1024: 3,
    768: 2,
    640: 1,
  };
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: false,
  });

  // Popular tags to display randomly
  const popularTags = [
    'Neon', 'Aesthetic', '3D Effect', 'Minimalist', 'Gradient', 
    'Dark Mode', 'Y2K', 'Motion', 'Retro', 'Glitch', 'Vintage',
    'Modern', 'Abstract', 'Typography', 'Geometric', 'Pastel',
    'Cyberpunk', 'Grunge', 'Flat Design', 'Material Design'
  ];

  // Create items array with assets and scattered tag cards
  const itemsWithTags = useMemo(() => {
    if (assets.length === 0) return [];
    
    const items: any[] = [];
    const tagPositions = [7, 15, 23, 35, 47]; // Specific positions for tag cards
    let tagIndex = 0;
    
    assets.forEach((asset, index) => {
      // Check if we should insert a tag card at this position
      if (tagPositions.includes(index) && tagIndex < popularTags.length) {
        const randomTag = popularTags[tagIndex % popularTags.length];
        items.push({ 
          type: 'tag', 
          data: { 
            tag: randomTag,
            count: Math.floor(Math.random() * 800) + 200 // Random count for demo
          } 
        });
        tagIndex++;
      }
      
      // Always add the asset
      items.push({ type: 'asset', data: asset });
    });
    
    return items;
  }, [assets]);

  useEffect(() => {
    if (inView && hasMore && !loading && onLoadMore) {
      onLoadMore();
    }
  }, [inView, hasMore, loading, onLoadMore]);

  return (
    <Box width="100%">
      <Masonry
        breakpointCols={breakpointColumns}
        className="masonry-grid"
        columnClassName="masonry-grid-column"
      >
        {itemsWithTags.map((item, index) => {
          if (item.type === 'tag') {
            return (
              <TagCard
                key={`tag-${item.data.tag}-${index}`}
                tag={item.data.tag}
                count={item.data.count}
              />
            );
          }
          
          const asset = item.data;
          return minimal ? (
            <PinterestCard 
              key={asset.id} 
              asset={asset} 
              onDownload={onDownload}
              hideOverlays={true}
            />
          ) : (
            <AssetCard 
              key={asset.id} 
              asset={asset} 
              onDownload={onDownload}
            />
          );
        })}
      </Masonry>
      
      {/* Loading indicator */}
      {loading && (
        <Box paddingY={8}>
          <Flex justifyContent="center">
            <Spinner />
          </Flex>
        </Box>
      )}
      
      {/* Infinite scroll trigger */}
      {hasMore && !loading && (
        <Box ref={ref} height={80} />
      )}
      
      {/* End of content */}
      {!hasMore && assets.length > 0 && (
        <Box paddingY={12}>
          <Flex direction="column" alignItems="center">
            <Text color="subtle" size="200" weight="bold">
              End of content
            </Text>
            <Box marginTop={2}>
              <Text color="subtle" size="100">
                Check back later for more
              </Text>
            </Box>
          </Flex>
        </Box>
      )}
      
      {/* Empty state */}
      {!loading && assets.length === 0 && (
        <Box paddingY={12}>
          <Flex direction="column" alignItems="center">
            <Text size="400" weight="bold" color="light">
              No assets found
            </Text>
            <Text size="300" color="subtle">
              Try adjusting your filters or search terms
            </Text>
          </Flex>
        </Box>
      )}
    </Box>
  );
}
