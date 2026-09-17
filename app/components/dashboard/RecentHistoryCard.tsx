'use client';

import React from 'react';
import useSWR from 'swr';
import Link from 'next/link';
import { GetConsultationListResponse, ConsultationListItem } from '../../lib/types/consultation';
import { formatDateShortIndonesia } from '../../lib/utils/date';

const fetcher = async (url: string): Promise<GetConsultationListResponse> => {
  const res = await fetch(url);
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Gagal memuat riwayat');
  }
  return data;
};

export function RecentHistoryCard() {
  const { data, isLoading, error } = useSWR<GetConsultationListResponse>(
    '/api/proxy/consultations?page=1&limit=4',
    fetcher,
    { revalidateOnFocus: false }
  );

  const items = data?.data?.items || [];

  const getCategoryBadgeStyle = (category?: string | null) => {
    const cat = (category || '').toLowerCase();
    if (cat.includes('influenza') || cat.includes('pernapasan')) {
      return {
        badge: 'bg-emerald-50 text-emerald-700 border-emerald-200/80',
        bar: 'bg-emerald-500',
      };
    }
    if (cat.includes('faringitis') || cat.includes('tht')) {
      return {
        badge: 'bg-amber-50 text-amber-700 border-amber-200/80',
        bar: 'bg-blue-500',
      };
    }
    if (cat.includes('dispepsia') || cat.includes('pencernaan') || cat.includes('gastritis')) {
      return {
        badge: 'bg-purple-50 text-purple-700 border-purple-200/80',
        bar: 'bg-amber-500',
      };
    }
    return {
      badge: 'bg-blue-50 text-blue-700 border-blue-200/80',
      bar: 'bg-blue-500',
    };
  };

  const formatConfidence = (score?: number | null) => {
    if (score === undefined || score === null) return null;
    return score > 1 ? Math.round(score) : Math.round(score * 100);
  };

  return (
    <div className="bg-white rounded-3xl p-6 shadow-xs border border-slate-200/80 flex flex-col justify-between h-full space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
              />
            </svg>
          </div>
          <h2 className="text-sm sm:text-base font-bold text-slate-900">
            Riwayat Prediksi Terbaru
          </h2>
        </div>

        <Link
          href="/riwayat-prediksi"
          className="text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline flex items-center gap-1 cursor-pointer"
        >
          <span>Lihat semua riwayat</span>
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>

      {/* Loading Skeleton */}
      {isLoading && (
        <div className="space-y-4 py-4 animate-pulse flex-1">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-12 bg-slate-50 rounded-xl w-full flex items-center justify-between px-4">
              <div className="h-3 bg-slate-200 rounded w-1/3"></div>
              <div className="h-3 bg-slate-200 rounded w-1/4"></div>
              <div className="h-3 bg-slate-200 rounded w-1/6"></div>
            </div>
          ))}
        </div>
      )}

      {/* Error state */}
      {!isLoading && error && (
        <div className="py-8 text-center text-xs text-slate-500 flex-1">
          Gagal mengambil data riwayat prediksi terbaru.
        </div>
      )}

      {/* Empty state */}
      {!isLoading && !error && items.length === 0 && (
        <div className="py-10 text-center text-xs text-slate-400 space-y-2 flex-1 flex flex-col items-center justify-center">
          <p>Belum ada riwayat prediksi.</p>
        </div>
      )}

      {/* Table Content */}
      {!isLoading && !error && items.length > 0 && (
        <div className="overflow-x-auto flex-1">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-[10px] sm:text-[11px] font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                <th className="pb-3 pr-2">Gejala Keluhan</th>
                <th className="pb-3 px-2 text-center">Hasil</th>
                <th className="pb-3 pl-2 text-right">Confidence</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {items.map((item: ConsultationListItem) => {
                const category = item.category || '-';
                const styles = getCategoryBadgeStyle(category);
                const confidencePct = formatConfidence(item.confidence_score);

                return (
                  <tr key={item.id} className="hover:bg-slate-50/60 transition-colors">
                    {/* Gejala Keluhan (Tanggal + Text) */}
                    <td className="py-3.5 pr-2 align-middle max-w-[180px] sm:max-w-[220px]">
                      <span className="text-[10px] font-medium text-slate-400 block mb-0.5">
                        {formatDateShortIndonesia(item.created_at)}
                      </span>
                      <p className="text-slate-800 font-bold truncate text-xs leading-snug">
                        {item.complaint_text}
                      </p>
                    </td>

                    {/* Hasil Badge */}
                    <td className="py-3.5 px-2 align-middle text-center whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${styles.badge} capitalize`}
                      >
                        {category}
                      </span>
                      <span className="text-[10px] text-slate-400 block mt-0.5">
                        {item.category ? 'Review dokter' : 'Belum ditinjau'}
                      </span>
                    </td>

                    {/* Confidence Progress Bar */}
                    <td className="py-3.5 pl-2 align-middle text-right whitespace-nowrap">
                      {confidencePct !== null ? (
                        <div className="flex items-center justify-end gap-2">
                          <div className="w-12 sm:w-16 bg-slate-100 rounded-full h-1.5 overflow-hidden shrink-0">
                            <div
                              className={`${styles.bar} h-1.5 rounded-full transition-all duration-300`}
                              style={{ width: `${confidencePct}%` }}
                            ></div>
                          </div>
                          <span className="font-extrabold text-slate-800 text-xs shrink-0 min-w-[32px]">
                            {confidencePct}%
                          </span>
                        </div>
                      ) : (
                        <span className="text-slate-400 font-medium text-xs">-</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Bottom Full-Width Action Button */}
      <div className="pt-2">
        <Link
          href="/prediksi-baru"
          className="w-full py-3 rounded-2xl border border-slate-200 hover:border-blue-400 hover:bg-blue-50/50 text-slate-600 hover:text-blue-600 font-semibold text-xs transition-all inline-flex items-center justify-center gap-2 cursor-pointer shadow-2xs"
        >
          <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span>Buat Prediksi Baru</span>
        </Link>
      </div>
    </div>
  );
}
