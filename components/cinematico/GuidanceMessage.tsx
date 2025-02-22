'use client';
import { motion } from 'framer-motion';

export default function GuidanceMessage() {
  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center pointer-events-none z-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1.8, duration: 0.6, ease: 'easeOut' }}
    >
      <div className="bg-black/40 backdrop-blur-sm p-4 rounded-xl shadow-md text-white text-center text-lg">
        choose a channel from the control panel to start creating
      </div>
    </motion.div>
  );
}
