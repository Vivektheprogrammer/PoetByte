'use client';

import { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import FeedbackForm from './FeedbackForm';
import {
  FaXmark,
  FaQuoteLeft,
  FaShareNodes,
  FaCopy,
  FaCheck,
  FaBookOpen,
  FaScroll,
  FaChevronLeft,
  FaChevronRight,
  FaCommentDots,
  FaFeatherPointed,
} from 'react-icons/fa6';

import { isPoemLiked, setPoemLiked } from '@/lib/likes';

interface PoemModalProps {
  poem: any;
  isOpen: boolean;
  onClose: () => void;
}

// Roman numeral converter for authentic folio numbering
function toRoman(num: number): string {
  const lookup: [number, string][] = [
    [100, 'C'],
    [90, 'XC'],
    [50, 'L'],
    [40, 'XL'],
    [10, 'X'],
    [9, 'IX'],
    [5, 'V'],
    [4, 'IV'],
    [1, 'I'],
  ];
  let roman = '';
  let n = num;
  for (const [val, letter] of lookup) {
    while (n >= val) {
      roman += letter;
      n -= val;
    }
  }
  return roman || 'I';
}

// Ornate 3D Wax Seal Stamp Component with Molten Glow
function RoyalWaxSeal({ isStamped }: { isStamped: boolean }) {
  if (!isStamped) return null;

  return (
    <div className="relative inline-flex items-center justify-center select-none pointer-events-none">
      {/* Molten Golden-Crimson Shockwave Ripple */}
      <div className="absolute w-24 h-24 rounded-full border-2 border-[#dfa84a] animate-wax-ripple pointer-events-none" />

      {/* Wax Seal Physical Stamp */}
      <div className="animate-wax-stamp">
        <div
          className="relative w-20 h-20 rounded-[48%_52%_49%_51%/52%_48%_53%_47%] bg-gradient-to-br from-[#991b1b] via-[#be123c] to-[#7f1d1d] flex items-center justify-center border-2 border-[#dfa84a]/70"
          style={{
            boxShadow:
              'inset 0 3px 6px rgba(255,255,255,0.4), inset 0 -4px 8px rgba(0,0,0,0.6), 0 10px 25px rgba(153,27,27,0.7), 0 0 20px rgba(223,168,74,0.3)',
          }}
        >
          {/* Inner Engraved Gold Ring */}
          <div className="w-14 h-14 rounded-full border border-dashed border-[#f9e29d]/80 flex flex-col items-center justify-center p-1 text-center bg-[#881337]/50 shadow-inner">
            <FaFeatherPointed className="text-[#f9e29d] text-sm drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]" />
            <span className="text-[7px] font-serif font-black tracking-widest text-[#f9e29d] uppercase mt-0.5 drop-shadow-[0_1px_1px_rgba(0,0,0,0.9)]">
              SEALED
            </span>
          </div>

          {/* Gloss highlight */}
          <div className="absolute top-1.5 left-2.5 w-4 h-2 rounded-full bg-white/35 blur-[1px] -rotate-45" />
        </div>
      </div>
    </div>
  );
}

export default function PoemModal({ poem, isOpen, onClose }: PoemModalProps) {
  const [liked, setLiked] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [viewMode, setViewMode] = useState<'grimoire' | 'scroll'>('grimoire');
  const [currentPage, setCurrentPage] = useState(0);
  const [mounted, setMounted] = useState(false);

  const portalTarget = useMemo(() => {
    if (typeof window === 'undefined') return null;
    return document.body;
  }, []);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Sync like state from localStorage whenever modal opens or poem changes
  useEffect(() => {
    if (!poem?._id) return;
    setLiked(isPoemLiked(poem._id));

    const handleLikeChange = (e: Event) => {
      const customEvent = e as CustomEvent<{ poemId: string; liked: boolean }>;
      if (customEvent.detail?.poemId === poem._id.toString()) {
        setLiked(customEvent.detail.liked);
      }
    };

    window.addEventListener('poetbyte_like_change', handleLikeChange);
    return () => {
      window.removeEventListener('poetbyte_like_change', handleLikeChange);
    };
  }, [poem?._id, isOpen]);

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

  const stanzas = useMemo(() => {
    if (!poem?.content) return [];
    return poem.content.split(/\n\n+/).filter((s: string) => s.trim() !== '');
  }, [poem]);

  // Split stanzas into pairs of pages for Grimoire book view
  const pages = useMemo(() => {
    const chunked: string[][] = [];
    for (let i = 0; i < stanzas.length; i += 2) {
      chunked.push(stanzas.slice(i, i + 2));
    }
    return chunked.length > 0 ? chunked : [[poem?.content || '']];
  }, [stanzas, poem]);

  const handleLike = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const newLiked = !liked;
    setLiked(newLiked);
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
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  const handleCopy = async () => {
    try {
      const textToCopy = `${poem.title ? poem.title + '\n\n' : ''}${poem.content}\n\n— ${poem.author || 'Vivek R'}\nRead on PoetByte Anthology`;
      await navigator.clipboard.writeText(textToCopy);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error('Copy failed', err);
    }
  };

  const handleShare = async () => {
    try {
      const envBase = typeof process !== 'undefined' ? (process as any).env?.NEXT_PUBLIC_BASE_URL || (process as any).env?.NEXT_PUBLIC_SITE_URL : undefined;
      const origin = envBase || (typeof window !== 'undefined' ? window.location.origin : 'https://poetbyte.vercel.app');
      const url = `${origin}/poems/${poem._id}`;
      const shareData = {
        title: poem.title || (poem.type === 'quote' ? 'Vintage Quote' : 'Anthology Poem'),
        text: `“${poem.title || (poem.type === 'quote' ? 'Quote' : 'Poem')}” penned by ${poem.author || 'Vivek R'}:`,
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

  const isQuote = poem.type === 'quote';

  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-4 md:p-6"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Escape') onClose();
          }}
        >
          {/* Dim Candlelit Backdrop */}
          <motion.div
            className="absolute inset-0 bg-[#090604]/85 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* 3D Book & Grimoire Chamber */}
          <motion.div
            className="relative w-full max-w-4xl max-h-[94vh] flex flex-col rounded-3xl overflow-hidden bg-[#160e0a] border-2 border-[#dfa84a]/40 shadow-[0_20px_70px_rgba(0,0,0,0.8),0_0_40px_rgba(223,168,74,0.15)] z-10"
            initial={{ scale: 0.9, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 30 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Velvet Ribbon Bookmark Dangler (Hidden on mobile to prevent button overlap) */}
            <div className="hidden sm:flex absolute top-0 right-20 w-6 h-12 bg-gradient-to-b from-[#881337] to-[#be123c] shadow-lg rounded-b-sm border-x border-[#dfa84a]/40 z-30 pointer-events-none items-end justify-center pb-1">
              <span className="text-[10px] text-[#f9e29d]">✦</span>
            </div>

            {/* Top Toolbar: Leather Header */}
            <div className="flex items-center justify-between px-4 sm:px-6 py-3 border-b border-[#dfa84a]/25 bg-[#120b08] text-[#dfa84a] gap-2">
              <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                <span className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-full bg-[#2c1a11] border border-[#dfa84a]/30 text-[11px] sm:text-xs font-serif font-bold uppercase tracking-wider text-[#f9e29d]">
                  {isQuote ? <FaQuoteLeft size={10} /> : <FaBookOpen size={11} />}
                  <span>{isQuote ? 'Quote' : 'Book Reader'}</span>
                </span>

                {!isQuote && (
                  <div className="flex items-center gap-1 bg-[#1d120c] p-0.5 sm:p-1 rounded-lg border border-[#dfa84a]/20">
                    <button
                      onClick={() => setViewMode('grimoire')}
                      className={`px-2 sm:px-2.5 py-0.5 rounded text-[10px] sm:text-xs font-serif font-semibold transition-all ${
                        viewMode === 'grimoire' ? 'bg-[#dfa84a] text-[#1a1007]' : 'text-[#b8a690] hover:text-[#f9e29d]'
                      }`}
                    >
                      📖 Book
                    </button>
                    <button
                      onClick={() => setViewMode('scroll')}
                      className={`px-2 sm:px-2.5 py-0.5 rounded text-[10px] sm:text-xs font-serif font-semibold transition-all ${
                        viewMode === 'scroll' ? 'bg-[#dfa84a] text-[#1a1007]' : 'text-[#b8a690] hover:text-[#f9e29d]'
                      }`}
                    >
                      📜 Scroll
                    </button>
                  </div>
                )}
              </div>

              <button
                onClick={onClose}
                className="p-2 rounded-full text-[#b8a690] hover:text-[#f9e29d] bg-[#22150e] hover:bg-[#342015] border border-[#dfa84a]/20 transition-all shrink-0"
                aria-label="Close"
              >
                <FaXmark size={15} />
              </button>
            </div>

            {/* Grimoire Reader Chamber */}
            <div className="flex-1 overflow-y-auto p-3.5 sm:p-6 md:p-8 space-y-5">
              
              {isQuote ? (
                /* Quote Parchment Display */
                <div className="parchment-panel-light rounded-2xl p-6 sm:p-12 text-center space-y-6 relative overflow-hidden ornate-corners">
                  <FaQuoteLeft className="text-3xl sm:text-4xl text-[#dfa84a] mx-auto opacity-70" />
                  <div className="font-serif italic text-xl sm:text-3xl text-[#261c14] leading-relaxed max-w-2xl mx-auto drop-cap">
                    {poem.content}
                  </div>
                  <div className="text-right text-base sm:text-lg font-serif font-bold text-[#8c591c] max-w-2xl mx-auto pt-4 border-t border-[#d8caa9]">
                    —{' '}
                    <a
                      href="https://vivekr.vercel.app/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:underline text-[#8c591c] hover:text-[#5a380e] transition-colors"
                    >
                      {poem.author || 'Vivek R'}
                    </a>
                  </div>

                  {/* Wax Seal on Quote */}
                  {liked && (
                    <div className="flex justify-center pt-4">
                      <RoyalWaxSeal isStamped={liked} />
                    </div>
                  )}
                </div>
              ) : viewMode === 'grimoire' ? (
                /* Dual Page 3D Hardbound Book */
                <div className="perspective-1200 py-1">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-0 rounded-2xl overflow-hidden shadow-2xl border-2 sm:border-4 border-[#2b1b12] bg-[#fbf5e8] text-[#261c14] relative book-spine-shadow">
                    
                    {/* Left Page */}
                    <div className="p-5 sm:p-8 border-b md:border-b-0 md:border-r border-[#d4c5a3] book-page-left-shadow space-y-4">
                      <div className="text-center border-b border-[#dfa84a]/30 pb-2 sm:pb-3">
                        <span className="text-[11px] sm:text-xs uppercase tracking-[0.25em] text-[#8c591c] font-serif font-bold">
                          Folio {toRoman(currentPage + 1)} of {toRoman(pages.length)}
                        </span>
                        <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#1f1610] mt-1">
                          {poem.title || 'Untitled Verse'}
                        </h2>
                      </div>

                      {/* Stanza 1 on Left Page with Drop Cap */}
                      <div className="space-y-4 font-serif text-base sm:text-lg leading-relaxed pt-1 sm:pt-2">
                        {pages[currentPage] && pages[currentPage][0] && (
                          <div className="drop-cap whitespace-pre-line">
                            {pages[currentPage][0]}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Right Page */}
                    <div className="p-5 sm:p-8 book-page-right-shadow space-y-4 relative min-h-[160px] sm:min-h-[220px]">
                      <div className="text-right text-[11px] sm:text-xs uppercase tracking-widest text-[#8c591c] font-serif border-b border-[#dfa84a]/30 pb-2 sm:pb-3">
                        Penned by{' '}
                        <a
                          href="https://vivekr.vercel.app/"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-bold text-[#8c591c] hover:text-[#5a380e] hover:underline transition-colors"
                        >
                          {poem.author || 'Vivek R'}
                        </a>
                      </div>

                      {/* Stanza 2 on Right Page */}
                      <div className="space-y-4 font-serif text-base sm:text-lg leading-relaxed pt-1 sm:pt-2">
                        {pages[currentPage] && pages[currentPage][1] ? (
                          <div className="whitespace-pre-line text-[#261c14]">
                            {pages[currentPage][1]}
                          </div>
                        ) : (
                          <div className="text-center py-6 text-[#8c591c]/60 italic text-sm">
                            ❧ End of Passage ❧
                          </div>
                        )}
                      </div>

                      {/* Stamped Ornate 3D Wax Seal if liked */}
                      {liked && (
                        <div className="flex justify-end pt-4 sm:absolute sm:bottom-4 sm:right-4 z-20">
                          <RoyalWaxSeal isStamped={liked} />
                        </div>
                      )}
                    </div>

                  </div>

                  {/* Page Navigation for Grimoire */}
                  {pages.length > 1 && (
                    <div className="flex items-center justify-between mt-3 px-1 gap-2">
                      <button
                        onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
                        disabled={currentPage === 0}
                        className="px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl bg-[#231710] border border-[#dfa84a]/30 text-[#f9e29d] text-[11px] sm:text-xs font-serif font-bold disabled:opacity-30 hover:bg-[#342217] transition-all flex items-center gap-1.5"
                      >
                        <FaChevronLeft size={10} />
                        <span>Previous</span>
                      </button>

                      <span className="text-[11px] sm:text-xs font-serif text-[#dfa84a] whitespace-nowrap">
                        Folio {currentPage + 1} of {pages.length}
                      </span>

                      <button
                        onClick={() => setCurrentPage((p) => Math.min(pages.length - 1, p + 1))}
                        disabled={currentPage === pages.length - 1}
                        className="px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl bg-[#231710] border border-[#dfa84a]/30 text-[#f9e29d] text-[11px] sm:text-xs font-serif font-bold disabled:opacity-30 hover:bg-[#342217] transition-all flex items-center gap-1.5"
                      >
                        <span>Next</span>
                        <FaChevronRight size={10} />
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                /* Parchment Scroll View */
                <div className="parchment-panel-light rounded-2xl p-5 sm:p-10 space-y-5 relative">
                  <div className="border-b border-[#d8caa9] pb-3 sm:pb-4">
                    <h1 className="text-2xl sm:text-4xl font-serif font-bold text-[#1f1610]">
                      {poem.title || 'Untitled Verse'}
                    </h1>
                    <p className="text-xs sm:text-sm font-serif italic text-[#8c591c] mt-1">
                      Penned by{' '}
                      <a
                        href="https://vivekr.vercel.app/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-bold text-[#8c591c] hover:text-[#5a380e] hover:underline transition-colors"
                      >
                        {poem.author || 'Vivek R'}
                      </a>
                      {' '}• {new Date(poem.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="space-y-5 font-serif text-base sm:text-xl text-[#261c14] leading-relaxed">
                    {stanzas.map((stanza: string, i: number) => (
                      <div key={i} className={i === 0 ? 'drop-cap whitespace-pre-line' : 'whitespace-pre-line'}>
                        {stanza}
                      </div>
                    ))}
                  </div>

                  {liked && (
                    <div className="flex justify-end pt-4">
                      <RoyalWaxSeal isStamped={liked} />
                    </div>
                  )}
                </div>
              )}

              {/* Action Toolbar */}
              <div className="pt-3 border-t border-[#dfa84a]/25 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                
                {/* Wax Seal Like Button & Reflections */}
                <div className="flex items-center gap-2 sm:gap-3">
                  {/* 3D Wax Seal Like / Stamp Button */}
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.94 }}
                    onClick={handleLike}
                    className={`relative flex-1 sm:flex-none flex items-center justify-center gap-2.5 px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-xl font-serif text-xs sm:text-sm font-bold transition-all duration-300 shadow-md ${
                      liked
                        ? 'bg-gradient-to-r from-[#991b1b] via-[#be123c] to-[#881337] text-[#fff7d6] border border-[#dfa84a] shadow-[0_0_20px_rgba(190,18,60,0.6)]'
                        : 'bg-[#231710] hover:bg-[#342217] text-[#dfa84a] hover:text-[#f9e29d] border border-[#dfa84a]/40 hover:border-[#dfa84a]'
                    }`}
                  >
                    {/* Molten Glow Shockwave on click */}
                    {liked && (
                      <span className="absolute -inset-1 rounded-xl border border-[#dfa84a] animate-wax-ripple pointer-events-none" />
                    )}

                    {liked ? (
                      /* Mini 3D Royal Wax Seal */
                      <span className="animate-wax-stamp relative w-5 h-5 sm:w-6 sm:h-6 rounded-[48%_52%_49%_51%/52%_48%_53%_47%] bg-gradient-to-br from-[#991b1b] via-[#be123c] to-[#7f1d1d] flex items-center justify-center border border-[#dfa84a]/80 shadow-[0_2px_6px_rgba(153,27,27,0.8),inset_0_1px_2px_rgba(255,255,255,0.4)]">
                        <FaFeatherPointed className="text-[#f9e29d] text-[8px] sm:text-[9px] drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)]" />
                      </span>
                    ) : (
                      /* Mini Brass Matrix Ring */
                      <span className="w-5 h-5 sm:w-6 sm:h-6 rounded-full border border-dashed border-[#dfa84a]/60 flex items-center justify-center bg-[#1a100a] text-[#dfa84a] shadow-inner">
                        <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-[#dfa84a]/50" />
                      </span>
                    )}

                    <span className="whitespace-nowrap">{liked ? 'Wax Sealed' : 'Stamp Wax Seal'}</span>
                  </motion.button>

                  <button
                    onClick={() => setShowFeedback(!showFeedback)}
                    className={`flex-1 sm:flex-none flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl font-serif text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
                      showFeedback
                        ? 'bg-[#dfa84a] text-[#1a1007] border border-[#fff2b2]'
                        : 'bg-[#231710] hover:bg-[#342217] text-[#b8a690] border border-[#dfa84a]/25'
                    }`}
                  >
                    <FaCommentDots size={13} />
                    <span>Inscribe</span>
                  </button>
                </div>

                {/* Copy & Share */}
                <div className="flex items-center justify-end gap-2">
                  <button
                    onClick={handleCopy}
                    className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-[#231710] hover:bg-[#342217] text-[#b8a690] hover:text-[#f9e29d] border border-[#dfa84a]/25 text-xs font-serif font-bold transition-all"
                  >
                    {isCopied ? <FaCheck className="text-amber-400" size={12} /> : <FaCopy size={12} />}
                    <span>{isCopied ? 'Copied' : 'Copy Verse'}</span>
                  </button>

                  <button
                    onClick={handleShare}
                    className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-[#231710] hover:bg-[#342217] text-[#b8a690] hover:text-[#f9e29d] border border-[#dfa84a]/25 text-xs font-serif font-bold transition-all"
                  >
                    <FaShareNodes size={12} />
                    <span>Dispatch</span>
                  </button>
                </div>

              </div>

              {/* Feedback Inscription Drawer */}
              <AnimatePresence>
                {showFeedback && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.35 }}
                    className="overflow-hidden pt-2"
                  >
                    <div className="bg-[#120b08] rounded-2xl p-6 border border-[#dfa84a]/30 shadow-2xl">
                      <FeedbackForm poemId={poem._id} />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );

  if (!mounted || !portalTarget) return null;
  return createPortal(modalContent, portalTarget);
}