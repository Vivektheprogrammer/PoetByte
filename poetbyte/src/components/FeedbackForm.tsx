import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaFeatherPointed, FaCircleExclamation, FaCheck } from 'react-icons/fa6';

interface FeedbackFormProps {
  poemId: string;
}

export default function FeedbackForm({ poemId }: FeedbackFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
    anonymous: false,
  });

  const [status, setStatus] = useState({
    submitting: false,
    submitted: false,
    error: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.message.trim()) {
      setStatus({ submitting: false, submitted: false, error: 'Please inscribe a message before submitting.' });
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
          poemId,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to dispatch feedback');
      }

      setStatus({ submitting: false, submitted: true, error: '' });
      setFormData({
        name: '',
        email: '',
        phone: '',
        message: '',
        anonymous: false,
      });
    } catch (error) {
      setStatus({
        submitting: false,
        submitted: false,
        error: 'Could not deliver reflection. Please try again later.',
      });
    }
  };

  return (
    <div className="space-y-4 font-serif">
      {status.submitted ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-[#180f0a] border border-[#dfa84a]/40 rounded-2xl p-6 text-center space-y-4 shadow-[0_10px_30px_rgba(0,0,0,0.6),0_0_20px_rgba(223,168,74,0.1)] relative overflow-hidden"
        >
          {/* Subtle gold filigree accent */}
          <div className="absolute top-2 left-3 text-[#dfa84a] text-xs opacity-50">❧</div>
          <div className="absolute top-2 right-3 text-[#dfa84a] text-xs opacity-50">❧</div>

          {/* Sealed Wax Stamp Badge */}
          <div className="mx-auto w-12 h-12 rounded-full bg-gradient-to-br from-[#991b1b] via-[#be123c] to-[#7f1d1d] flex items-center justify-center border border-[#dfa84a]/80 shadow-[0_4px_15px_rgba(153,27,27,0.7)] animate-wax-stamp">
            <FaFeatherPointed className="text-[#f9e29d] text-base drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]" />
          </div>

          <div className="space-y-1.5">
            <h4 className="text-lg font-serif font-bold text-[#f9e29d]">
              Reflection Sealed & Dispatched
            </h4>
            <p className="text-xs sm:text-sm font-serif italic text-[#b8a690] max-w-md mx-auto">
              Your words have been transcribed and delivered to the author. Thank you for gracing the anthology with your thoughts.
            </p>
          </div>

          <div className="pt-2">
            <button
              type="button"
              onClick={() => setStatus({ submitting: false, submitted: false, error: '' })}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#281810] hover:bg-[#382318] text-[#dfa84a] hover:text-[#f9e29d] border border-[#dfa84a]/30 text-xs font-serif font-semibold transition-all shadow-md active:scale-95"
            >
              <span>✦</span>
              <span>Inscribe Another Reflection</span>
            </button>
          </div>
        </motion.div>
      ) : (
        <>
          {status.error ? (
            <div className="flex items-center gap-2.5 bg-[#2c1014] border border-[#be123c]/50 text-[#fecdd3] p-3.5 rounded-xl text-xs sm:text-sm font-serif shadow-lg">
              <FaCircleExclamation className="text-[#fb7185] flex-shrink-0" size={15} />
              <span>{status.error}</span>
            </div>
          ) : null}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="name" className="block text-xs font-serif font-bold text-[#dfa84a] uppercase tracking-wider mb-1.5">
              Your Name (optional)
            </label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder={formData.anonymous ? "Anonymous Scribe" : "e.g. A Fellow Bard"}
              value={formData.anonymous ? "" : formData.name}
              onChange={handleChange}
              disabled={status.submitting}
              readOnly={formData.anonymous}
              className="w-full px-3.5 py-2.5 bg-[#1a1007] text-sm text-[#f7eedb] placeholder-[#786a58] rounded-xl border border-[#dfa84a]/30 focus:border-[#dfa84a] focus:outline-none focus:ring-1 focus:ring-[#dfa84a]/40 disabled:opacity-40 read-only:opacity-40 read-only:cursor-not-allowed transition-all font-serif"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-xs font-serif font-bold text-[#dfa84a] uppercase tracking-wider mb-1.5">
              Correspondence Email (optional)
            </label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder={formData.anonymous ? "Hidden for privacy" : "bard@sanctuary.com"}
              value={formData.anonymous ? "" : formData.email}
              onChange={handleChange}
              disabled={status.submitting}
              readOnly={formData.anonymous}
              className="w-full px-3.5 py-2.5 bg-[#1a1007] text-sm text-[#f7eedb] placeholder-[#786a58] rounded-xl border border-[#dfa84a]/30 focus:border-[#dfa84a] focus:outline-none focus:ring-1 focus:ring-[#dfa84a]/40 disabled:opacity-40 read-only:opacity-40 read-only:cursor-not-allowed transition-all font-serif"
            />
          </div>
        </div>

        <div>
          <label htmlFor="message" className="block text-xs font-serif font-bold text-[#dfa84a] uppercase tracking-wider mb-1.5">
            Your Inscribed Reflection / Critique *
          </label>
          <textarea
            id="message"
            name="message"
            placeholder="Inscribe how these stanzas resonated with your soul..."
            rows={3}
            value={formData.message}
            onChange={handleChange}
            required
            disabled={status.submitting}
            className="w-full px-3.5 py-2.5 bg-[#1a1007] text-sm text-[#f7eedb] placeholder-[#786a58] rounded-xl border border-[#dfa84a]/30 focus:border-[#dfa84a] focus:outline-none focus:ring-1 focus:ring-[#dfa84a]/40 disabled:opacity-40 transition-all font-serif"
          />
        </div>

        <div className="flex items-center justify-between pt-1">
          <button
            type="button"
            role="checkbox"
            aria-checked={formData.anonymous}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setFormData((prev) => ({ ...prev, anonymous: !prev.anonymous }));
            }}
            className="group flex items-center gap-2.5 select-none text-xs font-serif text-[#b8a690] hover:text-[#f9e29d] transition-colors focus:outline-none"
          >
            <div
              className={`w-4 h-4 rounded-md flex items-center justify-center transition-all duration-200 border ${
                formData.anonymous
                  ? 'bg-gradient-to-br from-[#991b1b] to-[#be123c] border-[#dfa84a] shadow-[0_0_8px_rgba(223,168,74,0.4)]'
                  : 'bg-[#1a1007] border-[#dfa84a]/40 group-hover:border-[#dfa84a] shadow-inner'
              }`}
            >
              {formData.anonymous && <FaCheck className="text-[#f9e29d] text-[10px]" />}
            </div>
            <span className="font-medium tracking-wide">Dispatch Anonymously</span>
          </button>

          <button
            type="submit"
            disabled={status.submitting}
            className="px-6 py-2.5 rounded-xl font-serif font-bold text-xs uppercase tracking-wider text-[#1a1007] bg-gradient-to-r from-[#f9e29d] via-[#dfa84a] to-[#c9933b] hover:from-[#fff2b2] hover:to-[#dfa84a] shadow-lg active:scale-95 disabled:opacity-50 transition-all flex items-center gap-2 border border-[#fff2b2]"
          >
            <FaFeatherPointed size={12} />
            <span>{status.submitting ? 'Inscribing...' : 'Dispatch Letter'}</span>
          </button>
        </div>
      </form>
      </>
      )}
    </div>
  );
}