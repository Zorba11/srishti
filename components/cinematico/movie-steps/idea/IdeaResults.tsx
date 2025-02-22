'use client';
import { motion } from 'framer-motion';
import { IdeaAgentStore } from '@/stores/IdeaStore';

interface Props {
  ideaStore: IdeaAgentStore;
}

export const IdeaResults = ({ ideaStore }: Props) => {
  return (
    <div className="w-full max-w-4xl space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-light text-white/90">Generated Ideas</h2>
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
            key={idea.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="p-6 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10
                       shadow-[4px_4px_8px_rgba(0,0,0,0.3),-4px_-4px_8px_rgba(255,255,255,0.1)]
                       hover:shadow-[6px_6px_12px_rgba(0,0,0,0.3),-6px_-6px_12px_rgba(255,255,255,0.1)]
                       transition-all duration-300 ease-out"
          >
            <div className="space-y-3">
              <div className="flex justify-between items-start">
                <h3 className="text-xl font-medium text-white/90">
                  {idea.title}
                </h3>
                <span className="px-3 py-1 rounded-full text-sm bg-white/10 text-white/70">
                  {idea.genre}
                </span>
              </div>
              <p className="text-white/70 font-light leading-relaxed">
                {idea.description}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
