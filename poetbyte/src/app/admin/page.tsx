'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'poems' | 'feedback'>('poems');
  const [poems, setPoems] = useState<any[]>([]);
  const [feedbacks, setFeedbacks] = useState<any[]>([]);
  const [selectedPoemId, setSelectedPoemId] = useState<string | null>(null);
  const [newPoem, setNewPoem] = useState({ title: '', content: '', author: '' });
  const [editingPoemId, setEditingPoemId] = useState<string | null>(null);
  const [editingDraft, setEditingDraft] = useState<{ title: string; content: string; author?: string }>({ title: '', content: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [isDeletingFeedback, setIsDeletingFeedback] = useState(false);

  // Redirect if not authenticated
  useEffect(() => {
    if (status === 'unauthenticated' || status === 'loading') {
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
    if (!confirm('Are you sure you want to delete this feedback?')) {
      return;
    }
    
    setIsDeletingFeedback(true);
    
    try {
      const response = await fetch(`/api/admin/feedbacks/${feedbackId}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        // Remove the deleted feedback from the state
        setFeedbacks(prev => prev.filter(feedback => feedback._id !== feedbackId));
      } else {
        alert('Failed to delete feedback');
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
    setNewPoem(prev => ({ ...prev, [name]: value }));
  };

  const handlePoemSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newPoem.title || !newPoem.content) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/poems', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newPoem),
      });
      
      if (response.ok) {
        setSubmitStatus('success');
        const createdPoem = await response.json();
        setPoems((prev: any[]) => [createdPoem, ...prev]);
        setNewPoem({ title: '', content: '', author: '' });
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
      
      // Reset status after 3 seconds
      setTimeout(() => {
        setSubmitStatus('idle');
      }, 3000);
    }
  };

  const startEditPoem = (poem: any) => {
    setEditingPoemId(poem._id);
    setEditingDraft({ title: poem.title, content: poem.content, author: poem.author || '' });
  };

  const cancelEditPoem = () => {
    setEditingPoemId(null);
    setEditingDraft({ title: '', content: '', author: '' });
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
    if (!confirm('Delete this poem?')) return;
    try {
      const res = await fetch(`/api/poems/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete');
      setPoems(prev => prev.filter((p: any) => p._id !== id));
      if (selectedPoemId === id) setSelectedPoemId(null);
    } catch (e) {
      console.error(e);
      alert('Failed to delete poem');
    }
  };

  if (status === 'loading' || status === 'unauthenticated') {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-gray-700">Admin Dashboard</h1>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
        <div className="flex border-b">
          <button
            className={`px-4 py-3 font-medium ${activeTab === 'poems' ? 'bg-indigo-600 text-white' : 'text-gray-700 hover:bg-gray-100'}`}
            onClick={() => setActiveTab('poems')}
          >
            Manage Poems
          </button>
          <button
            className={`px-4 py-3 font-medium ${activeTab === 'feedback' ? 'bg-indigo-600 text-white' : 'text-gray-700 hover:bg-gray-100'}`}
            onClick={() => setActiveTab('feedback')}
          >
            View Feedback
          </button>
        </div>
        
        <div className="p-6">
          {activeTab === 'poems' && (
            <div>
              <h2 className="text-xl font-semibold mb-4 text-gray-700">Add New Poem</h2>
              <form onSubmit={handlePoemSubmit} className="space-y-4 mb-8">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={newPoem.title}
                    onChange={handlePoemChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-800"
                  />
                </div>
                
                <div>
                  <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
                    Content
                  </label>
                  <textarea
                    id="content"
                    name="content"
                    rows={6}
                    value={newPoem.content}
                    onChange={handlePoemChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-800"
                  />
                </div>

                <div>
                  <label htmlFor="author" className="block text-sm font-medium text-gray-700 mb-1">
                    Author
                  </label>
                  <input
                    type="text"
                    id="author"
                    name="author"
                    value={newPoem.author}
                    onChange={handlePoemChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-800"
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Button
                    type="submit"
                    disabled={isSubmitting || !newPoem.title || !newPoem.content}
                  >
                    {isSubmitting ? 'Adding...' : 'Add Poem'}
                  </Button>
                  
                  {submitStatus === 'success' && (
                    <p className="text-green-600 animate-fade-in">Poem added successfully!</p>
                  )}
                  
                  {submitStatus === 'error' && (
                    <p className="text-red-600 animate-fade-in">Failed to add poem. Please try again.</p>
                  )}
                </div>
              </form>
              
              <h2 className="text-xl font-semibold mb-4 text-gray-700">Existing Poems</h2>
              {poems.length > 0 ? (
                <div className="space-y-4">
                  {poems.map((poem: any) => (
                    <div key={poem._id} className="border rounded-md p-4 hover:bg-gray-50">
                      {editingPoemId === poem._id ? (
                        <div className="space-y-3">
                          <input
                            type="text"
                            value={editingDraft.title}
                            onChange={(e) => setEditingDraft(d => ({ ...d, title: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-700"
                          />
                          <textarea
                            rows={4}
                            value={editingDraft.content}
                            onChange={(e) => setEditingDraft(d => ({ ...d, content: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-700"
                          />
                          <input
                            type="text"
                            placeholder="Author"
                            value={editingDraft.author || ''}
                            onChange={(e) => setEditingDraft(d => ({ ...d, author: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-700"
                          />
                          <div className="flex gap-2">
                            <Button onClick={saveEditPoem}>Save</Button>
                            <Button variant="secondary" onClick={cancelEditPoem}>Cancel</Button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <h3 className="text-lg font-medium text-gray-800">{poem.title}</h3>
                  <p className="text-gray-600 mt-1 line-clamp-2">{poem.content}</p>
                  {poem.author && (
                    <div className="mt-1 text-sm text-indigo-600">By {poem.author}</div>
                  )}
                          <div className="mt-2 text-sm text-gray-500">
                            Posted on {new Date(poem.createdAt).toLocaleDateString()}
                          </div>
                          <div className="mt-3 flex gap-2">
                            <Button variant="outline" onClick={() => startEditPoem(poem)}>Edit</Button>
                            <Button variant="secondary" onClick={() => deletePoem(poem._id)}>Delete</Button>
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No poems available yet.</p>
              )}
            </div>
          )}
          
          {activeTab === 'feedback' && (
            <div>
              <div className="mb-6">
                <label htmlFor="poemFilter" className="block text-sm font-medium text-gray-700 mb-1">
                  Filter by Poem
                </label>
                <select
                  id="poemFilter"
                  value={selectedPoemId || ''}
                  onChange={(e) => setSelectedPoemId(e.target.value || null)}
                  className="w-full md:w-1/2 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">All Poems</option>
                  {poems.map((poem: any) => (
                    <option key={poem._id} value={poem._id}>
                      {poem.title}
                    </option>
                  ))}
                </select>
              </div>
              
              {feedbacks.length > 0 ? (
                <div className="space-y-4">
                  {feedbacks.map((feedback: any) => (
                    <div key={feedback._id} className="border rounded-md p-4 hover:bg-gray-50">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-lg font-medium text-gray-800">
                            {feedback.anonymous ? 'Anonymous' : feedback.name || 'Unnamed'}
                          </h3>
                          {!feedback.anonymous && feedback.email && (
                            <p className="text-gray-600 text-sm">{feedback.email}</p>
                          )}
                          {!feedback.anonymous && feedback.phone && (
                            <p className="text-gray-600 text-sm">{feedback.phone}</p>
                          )}
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="text-sm text-gray-500">
                            {new Date(feedback.createdAt).toLocaleDateString()}
                          </div>
                          <button
                            onClick={() => handleDeleteFeedback(feedback._id)}
                            disabled={isDeletingFeedback}
                            className="text-red-600 hover:text-red-800 text-sm font-medium"
                            title="Delete feedback"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                      <p className="mt-3 text-gray-700">{feedback.message}</p>
                      <div className="mt-2 text-sm text-indigo-600">
                        For: {typeof feedback.poemId === 'object' && feedback.poemId ? feedback.poemId.title : 'Unknown Poem'}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No feedback available yet.</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}