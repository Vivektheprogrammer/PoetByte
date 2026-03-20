'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import PoemModal from './PoemModal';
import { FaArrowRight, FaShareAlt, FaQuoteLeft } from 'react-icons/fa';

interface PoemCardProps {
  poem: any;
  index: number;
}

export default function PoemCard({ poem, index }: PoemCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const isQuote = poem.type === 'quote';
  
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  const sharePoem = async () => {
    try {
      const envBase = typeof process !== 'undefined' ? (process as any).env?.NEXT_PUBLIC_BASE_URL : undefined;
      const origin = envBase || (typeof window !== 'undefined' ? window.location.origin : '');
      const url = `${origin}/?poem=${poem._id}`;
      const shareData = {
        title: poem.title || (isQuote ? 'Quote' : 'Poem'),
        text: `Check out this ${isQuote ? 'quote' : 'poem'}${poem.author ? ' by ' + poem.author : ''}: ${poem.title}`,
        url,
      } as ShareData;

      if (typeof navigator !== 'undefined' && (navigator as any).share) {
        try {
          const canShare = typeof (navigator as any).canShare === 'function' ? (navigator as any).canShare(shareData) : true;
          if (canShare) {
            await (navigator as any).share(shareData);
            return;
          }
        } catch (err: any) {
          const name = err?.name || '';
          if (name === 'AbortError' || name === 'NotAllowedError') return;
        }
      }

      if (typeof navigator !== 'undefined' && navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(url);
        alert('Link copied to clipboard');
        return;
      }

      if (typeof window !== 'undefined') {
        window.open(url, '_blank');
      }
    } catch (e) {
      console.error('Share failed', e);
      if (typeof window !== 'undefined') {
        const envBase = (process as any).env?.NEXT_PUBLIC_BASE_URL || window.location.origin;
        const url = `${envBase}/?poem=${poem._id}`;
        window.prompt('Copy this link:', url);
      }
    }
  };
  
  const contentPreview = poem.content.length > 150
    ? `${poem.content.substring(0, 150)}...`
    : poem.content;

  return (
    <>
      <motion.div
        className={`card p-5 sm:p-6 cursor-pointer hover-lift backdrop-blur-sm rounded-xl h-full transition-all ${
          isQuote 
            ? 'bg-gradient-to-br from-amber-50/80 to-orange-50/80 dark:from-amber-900/20 dark:to-orange-900/20 border-amber-200/50 dark:border-amber-700/30' 
            : 'bg-white/80 dark:bg-gray-800/80 border-gray-100 dark:border-gray-700/30'
        }`}
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
          <div className="flex items-center gap-2 mb-2">
            {isQuote && (
              <FaQuoteLeft className="text-amber-500 dark:text-amber-400" size={18} />
            )}
            {!isQuote && poem.title && (
              <h2 className="text-xl font-semibold text-[var(--primary)]">
                {poem.title}
              </h2>
            )}
          </div>
          <div className="mb-2 text-sm">
            <span className="text-[var(--accent)]">By</span>{' '}
            <span className="text-[var(--accent)] font-medium">
              {poem.author || 'Unknown'}
            </span>
          </div>
          <p className={`mb-4 flex-grow ${isQuote ? 'text-gray-700 dark:text-gray-200 italic font-serif text-lg' : 'text-gray-600 dark:text-gray-300'}`}>
            {isQuote ? `"${contentPreview}"` : contentPreview}
          </p>
          <div className="mt-auto flex items-center justify-between">
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); void sharePoem(); }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-100/80 dark:bg-gray-800/80 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              aria-label={`Share ${isQuote ? 'quote' : 'poem'}`}
            >
              <FaShareAlt size={14} />
              <span className="text-sm">Share</span>
            </button>
            <div className="inline-flex items-center text-[var(--primary)] font-medium group">
              <span className="mr-2">{isQuote ? 'Read Quote' : 'Read More'}</span>
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