'use client';
import { motion } from 'framer-motion';
import ColorBars from './ColorBars';
import GuidanceMessage from './GuidanceMessage';
import { observer } from 'mobx-react-lite';
import { useStores } from '@/hooks/useStores';
import { StepRenderer } from './movie-steps/StepRenderer';

const MovieContent = observer(() => {
  const { rootStore } = useStores();
  const movieStore = rootStore.movieStore;

  return (
    <motion.div
      className="relative w-full h-full bg-black flex items-center justify-center"
      style={{
        boxShadow:
          'inset 4px 4px 8px rgba(0,0,0,0.5), inset -4px -4px 8px rgba(255,255,255,0.05)',
      }}
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{
        duration: 0.6,
        ease: [0.34, 1.56, 0.64, 1],
        scale: { duration: 0.4, ease: [0.34, 1.56, 0.64, 1] },
      }}
    >
      <div className="w-full h-full flex items-center justify-center">
        {movieStore.currentStep ? (
          <StepRenderer
            movieStore={movieStore}
            currentStep={movieStore.currentStep}
          />
        ) : (
          <>
            <ColorBars />
            <GuidanceMessage />
          </>
        )}
      </div>
    </motion.div>
  );
});

export default MovieContent;
