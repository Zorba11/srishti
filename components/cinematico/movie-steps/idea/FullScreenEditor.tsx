'use client';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

interface Props {
  type: 'system' | 'vision';
  initialValue: string;
  onClose: (type: 'system' | 'vision', value: string) => void;
}

export const FullScreenEditor = ({ type, initialValue, onClose }: Props) => {
  const [value, setValue] = useState(initialValue);

  // Handle escape key to close
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose(type, value);
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [type, value, onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/90 backdrop-blur-lg flex items-center justify-center p-8"
    >
      <motion.div
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.95 }}
        className="w-full max-w-4xl bg-white/5 rounded-2xl p-6 space-y-4
                   shadow-[8px_8px_16px_rgba(0,0,0,0.4),-8px_-8px_16px_rgba(255,255,255,0.1)]"
      >
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-light text-white/90">
            {type === 'system' ? 'System Prompt' : 'Your Vision'}
          </h2>
          <button
            onClick={() => onClose(type, value)}
            className="p-2 rounded-lg bg-white/10 text-white/70 hover:text-white/90
                     transition-all duration-300 ease-out"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <textarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="w-full h-[60vh] p-6 rounded-xl bg-black/20 backdrop-blur-sm border border-white/10 
                   text-white/90 text-lg focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50
                   transition-all duration-300 ease-out resize-none
                   shadow-[inset_2px_2px_4px_rgba(0,0,0,0.4),inset_-2px_-2px_4px_rgba(255,255,255,0.1)]"
          autoFocus
        />

        <div className="flex justify-end gap-4">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onClose(type, value)}
            className="px-6 py-3 rounded-xl bg-gradient-to-br from-blue-500/80 to-purple-600/80
                     text-white font-medium tracking-wide
                     shadow-[4px_4px_8px_rgba(0,0,0,0.3),-4px_-4px_8px_rgba(255,255,255,0.1)]
                     hover:shadow-[6px_6px_12px_rgba(0,0,0,0.3),-6px_-6px_12px_rgba(255,255,255,0.1)]
                     transition-all duration-300 ease-out"
          >
            Save Changes
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
};
