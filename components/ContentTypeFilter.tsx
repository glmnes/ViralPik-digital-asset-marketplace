'use client';

import { X } from 'lucide-react';

interface ContentTypeFilterProps {
  selectedTypes: string[];
  onToggleType: (type: string) => void;
  onClearAll: () => void;
}

const contentTypes = [
  { id: 'thumbnail', label: 'Thumbnails', description: 'YouTube, video thumbnails' },
  { id: 'post', label: 'Posts', description: 'Square format posts' },
  { id: 'story', label: 'Stories', description: 'Vertical stories' },
  { id: 'short', label: 'Shorts', description: 'Short-form videos' },
  { id: 'reel', label: 'Reels', description: 'Instagram reels' },
  { id: 'banner', label: 'Banners', description: 'Headers, covers' },
];

export default function ContentTypeFilter({ selectedTypes, onToggleType, onClearAll }: ContentTypeFilterProps) {
  const hasSelection = selectedTypes.length > 0;

  return (
    <div className="flex flex-wrap items-center gap-2">
      {/* Clear all button */}
      {hasSelection && (
        <button
          onClick={onClearAll}
          className="flex items-center gap-1 px-3 py-1.5 bg-zinc-800 text-zinc-300 text-sm rounded-full hover:bg-zinc-700 transition-colors"
          title="Clear all filters"
        >
          <X className="w-3 h-3" />
          Clear
        </button>
      )}

      {/* Filter chips */}
      {contentTypes.map((type) => {
        const isSelected = selectedTypes.includes(type.id);
        return (
          <button
            key={type.id}
            onClick={() => onToggleType(type.id)}
            className={`
              px-3 py-1.5 text-sm rounded-full transition-all
              ${isSelected 
                ? 'bg-white text-black border border-white' 
                : 'bg-zinc-900 text-zinc-400 border border-zinc-800 hover:border-zinc-600 hover:text-white'
              }
            `}
            title={type.description}
          >
            {type.label}
            {isSelected && (
              <span className="ml-1.5 inline-flex items-center">
                <X className="w-3 h-3" />
              </span>
            )}
          </button>
        );
      })}

      {/* Show selected count */}
      {hasSelection && (
        <span className="text-xs text-zinc-500 ml-2">
          {selectedTypes.length} selected
        </span>
      )}
    </div>
  );
}
