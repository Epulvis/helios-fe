'use client';

import React from 'react';

export function DeveloperSection() {
  const techStack = [
    { name: 'Next.js 16 (App Router)', type: 'Frontend Framework', color: 'bg-slate-900 text-white' },
    { name: 'React 19', type: 'UI Library', color: 'bg-sky-500 text-white' },
    { name: 'TypeScript', type: 'Language', color: 'bg-blue-600 text-white' },
    { name: 'TailwindCSS v4', type: 'Styling', color: 'bg-cyan-500 text-white' },
    { name: 'Zustand', type: 'State Management', color: 'bg-amber-600 text-white' },
    { name: 'Zod', type: 'Validation', color: 'bg-indigo-600 text-white' },
    { name: 'SWR', type: 'Data Fetching', color: 'bg-teal-600 text-white' },
    { name: 'NLP AI Proxy Engine', type: 'Medical Backend', color: 'bg-sky-700 text-white' },
  ];

  const highlights = [
    {
      title: 'Performa & Rendering Kilat',
      desc: 'Dibangun dengan Next.js App Router & Turbopack untuk rendering instan, optimasi gambar, dan waktu muat halaman di bawah 2 detik.',
      icon: (
        <svg className="w-6 h-6 text-sky-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
    },
    {
      title: 'Arsitektur Keamanan Bertingkat',
      desc: 'Menerapkan verifikasi JWT Token, proxy endpoint terenkripsi SSL, dan validasi skema Zod ketat di setiap layer transmisi data.',
      icon: (
        <svg className="w-6 h-6 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
    },
    {
      title: 'Desain Human-Centric & Interaktif',
      desc: 'Antarmuka visual modern berbasis glassmorphic dengan mikro-animasi interaktif untuk kenyamanan maksimal pasien dan dokter.',
      icon: (
        <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-23" />
        </svg>
      ),
    },
  ];

  return (
    <section id="developer" className="py-16 lg:py-24 bg-gradient-to-b from-[#edf5fd] via-[#e6f1fa] to-[#edf4fc] relative overflow-hidden">
      {/* Decorative Orbs */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-sky-200/40 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-teal-200/30 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 lg:mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-sky-100 border border-sky-200 text-xs font-bold text-[#0091ff] mb-4">
            <span className="w-2 h-2 rounded-full bg-[#0091ff] animate-pulse" />
            Tim Pengembang & Spesifikasi Sistem
          </div>
          <h2 className="text-3xl sm:text-4xl font-[850] text-[#0d2946] tracking-tight">
            Informasi Developer Platform Helios
          </h2>
          <p className="mt-3 text-sm sm:text-base text-[#486581] leading-relaxed">
            Helios dikembangkan oleh tim engineer dan spesialis teknologi kesehatan yang berdedikasi menciptakan ekosistem medis digital berbasis AI yang aman, cepat, dan presisi.
          </p>
        </div>

        {/* Main Developer Profile Card */}
        <div className="bg-white rounded-[32px] p-8 lg:p-12 shadow-[0_20px_50px_-15px_rgba(13,41,70,0.08)] border border-slate-100/90 mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Developer Bio Left */}
            <div className="lg:col-span-6 space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#0091ff] to-[#0066d6] p-3 text-white flex items-center justify-center shadow-lg shadow-sky-500/25 shrink-0">
                  <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-extrabold text-[#0d2946]">HUMIC Engineering Team</h3>
                  <p className="text-xs font-semibold text-teal-600 uppercase tracking-wider mt-0.5">
                    Helios Healthcare Platform Development
                  </p>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-[#486581] leading-relaxed">
                Platform Helios dirancang dan dibangun khusus untuk memenuhi kebutuhan evaluasi medis modern berbasis teknologi Natural Language Processing (NLP). Tim kami mengedepankan kualitas arsitektur kode clean, tipe aman (*type-safe*), dan performa responsif di setiap antarmuka.
              </p>

              {/* Developer Metadata List */}
              <div className="grid grid-cols-2 gap-3 pt-2 text-xs">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="block font-bold text-[#0d2946]">Project Core</span>
                  <span className="text-slate-500 text-[11px]">Helios Health Platform</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="block font-bold text-[#0d2946]">Versi Rilis</span>
                  <span className="text-slate-500 text-[11px]">v1.0.0 (Production Ready)</span>
                </div>
              </div>
            </div>

            {/* Tech Stack Pills Right */}
            <div className="lg:col-span-6">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">
                Teknologi & Stack Utama yang Digunakan:
              </h4>
              <div className="flex flex-wrap gap-2.5">
                {techStack.map((tech) => (
                  <div
                    key={tech.name}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold shadow-xs flex items-center gap-2 ${tech.color}`}
                  >
                    <span>{tech.name}</span>
                    <span className="text-[9px] opacity-80 uppercase font-mono px-1.5 py-0.5 bg-black/20 rounded">
                      {tech.type}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 3 Architecture Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {highlights.map((item, index) => (
            <div
              key={index}
              className="bg-white/80 backdrop-blur-md rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-all group"
            >
              <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                {item.icon}
              </div>
              <h4 className="text-base font-bold text-[#0d2946] mb-1.5">{item.title}</h4>
              <p className="text-xs text-[#627d98] leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
