'use client';
import { motion } from 'framer-motion';

export const RenderStep = () => {
  return (
    <motion.div
      className="flex flex-col items-center justify-center h-full text-white p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.5 }}
    >
      <h2 className="text-2xl font-light mb-4">Final Movie Preview</h2>
      {/* Full movie preview interface will go here */}
    </motion.div>
  );
};
