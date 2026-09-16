'use client';

import React from 'react';

export function HowItWorksSection() {
  const steps = [
    {
      num: '01',
      title: 'Input Keluhan & Teks Medis',
      desc: 'Pasien masuk ke portal dan menuliskan narasi gejala atau keluhan kesehatan yang dirasakan secara natural.',
      color: 'bg-sky-500 text-white',
    },
    {
      num: '02',
      title: 'Analisis NLP Engine AI',
      desc: 'Engine Helios memproses teks medis, mengekstrak entitas medis, dan menghitung estimasi tingkat risiko penyakit.',
      color: 'bg-teal-500 text-white',
    },
    {
      num: '03',
      title: 'Hasil Evaluasi & Konsultasi Dokter',
      desc: 'Pasien menerima ringkasan skrining dan dokter dapat meninjau rekam medis untuk konsultasi tindak lanjut.',
      color: 'bg-blue-600 text-white',
    },
  ];

  return (
    <section id="how-it-works" className="py-16 lg:py-24 bg-gradient-to-b from-white via-sky-50/50 to-[#edf5fd] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 lg:mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-100 border border-sky-200 text-xs font-bold text-[#0091ff] mb-4">
            Alur Penggunaan Platform
          </div>
          <h2 className="text-3xl sm:text-4xl font-[850] text-[#0d2946] tracking-tight">
            Bagaimana Cara Kerja Helios?
          </h2>
          <p className="mt-3 text-sm sm:text-base text-[#486581] leading-relaxed">
            3 langkah sederhana untuk mendapatkan hasil analisis awal kesehatan medis berbasis AI.
          </p>
        </div>

        {/* 3 Step Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {steps.map((step, idx) => (
            <div
              key={idx}
              className="bg-white rounded-[28px] p-8 border border-slate-100 shadow-[0_15px_35px_-10px_rgba(13,41,70,0.06)] relative flex flex-col justify-between hover:shadow-lg transition-shadow"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <span className={`w-12 h-12 rounded-2xl ${step.color} font-extrabold text-lg flex items-center justify-center shadow-md`}>
                    {step.num}
                  </span>
                  <span className="text-xs font-bold text-slate-300 uppercase tracking-widest">Langkah {idx + 1}</span>
                </div>
                <h3 className="text-lg font-bold text-[#0d2946] mb-3">{step.title}</h3>
                <p className="text-xs sm:text-sm text-[#627d98] leading-relaxed">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
