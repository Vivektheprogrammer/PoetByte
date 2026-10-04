'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import PoemModal from './PoemModal';
import { FaArrowRight, FaShareNodes, FaQuoteLeft, FaFeatherPointed, FaCopy, FaCheck, FaBookOpen } from 'react-icons/fa6';
import { isPoemLiked, setPoemLiked } from '@/lib/likes';

interface PoemCardProps {
  poem: any;
  index: number;
}

export default function PoemCard({ poem, index }: PoemCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const isQuote = poem.type === 'quote';

  // Sync like state from localStorage and listen to cross-component changes
  useEffect(() => {
    if (!poem?._id) return;
    setIsLiked(isPoemLiked(poem._id));

    const handleLikeChange = (e: Event) => {
      const customEvent = e as CustomEvent<{ poemId: string; liked: boolean }>;
      if (customEvent.detail?.poemId === poem._id.toString()) {
        setIsLiked(customEvent.detail.liked);
      }
    };

    window.addEventListener('poetbyte_like_change', handleLikeChange);
    return () => {
      window.removeEventListener('poetbyte_like_change', handleLikeChange);
    };
  }, [poem?._id]);

  // 3D Tilt Mouse tracking with smooth springs
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 25 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 25 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ['12deg', '-12deg']);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ['-12deg', '12deg']);
  const glareX = useTransform(mouseXSpring, [-0.5, 0.5], ['0%', '100%']);
  const glareY = useTransform(mouseYSpring, [-0.5, 0.5], ['0%', '100%']);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const mouseX = (e.clientX - rect.left) / rect.width - 0.5;
    const mouseY = (e.clientY - rect.top) / rect.height - 0.5;
    x.set(mouseX);
    y.set(mouseY);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleLike = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const newLiked = !isLiked;
    setIsLiked(newLiked);
    setPoemLiked(poem._id, newLiked);

    try {
      await fetch('/api/poems/like', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          poemId: poem._id,
          action: newLiked ? 'like' : 'unlike',
        }),
      });
    } catch (err) {
      console.error('Failed to update like status:', err);
    }
  };

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const textToCopy = `${poem.title ? poem.title + '\n\n' : ''}${poem.content}\n\n— ${poem.author || 'Vivek R'}\nRead on PoetByte Anthology`;
      await navigator.clipboard.writeText(textToCopy);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  const sharePoem = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const envBase = typeof process !== 'undefined' ? (process as any).env?.NEXT_PUBLIC_BASE_URL : undefined;
      const origin = envBase || (typeof window !== 'undefined' ? window.location.origin : '');
      const url = `${origin}/?poem=${poem._id}`;
      const shareData = {
        title: poem.title || (isQuote ? 'Quote' : 'Poem'),
        text: `“${poem.title || (isQuote ? 'Quote' : 'Poem')}” by ${poem.author || 'Vivek R'}:`,
        url,
      };

      if (typeof navigator !== 'undefined' && navigator.share) {
        await navigator.share(shareData);
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(url);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      }
    } catch (err) {
      console.error('Share failed', err);
    }
  };

  const contentPreview =
    poem.content.length > 160
      ? `${poem.content.substring(0, 160)}...`
      : poem.content;

  return (
    <>
      <div className="perspective-1200 w-full h-full">
        <motion.div
          ref={cardRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          onClick={openModal}
          style={{
            rotateX,
            rotateY,
            transformStyle: 'preserve-3d',
          }}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.6,
            delay: Math.min(index * 0.07, 0.4),
            ease: 'easeOut',
          }}
          whileHover={{ scale: 1.02 }}
          className={`relative group h-full rounded-2xl p-6 sm:p-7 cursor-pointer select-none overflow-hidden transition-all duration-500 parchment-panel border border-[#dfa84a]/30 shadow-[0_15px_35px_-5px_rgba(0,0,0,0.7)] hover:shadow-[0_20px_45px_-5px_rgba(223,168,74,0.25)] hover:border-[#dfa84a]/60`}
        >
          {/* Candlelight Glare Reflection */}
          <motion.div
            className="pointer-events-none absolute -inset-full opacity-0 group-hover:opacity-20 transition-opacity duration-300"
            style={{
              background: 'radial-gradient(circle 300px at 50% 50%, rgba(249,226,157,0.8), transparent 70%)',
              left: glareX,
              top: glareY,
            }}
          />

          {/* Ornate Corner Markers */}
          <span className="absolute top-2.5 left-3 text-[#dfa84a] text-xs opacity-60">❧</span>
          <span className="absolute top-2.5 right-3 text-[#dfa84a] text-xs opacity-60">❧</span>
          <span className="absolute bottom-2.5 left-3 text-[#dfa84a] text-xs opacity-60 rotate-180">❧</span>
          <span className="absolute bottom-2.5 right-3 text-[#dfa84a] text-xs opacity-60 rotate-180">❧</span>

          {/* Card Inner Content */}
          <div className="flex flex-col h-full relative z-10 space-y-4 preserve-3d">
            
            {/* Top Bar */}
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-serif font-bold uppercase tracking-wider bg-[#2a1b12] text-[#f9e29d] border border-[#dfa84a]/30">
                {isQuote ? <FaQuoteLeft size={10} /> : <FaBookOpen size={10} />}
                <span>{isQuote ? 'Quote' : 'Folio Verse'}</span>
              </span>

              <div className="flex items-center gap-1.5 text-[#b8a690]">
                {/* 3D Wax Seal Like / Stamp Button */}
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.15 }}
                  whileTap={{ scale: 0.88 }}
                  onClick={handleLike}
                  title={isLiked ? "Wax Sealed" : "Stamp Wax Seal"}
                  className="relative p-1 rounded-full flex items-center justify-center transition-all focus:outline-none"
                >
                  {/* Expanding Molten Wax Aura Ripple on click */}
                  {isLiked && (
                    <span className="absolute inset-0 rounded-full border border-[#dfa84a] animate-wax-ripple pointer-events-none" />
                  )}

                  {isLiked ? (
                    /* Sealed 3D Royal Crimson Wax Stamp */
                    <span className="animate-wax-stamp relative w-6 h-6 rounded-[48%_52%_49%_51%/52%_48%_53%_47%] bg-gradient-to-br from-[#991b1b] via-[#be123c] to-[#7f1d1d] flex items-center justify-center border border-[#dfa84a]/80 shadow-[0_2px_8px_rgba(153,27,27,0.8),inset_0_1px_2px_rgba(255,255,255,0.4)]">
                      <FaFeatherPointed className="text-[#f9e29d] text-[9px] drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)]" />
                    </span>
                  ) : (
                    /* Unsealed Brass Stamp Matrix Ring */
                    <span className="w-6 h-6 rounded-full border border-dashed border-[#dfa84a]/50 flex items-center justify-center bg-[#231710]/80 hover:bg-[#342217] hover:border-[#dfa84a] text-[#dfa84a]/70 hover:text-[#f9e29d] transition-all shadow-inner">
                      <span className="w-2 h-2 rounded-full border border-[#dfa84a]/40 group-hover:scale-125 transition-transform" />
                    </span>
                  )}
                </motion.button>

                <button
                  type="button"
                  onClick={handleCopy}
                  title="Copy Verse"
                  className="p-2 rounded-full hover:bg-[#342217] hover:text-[#f9e29d] transition-colors"
                >
                  {isCopied ? <FaCheck className="text-amber-400" size={13} /> : <FaCopy size={13} />}
                </button>

                <button
                  type="button"
                  onClick={sharePoem}
                  title="Dispatch Link"
                  className="p-2 rounded-full hover:bg-[#342217] hover:text-[#f9e29d] transition-colors"
                >
                  <FaShareNodes size={13} />
                </button>
              </div>
            </div>

            {/* Title / Quote Glyph */}
            <div>
              {isQuote ? (
                <div className="text-[#dfa84a] text-2xl font-serif">“</div>
              ) : (
                <h3 className="text-xl sm:text-2xl font-serif font-bold gold-foil-text tracking-normal leading-snug group-hover:text-[#f9e29d] transition-colors">
                  {poem.title || 'Untitled Verse'}
                </h3>
              )}
            </div>

            {/* Excerpt Body */}
            <div className="flex-grow">
              <p
                className={`font-serif leading-relaxed ${
                  isQuote
                    ? 'italic text-lg text-[#f9e29d]/90'
                    : 'text-[#f7eedb] text-base font-normal'
                }`}
              >
                {isQuote ? `"${contentPreview}"` : contentPreview}
              </p>
            </div>

            {/* Signature & Read Link */}
            <div className="pt-3 border-t border-[#dfa84a]/20 flex items-center justify-between text-xs sm:text-sm font-serif">
              <div className="flex items-center gap-1.5">
                <span className="text-[#786a58] italic">Penned by</span>
                <a
                  href="https://vivekr.vercel.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="font-semibold text-[#f9e29d] hover:text-[#dfa84a] hover:underline transition-colors"
                >
                  {poem.author || 'Vivek R'}
                </a>
              </div>

              <div className="inline-flex items-center gap-1.5 text-[#dfa84a] font-bold group-hover:text-[#f9e29d] group-hover:translate-x-1 transition-all duration-300">
                <span>{isQuote ? 'Open Scroll' : 'Read In Book'}</span>
                <FaArrowRight size={11} />
              </div>
            </div>

          </div>
        </motion.div>
      </div>

      {/* 3D Grimoire Modal */}
      <PoemModal
        poem={poem}
        isOpen={isModalOpen}
        onClose={closeModal}
      />
    </>
  );
}