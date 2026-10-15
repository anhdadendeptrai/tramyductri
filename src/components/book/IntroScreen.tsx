'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Heart, BookOpen } from 'lucide-react';
import { BookData } from '@/lib/types';

interface IntroScreenProps {
  bookData: BookData;
  onOpen: () => void;
}

export const IntroScreen: React.FC<IntroScreenProps> = ({ bookData, onOpen }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#FAF8F5] paper-texture p-6 select-none"
    >
      {/* Decorative Outer Border */}
      <div className="absolute inset-4 sm:inset-8 border border-[#E8DFD8]/80 pointer-events-none rounded-sm" />
      <div className="absolute inset-6 sm:inset-10 border border-dashed border-[#E8DFD8]/50 pointer-events-none rounded-sm" />

      {/* Main Content Box */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.8 }}
        className="max-w-md w-full text-center space-y-6 sm:space-y-8 z-10 px-4"
      >
        {/* Heart Icon Header */}
        <div className="flex justify-center">
          <div className="w-12 h-12 rounded-full bg-[#F5EFEB] flex items-center justify-center shadow-xs border border-[#E8DFD8]">
            <Heart className="w-5 h-5 text-[#6E5A4E] fill-[#EAD5D1]" />
          </div>
        </div>

        {/* Title & Branding */}
        <div className="space-y-3">
          <h1 className="font-serif text-3xl sm:text-4xl tracking-[0.15em] font-medium text-[#2B2825] uppercase whitespace-nowrap">
            {bookData.cover.title || 'DUCTRI & TRAMY'}
          </h1>
          <div className="h-[1px] w-16 bg-[#6E5A4E]/30 mx-auto" />
          <p className="font-serif text-lg sm:text-xl tracking-widest text-[#6E5A4E] italic font-light">
            {bookData.cover.subtitle || 'OUR LITTLE BOOK'}
          </p>
          <p className="font-handwriting text-xl sm:text-2xl text-[#6E5A4E]/80">
            for you
          </p>
        </div>

        {/* Action Button: OPEN THE BOOK */}
        <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
          <button
            onClick={onOpen}
            className="group relative inline-flex items-center gap-3 px-8 py-3.5 bg-[#2B2825] text-[#FAF8F5] rounded-full font-serif text-sm tracking-[0.25em] uppercase hover:bg-[#6E5A4E] transition-all duration-300 shadow-md hover:shadow-lg cursor-pointer"
          >
            <BookOpen className="w-4 h-4 text-[#EAD5D1] transition-transform duration-300 group-hover:rotate-12" />
            <span>OPEN THE BOOK</span>
          </button>
        </motion.div>

        {/* Subtitle Message */}
        <p className="font-sans text-xs tracking-wider text-[#6E5A4E]/60 uppercase pt-2">
          &ldquo;a little memory, made for you&rdquo;
        </p>
      </motion.div>
    </motion.div>
  );
};
