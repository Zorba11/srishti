'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { MovieStore } from '@/stores/MovieStore';
import { FullScreenEditor } from '../idea/FullScreenEditor';
import { HiOutlineArrowsExpand } from 'react-icons/hi';
import { ScriptAgentStore } from '@/stores/ScriptStore';

interface Props {
  scriptStore: ScriptAgentStore;
  initialSystemPrompt: string;
  selectedIdea: string;
  movieId: string;
}

export const ScriptPromptForm = observer(
  ({ scriptStore, initialSystemPrompt, selectedIdea, movieId }: Props) => {
    const [systemPrompt, setSystemPrompt] = useState(initialSystemPrompt);
    const [userPrompt, setUserPrompt] = useState(selectedIdea);
    const [fullScreenMode, setFullScreenMode] = useState<
      'system' | 'vision' | null
    >(null);

    useEffect(() => {
      if (scriptStore.lastPrompt) {
        setSystemPrompt(scriptStore.lastPrompt.systemPrompt);
        setUserPrompt(scriptStore.lastPrompt.userPrompt);
      }
    }, [scriptStore.lastPrompt]);

    const handleGenerate = async () => {
      try {
        await scriptStore.generateScript({ systemPrompt, userPrompt }, movieId);
      } catch (error) {
        console.error('Error generating script:', error);
      }
    };

    const handleFullScreenClose = (
      type: 'system' | 'vision',
      value: string
    ) => {
      if (type === 'system') setSystemPrompt(value);
      else setUserPrompt(value);
      setFullScreenMode(null);
    };

    return (
      <>
        <motion.div
          className="w-full space-y-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
        >
          {/* Add View Existing Script Button at the top */}
          <div className="flex justify-end">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => scriptStore.setStep('results')}
              className="py-2 px-4 rounded-lg font-medium
                   bg-gradient-to-br from-purple-500/80 to-blue-600/80
                   text-white shadow-[4px_4px_8px_rgba(0,0,0,0.3),-4px_-4px_8px_rgba(255,255,255,0.1)]
                   hover:shadow-[6px_6px_12px_rgba(0,0,0,0.3),-6px_-6px_12px_rgba(255,255,255,0.1)]
                   transition-all duration-300 ease-out"
            >
              View Existing Script
            </motion.button>
          </div>

          {/* System Prompt Section */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold text-white/90">
                Script Assistant Instructions
              </h2>
              <button
                onClick={() => setFullScreenMode('system')}
                className="p-2 rounded-lg bg-white/5 text-white/70 hover:text-white/90 
                     transition-all duration-300 ease-out
                     shadow-[2px_2px_4px_rgba(0,0,0,0.3),-2px_-2px_4px_rgba(255,255,255,0.1)]"
              >
                <HiOutlineArrowsExpand className="h-5 w-5" />
              </button>
            </div>
            <div
              className="relative rounded-xl overflow-hidden
                      shadow-[4px_4px_8px_rgba(0,0,0,0.3),-4px_-4px_8px_rgba(255,255,255,0.1)]"
            >
              <textarea
                value={systemPrompt}
                onChange={(e) => setSystemPrompt(e.target.value)}
                className="w-full h-32 p-4 bg-white/5 backdrop-blur-sm border border-white/10 
                     text-white/90 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50
                     transition-all duration-300 ease-out resize-none
                     shadow-[inset_2px_2px_4px_rgba(0,0,0,0.4),inset_-2px_-2px_4px_rgba(255,255,255,0.1)]"
              />
            </div>
          </div>

          {/* Selected Idea Section */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold text-white/90">
                Selected Idea
              </h2>
              <button
                onClick={() => setFullScreenMode('vision')}
                className="p-2 rounded-lg bg-white/5 text-white/70 hover:text-white/90 
                     transition-all duration-300 ease-out
                     shadow-[2px_2px_4px_rgba(0,0,0,0.3),-2px_-2px_4px_rgba(255,255,255,0.1)]"
              >
                <HiOutlineArrowsExpand className="h-5 w-5" />
              </button>
            </div>
            <div
              className="relative rounded-xl overflow-hidden
                      shadow-[4px_4px_8px_rgba(0,0,0,0.3),-4px_-4px_8px_rgba(255,255,255,0.1)]"
            >
              <textarea
                value={userPrompt}
                onChange={(e) => setUserPrompt(e.target.value)}
                className="w-full h-32 p-4 bg-white/5 backdrop-blur-sm border border-white/10 
                     text-white/90 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50
                     transition-all duration-300 ease-out resize-none
                     shadow-[inset_2px_2px_4px_rgba(0,0,0,0.4),inset_-2px_-2px_4px_rgba(255,255,255,0.1)]"
                placeholder="Your selected idea will appear here..."
              />
            </div>
          </div>

          {/* Generate Button */}
          <div className="flex gap-4 pt-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={scriptStore.isGenerating}
              onClick={handleGenerate}
              className={`flex-1 py-4 px-6 rounded-xl font-medium tracking-wide text-lg
                   transition-all duration-300 ease-out
                   ${
                     scriptStore.isGenerating
                       ? 'bg-gradient-to-br from-blue-400/60 to-purple-500/60 cursor-not-allowed'
                       : 'bg-gradient-to-br from-blue-500/80 to-purple-600/80 hover:shadow-[6px_6px_12px_rgba(0,0,0,0.3),-6px_-6px_12px_rgba(255,255,255,0.1)]'
                   }
                   text-white
                   shadow-[4px_4px_8px_rgba(0,0,0,0.3),-4px_-4px_8px_rgba(255,255,255,0.1)]`}
            >
              {scriptStore.isGenerating ? (
                <span className="flex items-center justify-center gap-3">
                  <div className="relative w-6 h-6">
                    <div className="absolute top-0 left-0 w-full h-full border-4 border-white/20 rounded-full"></div>
                    <div className="absolute top-0 left-0 w-full h-full border-4 border-white rounded-full border-t-transparent animate-spin"></div>
                  </div>
                  <span className="relative">
                    Generating Script
                    <span className="absolute -right-4 animate-pulse">...</span>
                  </span>
                </span>
              ) : (
                'Generate Script'
              )}
            </motion.button>
          </div>
        </motion.div>

        <AnimatePresence>
          {fullScreenMode && (
            <FullScreenEditor
              type={fullScreenMode}
              initialValue={
                fullScreenMode === 'system' ? systemPrompt : userPrompt
              }
              onClose={handleFullScreenClose}
            />
          )}
        </AnimatePresence>
      </>
    );
  }
);
