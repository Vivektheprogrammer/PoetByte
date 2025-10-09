'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import PoemModal from './PoemModal';
import { FaArrowRight, FaShareAlt } from 'react-icons/fa';

interface PoemCardProps {
  poem: any;
  index: number;
}

export default function PoemCard({ poem, index }: PoemCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  const sharePoem = async () => {
    try {
      const envBase = typeof process !== 'undefined' ? (process as any).env?.NEXT_PUBLIC_BASE_URL : undefined;
      const origin = envBase || (typeof window !== 'undefined' ? window.location.origin : '');
      const url = `${origin}/?poem=${poem._id}`;
      const shareData = {
        title: poem.title || 'Poem',
        text: `Check out this poem${poem.author ? ' by ' + poem.author : ''}: ${poem.title}`,
        url,
      } as ShareData;

      // Prefer native share if available
      if (typeof navigator !== 'undefined' && (navigator as any).share) {
        try {
          const canShare = typeof (navigator as any).canShare === 'function' ? (navigator as any).canShare(shareData) : true;
          if (canShare) {
            await (navigator as any).share(shareData);
            return; // shared successfully
          }
        } catch (err: any) {
          // If user cancels share, silently stop
          const name = err?.name || '';
          if (name === 'AbortError' || name === 'NotAllowedError') return;
          // Otherwise fall through to clipboard fallback
        }
      }

      // Fallback: copy link to clipboard
      if (typeof navigator !== 'undefined' && navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(url);
        alert('Link copied to clipboard');
        return;
      }

      // Last resort: open in new tab
      if (typeof window !== 'undefined') {
        window.open(url, '_blank');
      }
    } catch (e) {
      console.error('Share failed', e);
      // As a final fallback, try a prompt for copying
      if (typeof window !== 'undefined') {
        const envBase = (process as any).env?.NEXT_PUBLIC_BASE_URL || window.location.origin;
        const url = `${envBase}/?poem=${poem._id}`;
        window.prompt('Copy this link:', url);
      }
    }
  };
  
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
          <div className="mt-auto flex items-center justify-between">
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); void sharePoem(); }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              aria-label="Share poem"
            >
              <FaShareAlt size={14} />
              <span className="text-sm">Share</span>
            </button>
            <div className="inline-flex items-center text-[var(--primary)] font-medium group">
              <span className="mr-2">Read More</span>
              <motion.div
                whileHover={{ x: 5 }}
                transition={{ duration: 0.3 }}
              >
                <FaArrowRight size={14} className="group-hover:translate-x-1 transition-transform duration-300" />
              </motion.div>
            </div>
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