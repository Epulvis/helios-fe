'use client';

import React from 'react';

export function DoctorStatCards() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 1. Prediksi Masuk Hari Ini */}
      <div className="bg-white rounded-3xl p-5 shadow-xs border border-slate-200/80 flex items-center gap-4 hover:shadow-md transition-shadow">
        <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.8}
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
            />
          </svg>
        </div>
        <div className="min-w-0">
          <span className="text-[11px] font-medium text-slate-500 block">Prediksi Masuk Hari Ini</span>
          <p className="text-2xl font-black text-slate-900 leading-tight mt-0.5">18</p>
          <span className="text-[10px] text-slate-400 block mt-0.5">+4 dari kemarin</span>
        </div>
      </div>

      {/* 2. Perlu Ditinjau */}
      <div className="bg-white rounded-3xl p-5 shadow-xs border border-slate-200/80 flex items-center gap-4 hover:shadow-md transition-shadow">
        <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center shrink-0">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.8}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
        <div className="min-w-0">
          <span className="text-[11px] font-medium text-slate-500 block">Perlu Ditinjau</span>
          <p className="text-2xl font-black text-slate-900 leading-tight mt-0.5">6</p>
          <span className="text-[10px] text-slate-400 block mt-0.5">Menunggu review</span>
        </div>
      </div>

      {/* 3. Rata-rata Confidence */}
      <div className="bg-white rounded-3xl p-5 shadow-xs border border-slate-200/80 flex items-center gap-4 hover:shadow-md transition-shadow">
        <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-500 flex items-center justify-center shrink-0">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.8}
              d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
            />
          </svg>
        </div>
        <div className="min-w-0">
          <span className="text-[11px] font-medium text-slate-500 block">Rata-rata Confidence</span>
          <p className="text-2xl font-black text-slate-900 leading-tight mt-0.5">81%</p>
          <span className="text-[10px] text-slate-400 block mt-0.5">Seluruh prediksi</span>
        </div>
      </div>

      {/* 4. Pasien Aktif */}
      <div className="bg-white rounded-3xl p-5 shadow-xs border border-slate-200/80 flex items-center gap-4 hover:shadow-md transition-shadow">
        <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-500 flex items-center justify-center shrink-0">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.8}
              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
        </div>
        <div className="min-w-0">
          <span className="text-[11px] font-medium text-slate-500 block">Pasien Aktif</span>
          <p className="text-2xl font-black text-slate-900 leading-tight mt-0.5">124</p>
          <span className="text-[10px] text-slate-400 block mt-0.5">30 hari terakhir</span>
        </div>
      </div>
    </div>
  );
}
