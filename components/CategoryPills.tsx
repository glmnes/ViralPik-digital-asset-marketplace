'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useRef, useState, useEffect } from 'react';

interface CategoryPillsProps {
  topics: string[];
  selectedTopic: string;
  onSelectTopic: (topic: string) => void;
}

export default function CategoryPills({ topics, selectedTopic, onSelectTopic }: CategoryPillsProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setShowLeftArrow(scrollLeft > 0);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    checkScroll();
    const element = scrollRef.current;
    if (element) {
      element.addEventListener('scroll', checkScroll);
      return () => element.removeEventListener('scroll', checkScroll);
    }
  }, []);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 200;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="relative">
      {/* Left Arrow */}
      {showLeftArrow && (
        <button
          onClick={() => scroll('left')}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-zinc-800 rounded-full shadow-md flex items-center justify-center hover:shadow-lg transition-shadow">
          <ChevronLeft className="w-5 h-5 text-zinc-300" />
        </button>
      )}

      {/* Pills Container */}
      <div
        ref={scrollRef}
        className="flex gap-3 px-4 py-4 overflow-x-auto scrollbar-hide scroll-smooth"
      >
        {/* All Topics */}
        <button
          onClick={() => onSelectTopic('')}
          className={`
            px-4 py-2 rounded-full font-medium whitespace-nowrap transition-all
            ${!selectedTopic 
              ? 'bg-blue-500 text-white' 
              : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
            }
          `}
        >
          All
        </button>

        {/* Topic Pills */}
        {topics.map((topic) => (
          <button
            key={topic}
            onClick={() => onSelectTopic(topic === selectedTopic ? '' : topic)}
            className={`
              px-4 py-2 rounded-full font-medium whitespace-nowrap transition-all capitalize
              ${selectedTopic === topic 
                ? 'bg-blue-500 text-white' 
                : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
              }
            `}
          >
            {topic}
          </button>
        ))}
      </div>

      {/* Right Arrow */}
      {showRightArrow && (
        <button
          onClick={() => scroll('right')}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-zinc-800 rounded-full shadow-md flex items-center justify-center hover:shadow-lg transition-shadow">
          <ChevronRight className="w-5 h-5 text-zinc-300" />
        </button>
      )}
    </div>
  );
}
