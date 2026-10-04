'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FaFeatherPointed, FaLock, FaUser, FaArrowLeft, FaShieldHalved } from 'react-icons/fa6';

export default function LoginPage() {
  const [credentials, setCredentials] = useState({
    username: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const result = await signIn('credentials', {
        username: credentials.username,
        password: credentials.password,
        redirect: false,
      });

      if (result?.error) {
        setError('Invalid Scribe Credentials. Access denied.');
      } else {
        router.push('/admin');
        router.refresh();
      }
    } catch (error) {
      setError('An error occurred while entering the sanctuary.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[75vh] flex flex-col justify-center items-center px-4 py-8 font-serif">
      <div className="w-full max-w-md space-y-6">
        
        {/* Back Link */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#231710] border border-[#dfa84a]/30 text-xs font-serif font-bold text-[#f9e29d] hover:bg-[#342217] transition-all shadow-md group"
        >
          <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" />
          <span>Return to Grimoire Sanctuary</span>
        </Link>

        {/* Login Parchment Panel */}
        <div className="parchment-panel rounded-3xl p-7 sm:p-10 border-2 border-[#dfa84a]/40 shadow-[0_20px_60px_rgba(0,0,0,0.8)] relative overflow-hidden ornate-corners">
          
          {/* Header */}
          <div className="text-center space-y-3 pb-6 border-b border-[#dfa84a]/25">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-tr from-[#991b1b] via-[#be123c] to-[#dfa84a] flex items-center justify-center text-[#fef3c7] text-2xl shadow-lg border border-[#f9e29d]/40">
              <FaShieldHalved />
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold gold-foil-text">
              Scribe Sanctuary Access
            </h1>
            <p className="text-xs sm:text-sm text-[#b8a690] font-serif italic">
              Authenticate your identity to inscribe and curate the anthology.
            </p>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="mt-6 bg-[#881337]/50 border border-rose-500/40 text-rose-200 px-4 py-3 rounded-xl text-xs sm:text-sm font-serif shadow-md animate-fade-in">
              {error}
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="mt-6 space-y-5">
            <div>
              <label
                htmlFor="username"
                className="block text-xs font-serif font-bold text-[#dfa84a] uppercase tracking-wider mb-1.5"
              >
                Scribe Username
              </label>
              <div className="relative">
                <FaUser className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#dfa84a] text-xs" />
                <input
                  type="text"
                  id="username"
                  name="username"
                  placeholder="Enter username..."
                  value={credentials.username}
                  onChange={handleChange}
                  required
                  className="w-full pl-9 pr-4 py-2.5 bg-[#120b08] text-sm font-serif text-[#f7eedb] placeholder-[#786a58] rounded-xl border border-[#dfa84a]/30 focus:border-[#dfa84a] focus:outline-none focus:ring-1 focus:ring-[#dfa84a]/40 transition-all"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-xs font-serif font-bold text-[#dfa84a] uppercase tracking-wider mb-1.5"
              >
                Wax Seal Passcode
              </label>
              <div className="relative">
                <FaLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#dfa84a] text-xs" />
                <input
                  type="password"
                  id="password"
                  name="password"
                  placeholder="••••••••••••"
                  value={credentials.password}
                  onChange={handleChange}
                  required
                  className="w-full pl-9 pr-4 py-2.5 bg-[#120b08] text-sm font-serif text-[#f7eedb] placeholder-[#786a58] rounded-xl border border-[#dfa84a]/30 focus:border-[#dfa84a] focus:outline-none focus:ring-1 focus:ring-[#dfa84a]/40 transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-6 rounded-xl font-serif font-bold text-sm uppercase tracking-wider text-[#1a1007] bg-gradient-to-r from-[#f9e29d] via-[#dfa84a] to-[#c9933b] hover:from-[#fff2b2] hover:to-[#dfa84a] shadow-[0_0_20px_rgba(223,168,74,0.3)] active:scale-95 disabled:opacity-50 transition-all flex items-center justify-center gap-2 border border-[#fff2b2]"
            >
              <FaFeatherPointed size={14} />
              <span>{isLoading ? 'Unlocking Sanctuary...' : 'Enter Sanctuary'}</span>
            </button>
          </form>

        </div>
      </div>
    </div>
  );
}