'use client';

import { useState, useEffect } from 'react';
import PoemCard from '@/components/PoemCard';
import { FaFeatherAlt, FaQuoteLeft } from 'react-icons/fa';

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
  const [poems, setPoems] = useState<Poem[]>(initialPoems);

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

  const filteredPoems = poems.filter((poem) => {
    if (activeTab === 'all') return true;
    if (activeTab === 'poems') return poem.type === 'poem';
    if (activeTab === 'quotes') return poem.type === 'quote';
    return true;
  });

  const poemCount = poems.filter((p) => p.type === 'poem').length;
  const quoteCount = poems.filter((p) => p.type === 'quote').length;

  return (
    <div>
      <div className="flex justify-center mb-8">
        <div className="inline-flex bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full p-1.5 shadow-lg border border-gray-100 dark:border-gray-700/30">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-5 py-2.5 rounded-full font-medium text-sm transition-all duration-300 ${
              activeTab === 'all'
                ? 'bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] text-white shadow-md'
                : 'text-gray-600 dark:text-gray-300 hover:text-[var(--primary)] dark:hover:text-[var(--primary)]'
            }`}
          >
            All ({poems.length})
          </button>
          <button
            onClick={() => setActiveTab('poems')}
            className={`px-5 py-2.5 rounded-full font-medium text-sm transition-all duration-300 flex items-center gap-2 ${
              activeTab === 'poems'
                ? 'bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] text-white shadow-md'
                : 'text-gray-600 dark:text-gray-300 hover:text-[var(--primary)] dark:hover:text-[var(--primary)]'
            }`}
          >
            <FaFeatherAlt size={14} />
            Poems ({poemCount})
          </button>
          <button
            onClick={() => setActiveTab('quotes')}
            className={`px-5 py-2.5 rounded-full font-medium text-sm transition-all duration-300 flex items-center gap-2 ${
              activeTab === 'quotes'
                ? 'bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] text-white shadow-md'
                : 'text-gray-600 dark:text-gray-300 hover:text-[var(--primary)] dark:hover:text-[var(--primary)]'
            }`}
          >
            <FaQuoteLeft size={14} />
            Quotes ({quoteCount})
          </button>
        </div>
      </div>

      {filteredPoems.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPoems.map((poem: Poem, index: number) => (
            <PoemCard
              key={poem._id}
              poem={poem}
              index={index}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 animate-fade-in max-w-md mx-auto">
          <div className="card p-8">
            <p className="text-2xl font-semibold mb-4 text-[var(--primary)]">
              {activeTab === 'quotes' ? 'No quotes yet.' : 'No poems available yet.'}
            </p>
            <p className="opacity-80">
              {activeTab === 'quotes'
                ? 'Visit the admin dashboard to add your first quote!'
                : 'Visit the admin dashboard to add your first poem!'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
