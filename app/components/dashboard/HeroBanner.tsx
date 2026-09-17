'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuthStore } from '../../lib/stores/useAuthStore';

export function HeroBanner() {
  const { user } = useAuthStore();
  const patientName = user?.name || 'Pasien';

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#EDF7FF] via-[#F4F9FF] to-[#E6F4FF] border border-blue-100/80 p-6 sm:p-8 shadow-xs flex flex-col md:flex-row items-center justify-between gap-6">
      {/* Background Decorative Circles */}
      <div className="absolute top-0 right-0 pointer-events-none translate-x-8 -translate-y-4 opacity-60">
        <Image
          src="/images/dashboard/bg-circle-teal.svg"
          alt=""
          width={140}
          height={100}
        />
      </div>
      <div className="absolute bottom-0 right-60 pointer-events-none opacity-50">
        <Image
          src="/images/dashboard/bg-circle-blue.svg"
          alt=""
          width={100}
          height={80}
        />
      </div>

      {/* Left Content */}
      <div className="relative z-10 max-w-xl space-y-3 text-left">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2 flex-wrap">
          Selamat Datang, <span className="text-slate-900">{patientName}</span> 👋
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
          Pantau kondisi kesehatan Anda dengan sistem prediksi berbasis NLP.
          <br className="hidden sm:inline" />
          Mulai prediksi baru atau lihat riwayat sebelumnya.
        </p>

        <div className="pt-2">
          <Link
            href="/prediksi-baru"
            className="px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-2xl shadow-md shadow-blue-500/20 hover:shadow-lg hover:shadow-blue-500/30 transition-all inline-flex items-center gap-2.5 cursor-pointer"
          >
            <div className="w-5 h-5 rounded-lg bg-blue-500/40 flex items-center justify-center">
              <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <span>Buat Prediksi Baru</span>
          </Link>
        </div>
      </div>

      {/* Right Graphic Illustration (Wave Chart + Badges) */}
      <div className="relative z-10 shrink-0 flex items-center justify-center w-full md:w-auto">
        <div className="relative w-[260px] sm:w-[280px] h-[105px] flex items-center justify-center">
          <Image
            src="/images/dashboard/wave-chart.svg"
            alt="Grafik Prediksi & Akurasi"
            width={272}
            height={100}
            className="w-full h-auto drop-shadow-xs object-contain"
            priority
          />
        </div>
      </div>
    </div>
  );
}
