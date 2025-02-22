'use client';
import { motion } from 'framer-motion';
import { useState } from 'react';
import TextInput from '../inputs/TextInput';
import { useStores } from '@/hooks/useStores';
import { toast } from 'sonner';
import ModalButtons from '@/components/buttons/ModalButtons';

interface CreateMovieModalProps {
  onClose: () => void;
}

export default function CreateMovieModal({ onClose }: CreateMovieModalProps) {
  const [movieText, setMovieText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { rootStore } = useStores();
  const movieStore = rootStore.movieStore;
  const MAX_CHARS = 280;

  const handleSubmit = async () => {
    if (!movieText.trim()) {
      toast.error('Please enter a movie prompt');
      return;
    }

    setIsSubmitting(true);
    try {
      await movieStore.createMovie({
        moviePrompt: movieText,
      });
      toast.success('Movie created successfully');
      onClose();
    } catch (error: any) {
      toast.error(error?.message || 'Failed to create movie');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 z-20 flex items-center justify-center bg-black/40 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="w-full max-w-xl p-8 rounded-3xl
                   backdrop-blur-lg bg-[rgba(255,255,255,0.03)]
                   shadow-[20px_20px_40px_rgba(0,0,0,0.25),_-12px_-12px_24px_rgba(255,255,255,0.08)]
                   border border-gray-200/10
                   h-[16vw] w-[60vh]
                   "
      >
        <div className="space-y-7">
          {/* Text Input Area */}
          <TextInput
            value={movieText}
            onChange={(value) => {
              if (value.length <= MAX_CHARS) {
                setMovieText(value);
              }
            }}
            maxLength={MAX_CHARS}
          />

          {/* Image Upload Area */}
          {/* <ImageUpload onImageUpload={(file) => console.log(file)} /> */}

          {/* Character Count and Buttons */}
          <ModalButtons
            characterCount={movieText.length}
            maxChars={MAX_CHARS}
            onCancel={onClose}
            onSubmit={handleSubmit}
          />
        </div>
      </motion.div>
    </motion.div>
  );
}
