'use client';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { observer } from 'mobx-react-lite';
import { ScreenplayAgentStore } from '@/stores/ScreenplayStore';
import { HiOutlineArrowsExpand } from 'react-icons/hi';
import { MovieStore } from '@/stores/MovieStore';
import { DocumentIcon } from '@heroicons/react/24/outline';

interface Props {
  screenplayStore: ScreenplayAgentStore;
  movieStore: MovieStore;
  movieId: string;
  baseScript: string;
}

export const ScreenplayPromptForm = observer(
  ({ screenplayStore, movieStore, movieId, baseScript }: Props) => {
    const [systemPrompt, setSystemPrompt] = useState(
      screenplayStore.systemPrompt
    );
    const [userPrompt, setUserPrompt] = useState(baseScript);
    const [fullScreenMode, setFullScreenMode] = useState<
      'system' | 'script' | null
    >(null);

    const handleFullScreenClose = (
      type: 'system' | 'script',
      value: string
    ) => {
      if (type === 'system') setSystemPrompt(value);
      else setUserPrompt(value);
      setFullScreenMode(null);
    };

    return (
      <motion.div
        className="w-full space-y-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
      >
        {movieStore.isScreenplaySelected && (
          <motion.button
            onClick={() => screenplayStore.setStep('results')}
            className="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-xl 
                     bg-white/5 border border-white/10 text-white/90
                     hover:bg-white/10 hover:border-white/20
                     transition-all duration-300 ease-out
                     shadow-[2px_2px_4px_rgba(0,0,0,0.3),-2px_-2px_4px_rgba(255,255,255,0.1)]
                     hover:shadow-[4px_4px_8px_rgba(0,0,0,0.3),-4px_-4px_8px_rgba(255,255,255,0.1)]"
          >
            <DocumentIcon className="w-5 h-5" />
            <span>View Existing Screenplay</span>
          </motion.button>
        )}

        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold text-white/90">
              Screenplay Instructions
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
          <textarea
            value={systemPrompt}
            onChange={(e) => setSystemPrompt(e.target.value)}
            className="w-full h-32 p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 
                   text-white/90 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50
                   transition-all duration-300 ease-out resize-none
                   shadow-[inset_2px_2px_4px_rgba(0,0,0,0.4),inset_-2px_-2px_4px_rgba(255,255,255,0.1)]"
          />
        </div>

        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold text-white/90">
              Base Script
            </h2>
            <button
              onClick={() => setFullScreenMode('script')}
              className="p-2 rounded-lg bg-white/5 text-white/70 hover:text-white/90 
                     transition-all duration-300 ease-out
                     shadow-[2px_2px_4px_rgba(0,0,0,0.3),-2px_-2px_4px_rgba(255,255,255,0.1)]"
            >
              <HiOutlineArrowsExpand className="h-5 w-5" />
            </button>
          </div>
          <textarea
            value={userPrompt}
            onChange={(e) => setUserPrompt(e.target.value)}
            className="w-full h-48 p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 
                   text-white/90 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50
                   transition-all duration-300 ease-out resize-none
                   shadow-[inset_2px_2px_4px_rgba(0,0,0,0.4),inset_-2px_-2px_4px_rgba(255,255,255,0.1)]"
          />
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          disabled={screenplayStore.isGenerating}
          onClick={() =>
            screenplayStore.generateScreenplay(
              { systemPrompt, userPrompt },
              movieId
            )
          }
          className={`w-full py-4 px-6 rounded-xl font-medium tracking-wide text-lg
                   ${
                     screenplayStore.isGenerating
                       ? 'bg-gradient-to-br from-blue-400/60 to-purple-500/60 cursor-not-allowed'
                       : 'bg-gradient-to-br from-blue-500/80 to-purple-600/80 hover:shadow-lg'
                   }
                   text-white transition-all duration-300 ease-out`}
        >
          {screenplayStore.isGenerating
            ? 'Generating Screenplay...'
            : 'Generate Screenplay'}
        </motion.button>
      </motion.div>
    );
  }
);
