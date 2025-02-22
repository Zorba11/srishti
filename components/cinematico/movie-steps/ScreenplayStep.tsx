'use client';
import { motion } from 'framer-motion';
import { observer } from 'mobx-react-lite';
import { useStores } from '@/hooks/useStores';
import { DocumentIcon } from '@heroicons/react/24/outline';

export const ScreenplayStep = observer(() => {
  const { rootStore } = useStores();
  const movieStore = rootStore.movieStore;

  return (
    <motion.div
      className="w-full h-full flex flex-col items-center justify-center p-8 bg-neutral-900/80"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="max-w-3xl w-full bg-white/95 rounded-lg shadow-xl p-8 font-mono space-y-6"
        initial={{ y: 20 }}
        animate={{ y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <div className="flex items-center gap-3 border-b border-neutral-200 pb-4">
          <DocumentIcon className="w-6 h-6 text-neutral-600" />
          <h2 className="text-xl font-semibold text-neutral-800">Screenplay</h2>
        </div>

        <div className="space-y-4">
          <div className="text-center uppercase text-neutral-600">FADE IN:</div>

          <div className="space-y-6">
            <div className="uppercase font-bold text-neutral-800">
              INT. SCENE LOCATION - TIME
            </div>

            <div className="text-neutral-700 leading-relaxed">
              {movieStore.currentMovieId
                ? 'Scene description will appear here...'
                : 'Please create a movie first to view the screenplay.'}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
});
