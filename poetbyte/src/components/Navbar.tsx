'use client';

import Link from 'next/link';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaFeatherPointed,
  FaGithub,
  FaLinkedin,
  FaEnvelope,
  FaDiscord,
  FaBars,
  FaXmark,
  FaBookOpen,
  FaLock,
  FaHouse,
} from 'react-icons/fa6';

export default function Navbar() {
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 px-4 py-3 sm:py-4">
      <div className="container mx-auto max-w-6xl">
        <div className="parchment-panel rounded-2xl px-5 py-3 flex items-center justify-between shadow-2xl border border-[#dfa84a]/30">
          
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#991b1b] via-[#be123c] to-[#dfa84a] flex items-center justify-center text-[#fef3c7] shadow-[0_0_15px_rgba(223,168,74,0.3)] group-hover:scale-105 group-hover:shadow-[0_0_25px_rgba(223,168,74,0.6)] transition-all duration-300 border border-[#f9e29d]/40">
              <FaFeatherPointed className="group-hover:rotate-12 transition-transform duration-300" size={17} />
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-serif font-black tracking-tight text-[#f9e29d] flex items-center gap-1.5">
                Poet<span className="gold-foil-text">Byte</span>
                <span className="text-[#dfa84a] text-xs">❧</span>
              </span>
              <span className="text-[10px] uppercase tracking-[0.25em] text-[#dfa84a] font-serif font-semibold -mt-1">
                Poetry Anthology
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-2 font-serif">
            <Link
              href="/"
              className="px-4 py-2 rounded-xl text-sm font-semibold text-[#b8a690] hover:text-[#f9e29d] hover:bg-[#231710] transition-all flex items-center gap-2"
            >
              <FaHouse size={13} className="text-[#dfa84a]" />
              <span>Sanctuary</span>
            </Link>

            <Link
              href="/admin"
              className="px-4 py-2 rounded-xl text-sm font-semibold text-[#b8a690] hover:text-[#f9e29d] hover:bg-[#231710] transition-all flex items-center gap-2"
            >
              <FaLock size={12} className="text-[#dfa84a]" />
              <span>Scribe Admin</span>
            </Link>

            <button
              onClick={() => setIsAboutOpen(true)}
              className="ml-2 px-5 py-2 rounded-xl text-sm font-serif font-bold text-[#1a1007] bg-gradient-to-r from-[#f9e29d] via-[#dfa84a] to-[#c9933b] shadow-[0_0_15px_rgba(223,168,74,0.3)] hover:shadow-[0_0_20px_rgba(223,168,74,0.5)] active:scale-95 transition-all flex items-center gap-2 border border-[#fff2b2]"
            >
              <FaBookOpen size={13} />
              <span>About The Scribe</span>
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-xl text-[#dfa84a] hover:text-[#f9e29d] bg-[#231710] border border-[#dfa84a]/20 transition-all"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <FaXmark size={18} /> : <FaBars size={18} />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="md:hidden mt-2 p-4 rounded-2xl parchment-panel border border-[#dfa84a]/30 shadow-2xl space-y-2 font-serif"
            >
              <Link
                href="/"
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-[#f7eedb] hover:bg-[#231710] transition-all"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <FaHouse className="text-[#dfa84a]" />
                <span>Sanctuary</span>
              </Link>
              <Link
                href="/admin"
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-[#f7eedb] hover:bg-[#231710] transition-all"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <FaLock className="text-[#dfa84a]" />
                <span>Scribe Admin</span>
              </Link>
              <button
                onClick={() => {
                  setIsAboutOpen(true);
                  setIsMobileMenuOpen(false);
                }}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-serif font-bold text-[#1a1007] bg-gradient-to-r from-[#f9e29d] via-[#dfa84a] to-[#c9933b] shadow-md border border-[#fff2b2]"
              >
                <FaBookOpen />
                <span>About The Scribe</span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* About The Scribe (Vivek R) Modal */}
      <AnimatePresence>
        {isAboutOpen && (
          <div
            className="fixed inset-0 z-[110] flex items-center justify-center p-4"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Escape') setIsAboutOpen(false);
            }}
          >
            <motion.div
              className="absolute inset-0 bg-[#090604]/85 backdrop-blur-md"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAboutOpen(false)}
            />

            <motion.div
              className="relative w-full max-w-md rounded-3xl p-7 sm:p-8 bg-[#160e0a] border-2 border-[#dfa84a]/40 shadow-[0_20px_60px_rgba(0,0,0,0.8),0_0_40px_rgba(223,168,74,0.2)] z-10 space-y-6"
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#991b1b] via-[#be123c] to-[#dfa84a] flex items-center justify-center text-[#fef3c7] text-xl shadow-lg border border-[#f9e29d]/40">
                    <FaFeatherPointed />
                  </div>
                  <div>
                    {/* Clickable link to personal vercel portfolio */}
                    <a
                      href="https://vivekr.vercel.app/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group/author inline-block"
                    >
                      <h2 className="text-2xl font-serif font-bold text-[#f9e29d] group-hover/author:text-[#dfa84a] transition-colors">
                        Vivek R
                      </h2>
                    </a>
                    <p className="text-xs font-serif italic text-[#dfa84a]">Software Engineer & Poet</p>
                  </div>
                </div>

                <button
                  onClick={() => setIsAboutOpen(false)}
                  className="p-2 rounded-full text-[#b8a690] hover:text-[#f9e29d] bg-[#231710] border border-[#dfa84a]/20 transition-all"
                >
                  <FaXmark size={15} />
                </button>
              </div>

              <p className="text-[#b8a690] text-sm font-serif leading-relaxed italic">
                PoetByte is a personal sanctuary celebrating the harmony of poetry, reflections, and modern software craftsmanship. Penned with passion and purpose.
              </p>

              {/* Social links */}
              <div className="pt-2 border-t border-[#dfa84a]/20">
                <p className="text-xs font-serif font-bold uppercase tracking-wider text-[#dfa84a] mb-3">
                  Inscribe & Connect
                </p>
                <div className="grid grid-cols-2 gap-2.5">
                  <a
                    href="https://github.com/Vivektheprogrammer"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-[#231710] hover:bg-[#342217] text-[#f7eedb] text-xs font-serif font-semibold border border-[#dfa84a]/20 hover:border-[#dfa84a] transition-all"
                  >
                    <FaGithub className="text-[#dfa84a] text-base" />
                    <span>GitHub</span>
                  </a>

                  <a
                    href="https://www.linkedin.com/in/vivek-r-626b16217/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-[#231710] hover:bg-[#342217] text-[#f7eedb] text-xs font-serif font-semibold border border-[#dfa84a]/20 hover:border-[#dfa84a] transition-all"
                  >
                    <FaLinkedin className="text-[#dfa84a] text-base" />
                    <span>LinkedIn</span>
                  </a>

                  <a
                    href="mailto:vivekgowda480@gmail.com"
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-[#231710] hover:bg-[#342217] text-[#f7eedb] text-xs font-serif font-semibold border border-[#dfa84a]/20 hover:border-[#dfa84a] transition-all"
                  >
                    <FaEnvelope className="text-[#be123c] text-base" />
                    <span>Send Letter</span>
                  </a>

                  <a
                    href="https://discord.com/users/869142924342988840"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-[#231710] hover:bg-[#342217] text-[#f7eedb] text-xs font-serif font-semibold border border-[#dfa84a]/20 hover:border-[#dfa84a] transition-all"
                  >
                    <FaDiscord className="text-[#dfa84a] text-base" />
                    <span>Discord</span>
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </nav>
  );
}