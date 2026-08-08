'use client';

import React from 'react';
import { GetConsultationListResponse } from '../../lib/types/consultation';
import { formatDateShortIndonesia } from '../../lib/utils/date';

interface DashboardStatCardsProps {
  data?: GetConsultationListResponse;
  isLoading: boolean;
}

export function DashboardStatCards({ data, isLoading }: DashboardStatCardsProps) {
  const items = data?.data?.items || [];
  const pagination = data?.data?.pagination;
  const statistics = data?.data?.statistics;

  // 1. Total Prediksi
  const totalPrediksi = pagination?.total ?? items.length;

  // 2. Prediksi Bulan Ini
  const bulanIniCount = statistics?.this_month ?? 0;

  // 3. Confidence Terbaik
  const rawBestConf = statistics?.best_confidence ?? 0;
  const bestConfidence = rawBestConf > 1 ? Math.round(rawBestConf) : Math.round(rawBestConf * 100);

  // 4. Prediksi Terakhir (Index 0 data paling atas)
  const latestItem = items[0];
  const latestDiagnosis = latestItem?.category || (latestItem ? 'Umum' : '-');
  const latestSubtext = latestItem ? `Kemungkinan ${latestDiagnosis}` : 'Belum ada data';

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 1. Total Prediksi */}
      <div className="bg-white rounded-3xl p-5 shadow-xs border border-slate-200/80 flex items-center gap-4 hover:shadow-md transition-shadow">
        <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.8}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        </div>
        <div className="min-w-0">
          <span className="text-[11px] font-medium text-slate-400 block">Total Prediksi</span>
          <p className="text-2xl font-black text-slate-900 leading-tight mt-0.5">
            {isLoading ? '...' : totalPrediksi}
          </p>
          <span className="text-[10px] text-slate-400 block mt-0.5">Semua waktu</span>
        </div>
      </div>

      {/* 2. Prediksi Bulan Ini */}
      <div className="bg-white rounded-3xl p-5 shadow-xs border border-slate-200/80 flex items-center gap-4 hover:shadow-md transition-shadow">
        <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.8}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        </div>
        <div className="min-w-0">
          <span className="text-[11px] font-medium text-slate-400 block">Prediksi Bulan Ini</span>
          <p className="text-2xl font-black text-slate-900 leading-tight mt-0.5">
            {isLoading ? '...' : bulanIniCount}
          </p>
          <span className="text-[10px] text-slate-400 block mt-0.5">
            {latestItem?.created_at ? formatDateShortIndonesia(latestItem.created_at) : 'Aktivitas terkini'}
          </span>
        </div>
      </div>

      {/* 3. Confidence Terbaik */}
      <div className="bg-white rounded-3xl p-5 shadow-xs border border-slate-200/80 flex items-center gap-4 hover:shadow-md transition-shadow">
        <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
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
          <span className="text-[11px] font-medium text-slate-400 block">Confidence Terbaik</span>
          <p className="text-2xl font-black text-teal-600 leading-tight mt-0.5">
            {isLoading ? '...' : `${bestConfidence}%`}
          </p>
          <span className="text-[10px] text-slate-400 block mt-0.5">Tingkat keyakinan</span>
        </div>
      </div>

      {/* 4. Prediksi Terakhir */}
      <div className="bg-white rounded-3xl p-5 shadow-xs border border-slate-200/80 flex items-center gap-4 hover:shadow-md transition-shadow">
        <div className="w-12 h-12 rounded-2xl bg-orange-50 text-orange-500 flex items-center justify-center shrink-0">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.8}
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
        </div>
        <div className="min-w-0 flex-1">
          <span className="text-[11px] font-medium text-slate-400 block">Prediksi Terakhir</span>
          <p className="text-lg font-bold text-slate-900 leading-tight truncate capitalize mt-0.5">
            {isLoading ? '...' : latestDiagnosis}
          </p>
          <span className="text-[10px] text-slate-400 block mt-0.5 truncate">
            {isLoading ? '...' : latestSubtext}
          </span>
        </div>
      </div>
    </div>
  );
}
