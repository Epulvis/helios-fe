'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { HeliosLogo } from '../ui/HeliosLogo';

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/85 backdrop-blur-md shadow-sm border-b border-slate-200/80 py-3'
          : 'bg-transparent py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <HeliosLogo size="md" />
        </Link>

        {/* Navigation Menu Links */}
        <nav className="hidden md:flex items-center gap-8 text-xs font-bold text-slate-600">
          <a
            href="#hero"
            className="hover:text-[#0091ff] transition-colors cursor-pointer"
          >
            Beranda
          </a>
          <a
            href="#features"
            className="hover:text-[#0091ff] transition-colors cursor-pointer"
          >
            Fitur AI
          </a>
          <a
            href="#how-it-works"
            className="hover:text-[#0091ff] transition-colors cursor-pointer"
          >
            Cara Kerja
          </a>
          <a
            href="#developer"
            className="hover:text-[#0091ff] transition-colors cursor-pointer flex items-center gap-1"
          >
            <span>Developer</span>
            <span className="px-1.5 py-0.5 text-[9px] bg-sky-100 text-[#0091ff] rounded-md font-mono">
              Info
            </span>
          </a>
        </nav>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="text-xs font-bold text-slate-700 hover:text-[#0091ff] px-3.5 py-2 rounded-xl transition-colors"
          >
            Masuk
          </Link>
          <Link
            href="/register"
            className="text-xs font-bold text-white bg-[#0091ff] hover:bg-[#0081e3] px-4 py-2.5 rounded-xl shadow-md shadow-sky-500/20 active:scale-[0.98] transition-all flex items-center gap-1.5"
          >
            <span>Daftar Pasien</span>
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
        </div>
      </div>
    </header>
  );
}
