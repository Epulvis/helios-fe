'use client';

import React, { useState } from 'react';
import useSWR from 'swr';

import { DoctorReviewSlideover } from '../../components/doctor-dashboard/DoctorReviewSlideover';
import {
  ConsultationStatus,
  GetDoctorConsultationListResponse,
} from '../../lib/types/consultation';
import { formatDateIndonesia } from '../../lib/utils/date';

const fetcher = async (url: string): Promise<GetDoctorConsultationListResponse> => {
  const res = await fetch(url);
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Gagal memuat riwayat konsultasi dokter');
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

function statusClass(status: ConsultationStatus) {
  if (status === 'in_review') return 'bg-blue-50 text-blue-700 border-blue-200';
  if (status === 'reviewed') return 'bg-emerald-50 text-emerald-700 border-emerald-200';
  if (status === 'closed') return 'bg-slate-100 text-slate-700 border-slate-200';
  return 'bg-amber-50 text-amber-700 border-amber-200';
}

export function DoctorHistoryContent() {
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<'all' | ConsultationStatus>('all');
  const [selectedConsultationId, setSelectedConsultationId] = useState<string | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const limit = 10;
  const query = new URLSearchParams({ scope: 'mine', page: String(page), limit: String(limit) });
  if (statusFilter !== 'all') query.set('status', statusFilter);

  const { data, error, isLoading, mutate } = useSWR<GetDoctorConsultationListResponse>(
    `/api/proxy/doctor/consultations?${query.toString()}`,
    fetcher,
    { revalidateOnFocus: false, keepPreviousData: true }
  );
  const items = data?.data?.items || [];
  const pagination = data?.data?.pagination || {
    page: 1,
    limit,
    total: 0,
    total_pages: 0,
  };

  const openDetail = (id: string) => {
    setSelectedConsultationId(id);
    setIsDetailOpen(true);
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Riwayat Prediksi</h1>
        <p className="mt-1 text-xs text-slate-500">Konsultasi yang ditugaskan kepada Anda.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {(['in_review', 'reviewed', 'closed'] as const).map((status) => (
          <div key={status} className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-xs">
            <span className="text-[11px] font-medium text-slate-400">{labels[status]}</span>
            <p className="mt-1 text-2xl font-black text-slate-900">
              {isLoading ? '...' : statusFilter === status ? pagination.total : items.filter((item) => item.status === status).length}
            </p>
          </div>
        ))}
      </div>

      <section className="space-y-5 rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xs">
        <div className="flex flex-col justify-between gap-3 border-b border-slate-100 pb-4 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-base font-bold text-slate-900">Konsultasi Saya</h2>
            <p className="mt-0.5 text-xs text-slate-400">Hanya menampilkan konsultasi milik akun dokter ini.</p>
          </div>
          <select
            value={statusFilter}
            onChange={(event) => {
              setStatusFilter(event.target.value as 'all' | ConsultationStatus);
              setPage(1);
            }}
            className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700 focus:outline-none"
          >
            <option value="all">Semua Status</option>
            <option value="in_review">Sedang Ditinjau</option>
            <option value="reviewed">Sudah Ditinjau</option>
            <option value="closed">Selesai</option>
          </select>
        </div>

        {error ? (
          <div className="py-12 text-center">
            <p className="text-sm font-bold text-rose-700">Gagal memuat riwayat</p>
            <p className="mt-1 text-xs text-slate-500">{error.message}</p>
            <button type="button" onClick={() => mutate()} className="mt-4 rounded-xl bg-blue-600 px-5 py-2 text-xs font-semibold text-white">Coba Lagi</button>
          </div>
        ) : isLoading ? (
          <div className="py-12 text-center text-sm text-slate-400">Memuat riwayat konsultasi...</div>
        ) : items.length === 0 ? (
          <div className="py-12 text-center">
            <p className="text-sm font-bold text-slate-700">Riwayat konsultasi kosong</p>
            <p className="mt-1 text-xs text-slate-500">Belum ada konsultasi yang ditugaskan dengan status ini.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] border-collapse text-left">
              <thead>
                <tr className="border-b border-slate-100 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                  <th className="pb-3 pr-4">Tanggal</th>
                  <th className="px-4 pb-3">Keluhan</th>
                  <th className="px-4 pb-3">Kategori Awal</th>
                  <th className="px-4 pb-3 text-center">Status</th>
                  <th className="pb-3 pl-4 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {items.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/60">
                    <td className="py-4 pr-4 align-top font-semibold text-slate-800">{formatDateIndonesia(item.created_at)}</td>
                    <td className="max-w-sm px-4 py-4 align-top leading-relaxed text-slate-700">{item.complaint_text}</td>
                    <td className="px-4 py-4 align-top capitalize text-slate-700">{item.possible_category || '-'}</td>
                    <td className="px-4 py-4 text-center align-top">
                      <span className={`inline-flex rounded-full border px-3 py-1 text-[10px] font-semibold ${statusClass(item.status)}`}>
                        {labels[item.status]}
                      </span>
                    </td>
                    <td className="py-4 pl-4 text-center align-top">
                      <button type="button" onClick={() => openDetail(item.id)} className="rounded-xl bg-blue-50 px-3 py-2 text-[11px] font-bold text-blue-700 hover:bg-blue-100">
                        {item.status === 'in_review' ? 'Lanjutkan Review' : 'Lihat Detail'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {!isLoading && !error && pagination.total > 0 && (
          <div className="flex items-center justify-between border-t border-slate-100 pt-4 text-xs text-slate-500">
            <span>{pagination.total} konsultasi</span>
            <div className="flex gap-2">
              <button type="button" disabled={page <= 1} onClick={() => setPage((current) => Math.max(1, current - 1))} className="rounded-lg border border-slate-200 px-3 py-1.5 disabled:opacity-40">Sebelumnya</button>
              <button type="button" disabled={page >= pagination.total_pages} onClick={() => setPage((current) => Math.min(pagination.total_pages, current + 1))} className="rounded-lg border border-slate-200 px-3 py-1.5 disabled:opacity-40">Berikutnya</button>
            </div>
          </div>
        )}
      </section>

      <DoctorReviewSlideover
        isOpen={isDetailOpen}
        consultationId={selectedConsultationId}
        onClose={() => setIsDetailOpen(false)}
        onSuccessReview={() => mutate()}
      />
    </div>
  );
}
