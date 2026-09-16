'use client';

import React from 'react';
import Link from 'next/link';
import { HeliosLogo } from '../ui/HeliosLogo';

export function Footer() {
  return (
    <footer className="bg-slate-900 text-white pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 pb-12 border-b border-slate-800">
          {/* Brand Col */}
          <div className="md:col-span-5 space-y-4">
            <div className="bg-white/10 p-2.5 rounded-2xl inline-block backdrop-blur-md">
              <HeliosLogo size="md" className="[&_span]:text-white" />
            </div>
            <p className="text-xs sm:text-sm text-slate-400 max-w-sm leading-relaxed">
              Health Evaluation through Language Intelligence for Outcome Screening. Platform skrining medis cerdas berbasis AI & NLP.
            </p>
          </div>

          {/* Quick Links Col */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">Navigasi Utama</h4>
            <ul className="space-y-2 text-xs font-medium text-slate-400">
              <li><a href="#hero" className="hover:text-sky-400 transition-colors">Beranda</a></li>
              <li><a href="#features" className="hover:text-sky-400 transition-colors">Fitur AI Medis</a></li>
              <li><a href="#how-it-works" className="hover:text-sky-400 transition-colors">Cara Kerja Platform</a></li>
              <li><a href="#developer" className="hover:text-sky-400 transition-colors">Informasi Developer</a></li>
            </ul>
          </div>

          {/* Portal Access Col */}
          <div className="md:col-span-4 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">Akses Portal</h4>
            <div className="flex flex-col gap-2 pt-1">
              <Link
                href="/login"
                className="px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold text-center transition-colors shadow-sm"
              >
                Masuk ke Portal Pasien / Dokter
              </Link>
              <Link
                href="/register"
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold text-center transition-colors border border-slate-700"
              >
                Daftar Akun Baru Pasien
              </Link>
            </div>
          </div>
        </div>

        {/* Copyright & Developer Info Footer Bottom */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>&copy; {new Date().getFullYear()} Helios Healthcare Platform. All rights reserved.</p>
          <div className="flex items-center gap-2">
            <span>Developed by</span>
            <span className="font-bold text-slate-300 bg-slate-800 px-2.5 py-1 rounded-md border border-slate-700">
              HUMIC Engineering Team
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
