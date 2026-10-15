'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, PanInfo } from 'framer-motion';
import { BookData } from '@/lib/types';
import { IntroScreen } from './IntroScreen';
import { BookCover } from './BookCover';
import { MemoryPageView } from './MemoryPageView';
import { FinalPage } from './FinalPage';
import { PageFlipEffect } from './PageFlipEffect';
import { MusicPlayer } from './MusicPlayer';
import { PageIndicator } from './PageIndicator';
import { PaperTexture } from '@/components/ui/PaperTexture';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface BookContainerProps {
  bookData: BookData;
  onUpdateBookData?: (updated: BookData) => void;
  isAdminPreview?: boolean;
}

export const BookContainer: React.FC<BookContainerProps> = ({
  bookData,
  onUpdateBookData,
  isAdminPreview = false,
}) => {
  const [isOpen, setIsOpen] = useState(isAdminPreview);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [direction, setDirection] = useState<number>(1);
  const [localData, setLocalData] = useState<BookData>(bookData);

  useEffect(() => {
    setLocalData(bookData);
  }, [bookData]);

  // Dynamic total: 1 cover + N memory pages + 1 final
  const totalPages = localData.pages.length + 2;

  const goToNextPage = useCallback(() => {
    if (currentPage < totalPages - 1) {
      setDirection(1);
      setCurrentPage((prev) => prev + 1);
    }
  }, [currentPage, totalPages]);

  const goToPrevPage = useCallback(() => {
    if (currentPage > 0) {
      setDirection(-1);
      setCurrentPage((prev) => prev - 1);
    }
  }, [currentPage]);

  const handleSelectPage = useCallback(
    (page: number) => {
      if (page >= 0 && page < totalPages && page !== currentPage) {
        setDirection(page > currentPage ? 1 : -1);
        setCurrentPage(page);
      }
    },
    [currentPage, totalPages]
  );

  // Keyboard controls
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') goToNextPage();
      else if (e.key === 'ArrowLeft') goToPrevPage();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, goToNextPage, goToPrevPage]);

  // Touch Swipe
  const handleDragEnd = (_: unknown, info: PanInfo) => {
    const swipeThreshold = 50;
    const swipeVelocity = 200;
    if (info.offset.x < -swipeThreshold || info.velocity.x < -swipeVelocity) {
      goToNextPage();
    } else if (info.offset.x > swipeThreshold || info.velocity.x > swipeVelocity) {
      goToPrevPage();
    }
  };

  // Randomize Cover Layout
  const handleRandomizeCover = () => {
    const currentPreset = localData.cover.presetIndex || 0;
    const nextPreset = (currentPreset + 1) % 6;
    const updated = {
      ...localData,
      cover: { ...localData.cover, presetIndex: nextPreset },
    };
    setLocalData(updated);
    if (onUpdateBookData) onUpdateBookData(updated);
  };

  // Close book
  const handleCloseBook = () => {
    setDirection(-1);
    setCurrentPage(0);
  };

  if (!isOpen) {
    return <IntroScreen bookData={localData} onOpen={() => setIsOpen(true)} />;
  }

  const finalPageIndex = localData.pages.length + 1;

  return (
    <div className="relative w-full h-screen bg-[#F5EFEB] paper-texture flex flex-col items-center justify-center p-3 sm:p-6 overflow-hidden select-none">
      <PaperTexture className="opacity-40" />
      <MusicPlayer audioUrl={localData.musicUrl} />

      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full max-w-4xl h-[88vh] max-h-[780px] bg-[#FFFDF7] rounded-md shadow-[0_20px_50px_rgba(43,40,37,0.18),0_4px_15px_rgba(0,0,0,0.06)] border border-[#E8DFD8] overflow-hidden"
      >
        {/* Left Edge */}
        {currentPage > 0 && (
          <button
            onClick={goToPrevPage}
            className="absolute left-0 top-0 bottom-0 w-12 sm:w-16 z-30 flex items-center justify-start pl-2 group cursor-pointer bg-gradient-to-r from-black/5 to-transparent hover:from-black/10 transition-colors"
            title="Trang trước (Arrow Left)"
          >
            <div className="w-8 h-8 rounded-full bg-[#FFFDF7]/90 border border-[#E8DFD8] flex items-center justify-center text-[#6E5A4E] shadow-2xs group-hover:scale-110 transition-transform">
              <ChevronLeft className="w-4 h-4" />
            </div>
          </button>
        )}

        {/* Right Edge */}
        {currentPage < totalPages - 1 && (
          <button
            onClick={goToNextPage}
            className="absolute right-0 top-0 bottom-0 w-12 sm:w-16 z-30 flex items-center justify-end pr-2 group cursor-pointer bg-gradient-to-l from-black/5 to-transparent hover:from-black/10 transition-colors"
            title="Trang tiếp (Arrow Right)"
          >
            <div className="w-8 h-8 rounded-full bg-[#FFFDF7]/90 border border-[#E8DFD8] flex items-center justify-center text-[#6E5A4E] shadow-2xs group-hover:scale-110 transition-transform">
              <ChevronRight className="w-4 h-4" />
            </div>
          </button>
        )}

        {/* Swipe & Flip */}
        <motion.div
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.2}
          onDragEnd={handleDragEnd}
          className="w-full h-full cursor-grab active:cursor-grabbing"
        >
          <PageFlipEffect currentPage={currentPage} direction={direction}>
            {currentPage === 0 && (
              <BookCover cover={localData.cover} onRandomize={handleRandomizeCover} />
            )}

            {currentPage >= 1 && currentPage <= localData.pages.length && (
              <MemoryPageView page={localData.pages[currentPage - 1]} />
            )}

            {currentPage === finalPageIndex && (
              <FinalPage
                finalPageContent={localData.finalPage}
                onCloseBook={handleCloseBook}
              />
            )}
          </PageFlipEffect>
        </motion.div>
      </motion.div>

      <PageIndicator
        currentPage={currentPage}
        pages={localData.pages}
        onSelectPage={handleSelectPage}
      />
    </div>
  );
};
