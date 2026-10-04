'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import FeedbackForm from '@/components/FeedbackForm';
import {
  FaArrowLeft,
  FaBookOpen,
  FaQuoteLeft,
  FaCopy,
  FaCheck,
  FaShareNodes,
  FaFeatherPointed,
} from 'react-icons/fa6';
import { isPoemLiked, setPoemLiked } from '@/lib/likes';

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

interface PoemDetailViewProps {
  poem: any;
}

export default function PoemDetailView({ poem }: PoemDetailViewProps) {
  const [liked, setLiked] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const isQuote = poem.type === 'quote';

  // Sync like state from localStorage and cross-component updates
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
  }, [poem?._id]);

  const handleLike = async () => {
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
      console.error('Error toggling like on full poem:', error);
    }
  };

  const handleCopy = async () => {
    try {
      const textToCopy = `${poem.title ? poem.title + '\n\n' : ''}${poem.content}\n\n— ${poem.author || 'Vivek R'}\nRead on PoetByte Anthology`;
      await navigator.clipboard.writeText(textToCopy);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy verse:', err);
    }
  };

  const handleShare = async () => {
    try {
      const url = typeof window !== 'undefined' ? window.location.href : '';
      const shareData = {
        title: poem.title || (isQuote ? 'Quote' : 'Poem'),
        text: `“${poem.title || (isQuote ? 'Quote' : 'Poem')}” by ${poem.author || 'Vivek R'}:`,
        url,
      };

      if (typeof navigator !== 'undefined' && navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(url);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      }
    } catch (err) {
      console.error('Share failed', err);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl space-y-8 font-serif">
      {/* Return to Library */}
      <div className="flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#231710] border border-[#dfa84a]/30 text-xs font-serif font-bold text-[#f9e29d] hover:bg-[#342217] transition-all shadow-md group"
        >
          <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" />
          <span>Return to Grimoire Sanctuary</span>
        </Link>
      </div>

      {/* Main Manuscript Parchment Panel */}
      <div className="parchment-panel rounded-3xl p-6 sm:p-12 border-2 border-[#dfa84a]/40 shadow-[0_20px_60px_rgba(0,0,0,0.8)] space-y-8 ornate-corners relative overflow-hidden">
        
        {/* Manuscript Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#dfa84a]/25 pb-6">
          <div className="flex items-center gap-3">
            <span
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-serif font-bold uppercase tracking-wider bg-[#2a1b12] text-[#f9e29d] border border-[#dfa84a]/40"
            >
              {isQuote ? <FaQuoteLeft size={10} /> : <FaBookOpen size={10} />}
              <span>{isQuote ? 'Anthology Quote' : 'Illuminated Manuscript'}</span>
            </span>

            <span className="text-xs text-[#dfa84a] italic">
              Inscribed on{' '}
              {new Date(poem.createdAt).toLocaleDateString(undefined, {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </span>
          </div>

          {/* Action Toolbar */}
          <div className="flex items-center gap-3">
            {/* Wax Seal Stamp Action Button */}
            <motion.button
              type="button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.92 }}
              onClick={handleLike}
              className={`relative flex items-center gap-2.5 px-4 py-2 rounded-xl font-serif text-xs font-bold transition-all duration-300 shadow-md ${
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
                <span className="animate-wax-stamp relative w-5 h-5 rounded-[48%_52%_49%_51%/52%_48%_53%_47%] bg-gradient-to-br from-[#991b1b] via-[#be123c] to-[#7f1d1d] flex items-center justify-center border border-[#dfa84a]/80 shadow-[0_2px_6px_rgba(153,27,27,0.8),inset_0_1px_2px_rgba(255,255,255,0.4)]">
                  <FaFeatherPointed className="text-[#f9e29d] text-[8px] drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)]" />
                </span>
              ) : (
                /* Mini Brass Matrix Ring */
                <span className="w-5 h-5 rounded-full border border-dashed border-[#dfa84a]/60 flex items-center justify-center bg-[#1a100a] text-[#dfa84a] shadow-inner">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#dfa84a]/50" />
                </span>
              )}

              <span>{liked ? 'Wax Sealed' : 'Stamp Wax Seal'}</span>
            </motion.button>

            {/* Copy Verse */}
            <button
              onClick={handleCopy}
              title="Copy Verse"
              className="p-2.5 rounded-xl bg-[#231710] hover:bg-[#342217] text-[#b8a690] hover:text-[#f9e29d] border border-[#dfa84a]/25 text-xs font-serif font-bold transition-all"
            >
              {isCopied ? <FaCheck className="text-amber-400" size={13} /> : <FaCopy size={13} />}
            </button>

            {/* Share */}
            <button
              onClick={handleShare}
              title="Dispatch Link"
              className="p-2.5 rounded-xl bg-[#231710] hover:bg-[#342217] text-[#b8a690] hover:text-[#f9e29d] border border-[#dfa84a]/25 text-xs font-serif font-bold transition-all"
            >
              <FaShareNodes size={13} />
            </button>
          </div>
        </div>

        {/* Content Body */}
        {isQuote ? (
          <div className="text-center space-y-6 py-8 parchment-panel-light rounded-2xl p-8 sm:p-12 relative overflow-hidden">
            <FaQuoteLeft className="text-4xl text-[#dfa84a] mx-auto opacity-70" />
            <div className="font-serif italic text-2xl sm:text-3xl text-[#261c14] leading-relaxed max-w-2xl mx-auto drop-cap">
              {poem.content}
            </div>
            <div className="text-right text-lg text-[#8c591c] font-bold max-w-2xl mx-auto pt-4 border-t border-[#d8caa9]">
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

            {/* Stamped Wax Seal on Quote */}
            {liked && (
              <div className="flex justify-center pt-6">
                <RoyalWaxSeal isStamped={liked} />
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            <h1 className="text-3xl sm:text-5xl font-serif font-bold gold-foil-text tracking-tight leading-tight">
              {poem.title || 'Untitled Verse'}
            </h1>

            <div className="text-sm text-[#dfa84a] italic border-b border-[#dfa84a]/20 pb-4">
              Penned by{' '}
              <a
                href="https://vivekr.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold text-[#f9e29d] hover:text-[#dfa84a] hover:underline transition-colors"
              >
                {poem.author || 'Vivek R'}
              </a>
            </div>

            <div className="space-y-6 text-[#f7eedb] font-serif text-lg sm:text-xl leading-relaxed pt-4">
              {poem.content.split('\n').map((paragraph: string, index: number) => (
                <p
                  key={index}
                  className={index === 0 ? 'drop-cap whitespace-pre-line' : 'whitespace-pre-line'}
                >
                  {paragraph}
                </p>
              ))}
            </div>

            {/* Stamped Royal Wax Seal on Manuscript */}
            {liked && (
              <div className="flex justify-end pt-8">
                <RoyalWaxSeal isStamped={liked} />
              </div>
            )}
          </div>
        )}

        {/* Reflections & Inscriptions Section */}
        <div className="pt-10 border-t border-[#dfa84a]/25 space-y-4">
          <div className="flex items-center gap-2 text-sm font-serif font-bold uppercase tracking-wider text-[#dfa84a]">
            <span>❧</span>
            <span>Inscribe Your Reflections</span>
            <span>❧</span>
          </div>
          <div className="bg-[#120b08] rounded-2xl p-6 border border-[#dfa84a]/30">
            <FeedbackForm poemId={poem._id} />
          </div>
        </div>

      </div>
    </div>
  );
}
