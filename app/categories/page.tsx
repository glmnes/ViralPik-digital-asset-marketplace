'use client';

import { useState } from 'react';
import Link from 'next/link';
import { mockCategories, mockAssets, generateMockAssets } from '@/lib/mockData';
import { Category } from '@/types';

export default function CategoriesPage() {
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);

  // Get asset count for each category
  const getCategoryCount = (categoryId: string) => {
    const allAssets = [...mockAssets, ...generateMockAssets(50)];
    return allAssets.filter(asset => asset.category_id === categoryId).length;
  };

  // Get top assets for preview
  const getTopAssets = (categoryId: string, limit: number = 4) => {
    const allAssets = [...mockAssets, ...generateMockAssets(50)];
    return allAssets
      .filter(asset => asset.category_id === categoryId)
      .sort((a, b) => b.download_count - a.download_count)
      .slice(0, limit);
  };

  const categoryCards = [
    {
      ...mockCategories[0], // Memes
      gradient: 'from-purple-500 to-pink-500',
      description: 'Viral meme templates that slap',
    },
    {
      ...mockCategories[1], // Stories
      gradient: 'from-blue-500 to-cyan-500',
      description: 'Instagram & TikTok story templates',
    },
    {
      ...mockCategories[2], // Reels
      gradient: 'from-orange-500 to-red-500',
      description: 'Trending reel effects & transitions',
    },
    {
      ...mockCategories[3], // Overlays
      gradient: 'from-green-500 to-emerald-500',
      description: 'Text overlays & graphic elements',
    },
    {
      ...mockCategories[4], // Thumbnails
      gradient: 'from-indigo-500 to-purple-500',
      description: 'YouTube thumbnail templates',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Browse by <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Category</span>
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Find exactly what you need. Each category is packed with viral-ready assets.
        </p>
      </div>

      {/* Category Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {categoryCards.map((category) => {
          const topAssets = getTopAssets(category.id);
          const assetCount = getCategoryCount(category.id);
          
          return (
            <Link
              key={category.id}
              href={`/categories/${category.slug}`}
              className="group relative overflow-hidden rounded-2xl bg-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
              onMouseEnter={() => setHoveredCategory(category.id)}
              onMouseLeave={() => setHoveredCategory(null)}
            >
              {/* Background Gradient */}
              <div className={`absolute inset-0 bg-gradient-to-br ${category.gradient} opacity-10 group-hover:opacity-20 transition-opacity`} />
              
              {/* Content */}
              <div className="relative p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <span className="text-4xl mb-2 block">{category.icon}</span>
                    <h3 className="text-xl font-bold text-gray-900">{category.name}</h3>
                    <p className="text-sm text-gray-600 mt-1">{category.description}</p>
                  </div>
                  <span className="text-sm font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded">
                    {assetCount} assets
                  </span>
                </div>
                
                {/* Preview Grid */}
                <div className="grid grid-cols-2 gap-2 mt-6">
                  {topAssets.map((asset, index) => (
                    <div
                      key={asset.id}
                      className="relative aspect-square rounded-lg overflow-hidden bg-gray-100"
                    >
                      <div 
                        className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300"
                        style={{
                          backgroundImage: `url(${asset.preview_url})`,
                          backgroundSize: 'cover',
                          backgroundPosition: 'center',
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  ))}
                </div>
                
                {/* Hover Effect */}
                <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${category.gradient} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300`} />
              </div>
            </Link>
          );
        })}
      </div>

      {/* Popular Tags Section */}
      <div className="border-t pt-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Popular Tags</h2>
        <div className="flex flex-wrap gap-3">
          {['viral', 'trending', 'aesthetic', 'y2k', 'minimal', 'bold', 'retro', 'modern', 'gradient', 'neon'].map((tag) => (
            <Link
              key={tag}
              href={`/search?tag=${tag}`}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-full text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
            >
              #{tag}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
