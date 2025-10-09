'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import PoemModal from './PoemModal';
import { FaArrowRight } from 'react-icons/fa';

interface PoemCardProps {
  poem: any;
  index: number;
}

export default function PoemCard({ poem, index }: PoemCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  
  // Get a preview of the poem content
  const contentPreview = poem.content.length > 150
    ? `${poem.content.substring(0, 150)}...`
    : poem.content;

  return (
    <>
      <motion.div
        className="card p-5 sm:p-6 cursor-pointer hover-lift bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-100 dark:border-gray-700/30 rounded-xl h-full"
        whileHover={{ 
          y: -8, 
          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)'
        }}
        whileTap={{ scale: 0.98 }}
        onClick={openModal}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ 
          duration: 0.5, 
          delay: Math.min(index * 0.08, 0.4),
          ease: 'easeInOut'
        }}
      >
        <div className="flex flex-col h-full">
          <h2 className="text-xl font-semibold mb-1 text-[var(--primary)]">
            {poem.title}
          </h2>
          <div className="mb-2 text-sm">
            <span className="text-[var(--accent)]">By</span>{' '}
            <span className="text-[var(--accent)] font-medium">
              {poem.author || 'Unknown'}
            </span>
          </div>
          <p className="mb-4 text-gray-600 dark:text-gray-300 flex-grow">
            {contentPreview}
          </p>
          <div className="inline-flex items-center mt-auto text-[var(--primary)] font-medium group">
            <span className="mr-2">Read More</span>
            <motion.div
              whileHover={{ x: 5 }}
              transition={{ duration: 0.3 }}
            >
              <FaArrowRight size={14} className="group-hover:translate-x-1 transition-transform duration-300" />
            </motion.div>
          </div>
        </div>
      </motion.div>

      <PoemModal 
        poem={poem} 
        isOpen={isModalOpen} 
        onClose={closeModal} 
      />
    </>
  );
}