'use client';

import React from 'react';
import { MemoryPage } from '@/lib/types';
import { PolaroidFrame } from '@/components/ui/PolaroidFrame';
import { FilmFrame } from '@/components/ui/FilmFrame';
import { Heart } from 'lucide-react';

interface MemoryPageViewProps {
  page: MemoryPage;
}

export const MemoryPageView: React.FC<MemoryPageViewProps> = ({ page }) => {
  const { template, memoryTitle, subtitle, date, images = [], message, quote, handwrittenCaption, signature } = page;

  const mainImage = images[0] || '';
  const secondaryImage = images[1] || '';

  return (
    <div className="relative w-full h-full min-h-[600px] bg-[#FFFDF7] p-6 sm:p-10 flex flex-col justify-between overflow-hidden select-none border border-[#E8DFD8]">
      {/* Spine crease shadow */}
      <div className="absolute top-0 bottom-0 left-0 w-3 bg-gradient-to-r from-[#2B2825]/8 to-transparent pointer-events-none z-30" />

      {/* Header: Memory Title, Subtitle, Date */}
      <div className="space-y-1 text-center sm:text-left z-20 pb-2">
        <div className="flex items-center justify-between border-b border-[#E8DFD8] pb-2">
          <div>
            <h2 className="font-serif text-xl sm:text-2xl tracking-[0.1em] font-medium text-[#2B2825]">
              {memoryTitle}
            </h2>
            <p className="font-serif text-xs sm:text-sm italic text-[#6E5A4E] font-light">
              &ldquo;{subtitle}&rdquo;
            </p>
          </div>
          <span className="font-sans text-xs tracking-widest text-[#6E5A4E]/60 uppercase bg-[#F5EFEB] px-2.5 py-1 rounded-full border border-[#E8DFD8] whitespace-nowrap ml-2">
            {date}
          </span>
        </div>
      </div>

      {/* Dynamic Scrapbook Photo Layout based on Template */}
      <div className="flex-1 my-3 flex items-center justify-center relative w-full">

        {/* center-hero: Center Hero Photo */}
        {template === 'center-hero' && (
          <div className="w-full max-w-sm mx-auto">
            <PolaroidFrame
              src={mainImage}
              alt={memoryTitle}
              rotate={-1.5}
              tapePosition="top-center"
              aspectRatio="aspect-[4/3]"
            />
          </div>
        )}

        {/* left-image: Left Photo, Text Flow */}
        {template === 'left-image' && (
          <div className="w-full grid grid-cols-1 sm:grid-cols-12 gap-4 items-center max-w-lg mx-auto">
            <div className="sm:col-span-7">
              <PolaroidFrame
                src={mainImage}
                alt={memoryTitle}
                rotate={-3}
                tapePosition="top-left"
                aspectRatio="aspect-[1/1]"
              />
            </div>
            <div className="sm:col-span-5 text-center sm:text-left space-y-2">
              <span className="font-handwriting text-lg text-[#6E5A4E] block">
                Khoảnh khắc nhẹ nhàng...
              </span>
            </div>
          </div>
        )}

        {/* dual-photo: Dual Photos (1 Large + 1 Accent) */}
        {template === 'dual-photo' && (
          <div className="relative w-full max-w-md mx-auto h-[260px] sm:h-[300px]">
            <div className="absolute left-2 top-0 w-3/4 z-10">
              <PolaroidFrame
                src={mainImage}
                alt={memoryTitle}
                rotate={-4}
                tapePosition="top-left"
                aspectRatio="aspect-[4/3]"
              />
            </div>
            {secondaryImage && (
              <div className="absolute right-0 bottom-0 w-1/2 z-20">
                <PolaroidFrame
                  src={secondaryImage}
                  alt={`${memoryTitle} accent`}
                  rotate={5}
                  tapePosition="top-right"
                  caption={handwrittenCaption}
                  aspectRatio="aspect-[1/1]"
                />
              </div>
            )}
          </div>
        )}

        {/* film-frame: Vintage Film Frame */}
        {template === 'film-frame' && (
          <div className="w-full max-w-sm mx-auto">
            <FilmFrame
              src={mainImage}
              alt={memoryTitle}
              date={date}
              rotate={1.5}
            />
          </div>
        )}

        {/* polaroid: Large Polaroid with Tape */}
        {template === 'polaroid' && (
          <div className="w-full max-w-sm mx-auto">
            <PolaroidFrame
              src={mainImage}
              alt={memoryTitle}
              rotate={2}
              tapePosition="top-right"
              caption={handwrittenCaption || ''}
              aspectRatio="aspect-[4/3]"
            />
          </div>
        )}

        {/* collage: Dual Photos Collage */}
        {template === 'collage' && (
          <div className="relative w-full max-w-md mx-auto h-[260px] sm:h-[300px]">
            <div className="absolute left-0 top-2 w-3/5 z-10">
              <PolaroidFrame
                src={mainImage}
                alt={memoryTitle}
                rotate={-3}
                tapePosition="top-left"
                aspectRatio="aspect-[4/3]"
              />
            </div>
            {secondaryImage && (
              <div className="absolute right-2 bottom-0 w-3/5 z-20">
                <PolaroidFrame
                  src={secondaryImage}
                  alt={`${memoryTitle} accent`}
                  rotate={4}
                  tapePosition="bottom-right"
                  caption={handwrittenCaption || ''}
                  aspectRatio="aspect-[4/3]"
                />
              </div>
            )}
          </div>
        )}

        {/* grand-hero: Grand Hero Photo */}
        {template === 'grand-hero' && (
          <div className="w-full max-w-md mx-auto">
            <PolaroidFrame
              src={mainImage}
              alt={memoryTitle}
              rotate={-1}
              tapePosition="top-center"
              aspectRatio="aspect-[16/10]"
            />
          </div>
        )}
      </div>

      {/* Bottom Message & Signature Section */}
      <div className="space-y-3 z-20 pt-2 border-t border-[#E8DFD8]/60">
        {quote && (
          <p className="font-serif text-xs italic text-[#6E5A4E]/80 text-center tracking-wide">
            &ldquo;{quote}&rdquo;
          </p>
        )}

        <div className="bg-[#FAF8F5]/80 p-3.5 sm:p-4 rounded-xs border border-[#E8DFD8] shadow-2xs space-y-2">
          <span className="font-sans text-[10px] tracking-[0.2em] text-[#6E5A4E]/70 uppercase block font-semibold">
            MY MESSAGE
          </span>
          <p className="font-handwriting text-base sm:text-lg text-[#2B2825] leading-relaxed">
            {message}
          </p>
          <div className="flex justify-end items-center gap-1.5 text-right pt-1">
            <Heart className="w-3 h-3 text-[#EAD5D1] fill-[#EAD5D1]" />
            <span className="font-serif text-xs sm:text-sm text-[#6E5A4E] italic font-medium">
              {signature || '— Đức Trí'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
