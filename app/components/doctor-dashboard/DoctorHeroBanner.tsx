'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuthStore } from '../../lib/stores/useAuthStore';

export function DoctorHeroBanner() {
  const { user } = useAuthStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const doctorName = mounted && user?.name ? user.name : 'Dokter';

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#EFF6FF] via-[#F4F8FF] to-[#EBF3FF] border border-blue-100/90 p-6 sm:p-8 shadow-xs flex flex-col justify-between gap-4">
      <div className="relative z-10 max-w-2xl space-y-3 text-left">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2 flex-wrap">
          Selamat Datang, {doctorName} 👋
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
          Pantau dan tinjau hasil prediksi pasien berbasis NLP. Saat ini terdapat beberapa kasus yang membutuhkan perhatian dan tinjauan Anda.
        </p>

        <div className="pt-2">
          <Link
            href="/data-prediksi"
            className="px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-2xl shadow-md shadow-blue-500/20 hover:shadow-lg hover:shadow-blue-500/30 transition-all inline-flex items-center gap-2.5 cursor-pointer"
          >
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
            <span>Lihat Data Prediksi</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
