'use client';

import { useState } from 'react';

interface FeedbackFormProps {
  poemId: string;
}

export default function FeedbackForm({ poemId }: FeedbackFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
    anonymous: false
  });
  
  const [status, setStatus] = useState({
    submitting: false,
    submitted: false,
    error: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, anonymous: e.target.checked }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.message.trim()) {
      setStatus({ ...status, error: 'Message is required' });
      return;
    }
    
    setStatus({ submitting: true, submitted: false, error: '' });
    
    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          poemId
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to submit feedback');
      }
      
      setStatus({ submitting: false, submitted: true, error: '' });
      setFormData({
        name: '',
        email: '',
        phone: '',
        message: '',
        anonymous: false
      });
      
      // Reset form submission status after 5 seconds
      setTimeout(() => {
        setStatus(prev => ({ ...prev, submitted: false }));
      }, 5000);
      
    } catch (error) {
      setStatus({ 
        submitting: false, 
        submitted: false, 
        error: 'Failed to submit feedback. Please try again.' 
      });
    }
  };

  return (
    <div className="mt-8 bg-gray-50 dark:bg-gray-800 p-6 rounded-lg animate-fade-in">
      <h3 className="text-xl font-semibold mb-4">Share Your Thoughts</h3>
      
      {status.submitted ? (
        <div className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100 p-4 rounded-md mb-4 animate-fade-in">
          Thank you for your feedback!
        </div>
      ) : null}
      
      {status.error ? (
        <div className="bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-100 p-4 rounded-md mb-4 animate-fade-in">
          {status.error}
        </div>
      ) : null}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4 animate-slide-in" style={{ animationDelay: '0.1s' }}>
          <label htmlFor="name" className="block text-sm font-medium mb-1">
            Name (optional)
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 transition-all duration-300"
            disabled={status.submitting}
          />
        </div>
        
        <div className="mb-4 animate-slide-in" style={{ animationDelay: '0.2s' }}>
          <label htmlFor="email" className="block text-sm font-medium mb-1">
            Email (optional)
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 transition-all duration-300"
            disabled={status.submitting}
          />
        </div>
        
        <div className="mb-4 animate-slide-in" style={{ animationDelay: '0.3s' }}>
          <label htmlFor="phone" className="block text-sm font-medium mb-1">
            Phone (optional)
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 transition-all duration-300"
            disabled={status.submitting}
          />
        </div>
        
        <div className="mb-4 animate-slide-in" style={{ animationDelay: '0.4s' }}>
          <label htmlFor="message" className="block text-sm font-medium mb-1">
            Message *
          </label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 transition-all duration-300"
            required
            disabled={status.submitting}
          />
        </div>
        
        <div className="mb-6 flex items-center animate-slide-in" style={{ animationDelay: '0.5s' }}>
          <input
            type="checkbox"
            id="anonymous"
            name="anonymous"
            checked={formData.anonymous}
            onChange={handleCheckboxChange}
            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded transition-all duration-300"
            disabled={status.submitting}
          />
          <label htmlFor="anonymous" className="ml-2 block text-sm">
            Submit anonymously
          </label>
        </div>
        
        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-300 disabled:opacity-50 animate-slide-in hover-lift"
          style={{ animationDelay: '0.6s' }}
          disabled={status.submitting}
        >
          {status.submitting ? 'Submitting...' : 'Submit Feedback'}
        </button>
      </form>
    </div>
  );
}