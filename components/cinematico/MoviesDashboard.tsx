'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import TVStatic from './TVStatic';
import CreateMovieModal from './modals/CreateMovieModal';
import PreviousMoviesModal from './modals/PreviousMoviesModal';

export default function MoviesDashboard() {
  const [showPrompt, setShowPrompt] = useState(false);
  const [showPreviousMovies, setShowPreviousMovies] = useState(false);

  const buttonStyle = {
    boxShadow: `
      8px 8px 16px rgba(0, 0, 0, 0.4),
      -4px -4px 12px rgba(255, 255, 255, 0.05),
      inset -1px -1px 2px rgba(255, 255, 255, 0.05)
    `,
    transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
  };

  const activeButtonStyle = {
    boxShadow: `
      inset 4px 4px 8px rgba(0, 0, 0, 0.4),
      inset -2px -2px 6px rgba(255, 255, 255, 0.05)
    `,
  };

  return (
    <div className="relative w-full h-full">
      {/* Background TV Static with enhanced visibility */}
      <div className="absolute inset-0 opacity-95">
        <TVStatic />
      </div>

      {/* Buttons Container with adjusted backdrop blur */}
      <div className="relative z-10 w-full h-full flex flex-col items-center justify-center gap-8 bg-black/10">
        <motion.button
          onClick={() => setShowPrompt(true)}
          className="px-8 py-4 rounded-2xl font-medium text-lg backdrop-blur-md bg-[rgba(74,21,75,0.15)] text-gray-200 border border-white/5"
          style={buttonStyle}
          whileHover={{
            scale: 1.02,
            boxShadow: `
              12px 12px 24px rgba(0, 0, 0, 0.4),
              -6px -6px 16px rgba(255, 255, 255, 0.05),
              inset -1px -1px 2px rgba(255, 255, 255, 0.05)
            `,
          }}
          whileTap={{
            scale: 0.98,
            ...activeButtonStyle,
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.6,
            ease: [0.34, 1.56, 0.64, 1],
            delay: 0.1,
          }}
        >
          Create New Movie
        </motion.button>

        <motion.button
          onClick={() => setShowPreviousMovies(true)}
          className="px-8 py-4 rounded-2xl font-medium text-lg backdrop-blur-md bg-[rgba(74,21,75,0.1)] text-gray-200 transition-all duration-300 ease-out"
          style={buttonStyle}
          whileHover={{
            scale: 1.02,
            transition: { duration: 0.3, ease: [0.34, 1.56, 0.64, 1] },
          }}
          whileTap={{
            scale: 0.98,
            transition: { duration: 0.2, ease: [0.34, 1.56, 0.64, 1] },
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.6,
            ease: [0.34, 1.56, 0.64, 1],
            delay: 0.2,
          }}
        >
          Load Previous
        </motion.button>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {showPrompt && (
          <CreateMovieModal onClose={() => setShowPrompt(false)} />
        )}
        {showPreviousMovies && (
          <PreviousMoviesModal onClose={() => setShowPreviousMovies(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}
