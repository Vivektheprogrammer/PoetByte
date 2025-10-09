'use client';

import { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import FeedbackForm from './FeedbackForm';
import { FaHeart, FaRegHeart, FaTimes } from 'react-icons/fa';
import { MdFeedback } from 'react-icons/md';

interface PoemModalProps {
  poem: any;
  isOpen: boolean;
  onClose: () => void;
}

export default function PoemModal({ poem, isOpen, onClose }: PoemModalProps) {
  const [liked, setLiked] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isHeartAnimating, setIsHeartAnimating] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Create a portal target only on client
  const portalTarget = useMemo(() => {
    if (typeof window === 'undefined') return null;
    return document.body;
  }, []);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Lock body scroll while modal is open
  useEffect(() => {
    if (!mounted) return;
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen, mounted]);

  const handleLike = async () => {
    try {
      // Toggle like state for immediate feedback
      setIsHeartAnimating(true);
      setLiked(!liked);
      
      // Send like to backend
      await fetch('/api/poems/like', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          poemId: poem._id,
          action: !liked ? 'like' : 'unlike'
        }),
      });
    } catch (error) {
      console.error('Error toggling like:', error);
      // Revert UI state if request fails
      setLiked(liked);
    }
  };

  // Handle escape key to close modal
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 md:p-8"
          initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
          animate={{ opacity: 1, backdropFilter: 'blur(8px)' }}
          exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
          onKeyDown={handleKeyDown}
          tabIndex={0}
        >
          {/* Backdrop with blur */}
          <motion.div
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          
          {/* Modal Content */}
          <motion.div
            className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-xl shadow-2xl"
            initial={{ scale: 0.96, opacity: 0, y: 8 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.96, opacity: 0, y: 8 }}
            transition={{ duration: 0.4, ease: 'easeInOut' }}
          >
            {/* Glass effect container */}
            <div className="relative z-10 p-6 md:p-8 bg-white/90 dark:bg-gray-900/90 backdrop-blur-lg rounded-xl border border-white/20 dark:border-gray-700/30 shadow-lg">
              {/* Close button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-300 hover:shadow-md z-10"
                aria-label="Close modal"
              >
                <FaTimes size={20} />
              </button>
              
              <div className="mb-8">
                <motion.h1 
                  className="text-3xl font-bold mb-4 text-[var(--primary)]"
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.1, duration: 0.4 }}
                >
                  {poem.title}
                </motion.h1>
                
                <motion.div 
                  className="text-sm mb-6"
                  initial={{ y: -10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.4 }}
                >
                  By <span className="text-[var(--accent)] font-medium">{poem.author || 'Unknown'}</span>
                </motion.div>
                
                <div className="prose dark:prose-invert max-w-none mb-8">
                  {poem.content.split('\n').map((paragraph: string, index: number) => (
                    <motion.p 
                      key={index} 
                      className="mb-4 text-gray-800 dark:text-gray-200" 
                      initial={{ y: 10, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.2 + (index * 0.05), duration: 0.4 }}
                    >
                      {paragraph}
                    </motion.p>
                  ))}
                </div>
                
                <motion.div 
                  className="text-sm text-gray-500 dark:text-gray-400 mb-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.4 }}
                >
                  Posted on {new Date(poem.createdAt).toLocaleDateString()}
                </motion.div>
                
                {/* Action buttons */}
                <div className="flex flex-wrap gap-4 mb-8">
                  {/* Like button */}
                  <motion.button
                    className={`flex items-center gap-2 p-3 rounded-full ${
                      liked 
                        ? 'bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400' 
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                    } transition-all duration-300 hover:shadow-md`}
                    onClick={handleLike}
                    whileTap={{ scale: 0.9 }}
                    whileHover={{ scale: 1.05 }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4, duration: 0.3 }}
                  >
                    <motion.div
                      onAnimationEnd={() => setIsHeartAnimating(false)}
                      className={isHeartAnimating ? "animate-heart-beat" : ""}
                    >
                      {liked ? (
                        <FaHeart className="text-pink-500" size={20} />
                      ) : (
                        <FaRegHeart size={20} />
                      )}
                    </motion.div>
                    <span>{liked ? 'Liked' : 'Like'}</span>
                  </motion.button>
                  
                  {/* Feedback button */}
                  <motion.button
                    className={`flex items-center gap-2 p-3 rounded-full ${
                      showFeedback 
                        ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' 
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                    } transition-all duration-300 hover:shadow-md`}
                    onClick={() => setShowFeedback(!showFeedback)}
                    whileTap={{ scale: 0.9 }}
                    whileHover={{ scale: 1.05 }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.45, duration: 0.3 }}
                  >
                    <MdFeedback size={20} />
                    <span>Feedback</span>
                  </motion.button>
                </div>
              </div>
              
              {/* Feedback Form */}
              <AnimatePresence>
                {showFeedback && (
                  <motion.div
                    initial={{ opacity: 0, height: 0, y: -20 }}
                    animate={{ opacity: 1, height: 'auto', y: 0 }}
                    exit={{ opacity: 0, height: 0, y: -20 }}
                    transition={{ duration: 0.4, ease: 'easeInOut' }}
                    className="overflow-hidden"
                  >
                    <FeedbackForm poemId={poem._id} />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  if (!mounted || !portalTarget) return null;
  return createPortal(modalContent, portalTarget);
}