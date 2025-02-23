'use client';
import { motion } from 'framer-motion';
import { IdeaAgentStore } from '@/stores/IdeaStore';
import { MovieStore } from '@/stores/MovieStore';
import { useState } from 'react';

interface Props {
  ideaStore: IdeaAgentStore;
  movieStore: MovieStore;
}

export const IdeaResults = ({ ideaStore, movieStore }: Props) => {
  const [selectedIdea, setSelectedIdea] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleIdeaSelect = (idea: string) => {
    setSelectedIdea(idea);
  };

  const handleConfirmSelection = async () => {
    if (!selectedIdea) return;
    try {
      setIsProcessing(true);
      await movieStore.selectIdea(selectedIdea);
    } catch (error) {
      setSelectedIdea(null);
      // Handle error (maybe show a toast notification)
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="w-full max-w-4xl space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-light text-white/90">
          Top 10 Generated Ideas
        </h2>
        <button
          onClick={() => ideaStore.setStep('prompt')}
          className="px-4 py-2 rounded-lg bg-white/5 text-white/70 hover:text-white/90 
                     transition-all duration-300 ease-out
                     shadow-[2px_2px_4px_rgba(0,0,0,0.3),-2px_-2px_4px_rgba(255,255,255,0.1)]"
        >
          Generate More
        </button>
      </div>

      <div className="grid gap-6">
        {ideaStore.ideas.map((idea, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => handleIdeaSelect(idea.description)}
            className={`p-6 rounded-xl bg-white/5 backdrop-blur-sm border 
                       ${
                         selectedIdea === idea.description
                           ? 'border-emerald-400/50 bg-emerald-400/5'
                           : 'border-white/10'
                       }
                       shadow-[4px_4px_8px_rgba(0,0,0,0.3),-4px_-4px_8px_rgba(255,255,255,0.1)]
                       hover:shadow-[6px_6px_12px_rgba(0,0,0,0.3),-6px_-6px_12px_rgba(255,255,255,0.1)]
                       transition-all duration-300 ease-out cursor-pointer
                       hover:border-emerald-400/30`}
          >
            <div className="space-y-4">
              <p className="text-white/70 font-light leading-relaxed">
                {idea.description}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {selectedIdea && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-center"
        >
          <button
            onClick={handleConfirmSelection}
            disabled={isProcessing}
            className={`px-6 py-3 rounded-lg relative overflow-hidden
                     transition-all duration-300 ease-out
                     shadow-[2px_2px_4px_rgba(0,0,0,0.3),-2px_-2px_4px_rgba(255,255,255,0.1)]
                     border border-emerald-400/30
                     ${
                       isProcessing
                         ? 'bg-emerald-500/10 text-emerald-400/50 cursor-not-allowed'
                         : 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 hover:text-emerald-300'
                     }`}
          >
            <span
              className={`flex items-center gap-2 ${
                isProcessing ? 'opacity-0' : 'opacity-100'
              }`}
            >
              Confirm & Proceed
            </span>
            {isProcessing && (
              <motion.div
                className="absolute inset-0 flex items-center justify-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <div className="h-5 w-5 border-2 border-emerald-400/30 border-t-emerald-400 rounded-full animate-spin" />
              </motion.div>
            )}
          </button>
        </motion.div>
      )}
    </div>
  );
};
