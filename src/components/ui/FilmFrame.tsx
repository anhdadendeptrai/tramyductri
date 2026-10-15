import React from 'react';

interface FilmFrameProps {
  src: string;
  alt?: string;
  date?: string;
  rotate?: number;
  className?: string;
}

export const FilmFrame: React.FC<FilmFrameProps> = ({
  src,
  alt = 'Film moment',
  date,
  rotate = 0,
  className = '',
}) => {
  return (
    <div
      className={`relative bg-[#1E1C1A] p-3 pt-4 pb-5 rounded-xs shadow-[0_12px_28px_rgba(0,0,0,0.25)] border border-[#2B2825] ${className}`}
      style={{
        transform: `rotate(${rotate}deg)`,
      }}
    >
      {/* Top Film Sprocket Holes */}
      <div className="flex justify-between items-center mb-2 px-1">
        {Array.from({ length: 7 }).map((_, i) => (
          <div key={i} className="w-2.5 h-2 bg-[#FAF8F5]/20 rounded-xs" />
        ))}
      </div>

      {/* Image Area */}
      <div className="relative w-full aspect-[4/3] bg-[#2B2825] overflow-hidden rounded-xs">
        {src ? (
          <img
            src={src}
            alt={alt}
            className="w-full h-full object-cover grayscale-[15%] contrast-[105%] sepia-[10%]"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-white/40 text-xs">
            Film Frame
          </div>
        )}

        {/* Vintage Date Stamp Overlay */}
        {date && (
          <div className="absolute bottom-2 right-2 font-mono text-[10px] text-[#FF9E3B] tracking-widest bg-black/40 px-1.5 py-0.5 rounded-xs">
            {date}
          </div>
        )}
      </div>

      {/* Bottom Film Sprocket Holes */}
      <div className="flex justify-between items-center mt-2 px-1">
        {Array.from({ length: 7 }).map((_, i) => (
          <div key={i} className="w-2.5 h-2 bg-[#FAF8F5]/20 rounded-xs" />
        ))}
      </div>
    </div>
  );
};
