'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { IdeaAgentStore } from '@/stores/IdeaStore';
import { FullScreenEditor } from './FullScreenEditor';
import { HiOutlineArrowsExpand } from 'react-icons/hi';

interface Props {
  ideaStore: IdeaAgentStore;
  baseUserPrompt: string;
}

export const IdeaPromptForm = ({ ideaStore, baseUserPrompt }: Props) => {
  const [userPrompt, setUserPrompt] = useState(baseUserPrompt);
  const [systemPrompt, setSystemPrompt] = useState(ideaStore.systemPrompt);
  const [fullScreenMode, setFullScreenMode] = useState<
    'system' | 'vision' | null
  >(null);

  const handleFullScreenClose = (type: 'system' | 'vision', value: string) => {
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
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold text-white/90">
              System Prompt
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

        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold text-white/90">
              Your Vision
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
              placeholder="Describe your movie idea or the type of movie you'd like to create..."
            />
          </div>
        </div>

        <div className="flex gap-4 pt-4">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() =>
              ideaStore.generateIdeas({ userPrompt, systemPrompt })
            }
            className="flex-1 py-4 px-6 rounded-xl bg-gradient-to-br from-blue-500/80 to-purple-600/80
                     text-white font-medium tracking-wide text-lg
                     shadow-[4px_4px_8px_rgba(0,0,0,0.3),-4px_-4px_8px_rgba(255,255,255,0.1)]
                     hover:shadow-[6px_6px_12px_rgba(0,0,0,0.3),-6px_-6px_12px_rgba(255,255,255,0.1)]
                     transition-all duration-300 ease-out"
          >
            {ideaStore.isGenerating ? (
              <span className="flex items-center justify-center gap-3">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Generating Ideas...
              </span>
            ) : (
              'Generate Ideas'
            )}
          </motion.button>

          {ideaStore.ideas.length > 0 && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => ideaStore.setStep('results')}
              className="px-6 rounded-xl bg-white/5 text-white/90
                       shadow-[4px_4px_8px_rgba(0,0,0,0.3),-4px_-4px_8px_rgba(255,255,255,0.1)]
                       hover:shadow-[6px_6px_12px_rgba(0,0,0,0.3),-6px_-6px_12px_rgba(255,255,255,0.1)]
                       transition-all duration-300 ease-out"
            >
              View Results
            </motion.button>
          )}
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
};
