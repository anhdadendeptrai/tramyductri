import React from 'react';
import Image from 'next/image';

interface PolaroidFrameProps {
  src: string;
  alt?: string;
  rotate?: number;
  tapePosition?: 'top-left' | 'top-right' | 'top-center' | 'bottom-right' | 'none';
  caption?: string;
  className?: string;
  aspectRatio?: string;
}

export const PolaroidFrame: React.FC<PolaroidFrameProps> = ({
  src,
  alt = 'Kỷ niệm',
  rotate = 0,
  tapePosition = 'top-center',
  caption,
  className = '',
  aspectRatio = 'aspect-[4/5]',
}) => {
  return (
    <div
      className={`relative bg-[#FFFDF7] p-2.5 sm:p-3.5 shadow-[0_10px_25px_-5px_rgba(43,40,37,0.12),0_4px_10px_rgba(0,0,0,0.04)] border border-[#F5EFEB] rounded-sm transition-transform duration-300 ${className}`}
      style={{
        transform: `rotate(${rotate}deg)`,
      }}
    >
      {/* Washi Tape Accent */}
      {tapePosition !== 'none' && (
        <div
          className={`absolute z-20 h-5 sm:h-6 w-16 sm:w-20 bg-[#F5EFEB]/80 border-x border-dashed border-[#E8DFD8] backdrop-blur-[1px] shadow-xs ${
            tapePosition === 'top-left'
              ? '-top-3 left-4 -rotate-12'
              : tapePosition === 'top-right'
              ? '-top-3 right-4 rotate-12'
              : tapePosition === 'bottom-right'
              ? '-bottom-3 right-4 -rotate-6'
              : '-top-3 left-1/2 -translate-x-1/2 -rotate-2'
          }`}
        />
      )}

      {/* Image Container */}
      <div className={`relative w-full ${aspectRatio} overflow-hidden bg-[#F5EFEB] rounded-xs`}>
        {src ? (
          <img
            src={src}
            alt={alt}
            className="w-full h-full object-cover select-none pointer-events-none"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-[#6E5A4E]/40 font-sans text-xs">
            Chưa có ảnh
          </div>
        )}
      </div>

      {/* Polaroid Bottom Caption / Subtitle */}
      {caption && (
        <div className="mt-2 text-center">
          <p className="font-handwriting text-[#2B2825] text-sm sm:text-base tracking-wide leading-tight">
            {caption}
          </p>
        </div>
      )}
    </div>
  );
};
