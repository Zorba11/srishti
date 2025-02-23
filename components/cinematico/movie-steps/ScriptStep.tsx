'use client';
import { motion } from 'framer-motion';
import { observer } from 'mobx-react-lite';
import { useStores } from '@/hooks/useStores';
import { ScriptPromptForm } from './script/ScriptPromptForm';
import { ScriptResults } from './script/ScriptResults';
import { useEffect } from 'react';

export const ScriptStep = observer(() => {
  const {
    rootStore: { scriptStore, movieStore },
  } = useStores();

  useEffect(() => {
    if (scriptStore.script?.content) {
      movieStore.setSelectedScript(scriptStore.script.content);
    }
  }, [scriptStore.script?.content, movieStore]);

  useEffect(() => {
    // Set the script in scriptStore if there's a selected script in movieStore
    if (
      movieStore.isScriptSelected &&
      movieStore.currentMovie?.selectedScript
    ) {
      scriptStore.script = { content: movieStore.currentMovie.selectedScript };
      scriptStore.setStep('results');
    }
  }, [
    movieStore.currentMovie?.selectedScript,
    scriptStore,
    movieStore.isScriptSelected,
  ]);

  return (
    <motion.div
      className="w-full h-full flex items-start justify-center p-4 sm:p-8 overflow-y-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.5 }}
    >
      <div className="w-full max-w-4xl mx-auto py-6">
        {scriptStore.currentStep === 'prompt' ? (
          <ScriptPromptForm
            scriptStore={scriptStore}
            initialSystemPrompt={
              movieStore.currentMovie?.ideasAgentSystemPrompt ??
              scriptStore.systemPrompt
            }
            selectedIdea={movieStore.currentMovie?.selectedIdea ?? ''}
            movieId={movieStore.currentMovieId!}
          />
        ) : (
          <ScriptResults scriptStore={scriptStore} movieStore={movieStore} />
        )}
      </div>
    </motion.div>
  );
});
