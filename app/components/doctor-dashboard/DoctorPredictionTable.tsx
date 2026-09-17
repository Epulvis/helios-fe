'use client';

import Link from 'next/link';
import React, { useMemo } from 'react';
import useSWR from 'swr';

import {
  ConsultationStatus,
  DoctorConsultationItem,
  GetDoctorConsultationListResponse,
} from '../../lib/types/consultation';
import { formatDateShortIndonesia } from '../../lib/utils/date';

const fetcher = async (url: string): Promise<GetDoctorConsultationListResponse> => {
  const res = await fetch(url);
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Gagal memuat data konsultasi');
  return data;
};

const labels: Record<ConsultationStatus, string> = {
  submitted: 'Dikirim',
  processing: 'Sedang Diproses',
  analyzed: 'Menunggu Dokter',
  in_review: 'Sedang Ditinjau',
  reviewed: 'Sudah Ditinjau',
  closed: 'Selesai',
  failed: 'Gagal Diproses',
};

function badgeClass(status: ConsultationStatus) {
  if (status === 'analyzed') return 'bg-amber-50 text-amber-700';
  if (status === 'in_review') return 'bg-blue-50 text-blue-700';
  if (status === 'reviewed') return 'bg-emerald-50 text-emerald-700';
  return 'bg-slate-100 text-slate-700';
}

export function DoctorPredictionTable() {
  const available = useSWR<GetDoctorConsultationListResponse>(
    '/api/proxy/doctor/consultations?scope=available&page=1&limit=6',
    fetcher,
    { revalidateOnFocus: false }
  );
  const mine = useSWR<GetDoctorConsultationListResponse>(
    '/api/proxy/doctor/consultations?scope=mine&page=1&limit=6',
    fetcher,
    { revalidateOnFocus: false }
  );

  const items = useMemo(() => {
    const byId = new Map<string, DoctorConsultationItem>();
    for (const item of available.data?.data?.items || []) byId.set(item.id, item);
    for (const item of mine.data?.data?.items || []) byId.set(item.id, item);
    return [...byId.values()]
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, 6);
  }, [available.data, mine.data]);

  const isLoading = available.isLoading || mine.isLoading;
  const error = available.error || mine.error;

  return (
    <div className="flex flex-col justify-between space-y-5 rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xs">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div>
          <h2 className="text-base font-bold text-slate-900">Konsultasi Terbaru</h2>
          <p className="mt-0.5 text-xs text-slate-400">Konsultasi tersedia dan yang ditugaskan kepada Anda.</p>
        </div>
        <Link href="/data-prediksi" className="text-xs font-semibold text-blue-600 hover:underline">
          Lihat semua
        </Link>
      </div>

      {error ? (
        <div className="py-10 text-center text-xs text-rose-600">Gagal memuat konsultasi dokter.</div>
      ) : isLoading ? (
        <div className="py-10 text-center text-xs text-slate-400">Memuat data konsultasi...</div>
      ) : items.length === 0 ? (
        <div className="py-10 text-center">
          <p className="text-sm font-bold text-slate-700">Belum ada konsultasi</p>
          <p className="mt-1 text-xs text-slate-400">Antrian dan riwayat tugas Anda masih kosong.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[620px] border-collapse text-left">
            <thead>
              <tr className="border-b border-slate-100 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                <th className="pb-3 pr-4">Konsultasi</th>
                <th className="px-4 pb-3">Keluhan</th>
                <th className="px-4 pb-3">Kategori Awal</th>
                <th className="px-3 pb-3 text-center">Conf.</th>
                <th className="pb-3 pl-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100/80 text-xs">
              {items.map((item) => (
                <tr key={item.id} className="transition-colors hover:bg-slate-50/70">
                  <td className="py-3.5 pr-4 align-top">
                    <p className="font-bold text-slate-900">{item.id.slice(0, 8)}</p>
                    <p className="mt-0.5 text-[10px] text-slate-400">{formatDateShortIndonesia(item.created_at)}</p>
                  </td>
                  <td className="max-w-[260px] px-4 py-3.5 align-top">
                    <p className="line-clamp-2 leading-relaxed text-slate-600">{item.complaint_text}</p>
                  </td>
                  <td className="px-4 py-3.5 align-top capitalize text-slate-700">{item.possible_category || '-'}</td>
                  <td className="px-3 py-3.5 text-center align-top font-bold text-slate-800">
                    {item.confidence_score === null ? '-' : `${Math.round(item.confidence_score * 100)}%`}
                  </td>
                  <td className="py-3.5 pl-4 text-center align-top">
                    <span className={`inline-flex rounded-full px-3 py-1 text-[10px] font-semibold ${badgeClass(item.status)}`}>
                      {labels[item.status]}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
