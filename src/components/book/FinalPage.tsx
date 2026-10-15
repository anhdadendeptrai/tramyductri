'use client';

import React from 'react';
import { FinalPageContent } from '@/lib/types';
import { PolaroidFrame } from '@/components/ui/PolaroidFrame';
import { LetterPaper } from '@/components/ui/LetterPaper';
import { BookX, Heart } from 'lucide-react';

interface FinalPageProps {
  finalPageContent: FinalPageContent;
  onCloseBook: () => void;
}

export const FinalPage: React.FC<FinalPageProps> = ({ finalPageContent, onCloseBook }) => {
  const { subtitle, images = [], letter, signature, closingQuote } = finalPageContent;

  return (
    <div className="relative w-full h-full min-h-[600px] bg-[#FFFDF7] p-6 sm:p-10 flex flex-col justify-between overflow-y-auto no-scrollbar select-none border border-[#E8DFD8]">
      {/* Spine crease shadow */}
      <div className="absolute top-0 bottom-0 left-0 w-3 bg-gradient-to-r from-[#2B2825]/8 to-transparent pointer-events-none z-30" />

      {/* Header */}
      <div className="text-center space-y-1 z-20 pb-3 border-b border-[#E8DFD8]">
        <h2 className="font-serif text-2xl sm:text-3xl tracking-[0.2em] font-medium text-[#2B2825] uppercase">
          THE LAST PAGE
        </h2>
        <p className="font-serif text-xs sm:text-sm italic text-[#6E5A4E] font-light">
          &ldquo;{subtitle || 'but not the end'}&rdquo;
        </p>
      </div>

      {/* Scrapbook Memories Photo Grid */}
      {images.length > 0 && (
        <div className="my-4 grid grid-cols-2 sm:grid-cols-3 gap-3 max-w-lg mx-auto w-full z-20">
          {images.slice(0, 6).map((img, idx) => {
            const rotations = [-4, 3, -2, 5, -3, 2];
            const tapePositions: ('top-left' | 'top-right' | 'top-center' | 'bottom-right' | 'none')[] = [
              'top-left',
              'top-right',
              'top-center',
              'bottom-right',
              'top-left',
              'top-right',
            ];
            return (
              <div key={idx} className="w-full">
                <PolaroidFrame
                  src={img}
                  alt={`Memory ${idx + 1}`}
                  rotate={rotations[idx % rotations.length]}
                  tapePosition={tapePositions[idx % tapePositions.length]}
                  aspectRatio="aspect-[4/3]"
                />
              </div>
            );
          })}
        </div>
      )}

      {/* Handwritten Love Letter Section */}
      <div className="my-4 w-full max-w-lg mx-auto z-20">
        <LetterPaper>
          <div className="space-y-4">
            <p className="font-semibold text-xl text-[#2B2825]">Dear you,</p>
            <p className="whitespace-pre-line text-lg text-[#2B2825] leading-relaxed">
              {letter}
            </p>
            <div className="pt-2 text-right">
              <span className="font-serif italic font-medium text-lg text-[#6E5A4E]">
                {signature || '— Đức Trí'}
              </span>
            </div>
          </div>
        </LetterPaper>
      </div>

      {/* Footer Section & Close The Book */}
      <div className="text-center space-y-4 z-20 pt-3 border-t border-[#E8DFD8]">
        <p className="font-serif text-xs sm:text-sm italic text-[#6E5A4E]/80 tracking-widest">
          &ldquo;{closingQuote || 'some stories are worth keeping.'}&rdquo;
        </p>

        <div>
          <button
            onClick={onCloseBook}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#2B2825] hover:bg-[#6E5A4E] text-[#FAF8F5] rounded-full font-serif text-xs tracking-[0.2em] uppercase transition-all shadow-sm hover:shadow-md cursor-pointer"
          >
            <BookX className="w-3.5 h-3.5 text-[#EAD5D1]" />
            <span>CLOSE THE BOOK</span>
          </button>
        </div>
      </div>
    </div>
  );
};
