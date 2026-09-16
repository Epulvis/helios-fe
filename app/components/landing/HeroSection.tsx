'use client';

import React from 'react';
import Link from 'next/link';
import { AnimatedMedicalSvg } from '../ui/AnimatedMedicalSvg';

export function HeroSection() {
  return (
    <section id="hero" className="pt-28 pb-16 lg:pt-36 lg:pb-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Hero Left Content */}
          <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
            {/* Top Sparkle Tagline */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-100/80 border border-sky-200 text-xs font-bold text-[#0091ff] shadow-xs">
              <span className="w-2 h-2 rounded-full bg-[#0091ff] animate-ping" />
              Platform Skrining Kesehatan Berbasis AI & NLP
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl xl:text-6xl font-[850] text-[#0d2946] tracking-tight leading-[1.15]">
              Transformasi Evaluasi <br />
              <span className="bg-gradient-to-r from-[#0091ff] via-sky-600 to-[#00b4a2] bg-clip-text text-transparent">
                Kesehatan Medis
              </span>{' '}
              Pintar
            </h1>

            {/* Subtitle */}
            <p className="text-sm sm:text-base text-[#486581] leading-relaxed max-w-xl mx-auto lg:mx-0">
              Helios menghadirkan analisis teks medis berbasis Natural Language Processing (NLP) untuk membantu pasien dan dokter mengevaluasi gejala kesehatan secara cepat, akurat, dan terenkripsi.
            </p>

            {/* Action CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
              <Link
                href="/login"
                className="w-full sm:w-auto py-3.5 px-7 bg-[#0091ff] hover:bg-[#0081e3] text-white text-sm font-bold rounded-2xl shadow-lg shadow-sky-500/25 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
              >
                <span>Mulai Skrining Sekarang</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
              <a
                href="#how-it-works"
                className="w-full sm:w-auto py-3.5 px-6 bg-white hover:bg-slate-50 text-slate-700 text-sm font-bold rounded-2xl border border-slate-200 shadow-xs transition-all flex items-center justify-center gap-2"
              >
                <span>Pelajari Cara Kerja</span>
              </a>
            </div>

            {/* Trust Micro Indicators */}
            <div className="flex items-center justify-center lg:justify-start gap-6 pt-4 border-t border-slate-200/60 text-xs font-medium text-slate-500">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-teal-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Akses Pasien & Dokter</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-teal-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Enkripsi Standar ISO</span>
              </div>
            </div>
          </div>

          {/* Hero Right Visual Asset */}
          <div className="lg:col-span-6 flex items-center justify-center">
            <div className="relative w-full max-w-xl h-[320px] sm:h-[380px] lg:h-[420px] animate-float">
              <AnimatedMedicalSvg />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
