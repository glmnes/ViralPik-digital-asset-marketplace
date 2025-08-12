'use client';

import { useState, useEffect, useRef } from 'react';
import { X, Search, Check } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';

interface Tag {
  id: string;
  name: string;
  slug: string;
  category: string;
}

interface TagSelectorProps {
  selectedTags: string[];
  onTagsChange: (tags: string[]) => void;
  minTags?: number;
  maxTags?: number;
}

export default function TagSelector({ 
  selectedTags, 
  onTagsChange, 
  minTags = 5, 
  maxTags = 10 
}: TagSelectorProps) {
  const [availableTags, setAvailableTags] = useState<Tag[]>([]);
  const [filteredTags, setFilteredTags] = useState<Tag[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Load tags from database
  useEffect(() => {
    loadTags();
  }, []);

  // Filter tags based on search
  useEffect(() => {
    if (searchQuery) {
      const filtered = availableTags.filter(tag => 
        tag.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tag.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredTags(filtered);
    } else {
      setFilteredTags(availableTags);
    }
  }, [searchQuery, availableTags]);

  // Handle click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setSearchQuery('');
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const loadTags = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('tags')
        .select('*')
        .eq('is_active', true)
        .order('category', { ascending: true })
        .order('name', { ascending: true });

      if (!error && data) {
        setAvailableTags(data);
        setFilteredTags(data);
      }
    } catch (error) {
      console.error('Error loading tags:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTag = (tag: Tag) => {
    if (selectedTags.length >= maxTags) {
      return;
    }
    
    if (!selectedTags.includes(tag.name)) {
      onTagsChange([...selectedTags, tag.name]);
      setSearchQuery('');
    }
  };

  const handleRemoveTag = (tagName: string) => {
    onTagsChange(selectedTags.filter(t => t !== tagName));
  };

  // Group tags by category
  const groupedTags = filteredTags.reduce((acc, tag) => {
    if (!acc[tag.category]) {
      acc[tag.category] = [];
    }
    acc[tag.category].push(tag);
    return acc;
  }, {} as Record<string, Tag[]>);

  const categoryLabels: Record<string, string> = {
    platform: 'Platforms',
    content_type: 'Content Types',
    style: 'Styles',
    industry: 'Industries',
    mood: 'Moods'
  };

  return (
    <div className="space-y-3">
      {/* Selected Tags */}
      <div className="flex flex-wrap gap-2">
        {selectedTags.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center gap-1 px-3 py-1 bg-blue-500/10 text-blue-400 rounded-full text-sm border border-blue-500/20"
          >
            {tag}
            <button
              onClick={() => handleRemoveTag(tag)}
              className="ml-1 hover:text-blue-300"
            >
              <X className="w-3 h-3" />
            </button>
          </span>
        ))}
      </div>

      {/* Tag Input */}
      <div className="relative" ref={dropdownRef}>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={`Start typing to add tags... (${selectedTags.length}/${maxTags} selected, min ${minTags})`}
            className="w-full pl-10 pr-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={selectedTags.length >= maxTags}
          />
        </div>

        {/* Dropdown - Only show when typing */}
        {searchQuery && !loading && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-zinc-900 border border-zinc-800 rounded-lg shadow-xl max-h-96 overflow-y-auto z-50">
            {Object.keys(groupedTags).length > 0 ? (
              <>
                {/* Show popular tags that match search at the top */}
                {filteredTags.filter(tag => 
                  availableTags.slice(0, 8).some(popular => popular.id === tag.id)
                ).length > 0 && (
                  <div className="px-3 py-2 border-b border-zinc-800">
                    <p className="text-xs font-semibold text-blue-400 mb-2">Popular Tags</p>
                    <div className="flex flex-wrap gap-2">
                      {filteredTags
                        .filter(tag => availableTags.slice(0, 8).some(popular => popular.id === tag.id))
                        .slice(0, 5)
                        .map((tag) => {
                          const isSelected = selectedTags.includes(tag.name);
                          return (
                            <button
                              key={tag.id}
                              onClick={() => handleAddTag(tag)}
                              disabled={selectedTags.length >= maxTags && !isSelected}
                              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                                isSelected 
                                  ? 'bg-blue-500 text-white' 
                                  : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
                              }`}
                            >
                              {tag.name}
                              {isSelected && <Check className="inline-block w-3 h-3 ml-1" />}
                            </button>
                          );
                        })}
                    </div>
                  </div>
                )}
                
                {/* Show all matching tags grouped by category */}
                {Object.entries(groupedTags).map(([category, tags]) => (
                  <div key={category}>
                    <div className="px-3 py-2 text-xs font-semibold text-zinc-500 bg-zinc-950 sticky top-0">
                      {categoryLabels[category] || category}
                    </div>
                    {tags.map((tag) => {
                      const isSelected = selectedTags.includes(tag.name);
                      const isDisabled = selectedTags.length >= maxTags && !isSelected;
                      
                      return (
                        <button
                          key={tag.id}
                          onClick={() => !isDisabled && handleAddTag(tag)}
                          disabled={isDisabled}
                          className={`w-full px-3 py-2 text-left hover:bg-zinc-800 transition-colors flex items-center justify-between ${
                            isSelected ? 'bg-blue-500/10 text-blue-400' : 'text-zinc-100'
                          } ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                          <span className="text-sm">{tag.name}</span>
                          {isSelected && <Check className="w-4 h-4" />}
                        </button>
                      );
                    })}
                  </div>
                ))}
              </>
            ) : (
              <div className="px-3 py-8 text-center text-zinc-500">
                No tags found matching &quot;{searchQuery}&quot;
              </div>
            )}
          </div>
        )}
      </div>

      {/* Tag Requirements */}
      <div className="text-xs text-zinc-500">
        {selectedTags.length < minTags ? (
          <span className="text-yellow-400">
            Please select at least {minTags - selectedTags.length} more tag{minTags - selectedTags.length > 1 ? 's' : ''}
          </span>
        ) : selectedTags.length === maxTags ? (
          <span className="text-blue-400">
            Maximum tags selected
          </span>
        ) : (
          <span>
            You can add {maxTags - selectedTags.length} more tag{maxTags - selectedTags.length > 1 ? 's' : ''}
          </span>
        )}
      </div>

      {/* Popular Tags - Always visible when no tags selected */}
      {selectedTags.length === 0 && !searchQuery && (
        <div className="mt-4">
          <p className="text-xs text-zinc-500 mb-2">Popular tags to get started:</p>
          <div className="flex flex-wrap gap-2">
            {availableTags.slice(0, 10).map((tag) => (
              <button
                key={tag.id}
                onClick={() => handleAddTag(tag)}
                className="px-3 py-1 bg-zinc-800 text-zinc-300 rounded-full text-sm hover:bg-zinc-700 transition-colors"
              >
                {tag.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
