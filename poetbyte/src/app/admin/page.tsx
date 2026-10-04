'use client';

import { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  FaFeatherPointed,
  FaBookOpen,
  FaQuoteLeft,
  FaTrash,
  FaPenToSquare,
  FaComments,
  FaArrowLeft,
  FaCheck,
  FaXmark,
  FaRightFromBracket,
  FaHeart,
  FaRegHeart,
} from 'react-icons/fa6';

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'poems' | 'feedback'>('poems');
  const [poems, setPoems] = useState<any[]>([]);
  const [feedbacks, setFeedbacks] = useState<any[]>([]);
  const [selectedPoemId, setSelectedPoemId] = useState<string | null>(null);
  const [newPoem, setNewPoem] = useState({
    title: '',
    content: '',
    author: '',
    type: 'poem' as 'poem' | 'quote',
  });
  const [editingPoemId, setEditingPoemId] = useState<string | null>(null);
  const [editingDraft, setEditingDraft] = useState<{
    title: string;
    content: string;
    author?: string;
    type?: 'poem' | 'quote';
  }>({ title: '', content: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [isDeletingFeedback, setIsDeletingFeedback] = useState(false);

  // Redirect if not authenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login');
    }
  }, [status, router]);

  // Fetch poems
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
  }, []);

  // Fetch feedbacks
  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const url = selectedPoemId
          ? `/api/admin/feedbacks?poemId=${selectedPoemId}`
          : '/api/admin/feedbacks';

        const res = await fetch(url);
        if (res.ok) {
          const data = await res.json();
          setFeedbacks(data);
        }
      } catch (error) {
        console.error('Failed to fetch feedbacks:', error);
      }
    };

    if (activeTab === 'feedback') {
      fetchFeedbacks();
    }
  }, [activeTab, selectedPoemId]);

  const handleDeleteFeedback = async (feedbackId: string) => {
    if (!confirm('Are you certain you wish to discard this reader reflection?')) {
      return;
    }

    setIsDeletingFeedback(true);

    try {
      const response = await fetch(`/api/admin/feedbacks/${feedbackId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setFeedbacks((prev) => prev.filter((feedback) => feedback._id !== feedbackId));
      } else {
        alert('Failed to delete reflection');
      }
    } catch (error) {
      console.error('Error deleting feedback:', error);
      alert('An error occurred while deleting feedback');
    } finally {
      setIsDeletingFeedback(false);
    }
  };

  const handlePoemChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewPoem((prev) => ({ ...prev, [name]: value }));
  };

  const handlePoemSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPoem.type === 'poem' && !newPoem.title.trim()) {
      return;
    }

    if (!newPoem.content.trim()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        content: newPoem.content,
        author: newPoem.author || 'Vivek R',
        type: newPoem.type,
        ...(newPoem.type === 'poem' && { title: newPoem.title }),
      };

      const response = await fetch('/api/poems', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        setSubmitStatus('success');
        const createdPoem = await response.json();
        setPoems((prev: any[]) => [createdPoem, ...prev]);
        setNewPoem({ title: '', content: '', author: '', type: 'poem' });
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);

      setTimeout(() => {
        setSubmitStatus('idle');
      }, 4000);
    }
  };

  const startEditPoem = (poem: any) => {
    setEditingPoemId(poem._id);
    setEditingDraft({
      title: poem.title || '',
      content: poem.content || '',
      author: poem.author || '',
      type: poem.type || 'poem',
    });
  };

  const cancelEditPoem = () => {
    setEditingPoemId(null);
    setEditingDraft({ title: '', content: '', author: '', type: 'poem' });
  };

  const saveEditPoem = async () => {
    if (!editingPoemId) return;
    try {
      const res = await fetch(`/api/poems/${editingPoemId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingDraft),
      });
      if (!res.ok) throw new Error('Failed to update poem');
      const updated = await res.json();
      setPoems((prev: any[]) => prev.map((p: any) => (p._id === updated._id ? updated : p)));
      cancelEditPoem();
    } catch (e) {
      console.error(e);
      alert('Failed to update poem');
    }
  };

  const deletePoem = async (id: string) => {
    if (!confirm('Are you sure you wish to strike this manuscript from the anthology?')) return;
    try {
      const res = await fetch(`/api/poems/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete');
      setPoems((prev) => prev.filter((p: any) => p._id !== id));
      if (selectedPoemId === id) setSelectedPoemId(null);
    } catch (e) {
      console.error(e);
      alert('Failed to delete poem');
    }
  };

  if (status === 'loading' || status === 'unauthenticated') {
    return (
      <div className="min-h-[50vh] flex items-center justify-center font-serif text-[#dfa84a]">
        <span className="text-sm italic">Authenticating Scribe Sanctuary...</span>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 font-serif space-y-8">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#dfa84a]/25 pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-amber-400">❧</span>
            <span className="text-xs uppercase tracking-widest text-[#dfa84a] font-bold">
              Grand Scribe Administration
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold gold-foil-text">
            Anthology Sanctuary
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#231710] border border-[#dfa84a]/30 text-xs font-serif font-bold text-[#f9e29d] hover:bg-[#342217] transition-all shadow-md"
          >
            <FaArrowLeft />
            <span>Public Library</span>
          </Link>

          <button
            onClick={() => signOut({ callbackUrl: '/' })}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#881337]/50 hover:bg-[#881337] border border-rose-500/40 text-xs font-serif font-bold text-rose-200 transition-all shadow-md"
          >
            <FaRightFromBracket />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Quick Library Statistics Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="parchment-panel rounded-2xl p-4 text-center border border-[#dfa84a]/30 space-y-1">
          <div className="text-2xl font-serif font-bold text-[#f9e29d]">
            {poems.filter((p) => p.type !== 'quote').length}
          </div>
          <div className="text-[11px] uppercase tracking-wider text-[#dfa84a] font-serif font-semibold">
            Inscribed Poems
          </div>
        </div>

        <div className="parchment-panel rounded-2xl p-4 text-center border border-[#dfa84a]/30 space-y-1">
          <div className="text-2xl font-serif font-bold text-[#f9e29d]">
            {poems.filter((p) => p.type === 'quote').length}
          </div>
          <div className="text-[11px] uppercase tracking-wider text-[#dfa84a] font-serif font-semibold">
            Timeless Quotes
          </div>
        </div>

        <div className="parchment-panel rounded-2xl p-4 text-center border border-rose-500/30 bg-[#1e0e0e]/60 space-y-1">
          <div className="text-2xl font-serif font-bold text-rose-300 flex items-center justify-center gap-1.5">
            <FaHeart className="text-rose-500 text-lg" />
            <span>{poems.reduce((acc, curr) => acc + (curr.likes || 0), 0)}</span>
          </div>
          <div className="text-[11px] uppercase tracking-wider text-rose-300 font-serif font-semibold">
            Total Wax Seals / Likes
          </div>
        </div>

        <div className="parchment-panel rounded-2xl p-4 text-center border border-[#dfa84a]/30 space-y-1">
          <div className="text-2xl font-serif font-bold text-[#f9e29d]">
            {feedbacks.length}
          </div>
          <div className="text-[11px] uppercase tracking-wider text-[#dfa84a] font-serif font-semibold">
            Reader Reflections
          </div>
        </div>
      </div>

      {/* Main Tabs Container */}
      <div className="parchment-panel rounded-3xl overflow-hidden border-2 border-[#dfa84a]/40 shadow-2xl">
        
        {/* Navigation Tabs */}
        <div className="flex flex-wrap border-b border-[#dfa84a]/25 bg-[#120b08]">
          <button
            className={`flex-1 min-w-[140px] px-6 py-4 font-serif font-bold text-sm transition-all flex items-center justify-center gap-2 ${
              activeTab === 'poems'
                ? 'bg-gradient-to-r from-[#f9e29d] via-[#dfa84a] to-[#c9933b] text-[#1a1007] shadow-inner'
                : 'text-[#d4c5a3] hover:text-[#f9e29d] hover:bg-[#231710]'
            }`}
            onClick={() => setActiveTab('poems')}
          >
            <FaBookOpen size={14} />
            <span>Inscribe & Curate Verses</span>
          </button>

          <button
            className={`flex-1 min-w-[140px] px-6 py-4 font-serif font-bold text-sm transition-all flex items-center justify-center gap-2 ${
              activeTab === 'feedback'
                ? 'bg-gradient-to-r from-[#f9e29d] via-[#dfa84a] to-[#c9933b] text-[#1a1007] shadow-inner'
                : 'text-[#d4c5a3] hover:text-[#f9e29d] hover:bg-[#231710]'
            }`}
            onClick={() => setActiveTab('feedback')}
          >
            <FaComments size={14} />
            <span>Reader Reflections ({feedbacks.length})</span>
          </button>
        </div>

        {/* Tab Body */}
        <div className="p-5 sm:p-8 space-y-10">
          
          {/* TAB 1: MANAGE POEMS */}
          {activeTab === 'poems' && (
            <div className="space-y-10">
              
              {/* Form: Inscribe New Verse */}
              <div className="bg-[#120b08] rounded-2xl p-6 sm:p-8 border border-[#dfa84a]/30 shadow-xl space-y-6">
                <div className="flex items-center gap-2 border-b border-[#dfa84a]/20 pb-3">
                  <FaFeatherPointed className="text-[#dfa84a]" />
                  <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#f9e29d]">
                    Inscribe New Folio or Quote
                  </h2>
                </div>

                <form onSubmit={handlePoemSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label
                        htmlFor="type"
                        className="block text-xs font-serif font-bold text-[#dfa84a] uppercase tracking-wider mb-1.5"
                      >
                        Manuscript Type
                      </label>
                      <select
                        id="type"
                        name="type"
                        value={newPoem.type}
                        onChange={(e) =>
                          setNewPoem((prev) => ({
                            ...prev,
                            type: e.target.value as 'poem' | 'quote',
                            title: '',
                          }))
                        }
                        className="w-full px-3.5 py-2.5 bg-[#1a1007] text-sm text-[#f7eedb] rounded-xl border border-[#dfa84a]/30 focus:border-[#dfa84a] focus:outline-none transition-all font-serif"
                      >
                        <option value="poem">📜 Poem (Full Verses & Title)</option>
                        <option value="quote">✒️ Quote of Wisdom</option>
                      </select>
                    </div>

                    <div>
                      <label
                        htmlFor="author"
                        className="block text-xs font-serif font-bold text-[#dfa84a] uppercase tracking-wider mb-1.5"
                      >
                        Author / Scribe Signature
                      </label>
                      <input
                        type="text"
                        id="author"
                        name="author"
                        value={newPoem.author}
                        onChange={handlePoemChange}
                        placeholder="e.g. Vivek R"
                        className="w-full px-3.5 py-2.5 bg-[#1a1007] text-sm text-[#f7eedb] placeholder-[#786a58] rounded-xl border border-[#dfa84a]/30 focus:border-[#dfa84a] focus:outline-none transition-all font-serif"
                      >
                      </input>
                    </div>
                  </div>

                  {newPoem.type === 'poem' && (
                    <div>
                      <label
                        htmlFor="title"
                        className="block text-xs font-serif font-bold text-[#dfa84a] uppercase tracking-wider mb-1.5"
                      >
                        Manuscript Title *
                      </label>
                      <input
                        type="text"
                        id="title"
                        name="title"
                        value={newPoem.title}
                        onChange={handlePoemChange}
                        required
                        placeholder="e.g. Ode to the Midnight Starlight"
                        className="w-full px-3.5 py-2.5 bg-[#1a1007] text-sm text-[#f7eedb] placeholder-[#786a58] rounded-xl border border-[#dfa84a]/30 focus:border-[#dfa84a] focus:outline-none transition-all font-serif"
                      />
                    </div>
                  )}

                  <div>
                    <label
                      htmlFor="content"
                      className="block text-xs font-serif font-bold text-[#dfa84a] uppercase tracking-wider mb-1.5"
                    >
                      Verses & Content (Use blank line between stanzas) *
                    </label>
                    <textarea
                      id="content"
                      name="content"
                      rows={6}
                      value={newPoem.content}
                      onChange={handlePoemChange}
                      required
                      placeholder={
                        newPoem.type === 'quote'
                          ? 'Inscribe your timeless quote here...'
                          : 'Inscribe the first stanza...\n\nInscribe the second stanza...'
                      }
                      className="w-full px-3.5 py-2.5 bg-[#1a1007] text-sm text-[#f7eedb] placeholder-[#786a58] rounded-xl border border-[#dfa84a]/30 focus:border-[#dfa84a] focus:outline-none transition-all font-serif"
                    />
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
                    <button
                      type="submit"
                      disabled={isSubmitting || (!newPoem.title && newPoem.type === 'poem') || !newPoem.content}
                      className="px-7 py-3 rounded-xl font-serif font-bold text-sm uppercase tracking-wider text-[#1a1007] bg-gradient-to-r from-[#f9e29d] via-[#dfa84a] to-[#c9933b] hover:from-[#fff2b2] hover:to-[#dfa84a] shadow-lg active:scale-95 disabled:opacity-50 transition-all flex items-center gap-2 border border-[#fff2b2]"
                    >
                      <FaFeatherPointed />
                      <span>{isSubmitting ? 'Inscribing...' : newPoem.type === 'quote' ? 'Add Quote' : 'Inscribe Poem'}</span>
                    </button>

                    {submitStatus === 'success' && (
                      <p className="text-emerald-400 font-serif font-semibold text-sm flex items-center gap-1.5">
                        <FaCheck /> Manuscript permanently inscribed in library!
                      </p>
                    )}

                    {submitStatus === 'error' && (
                      <p className="text-rose-400 font-serif font-semibold text-sm">
                        Failed to inscribe manuscript. Please try again.
                      </p>
                    )}
                  </div>
                </form>
              </div>

              {/* List of Existing Manuscripts */}
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-[#dfa84a]/20 pb-3">
                  <h3 className="text-xl sm:text-2xl font-serif font-bold text-[#f9e29d]">
                    Inscribed Manuscripts Archive ({poems.length})
                  </h3>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  {poems.map((poem: any) => (
                    <div
                      key={poem._id}
                      className="bg-[#120b08] rounded-2xl p-5 sm:p-6 border border-[#dfa84a]/25 hover:border-[#dfa84a]/50 transition-all space-y-3"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#2a1b12] text-[#dfa84a] border border-[#dfa84a]/30">
                            {poem.type === 'quote' ? 'Quote' : 'Poem'}
                          </span>
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#881337]/30 text-rose-300 border border-rose-500/30">
                            <FaHeart size={9} className="text-rose-400" />
                            <span>{poem.likes || 0} {poem.likes === 1 ? 'Like' : 'Likes'}</span>
                          </span>
                          <h4 className="text-lg font-serif font-bold text-[#f9e29d]">
                            {poem.title || 'Untitled Quote'}
                          </h4>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => startEditPoem(poem)}
                            className="p-2 rounded-xl bg-[#231710] hover:bg-[#342217] text-[#dfa84a] hover:text-[#f9e29d] border border-[#dfa84a]/25 text-xs font-serif font-bold transition-all flex items-center gap-1.5"
                          >
                            <FaPenToSquare size={12} />
                            <span>Edit</span>
                          </button>

                          <button
                            onClick={() => deletePoem(poem._id)}
                            className="p-2 rounded-xl bg-[#881337]/40 hover:bg-[#881337] text-rose-300 border border-rose-500/30 text-xs font-serif font-bold transition-all flex items-center gap-1.5"
                          >
                            <FaTrash size={12} />
                            <span>Delete</span>
                          </button>
                        </div>
                      </div>

                      <p className="text-sm text-[#b8a690] line-clamp-2 italic font-serif">
                        "{poem.content}"
                      </p>

                      <div className="text-xs text-[#786a58] flex items-center justify-between pt-2 border-t border-[#dfa84a]/15">
                        <span>By {poem.author || 'Vivek R'}</span>
                        <div className="flex items-center gap-2.5">
                          <span className="text-rose-300/90 font-serif flex items-center gap-1 font-semibold">
                            <FaHeart size={10} className="text-rose-500" />
                            <span>{poem.likes || 0}</span>
                          </span>
                          <span>•</span>
                          <span>{new Date(poem.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: READER REFLECTIONS */}
          {activeTab === 'feedback' && (
            <div className="space-y-6">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#dfa84a]/20 pb-4">
                <div>
                  <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#f9e29d]">
                    Reader Reflections & Dispatches
                  </h2>
                  <p className="text-xs sm:text-sm text-[#b8a690] font-serif italic">
                    Critiques and soul reflections penned by visitors.
                  </p>
                </div>

                {/* Filter by Poem */}
                <select
                  value={selectedPoemId || ''}
                  onChange={(e) => setSelectedPoemId(e.target.value || null)}
                  className="px-3.5 py-2 bg-[#120b08] text-xs font-serif text-[#f7eedb] rounded-xl border border-[#dfa84a]/30 focus:outline-none"
                >
                  <option value="">All Folios & Quotes</option>
                  {poems.map((p) => (
                    <option key={p._id} value={p._id}>
                      {p.title || p.content.substring(0, 30)}...
                    </option>
                  ))}
                </select>
              </div>

              {feedbacks.length > 0 ? (
                <div className="grid grid-cols-1 gap-4">
                  {feedbacks.map((fb: any) => (
                    <div
                      key={fb._id}
                      className="bg-[#120b08] rounded-2xl p-5 sm:p-6 border border-[#dfa84a]/25 space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-serif font-bold text-sm text-[#f9e29d]">
                            {fb.anonymous ? 'Anonymous Bard' : fb.name || 'Anonymous Reader'}
                          </span>
                          {fb.email && (
                            <span className="text-xs text-[#dfa84a] opacity-80">
                              • {fb.email}
                            </span>
                          )}
                        </div>

                        <button
                          onClick={() => handleDeleteFeedback(fb._id)}
                          disabled={isDeletingFeedback}
                          className="p-1.5 rounded-lg bg-[#881337]/40 hover:bg-[#881337] text-rose-300 border border-rose-500/30 text-xs transition-all"
                          title="Discard reflection"
                        >
                          <FaTrash size={12} />
                        </button>
                      </div>

                      <p className="text-sm font-serif text-[#f7eedb] leading-relaxed italic bg-[#1a1007] p-3 rounded-xl border border-[#dfa84a]/15">
                        "{fb.message}"
                      </p>

                      <div className="text-[11px] text-[#786a58] flex items-center justify-between">
                        <span>
                          Folio: {typeof fb.poemId === 'object' && fb.poemId !== null
                            ? (fb.poemId.title || (fb.poemId.content ? `"${fb.poemId.content.substring(0, 20)}..."` : 'Manuscript'))
                            : (fb.poemId || 'General')}
                        </span>
                        <span>{new Date(fb.createdAt).toLocaleString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 text-[#b8a690] italic font-serif">
                  ❧ No reader reflections received in this folio yet. ❧
                </div>
              )}

            </div>
          )}

        </div>
      </div>

      {/* Edit Manuscript Modal */}
      {editingPoemId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-2xl bg-[#160e0a] rounded-3xl p-6 sm:p-8 border-2 border-[#dfa84a]/40 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-[#dfa84a]/25 pb-3">
              <h3 className="text-xl font-serif font-bold text-[#f9e29d]">
                Edit Inscribed Manuscript
              </h3>
              <button
                onClick={cancelEditPoem}
                className="p-2 rounded-full text-[#b8a690] hover:text-[#f9e29d] bg-[#231710] transition-all"
              >
                <FaXmark size={15} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-serif font-bold text-[#dfa84a] uppercase tracking-wider mb-1">
                  Title
                </label>
                <input
                  type="text"
                  value={editingDraft.title}
                  onChange={(e) => setEditingDraft({ ...editingDraft, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-[#120b08] text-sm font-serif text-[#f7eedb] rounded-xl border border-[#dfa84a]/30 focus:border-[#dfa84a] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-serif font-bold text-[#dfa84a] uppercase tracking-wider mb-1">
                  Author Signature
                </label>
                <input
                  type="text"
                  value={editingDraft.author || ''}
                  onChange={(e) => setEditingDraft({ ...editingDraft, author: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-[#120b08] text-sm font-serif text-[#f7eedb] rounded-xl border border-[#dfa84a]/30 focus:border-[#dfa84a] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-serif font-bold text-[#dfa84a] uppercase tracking-wider mb-1">
                  Verses & Content
                </label>
                <textarea
                  rows={6}
                  value={editingDraft.content}
                  onChange={(e) => setEditingDraft({ ...editingDraft, content: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-[#120b08] text-sm font-serif text-[#f7eedb] rounded-xl border border-[#dfa84a]/30 focus:border-[#dfa84a] focus:outline-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#dfa84a]/20">
              <button
                onClick={cancelEditPoem}
                className="px-4 py-2 rounded-xl bg-[#231710] text-[#b8a690] text-xs font-serif font-bold hover:bg-[#342217]"
              >
                Cancel
              </button>
              <button
                onClick={saveEditPoem}
                className="px-6 py-2 rounded-xl bg-gradient-to-r from-[#f9e29d] via-[#dfa84a] to-[#c9933b] text-[#1a1007] text-xs font-serif font-bold shadow-md hover:from-[#fff2b2]"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}