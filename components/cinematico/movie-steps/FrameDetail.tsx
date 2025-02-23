'use client';
import { useState, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { motion } from 'framer-motion';
import { useStores } from '@/hooks/useStores';
import { HiArrowLeft } from 'react-icons/hi';

interface FrameDetailProps {
  frameIndex: number;
  onBack: () => void;
}

export const FrameDetail = observer(
  ({ frameIndex, onBack }: FrameDetailProps) => {
    const { movieStore, frameStore } = useStores().rootStore;
    const screenplay = movieStore.screenplay;
    const movieId = movieStore.currentMovieId;

    const currentShotDescription = screenplay?.content[frameIndex] || '';
    const nextShotDescription = screenplay?.content[frameIndex + 1] || '';

    const [shotDescriptions, setShotDescriptions] = useState({
      current: currentShotDescription,
      next: nextShotDescription,
    });
    const [sceneScript, setSceneScript] = useState('');
    const [editedImagePrompt, setEditedImagePrompt] = useState('');

    useEffect(() => {
      if (frameStore.currentStep === 'image') {
        setEditedImagePrompt(frameStore.imagePrompt);
      }
    }, [frameStore.currentStep, frameStore.imagePrompt]);

    if (!movieId) {
      return (
        <div className="p-4 text-center text-white/90">
          No active movie selected.
        </div>
      );
    }

    return (
      <motion.div
        className="w-full h-full flex flex-col items-center justify-start p-6 overflow-y-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <div className="w-full max-w-3xl space-y-6">
          <div className="flex justify-between items-center mb-6">
            <motion.h2
              className="text-3xl font-light bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              Frame {frameIndex + 1} Detail
            </motion.h2>
            <motion.button
              onClick={onBack}
              className="flex items-center gap-2 py-2 px-4 rounded-lg text-white/90 
              bg-white/5 backdrop-blur-sm
              shadow-[2px_2px_4px_rgba(0,0,0,0.3),-2px_-2px_4px_rgba(255,255,255,0.1)]
              hover:shadow-[4px_4px_8px_rgba(0,0,0,0.3),-4px_-4px_8px_rgba(255,255,255,0.1)]
              transition-all duration-300 ease-out"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <HiArrowLeft className="w-5 h-5" />
              <span>Back to Grid</span>
            </motion.button>
          </div>

          {frameStore.currentStep === 'form' && (
            <div className="space-y-6">
              <div className="space-y-3">
                <label className="text-lg font-medium text-white/90">
                  Current Shot Description
                </label>
                <div
                  className="relative rounded-xl overflow-hidden
                shadow-[4px_4px_8px_rgba(0,0,0,0.3),-4px_-4px_8px_rgba(255,255,255,0.1)]"
                >
                  <textarea
                    value={shotDescriptions.current}
                    onChange={(e) =>
                      setShotDescriptions({
                        ...shotDescriptions,
                        current: e.target.value,
                      })
                    }
                    className="w-full h-32 p-4 bg-white/5 backdrop-blur-sm border border-white/10 
                    text-white/90 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50
                    transition-all duration-300 ease-out resize-none
                    shadow-[inset_2px_2px_4px_rgba(0,0,0,0.4),inset_-2px_-2px_4px_rgba(255,255,255,0.1)]"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-lg font-medium text-white/90">
                  Next Shot Description
                </label>
                <div
                  className="relative rounded-xl overflow-hidden
                shadow-[4px_4px_8px_rgba(0,0,0,0.3),-4px_-4px_8px_rgba(255,255,255,0.1)]"
                >
                  <textarea
                    value={shotDescriptions.next}
                    onChange={(e) =>
                      setShotDescriptions({
                        ...shotDescriptions,
                        next: e.target.value,
                      })
                    }
                    className="w-full h-32 p-4 bg-white/5 backdrop-blur-sm border border-white/10 
                    text-white/90 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50
                    transition-all duration-300 ease-out resize-none
                    shadow-[inset_2px_2px_4px_rgba(0,0,0,0.4),inset_-2px_-2px_4px_rgba(255,255,255,0.1)]"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-lg font-medium text-white/90">
                  Scene Script
                </label>
                <div
                  className="relative rounded-xl overflow-hidden
                shadow-[4px_4px_8px_rgba(0,0,0,0.3),-4px_-4px_8px_rgba(255,255,255,0.1)]"
                >
                  <textarea
                    value={sceneScript}
                    onChange={(e) => setSceneScript(e.target.value)}
                    className="w-full h-40 p-4 bg-white/5 backdrop-blur-sm border border-white/10 
                    text-white/90 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50
                    transition-all duration-300 ease-out resize-none
                    shadow-[inset_2px_2px_4px_rgba(0,0,0,0.4),inset_-2px_-2px_4px_rgba(255,255,255,0.1)]"
                    placeholder="Enter scene script here..."
                  />
                </div>
              </div>

              <motion.button
                onClick={() =>
                  frameStore.generateBaseScenePrompt(
                    frameIndex,
                    shotDescriptions.current,
                    shotDescriptions.next,
                    sceneScript,
                    movieId
                  )
                }
                disabled={frameStore.isGeneratingPrompt}
                className={`w-full py-4 px-6 rounded-xl font-medium tracking-wide text-lg
                ${
                  frameStore.isGeneratingPrompt
                    ? 'bg-gradient-to-br from-blue-400/60 to-purple-500/60 cursor-not-allowed'
                    : 'bg-gradient-to-br from-blue-500/80 to-purple-600/80 hover:shadow-[6px_6px_12px_rgba(0,0,0,0.3),-6px_-6px_12px_rgba(255,255,255,0.1)]'
                }
                text-white
                shadow-[4px_4px_8px_rgba(0,0,0,0.3),-4px_-4px_8px_rgba(255,255,255,0.1)]
                transition-all duration-300 ease-out`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {frameStore.isGeneratingPrompt ? (
                  <span className="flex items-center justify-center gap-3">
                    <div className="relative w-6 h-6">
                      <div className="absolute top-0 left-0 w-full h-full border-4 border-white/20 rounded-full"></div>
                      <div className="absolute top-0 left-0 w-full h-full border-4 border-white rounded-full border-t-transparent animate-spin"></div>
                    </div>
                    <span className="relative">
                      Generating Prompt
                      <span className="absolute -right-4 animate-pulse">
                        ...
                      </span>
                    </span>
                  </span>
                ) : (
                  'Generate Base Scene Prompt'
                )}
              </motion.button>
            </div>
          )}

          {frameStore.currentStep === 'image' && (
            <div className="space-y-6">
              <div className="space-y-3">
                <label className="text-lg font-medium text-white/90">
                  Base Scene Image Prompt
                </label>
                <div
                  className="relative rounded-xl overflow-hidden
                shadow-[4px_4px_8px_rgba(0,0,0,0.3),-4px_-4px_8px_rgba(255,255,255,0.1)]"
                >
                  <textarea
                    value={editedImagePrompt}
                    onChange={(e) => setEditedImagePrompt(e.target.value)}
                    className="w-full h-32 p-4 bg-white/5 backdrop-blur-sm border border-white/10 
                    text-white/90 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50
                    transition-all duration-300 ease-out resize-none
                    shadow-[inset_2px_2px_4px_rgba(0,0,0,0.4),inset_-2px_-2px_4px_rgba(255,255,255,0.1)]"
                  />
                </div>
              </div>

              <motion.button
                onClick={() =>
                  frameStore.createBaseSceneImage(
                    movieId,
                    frameIndex,
                    editedImagePrompt
                  )
                }
                disabled={frameStore.isCreatingImage}
                className={`w-full py-4 px-6 rounded-xl font-medium tracking-wide text-lg
                ${
                  frameStore.isCreatingImage
                    ? 'bg-gradient-to-br from-green-400/60 to-blue-500/60 cursor-not-allowed'
                    : 'bg-gradient-to-br from-green-500/80 to-blue-600/80 hover:shadow-[6px_6px_12px_rgba(0,0,0,0.3),-6px_-6px_12px_rgba(255,255,255,0.1)]'
                }
                text-white
                shadow-[4px_4px_8px_rgba(0,0,0,0.3),-4px_-4px_8px_rgba(255,255,255,0.1)]
                transition-all duration-300 ease-out`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {frameStore.isCreatingImage ? (
                  <span className="flex items-center justify-center gap-3">
                    <div className="relative w-6 h-6">
                      <div className="absolute top-0 left-0 w-full h-full border-4 border-white/20 rounded-full"></div>
                      <div className="absolute top-0 left-0 w-full h-full border-4 border-white rounded-full border-t-transparent animate-spin"></div>
                    </div>
                    <span className="relative">
                      Creating Image
                      <span className="absolute -right-4 animate-pulse">
                        ...
                      </span>
                    </span>
                  </span>
                ) : (
                  'Create Base Scene Image'
                )}
              </motion.button>

              {frameStore.baseSceneImage && (
                <motion.div
                  className="mt-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <img
                    src={frameStore.baseSceneImage}
                    alt={`Scene frame ${frameIndex + 1}`}
                    className="w-full rounded-xl shadow-[4px_4px_8px_rgba(0,0,0,0.3),-4px_-4px_8px_rgba(255,255,255,0.1)]"
                  />
                </motion.div>
              )}
            </div>
          )}
        </div>
      </motion.div>
    );
  }
);
