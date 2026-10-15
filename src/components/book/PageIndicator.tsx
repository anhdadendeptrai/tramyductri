'use client';

import React from 'react';
import { Heart } from 'lucide-react';
import { MemoryPage } from '@/lib/types';

interface PageIndicatorProps {
  currentPage: number;
  pages: MemoryPage[];
  onSelectPage: (page: number) => void;
}

export const PageIndicator: React.FC<PageIndicatorProps> = ({
  currentPage,
  pages,
  onSelectPage,
}) => {
  // Build labels: COVER + each page's date (first 5 chars) + ♥
  const labels = [
    'COVER',
    ...pages.map((p) => p.date.slice(0, 5)),
    '♥',
  ];

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 flex items-center gap-1 sm:gap-2 px-3 py-1.5 bg-[#FFFDF7]/90 backdrop-blur-md border border-[#E8DFD8] rounded-full shadow-xs select-none max-w-[95vw] overflow-x-auto no-scrollbar">
      {labels.map((label, idx) => {
        const isActive = currentPage === idx;
        const isHeart = label === '♥';

        return (
          <button
            key={idx}
            onClick={() => onSelectPage(idx)}
            className={`px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-sans tracking-wider transition-all cursor-pointer whitespace-nowrap ${
              isActive
                ? 'bg-[#2B2825] text-[#FAF8F5] font-medium shadow-2xs'
                : 'text-[#6E5A4E]/70 hover:text-[#2B2825] hover:bg-[#F5EFEB]'
            }`}
          >
            {isHeart ? (
              <Heart className={`w-3 h-3 inline ${isActive ? 'fill-[#EAD5D1] text-[#EAD5D1]' : 'text-[#6E5A4E]'}`} />
            ) : (
              label
            )}
          </button>
        );
      })}
    </div>
  );
};
