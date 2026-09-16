'use client';

import React from 'react';

export function StatsBanner() {
  const stats = [
    { label: 'Akurasi Model NLP', value: '99.4%', sub: 'Presisi Evaluasi Gejala' },
    { label: 'Waktu Respon AI', value: '< 2 dtk', sub: 'Skrining Instan 24/7' },
    { label: 'Keamanan Data', value: 'ISO 27001', sub: 'Terenkripsi Standar SSL' },
    { label: 'Integrasi Medis', value: '100%', sub: 'Portal Pasien & Dokter' },
  ];

  return (
    <section className="py-8 bg-white/70 backdrop-blur-md border-y border-slate-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 divide-y sm:divide-y-0 sm:divide-x divide-slate-200/80">
          {stats.map((stat, idx) => (
            <div key={idx} className={`flex flex-col items-center text-center ${idx > 0 ? 'pt-4 sm:pt-0' : ''}`}>
              <span className="text-3xl sm:text-4xl font-[900] text-[#0091ff] tracking-tight">
                {stat.value}
              </span>
              <span className="text-xs font-bold text-[#0d2946] mt-1">{stat.label}</span>
              <span className="text-[11px] text-[#627d98] mt-0.5">{stat.sub}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
