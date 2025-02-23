'use client';
import { motion } from 'framer-motion';
import { observer } from 'mobx-react-lite';
import { ScreenplayAgentStore, Shot } from '@/stores/ScreenplayStore';
import { MovieStore } from '@/stores/MovieStore';
import { DocumentIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';

interface Props {
  screenplayStore: ScreenplayAgentStore;
  movieStore: MovieStore;
}

export const ScreenplayResults = observer(
  ({ screenplayStore, movieStore }: Props) => {
    const [selectedShot, setSelectedShot] = useState<Shot | null>(null);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const shots = screenplayStore.screenplay?.content || [];

    const handleContinueClick = () => {
      if (shots.length > 0) {
        movieStore.handleFramesClick();
      }
    };

    return (
      <motion.div
        className="space-y-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <DocumentIcon className="w-6 h-6 text-white/70" />
            <h2 className="text-2xl font-semibold text-white/90">
              Director's Screenplay
            </h2>
          </div>
          <button
            onClick={() => screenplayStore.setStep('prompt')}
            className="p-2 rounded-lg bg-white/5 text-white/70 hover:text-white/90 
                     transition-all duration-300 ease-out
                     shadow-[2px_2px_4px_rgba(0,0,0,0.3),-2px_-2px_4px_rgba(255,255,255,0.1)]
                     hover:shadow-[4px_4px_8px_rgba(0,0,0,0.3),-4px_-4px_8px_rgba(255,255,255,0.1)]"
          >
            <ArrowPathIcon className="w-5 h-5" />
          </button>
        </div>

        <div className="grid gap-4">
          {shots.map((shot, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() =>
                setSelectedShot(selectedShot === shot ? null : shot)
              }
              className={`p-4 rounded-xl backdrop-blur-sm border transition-all duration-300 ease-out cursor-pointer
                       ${
                         selectedShot === shot
                           ? 'bg-white/10 border-white/20 shadow-[inset_4px_4px_8px_rgba(0,0,0,0.3),inset_-4px_-4px_8px_rgba(255,255,255,0.1)]'
                           : 'bg-white/5 border-white/10 shadow-[4px_4px_8px_rgba(0,0,0,0.3),-4px_-4px_8px_rgba(255,255,255,0.1)]'
                       }
                       hover:bg-white/10 hover:border-white/20`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-[80px] text-white/50 text-sm">
                  {shot.time}
                </div>
                <div className="flex-1 space-y-3">
                  <div className="flex items-center gap-3">
                    <span className="px-3 py-1 rounded-full bg-white/10 text-white/70 text-sm">
                      {shot.shot}
                    </span>
                    <span className="text-white/30 text-sm">
                      {shot.transition}
                    </span>
                  </div>

                  <p className="text-white/90">{shot.action}</p>

                  {shot.dialogue && (
                    <div className="pl-4 border-l-2 border-blue-500/30 mt-2">
                      <p className="text-blue-400/90 font-medium">
                        {shot.dialogue}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {selectedShot === shot && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-4 pt-4 border-t border-white/10"
                >
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <h4 className="text-white/50 mb-1">Camera Direction</h4>
                      <p className="text-white/90">{shot.shot}</p>
                    </div>
                    <div>
                      <h4 className="text-white/50 mb-1">Transition</h4>
                      <p className="text-white/90">{shot.transition}</p>
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>

        <div
          className="mt-8 p-4 rounded-xl bg-white/5 border border-white/10
                     shadow-[4px_4px_8px_rgba(0,0,0,0.3),-4px_-4px_8px_rgba(255,255,255,0.1)]"
        >
          <div className="flex items-center gap-2 text-white/50 text-sm">
            <span className="w-2 h-2 rounded-full bg-blue-400/90"></span>
            Total Duration: {shots.length} seconds
          </div>
        </div>

        <div className="flex gap-4 mt-8">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => screenplayStore.setStep('prompt')}
            className="flex-1 py-4 px-6 rounded-xl font-medium tracking-wide text-lg
                     bg-gradient-to-br from-gray-500/80 to-gray-600/80
                     text-white shadow-[4px_4px_8px_rgba(0,0,0,0.3),-4px_-4px_8px_rgba(255,255,255,0.1)]
                     hover:shadow-[6px_6px_12px_rgba(0,0,0,0.3),-6px_-6px_12px_rgba(255,255,255,0.1)]
                     transition-all duration-300 ease-out"
          >
            Back to Edit
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleContinueClick}
            disabled={shots.length === 0}
            className={`flex-1 py-4 px-6 rounded-xl font-medium tracking-wide text-lg
                     ${
                       shots.length > 0
                         ? 'bg-gradient-to-br from-blue-500/80 to-purple-600/80'
                         : 'bg-gradient-to-br from-gray-500/50 to-gray-600/50 cursor-not-allowed'
                     }
                     text-white shadow-[4px_4px_8px_rgba(0,0,0,0.3),-4px_-4px_8px_rgba(255,255,255,0.1)]
                     hover:shadow-[6px_6px_12px_rgba(0,0,0,0.3),-6px_-6px_12px_rgba(255,255,255,0.1)]
                     transition-all duration-300 ease-out`}
          >
            Continue to Frames
          </motion.button>
        </div>
      </motion.div>
    );
  }
);
