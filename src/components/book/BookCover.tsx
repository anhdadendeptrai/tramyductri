'use client';

import React from 'react';
import { CoverContent } from '@/lib/types';
import { COVER_PRESETS } from '@/lib/book-data';
import { PolaroidFrame } from '@/components/ui/PolaroidFrame';
import { Shuffle } from 'lucide-react';

interface BookCoverProps {
  cover: CoverContent;
  onRandomize?: () => void;
}

export const BookCover: React.FC<BookCoverProps> = ({ cover, onRandomize }) => {
  const images = cover.images || [];

  // Get current layout preset
  const presetIndex = cover.presetIndex % COVER_PRESETS.length;
  const currentPreset = COVER_PRESETS[presetIndex] || COVER_PRESETS[0];

  return (
    <div className="relative w-full h-full min-h-[600px] bg-[#FFFDF7] p-6 sm:p-10 flex flex-col justify-between overflow-hidden select-none border border-[#E8DFD8]">
      {/* Decorative Book Spine Edge Effect */}
      <div className="absolute top-0 bottom-0 left-0 w-4 bg-gradient-to-r from-[#2B2825]/10 via-[#2B2825]/5 to-transparent pointer-events-none z-30" />
      <div className="absolute top-0 bottom-0 left-0 w-[1px] bg-[#E8DFD8] z-30" />

      {/* Top Header Branding */}
      <div className="text-center space-y-1 z-20 pt-2">
        <h1 className="font-serif text-3xl sm:text-4xl tracking-[0.25em] font-medium text-[#2B2825] uppercase">
          {cover.title || 'DUCTRI & TRAMY'}
        </h1>
        <div className="h-[1px] w-12 bg-[#6E5A4E]/30 mx-auto my-1.5" />
        <h2 className="font-serif text-xs sm:text-sm tracking-[0.3em] text-[#6E5A4E] uppercase font-light">
          {cover.subtitle || 'OUR LITTLE BOOK'}
        </h2>
      </div>

      {/* Middle Photo Collage Section (5 Photos Layout) */}
      <div className="relative flex-1 w-full my-4 min-h-[380px] max-w-xl mx-auto">
        {currentPreset.positions.map((pos, idx) => {
          const imgSrc = images[idx] || '';
          if (!imgSrc) return null;

          const tapePosition =
            idx === 0 ? 'top-left' : idx === 1 ? 'top-right' : idx === 2 ? 'top-center' : idx === 3 ? 'bottom-right' : 'none';

          return (
            <div
              key={idx}
              className="absolute transition-all duration-500 ease-out"
              style={{
                top: pos.top,
                left: pos.left,
                right: pos.right,
                bottom: pos.bottom,
                width: pos.width || '40%',
                zIndex: pos.zIndex,
              }}
            >
              <PolaroidFrame
                src={imgSrc}
                alt={`Cover photo ${idx + 1}`}
                rotate={pos.rotate}
                tapePosition={tapePosition}
                aspectRatio="aspect-[4/5]"
                className="w-full"
              />
            </div>
          );
        })}
      </div>

      {/* Bottom Subtitle & Year */}
      <div className="text-center space-y-1 z-20 pb-2">
        <p className="font-serif text-sm sm:text-base italic text-[#6E5A4E] font-light tracking-wide">
          &ldquo;{cover.tagline || 'seven days, countless memories'}&rdquo;
        </p>
        <p className="font-sans text-[11px] tracking-[0.2em] text-[#6E5A4E]/60 uppercase">
          {cover.year || '2026'}
        </p>
      </div>

      {/* Optional Randomize Button */}
      {onRandomize && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRandomize();
          }}
          className="absolute bottom-4 right-4 z-40 flex items-center gap-1.5 px-3 py-1.5 bg-[#FAF8F5]/90 hover:bg-[#F5EFEB] border border-[#E8DFD8] rounded-full text-xs font-sans text-[#6E5A4E] shadow-xs backdrop-blur-xs transition-colors cursor-pointer"
          title="Randomize cover photo layout"
        >
          <Shuffle className="w-3.5 h-3.5" />
          <span>RANDOMIZE</span>
        </button>
      )}
    </div>
  );
};
