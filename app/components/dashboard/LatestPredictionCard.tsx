'use client';

import Link from 'next/link';
import React from 'react';
import useSWR from 'swr';

import {
  ConsultationStatus,
  GetConsultationDetailResponse,
  GetConsultationListResponse,
} from '../../lib/types/consultation';
import { formatDateShortIndonesia } from '../../lib/utils/date';

interface LatestPredictionCardProps {
  onOpenDetail: (id: string) => void;
}

const fetcher = async <T,>(url: string): Promise<T> => {
  const res = await fetch(url);
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Gagal memuat konsultasi');
  return data;
};

const statusLabels: Record<ConsultationStatus, string> = {
  submitted: 'Dikirim',
  processing: 'Sedang Diproses',
  analyzed: 'Menunggu Dokter',
  in_review: 'Sedang Ditinjau',
  reviewed: 'Sudah Ditinjau',
  closed: 'Selesai',
  failed: 'Gagal Diproses',
};

export function LatestPredictionCard({ onOpenDetail }: LatestPredictionCardProps) {
  const list = useSWR<GetConsultationListResponse>(
    '/api/proxy/consultations?limit=1',
    fetcher,
    { revalidateOnFocus: false }
  );
  const latestItem = list.data?.data?.items?.[0];
  const detail = useSWR<GetConsultationDetailResponse>(
    latestItem ? `/api/proxy/consultations/${latestItem.id}` : null,
    fetcher,
    { revalidateOnFocus: false }
  );
  const consultation = detail.data?.data?.consultation || latestItem;
  const review = detail.data?.data?.doctor_review;
  const isLoading = list.isLoading || (Boolean(latestItem) && detail.isLoading);
  const error = list.error || detail.error;

  return (
    <div className="flex h-full flex-col justify-between space-y-6 rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xs">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <h2 className="text-sm font-bold text-slate-900 sm:text-base">Konsultasi Terakhir</h2>
        <span className="text-xs font-semibold text-slate-400">
          {isLoading ? '...' : consultation ? formatDateShortIndonesia(consultation.created_at) : '-'}
        </span>
      </div>

      {isLoading ? (
        <div className="flex-1 py-12 text-center text-xs text-slate-400">Memuat konsultasi terakhir...</div>
      ) : error || !latestItem || !consultation ? (
        <div className="flex flex-1 flex-col items-center justify-center space-y-3 py-12 text-center">
          <p className="max-w-xs text-xs text-slate-500">
            {error ? 'Gagal memuat konsultasi terakhir.' : 'Belum ada riwayat konsultasi.'}
          </p>
          <Link href="/prediksi-baru" className="rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700">
            Buat Prediksi Baru
          </Link>
        </div>
      ) : (
        <div className="flex flex-1 flex-col justify-between space-y-5">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                {statusLabels[consultation.status]}
              </span>
              {latestItem.confidence_score !== null && (
                <span className="text-xs font-bold text-slate-700">
                  Confidence AI {Math.round(latestItem.confidence_score * 100)}%
                </span>
              )}
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <span className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400">Keluhan</span>
              <p className="mt-1 text-xs font-medium leading-relaxed text-slate-700">{consultation.complaint_text}</p>
            </div>

            {review ? (
              <div className="space-y-2 rounded-2xl border border-emerald-100 bg-emerald-50/50 p-4">
                <span className="block text-[11px] font-semibold uppercase tracking-wider text-emerald-700">Hasil Review Dokter</span>
                <p className="text-sm font-bold capitalize text-slate-900">{review.final_category || 'Kategori belum ditentukan'}</p>
                <p className="text-xs leading-relaxed text-slate-600">{review.recommendation || 'Belum ada rekomendasi tambahan.'}</p>
              </div>
            ) : (
              <div className="rounded-2xl border border-amber-100 bg-amber-50 p-4 text-xs leading-relaxed text-amber-800">
                Review dokter belum tersedia. Anda dapat memantau status konsultasi dari halaman riwayat.
              </div>
            )}
          </div>

          <p className="text-[11px] leading-relaxed text-slate-500">
            Analisis AI merupakan dukungan penyaringan awal dan bukan diagnosis medis final.
          </p>

          <div className="flex items-center gap-3 border-t border-slate-100 pt-4">
            <button
              type="button"
              onClick={() => onOpenDetail(latestItem.id)}
              className="flex-1 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-semibold text-white hover:bg-blue-700"
            >
              Lihat Detail
            </button>
            <Link href="/riwayat-prediksi" className="flex-1 rounded-xl border border-slate-200 px-4 py-2.5 text-center text-xs font-semibold text-slate-700 hover:bg-slate-50">
              Lihat Riwayat
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
