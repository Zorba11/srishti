'use client';
import { motion } from 'framer-motion';
import { IdeaPromptForm } from './idea/IdeaPromptForm';
import { IdeaAgentStore } from '@/stores/IdeaStore';
import { observer } from 'mobx-react-lite';
import { IdeaResults } from './idea/IdeaResults';
import { useStores } from '@/hooks/useStores';

export const IdeaStep = observer(() => {
  const {
    rootStore: { ideaStore, movieStore },
  } = useStores();

  return (
    <motion.div
      className="w-full h-full flex items-start justify-center p-4 sm:p-8 overflow-y-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.5 }}
    >
      <div className="w-full max-w-4xl mx-auto py-6">
        {ideaStore.currentStep === 'prompt' ? (
          <IdeaPromptForm
            baseUserPrompt={movieStore.currentMovie?.prompt!}
            ideaStore={ideaStore}
          />
        ) : (
          <IdeaResults ideaStore={ideaStore} />
        )}
      </div>
    </motion.div>
  );
});
