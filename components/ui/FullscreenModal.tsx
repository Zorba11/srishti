import { motion, AnimatePresence } from 'framer-motion';
import { IoCloseOutline } from 'react-icons/io5';

interface FullscreenModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export const FullscreenModal = ({
  isOpen,
  onClose,
  children,
}: FullscreenModalProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.95 }}
            className="relative w-[90vw] h-[90vh] bg-gradient-to-br from-gray-900/90 to-black/90 
                     rounded-2xl border border-white/10 shadow-2xl overflow-auto"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 
                       transition-all duration-300 text-white/90"
            >
              <IoCloseOutline size={24} />
            </button>
            <div className="p-8">{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
