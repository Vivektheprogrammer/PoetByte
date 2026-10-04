'use client';

import { useState, useEffect, useMemo } from 'react';
import PoemCard from '@/components/PoemCard';
import PoemModal from '@/components/PoemModal';
import { FaBookOpen, FaQuoteLeft, FaMagnifyingGlass, FaScroll, FaShuffle } from 'react-icons/fa6';
import { motion, AnimatePresence } from 'framer-motion';

interface Poem {
  _id: string;
  title: string;
  content: string;
  author: string;
  type: 'poem' | 'quote';
  createdAt: string;
  likes: number;
}

interface ContentTabsProps {
  initialPoems: Poem[];
}

export default function ContentTabs({ initialPoems }: ContentTabsProps) {
  const [activeTab, setActiveTab] = useState<'all' | 'poems' | 'quotes'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [poems, setPoems] = useState<Poem[]>(initialPoems);
  const [randomPoem, setRandomPoem] = useState<Poem | null>(null);
  const [isRandomModalOpen, setIsRandomModalOpen] = useState(false);

  useEffect(() => {
    const fetchPoems = async () => {
      try {
        const res = await fetch('/api/poems');
        if (res.ok) {
          const data = await res.json();
          setPoems(data);
        }
      } catch (error) {
        console.error('Failed to fetch poems:', error);
      }
    };

    fetchPoems();
    const interval = setInterval(fetchPoems, 30000);
    return () => clearInterval(interval);
  }, []);

  const filteredPoems = useMemo(() => {
    return poems.filter((poem) => {
      if (activeTab === 'poems' && poem.type !== 'poem') return false;
      if (activeTab === 'quotes' && poem.type !== 'quote') return false;

      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = poem.title?.toLowerCase().includes(query);
        const matchesContent = poem.content?.toLowerCase().includes(query);
        const matchesAuthor = poem.author?.toLowerCase().includes(query);
        return matchesTitle || matchesContent || matchesAuthor;
      }

      return true;
    });
  }, [poems, activeTab, searchQuery]);

  const poemCount = poems.filter((p) => p.type === 'poem').length;
  const quoteCount = poems.filter((p) => p.type === 'quote').length;

  const handleRandomPoem = () => {
    if (poems.length === 0) return;
    const randomIndex = Math.floor(Math.random() * poems.length);
    setRandomPoem(poems[randomIndex]);
    setIsRandomModalOpen(true);
  };

  return (
    <div id="verses-section" className="space-y-8">
      {/* Catalog Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 parchment-panel p-4 sm:p-5 rounded-2xl border border-[#dfa84a]/30 shadow-2xl">
        
        {/* Category Tabs */}
        <div className="flex items-center gap-1.5 bg-[#120b08] p-1.5 rounded-xl border border-[#dfa84a]/30 w-full md:w-auto justify-center">
          <button
            onClick={() => setActiveTab('all')}
            className={`relative px-4 py-2 rounded-lg text-xs sm:text-sm font-serif font-bold transition-all duration-300 ${
              activeTab === 'all'
                ? 'text-[#160e0a]'
                : 'text-[#d4c5a3] hover:text-[#f9e29d]'
            }`}
          >
            {activeTab === 'all' && (
              <motion.div
                layoutId="activeTabGlow"
                className="absolute inset-0 bg-gradient-to-r from-[#f9e29d] via-[#dfa84a] to-[#c9933b] rounded-lg shadow-md border border-[#fff2b2]"
                transition={{ type: 'spring', duration: 0.4 }}
              />
            )}
            <span className="relative z-10">All Folios ({poems.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('poems')}
            className={`relative px-4 py-2 rounded-lg text-xs sm:text-sm font-serif font-bold flex items-center gap-2 transition-all duration-300 ${
              activeTab === 'poems'
                ? 'text-[#160e0a]'
                : 'text-[#d4c5a3] hover:text-[#f9e29d]'
            }`}
          >
            {activeTab === 'poems' && (
              <motion.div
                layoutId="activeTabGlow"
                className="absolute inset-0 bg-gradient-to-r from-[#f9e29d] via-[#dfa84a] to-[#c9933b] rounded-lg shadow-md border border-[#fff2b2]"
                transition={{ type: 'spring', duration: 0.4 }}
              />
            )}
            <span className="relative z-10 flex items-center gap-2">
              <FaBookOpen size={12} />
              <span>Poems ({poemCount})</span>
            </span>
          </button>

          <button
            onClick={() => setActiveTab('quotes')}
            className={`relative px-4 py-2 rounded-lg text-xs sm:text-sm font-serif font-bold flex items-center gap-2 transition-all duration-300 ${
              activeTab === 'quotes'
                ? 'text-[#160e0a]'
                : 'text-[#d4c5a3] hover:text-[#f9e29d]'
            }`}
          >
            {activeTab === 'quotes' && (
              <motion.div
                layoutId="activeTabGlow"
                className="absolute inset-0 bg-gradient-to-r from-[#f9e29d] via-[#dfa84a] to-[#c9933b] rounded-lg shadow-md border border-[#fff2b2]"
                transition={{ type: 'spring', duration: 0.4 }}
              />
            )}
            <span className="relative z-10 flex items-center gap-2">
              <FaQuoteLeft size={11} />
              <span>Quotes ({quoteCount})</span>
            </span>
          </button>
        </div>

        {/* Ledger Search & Surprise Scroll */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <FaMagnifyingGlass className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#dfa84a] text-xs" />
            <input
              type="text"
              placeholder="Search library manuscripts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-[#120b08] text-sm font-serif text-[#f7eedb] placeholder-[#786a58] rounded-xl border border-[#dfa84a]/25 focus:border-[#dfa84a] focus:outline-none focus:ring-1 focus:ring-[#dfa84a]/40 transition-all"
            />
          </div>

          <button
            onClick={handleRandomPoem}
            title="Summon random verse from library"
            className="px-4 py-2 rounded-xl bg-[#2a1b12] hover:bg-[#3d271a] text-[#f9e29d] border border-[#dfa84a]/40 text-xs font-serif font-bold flex items-center gap-2 transition-all shadow-md active:scale-95 whitespace-nowrap"
          >
            <FaShuffle size={12} className="text-[#dfa84a]" />
            <span className="hidden sm:inline">Inspire Me</span>
          </button>
        </div>

      </div>

      {/* Grid of 3D Cards */}
      <AnimatePresence mode="popLayout">
        {filteredPoems.length > 0 ? (
          <motion.div
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
          >
            {filteredPoems.map((poem: Poem, index: number) => (
              <PoemCard key={poem._id} poem={poem} index={index} />
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="text-center py-20 parchment-panel rounded-3xl border border-[#dfa84a]/30 max-w-lg mx-auto p-8 space-y-4"
          >
            <div className="w-16 h-16 mx-auto rounded-full bg-[#dfa84a]/10 border border-[#dfa84a]/40 flex items-center justify-center text-[#dfa84a] text-2xl">
              <FaScroll />
            </div>
            <h3 className="text-2xl font-serif font-bold text-[#f9e29d]">No Manuscripts Inscribed</h3>
            <p className="text-[#b8a690] text-sm font-serif italic">
              {searchQuery
                ? `No passages matched "${searchQuery}". Try exploring other scrolls.`
                : 'No verses have been transcribed into this anthology yet.'}
            </p>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="px-4 py-2 bg-[#2a1b12] hover:bg-[#3d271a] text-[#f9e29d] rounded-lg text-xs font-serif font-bold border border-[#dfa84a]/30 transition-all"
              >
                Reset Search Ledger
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Random Poem Grimoire Modal */}
      {randomPoem && (
        <PoemModal
          poem={randomPoem}
          isOpen={isRandomModalOpen}
          onClose={() => setIsRandomModalOpen(false)}
        />
      )}
    </div>
  );
}
