import React from 'react';

interface LetterPaperProps {
  children: React.ReactNode;
  className?: string;
}

export const LetterPaper: React.FC<LetterPaperProps> = ({ children, className = '' }) => {
  return (
    <div
      className={`relative bg-[#FFFDF7] p-6 sm:p-8 rounded-sm shadow-[0_8px_24px_rgba(43,40,37,0.08)] border border-[#E8DFD8] ${className}`}
      style={{
        backgroundImage: `linear-gradient(transparent, transparent 31px, #E8DFD8 31px, #E8DFD8 32px)`,
        backgroundSize: '100% 32px',
        lineHeight: '32px',
      }}
    >
      {/* Left Red Margin Line */}
      <div className="absolute top-0 bottom-0 left-8 sm:left-10 w-[1px] bg-[#EAD5D1] opacity-70" />

      {/* Content */}
      <div className="relative pl-6 sm:pl-8 font-handwriting text-[#2B2825] text-lg sm:text-xl leading-[32px]">
        {children}
      </div>
    </div>
  );
};
