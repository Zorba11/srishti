'use client';
import { motion } from 'framer-motion';
import { observer } from 'mobx-react-lite';
import { useStores } from '@/hooks/useStores';
import { ScreenplayPromptForm } from './screenplay/ScreenplayPromptForm';
import { ScreenplayResults } from './screenplay/ScreenplayResults';
import { useEffect } from 'react';

export const ScreenplayStep = observer(() => {
  const {
    rootStore: { screenplayStore, movieStore },
  } = useStores();

  useEffect(() => {
    // Update movieStore only if the screenplay content is different
    if (
      screenplayStore.screenplay &&
      JSON.stringify(screenplayStore.screenplay.content) !==
        JSON.stringify(movieStore.screenplay?.content)
    ) {
      movieStore.setScreenplay(screenplayStore.screenplay.content);
    }
  }, [screenplayStore.screenplay]);

  useEffect(() => {
    // Only update screenplayStore if the currentStep is not already 'results'
    if (
      movieStore.isScreenplaySelected &&
      movieStore.screenplay &&
      screenplayStore.currentStep !== 'results'
    ) {
      screenplayStore.setScreenplay(movieStore.screenplay.content);
      screenplayStore.setStep('results');
    }
  }, [movieStore.isScreenplaySelected, movieStore.screenplay]);

  return (
    <motion.div
      className="w-full h-full flex items-start justify-center p-4 sm:p-8 overflow-y-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.5 }}
    >
      <div className="w-full max-w-4xl mx-auto py-6">
        {screenplayStore.currentStep === 'prompt' ? (
          <ScreenplayPromptForm
            movieStore={movieStore}
            screenplayStore={screenplayStore}
            movieId={movieStore.currentMovieId!}
            baseScript={movieStore.currentMovie?.selectedScript!}
          />
        ) : (
          <ScreenplayResults
            movieStore={movieStore}
            screenplayStore={screenplayStore}
          />
        )}
      </div>
    </motion.div>
  );
});
