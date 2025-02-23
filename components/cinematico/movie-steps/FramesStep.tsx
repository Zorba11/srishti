'use client';
import { motion } from 'framer-motion';
import { observer } from 'mobx-react-lite';
import { useStores } from '@/hooks/useStores';
import { useState } from 'react';
import { FrameDetail } from './FrameDetail';

export const FramesStep = observer(() => {
  const { movieStore, frameStore } = useStores().rootStore;
  const numberOfFrames = movieStore.numberOfFrames;
  const framesArray = Array.from({ length: numberOfFrames }, (_, i) => i);
  const [selectedFrameIndex, setSelectedFrameIndex] = useState<number | null>(
    null
  );

  return (
    <motion.div
      className="absolute inset-0 flex flex-col text-white/90 bg-black/20 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.3, duration: 0.5 }}
    >
      {selectedFrameIndex === null ? (
        <div className="flex flex-col h-full">
          <motion.div
            className="flex-none p-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <h2 className="text-3xl font-light text-center bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Create Base Scene Images
            </h2>
          </motion.div>

          {/* Scrollable container with custom scrollbar */}
          <div
            className="flex-1 overflow-y-auto min-h-0 p-4
            scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent
            hover:scrollbar-thumb-white/30"
          >
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 h-full">
              {framesArray.map((frameIndex) => (
                <motion.div
                  key={frameIndex}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 * (frameIndex % 8), duration: 0.4 }}
                  onClick={() => {
                    frameStore.setStep('form');
                    setSelectedFrameIndex(frameIndex);
                  }}
                  className="relative group cursor-pointer"
                >
                  <div
                    className="aspect-square rounded-2xl overflow-hidden
                      bg-[#1a1a2e] border border-white/10
                      shadow-[4px_4px_8px_rgba(0,0,0,0.3),-4px_-4px_8px_rgba(255,255,255,0.1)]
                      group-hover:shadow-[6px_6px_12px_rgba(0,0,0,0.3),-6px_-6px_12px_rgba(255,255,255,0.1)]
                      group-hover:bg-[#1e1e35]
                      transition-all duration-300 ease-out"
                  >
                    {/* Base gradient for consistent visibility */}
                    <div className="absolute inset-0 bg-gradient-to-br from-black/40 to-transparent" />

                    {/* Gradient overlay for depth */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-50" />

                    {/* Inner shadow for depth */}
                    <div className="absolute inset-0 shadow-[inset_2px_2px_4px_rgba(0,0,0,0.4),inset_-2px_-2px_4px_rgba(255,255,255,0.05)]" />

                    {/* Frame number with enhanced visibility */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span
                        className="text-5xl font-light text-white/90 group-hover:text-white
                          transition-all duration-300 ease-out
                          bg-gradient-to-br from-white/90 to-white/70 bg-clip-text
                          drop-shadow-[0_2px_3px_rgba(0,0,0,0.5)]"
                      >
                        {frameIndex + 1}
                      </span>
                    </div>

                    {/* Hover effect overlay */}
                    <div
                      className="absolute inset-0 bg-gradient-to-t from-purple-500/10 to-blue-500/10 
                        opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <FrameDetail
          frameIndex={selectedFrameIndex}
          onBack={() => setSelectedFrameIndex(null)}
        />
      )}
    </motion.div>
  );
});
