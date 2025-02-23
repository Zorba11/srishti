'use client';
import { motion } from 'framer-motion';
import { observer } from 'mobx-react-lite';
import { MovieStore } from '@/stores/MovieStore';
import { ScriptAgentStore } from '@/stores/ScriptStore';
import { useState } from 'react';
import { IoExpandOutline } from 'react-icons/io5';
import { FullscreenModal } from '@/components/ui/FullscreenModal';

interface Props {
  scriptStore: ScriptAgentStore;
  movieStore: MovieStore;
}

export const ScriptResults = observer(({ scriptStore, movieStore }: Props) => {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const handleContinueClick = () => {
    if (scriptStore.script?.content) {
      movieStore.handleScreenplayClick();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <h2 className="text-2xl font-semibold text-white/90">Generated Script</h2>
      <div
        className="relative rounded-xl bg-white/5 p-6 backdrop-blur-sm border border-white/10
                   shadow-[4px_4px_8px_rgba(0,0,0,0.3),-4px_-4px_8px_rgba(255,255,255,0.1)]"
      >
        <button
          onClick={() => setIsFullscreen(true)}
          className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 
                   transition-all duration-300 text-white/90"
        >
          <IoExpandOutline size={20} />
        </button>
        <pre className="whitespace-pre-wrap text-white/90 font-mono text-sm">
          {scriptStore.script?.content || 'No script generated yet.'}
        </pre>
      </div>

      <FullscreenModal
        isOpen={isFullscreen}
        onClose={() => setIsFullscreen(false)}
      >
        <pre className="whitespace-pre-wrap text-white/90 font-mono text-sm">
          {scriptStore.script?.content || 'No script generated yet.'}
        </pre>
      </FullscreenModal>

      <div className="flex gap-4">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => scriptStore.setStep('prompt')}
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
          disabled={!scriptStore.script?.content}
          className={`flex-1 py-4 px-6 rounded-xl font-medium tracking-wide text-lg
                   ${
                     scriptStore.script?.content
                       ? 'bg-gradient-to-br from-blue-500/80 to-purple-600/80'
                       : 'bg-gradient-to-br from-gray-500/50 to-gray-600/50 cursor-not-allowed'
                   }
                   text-white shadow-[4px_4px_8px_rgba(0,0,0,0.3),-4px_-4px_8px_rgba(255,255,255,0.1)]
                   hover:shadow-[6px_6px_12px_rgba(0,0,0,0.3),-6px_-6px_12px_rgba(255,255,255,0.1)]
                   transition-all duration-300 ease-out`}
        >
          Continue to Screenplay
        </motion.button>
      </div>
    </motion.div>
  );
});
