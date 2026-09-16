'use client';

import React from 'react';

export function FeaturesSection() {
  const features = [
    {
      title: 'AI Berbasis Natural Language Processing',
      description: 'Engine cerdas yang mampu memahami deskripsi naratif keluhan pasien, menganalisis pola gejala, dan memetakan indikator kondisi medis.',
      icon: (
        <svg className="w-6 h-6 text-[#0091ff]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      ),
      bg: 'bg-blue-50 border-blue-100',
    },
    {
      title: 'Portal Pasien & Dokter Terintegrasi',
      description: 'Menghubungkan pasien langsung dengan dokter ahli untuk peninjauan rekam medis, validasi hasil AI, dan konsultasi kesehatan terpadu.',
      icon: (
        <svg className="w-6 h-6 text-[#00b4a2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      bg: 'bg-teal-50 border-teal-100',
    },
    {
      title: 'Keamanan Data & SSL Encrypted',
      description: 'Privasi rekam medis dijamin dengan enkripsi endpoint standar internasional ISO 27001 untuk perlindungan data kesehatan yang ketat.',
      icon: (
        <svg className="w-6 h-6 text-[#0091ff]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      bg: 'bg-sky-50 border-sky-100',
    },
    {
      title: 'Skrining Risiko & Hasil Instan',
      description: 'Menyajikan ringkasan evaluasi komprehensif, tingkat risiko penyakit, dan rekomendasi langkah medis awal dalam waktu hitungan detik.',
      icon: (
        <svg className="w-6 h-6 text-[#00b4a2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
        </svg>
      ),
      bg: 'bg-teal-50 border-teal-100',
    },
  ];

  return (
    <section id="features" className="py-16 lg:py-24 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 lg:mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-50 border border-teal-200 text-xs font-bold text-[#00b4a2] mb-4">
            Keunggulan Utama Platform
          </div>
          <h2 className="text-3xl sm:text-4xl font-[850] text-[#0d2946] tracking-tight">
            Fitur Cerdas Helios Healthcare
          </h2>
          <p className="mt-3 text-sm sm:text-base text-[#486581] leading-relaxed">
            Solusi kecerdasan buatan terpadu yang dirancang khusus untuk meningkatkan kecepatan dan akurasi skrining awal medis.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {features.map((feature, idx) => (
            <div
              key={idx}
              className="p-8 rounded-[28px] bg-slate-50/70 border border-slate-200/70 hover:bg-white hover:shadow-[0_20px_40px_-15px_rgba(13,41,70,0.08)] hover:border-sky-200 transition-all duration-300 group flex flex-col justify-between"
            >
              <div>
                <div className={`w-14 h-14 rounded-2xl ${feature.bg} border flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  {feature.icon}
                </div>
                <h3 className="text-lg font-bold text-[#0d2946] mb-2.5">
                  {feature.title}
                </h3>
                <p className="text-xs sm:text-sm text-[#627d98] leading-relaxed">
                  {feature.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-200/50 flex items-center text-xs font-bold text-[#0091ff] group-hover:translate-x-1 transition-transform">
                <span>Pelajari Fitur ini</span>
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
