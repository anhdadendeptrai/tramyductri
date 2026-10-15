'use client';

import React from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';

interface PageFlipEffectProps {
  currentPage: number;
  direction: number; // 1 for next, -1 for prev
  children: React.ReactNode;
}

export const PageFlipEffect: React.FC<PageFlipEffectProps> = ({
  currentPage,
  direction,
  children,
}) => {
  // Page turn variants with 3D paper flip perspective
  const variants: Variants = {
    enter: (dir: number) => ({
      rotateY: dir > 0 ? 60 : -60,
      opacity: 0,
      scale: 0.98,
    }),
    center: {
      rotateY: 0,
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: [0.25, 1, 0.5, 1],
      },
    },
    exit: (dir: number) => ({
      rotateY: dir > 0 ? -60 : 60,
      opacity: 0,
      scale: 0.98,
      transition: {
        duration: 0.6,
        ease: [0.25, 1, 0.5, 1],
      },
    }),
  };

  return (
    <div className="relative w-full h-full perspective-2000 preserve-3d">
      <AnimatePresence custom={direction} mode="wait">
        <motion.div
          key={currentPage}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          className="w-full h-full origin-left preserve-3d rounded-sm shadow-xl overflow-hidden"
        >
          {/* Subtle Paper Spine Crease Gradient Overlay */}
          <div className="absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-black/15 via-black/5 to-transparent z-40 pointer-events-none" />
          
          {children}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
