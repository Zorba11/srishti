import { motion } from 'framer-motion';
import { observer } from 'mobx-react-lite';
import { useStores } from '@/hooks/useStores';
import { useEffect } from 'react';

interface PreviousMoviesModalProps {
  onClose: () => void;
}

export default observer(function PreviousMoviesModal({
  onClose,
}: PreviousMoviesModalProps) {
  const {
    rootStore: { movieStore },
  } = useStores();

  useEffect(() => {
    movieStore.loadPreviousMovies();
  }, [movieStore]);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />

      <motion.div
        className="relative bg-[#1a1a2e] rounded-2xl w-full max-w-2xl overflow-hidden"
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        style={{
          boxShadow: `
            8px 8px 16px rgba(0, 0, 0, 0.4),
            -4px -4px 12px rgba(255, 255, 255, 0.05),
            inset -1px -1px 2px rgba(255, 255, 255, 0.05)
          `,
        }}
      >
        <div className="p-6">
          <h2 className="text-2xl font-semibold text-gray-200 mb-4">
            Previous Movies
          </h2>

          {movieStore.isLoading ? (
            <div className="text-gray-400 text-center py-8">Loading...</div>
          ) : movieStore.movies.length === 0 ? (
            <div className="text-gray-400 text-center py-8">
              No previous movies found
            </div>
          ) : (
            <div className="space-y-3 max-h-[60vh] overflow-y-auto">
              {movieStore.movies.map((movie) => (
                <motion.button
                  key={movie.id}
                  className="w-full p-4 rounded-xl bg-[rgba(74,21,75,0.15)] text-left group"
                  onClick={() => {
                    movieStore.setActiveMovie(movie.id.toString());
                    onClose();
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <h3 className="text-gray-200 font-medium mb-1 group-hover:text-white">
                    {movie.title}
                  </h3>
                  <p className="text-gray-400 text-sm mb-2">
                    {movie.moviePrompt}
                  </p>
                  <p className="text-gray-500 text-xs">
                    {movie.createdAt
                      ? new Date(movie.createdAt).toLocaleDateString()
                      : 'Date not available'}
                  </p>
                </motion.button>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
});
