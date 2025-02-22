'use client';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Actor } from '@/types/MovieTypes';

interface ActorCardProps {
  actor: Actor;
  isPending: boolean;
  isConfirming: boolean;
  isSelected: boolean;
  onSelect: () => void;
  onConfirm: () => void;
  aspectClass: string;
}

export const ActorCard = ({
  actor,
  isPending,
  isConfirming,
  isSelected,
  onSelect,
  onConfirm,
  aspectClass,
}: ActorCardProps) => {
  return (
    <motion.div
      className={`relative group cursor-pointer ${
        isPending ? 'ring-2 ring-indigo-400/50 rounded-2xl' : ''
      } ${isSelected ? 'ring-2 ring-emerald-400/50 rounded-2xl' : ''}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ scale: 1.02 }}
      onClick={onSelect}
    >
      <div
        className={`relative ${aspectClass} rounded-2xl overflow-hidden bg-neutral-800/50 backdrop-blur-sm
          shadow-[inset_-8px_-8px_12px_rgba(255,255,255,0.05),inset_8px_8px_12px_rgba(0,0,0,0.3)]
          hover:shadow-[inset_-4px_-4px_8px_rgba(255,255,255,0.05),inset_4px_4px_8px_rgba(0,0,0,0.3)]
          transition-all duration-300 ease-in-out`}
      >
        <Image
          src={actor.portraitUrl}
          alt={actor.name}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          loading="eager"
          priority
        />

        {/* Base hover overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Selection overlay with AnimatePresence */}
        <AnimatePresence>
          {isPending && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-gradient-to-t from-indigo-900/90 via-indigo-600/20 to-transparent"
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(99,102,241,0.15)_0%,_transparent_100%)]" />
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="absolute top-4 right-4"
              >
                <div className="w-4 h-4 rounded-full bg-indigo-400 animate-pulse" />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Add selected state overlay */}
        <AnimatePresence>
          {isSelected && !isPending && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-gradient-to-t from-emerald-900/90 via-emerald-600/20 to-transparent"
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(52,211,153,0.15)_0%,_transparent_100%)]" />
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="absolute top-4 right-4 flex items-center space-x-2"
              >
                <div className="w-4 h-4 rounded-full bg-emerald-400" />
                <span className="text-sm text-emerald-200">Selected</span>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Actor info */}
        <div className="absolute bottom-0 left-0 right-0 p-6 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
          <p className="text-xl font-medium text-white/90">{actor.name}</p>
          <p className="text-neutral-300 text-sm mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            {isSelected
              ? 'Currently selected'
              : isPending
              ? 'Click confirm to select'
              : 'Click to select character'}
          </p>
        </div>

        {/* Confirm button with AnimatePresence */}
        <AnimatePresence>
          {isPending && (
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              className="absolute bottom-4 left-0 right-0 flex justify-center"
            >
              <motion.button
                onClick={(e) => {
                  e.stopPropagation();
                  onConfirm();
                }}
                disabled={isConfirming}
                className={`
                  py-2 px-6 rounded-xl font-medium text-sm
                  ${
                    isConfirming
                      ? 'bg-indigo-700/50 text-indigo-200/50'
                      : 'bg-gradient-to-r from-indigo-500 to-indigo-600 text-white'
                  }
                  shadow-lg shadow-indigo-500/20
                  transform transition-all duration-200
                  hover:shadow-xl hover:shadow-indigo-500/30
                  active:scale-95
                  disabled:cursor-not-allowed
                `}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="flex items-center space-x-2">
                  {isConfirming && (
                    <div className="w-4 h-4 border-2 border-indigo-200 border-t-transparent rounded-full animate-spin" />
                  )}
                  <span>
                    {isConfirming ? 'Selecting...' : 'Confirm Selection'}
                  </span>
                </div>
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};
