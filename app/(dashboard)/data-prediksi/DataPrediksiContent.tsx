'use client';

import React, { useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import useSWR, { useSWRConfig } from 'swr';

import { ConfirmCloseModal } from '../../components/doctor-dashboard/ConfirmCloseModal';
import { DoctorReviewSlideover } from '../../components/doctor-dashboard/DoctorReviewSlideover';
import { updateConsultationStatusService } from '../../lib/services/consultation';
import {
  ConsultationStatus,
  DoctorConsultationItem,
  GetDoctorConsultationListResponse,
} from '../../lib/types/consultation';
import { formatDateShortIndonesia } from '../../lib/utils/date';

const AVAILABLE_KEY = '/api/proxy/doctor/consultations?scope=available&page=1&limit=100';
const MINE_KEY = '/api/proxy/doctor/consultations?scope=mine&page=1&limit=100';
const PAGE_SIZE = 10;

const fetcher = async (url: string): Promise<GetDoctorConsultationListResponse> => {
  const res = await fetch(url);
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Gagal memuat data konsultasi dokter');
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

function statusClass(status: ConsultationStatus) {
  if (status === 'analyzed') return 'bg-amber-50 text-amber-700 border-amber-200';
  if (status === 'in_review') return 'bg-blue-50 text-blue-700 border-blue-200';
  if (status === 'reviewed') return 'bg-emerald-50 text-emerald-700 border-emerald-200';
  if (status === 'closed') return 'bg-slate-100 text-slate-700 border-slate-200';
  return 'bg-slate-50 text-slate-600 border-slate-200';
}

function confidencePercent(value: number | null) {
  return value === null ? null : Math.round(value * 100);
}

export function DataPrediksiContent() {
  const { mutate: globalMutate } = useSWRConfig();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | ConsultationStatus>('all');
  const [page, setPage] = useState(1);
  const [selectedConsultationId, setSelectedConsultationId] = useState<string | null>(null);
  const [isSlideoverOpen, setIsSlideoverOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isStatusUpdating, setIsStatusUpdating] = useState(false);

  const available = useSWR<GetDoctorConsultationListResponse>(AVAILABLE_KEY, fetcher, {
    revalidateOnFocus: false,
  });
  const mine = useSWR<GetDoctorConsultationListResponse>(MINE_KEY, fetcher, {
    revalidateOnFocus: false,
  });

  const items = useMemo(() => {
    const byId = new Map<string, DoctorConsultationItem>();
    for (const item of available.data?.data?.items || []) byId.set(item.id, item);
    for (const item of mine.data?.data?.items || []) byId.set(item.id, item);
    return [...byId.values()].sort(
      (left, right) => new Date(right.created_at).getTime() - new Date(left.created_at).getTime()
    );
  }, [available.data, mine.data]);

  const filteredItems = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return items.filter((item) => {
      const matchesSearch =
        !query ||
        item.id.toLowerCase().includes(query) ||
        item.complaint_text.toLowerCase().includes(query) ||
        item.possible_category?.toLowerCase().includes(query);
      const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [items, searchQuery, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredItems.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pageItems = filteredItems.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);
  const activeItem =
    items.find((item) => item.id === selectedConsultationId) || pageItems[0] || items[0];
  const isLoading = available.isLoading || mine.isLoading;
  const error = available.error || mine.error;

  const refreshLists = async () => {
    await Promise.all([available.mutate(), mine.mutate()]);
  };

  const openDetail = (id: string) => {
    setSelectedConsultationId(id);
    setIsSlideoverOpen(true);
  };

  const openCloseConfirmation = (item: DoctorConsultationItem) => {
    if (item.status !== 'reviewed') return;
    setSelectedConsultationId(item.id);
    setIsConfirmModalOpen(true);
  };

  const handleConfirmClose = async () => {
    const selected = items.find((item) => item.id === selectedConsultationId);
    if (!selected || selected.status !== 'reviewed') return;

    setIsStatusUpdating(true);
    try {
      const response = await updateConsultationStatusService(selected.id, 'closed');
      toast.success(response.message || 'Konsultasi berhasil ditutup.');
      setIsConfirmModalOpen(false);
      await Promise.all([
        refreshLists(),
        globalMutate(
          (key) =>
            typeof key === 'string' &&
            (key.startsWith('/api/proxy/doctor/consultations') ||
              key.startsWith('/api/proxy/consultations'))
        ),
      ]);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Status konsultasi gagal diperbarui.');
      await refreshLists();
    } finally {
      setIsStatusUpdating(false);
    }
  };

  const availableCount = items.filter((item) => item.status === 'analyzed').length;
  const inReviewCount = items.filter((item) => item.status === 'in_review').length;
  const reviewedCount = items.filter((item) => item.status === 'reviewed').length;
  const closedCount = items.filter((item) => item.status === 'closed').length;

  return (
    <div className="mx-auto max-w-7xl space-y-6 pb-8">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          ['Tersedia', availableCount, 'Menunggu dokter'],
          ['Sedang Ditinjau', inReviewCount, 'Milik Anda'],
          ['Sudah Ditinjau', reviewedCount, 'Siap ditutup'],
          ['Selesai', closedCount, 'Kasus ditutup'],
        ].map(([label, value, helper]) => (
          <div key={label} className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-xs">
            <span className="block text-[11px] font-medium text-slate-400">{label}</span>
            <p className="mt-1 text-2xl font-black text-slate-900">{isLoading ? '...' : value}</p>
            <span className="mt-0.5 block text-[10px] text-slate-400">{helper}</span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-3">
        <section className="space-y-5 rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xs lg:col-span-2">
          <div className="space-y-4 border-b border-slate-100 pb-4">
            <div>
              <h1 className="text-lg font-bold text-slate-900">Daftar Prediksi Pasien</h1>
              <p className="mt-0.5 text-xs text-slate-400">
                Konsultasi tersedia dan konsultasi yang ditugaskan kepada Anda.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <input
                type="search"
                value={searchQuery}
                onChange={(event) => {
                  setSearchQuery(event.target.value);
                  setPage(1);
                }}
                placeholder="Cari ID, keluhan, atau kategori..."
                className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-xs text-slate-700 focus:border-blue-500 focus:outline-none"
              />
              <select
                value={statusFilter}
                onChange={(event) => {
                  setStatusFilter(event.target.value as 'all' | ConsultationStatus);
                  setPage(1);
                }}
                className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700 focus:outline-none"
              >
                <option value="all">Semua Status</option>
                <option value="analyzed">Menunggu Dokter</option>
                <option value="in_review">Sedang Ditinjau</option>
                <option value="reviewed">Sudah Ditinjau</option>
                <option value="closed">Selesai</option>
              </select>
            </div>
          </div>

          {error ? (
            <div className="py-12 text-center">
              <p className="text-sm font-bold text-rose-700">Gagal memuat konsultasi</p>
              <p className="mt-1 text-xs text-slate-500">{error.message}</p>
              <button type="button" onClick={refreshLists} className="mt-4 rounded-xl bg-blue-600 px-5 py-2 text-xs font-semibold text-white">
                Coba Lagi
              </button>
            </div>
          ) : isLoading ? (
            <div className="py-12 text-center text-sm text-slate-400">Memuat data konsultasi...</div>
          ) : pageItems.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-sm font-bold text-slate-700">Belum ada konsultasi</p>
              <p className="mt-1 text-xs text-slate-500">Tidak ada data nyata yang sesuai dengan filter saat ini.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] border-collapse text-left">
                <thead>
                  <tr className="border-b border-slate-100 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                    <th className="pb-3 pr-3">Konsultasi</th>
                    <th className="px-3 pb-3">Keluhan</th>
                    <th className="px-3 pb-3">Kategori Awal</th>
                    <th className="px-3 pb-3 text-center">Confidence</th>
                    <th className="px-3 pb-3 text-center">Status</th>
                    <th className="pb-3 pl-3 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {pageItems.map((item) => {
                    const confidence = confidencePercent(item.confidence_score);
                    return (
                      <tr
                        key={item.id}
                        onClick={() => setSelectedConsultationId(item.id)}
                        className="cursor-pointer transition-colors hover:bg-slate-50/70"
                      >
                        <td className="py-4 pr-3 align-top">
                          <p className="font-bold text-slate-900">{item.id.slice(0, 8)}</p>
                          <p className="mt-0.5 text-[10px] text-slate-400">{formatDateShortIndonesia(item.created_at)}</p>
                        </td>
                        <td className="max-w-[260px] px-3 py-4 align-top">
                          <p className="line-clamp-2 leading-relaxed text-slate-600">{item.complaint_text}</p>
                        </td>
                        <td className="px-3 py-4 align-top capitalize text-slate-700">
                          {item.possible_category || '-'}
                        </td>
                        <td className="px-3 py-4 text-center align-top font-bold text-slate-800">
                          {confidence === null ? '-' : `${confidence}%`}
                        </td>
                        <td className="px-3 py-4 text-center align-top">
                          <span className={`inline-flex rounded-full border px-2.5 py-1 text-[10px] font-semibold ${statusClass(item.status)}`}>
                            {statusLabels[item.status]}
                          </span>
                        </td>
                        <td className="py-4 pl-3 text-center align-top" onClick={(event) => event.stopPropagation()}>
                          <div className="flex items-center justify-center gap-2">
                            <button
                              type="button"
                              onClick={() => openDetail(item.id)}
                              className="rounded-lg bg-blue-50 px-3 py-1.5 text-[10px] font-bold text-blue-700 hover:bg-blue-100"
                            >
                              {item.status === 'analyzed'
                                ? 'Ambil'
                                : item.status === 'in_review'
                                  ? 'Tinjau'
                                  : 'Lihat'}
                            </button>
                            {item.status === 'reviewed' && (
                              <button
                                type="button"
                                onClick={() => openCloseConfirmation(item)}
                                className="rounded-lg bg-rose-50 px-3 py-1.5 text-[10px] font-bold text-rose-700 hover:bg-rose-100"
                              >
                                Tutup Kasus
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {!isLoading && !error && filteredItems.length > 0 && (
            <div className="flex items-center justify-between border-t border-slate-100 pt-4 text-xs text-slate-500">
              <span>
                Menampilkan {(safePage - 1) * PAGE_SIZE + 1}–{Math.min(safePage * PAGE_SIZE, filteredItems.length)} dari {filteredItems.length}
              </span>
              <div className="flex gap-2">
                <button type="button" disabled={safePage <= 1} onClick={() => setPage((current) => Math.max(1, current - 1))} className="rounded-lg border border-slate-200 px-3 py-1.5 disabled:opacity-40">
                  Sebelumnya
                </button>
                <button type="button" disabled={safePage >= totalPages} onClick={() => setPage((current) => Math.min(totalPages, current + 1))} className="rounded-lg border border-slate-200 px-3 py-1.5 disabled:opacity-40">
                  Berikutnya
                </button>
              </div>
            </div>
          )}
        </section>

        <aside className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xs">
          <h2 className="border-b border-slate-100 pb-3 text-sm font-extrabold text-slate-900">Detail Singkat</h2>
          {activeItem ? (
            <div className="mt-4 space-y-4 text-xs">
              <div>
                <span className="text-slate-400">ID Konsultasi</span>
                <p className="mt-1 break-all font-bold text-slate-900">{activeItem.id}</p>
              </div>
              <div>
                <span className="text-slate-400">Ringkasan Keluhan</span>
                <p className="mt-1 leading-relaxed text-slate-700">{activeItem.complaint_text}</p>
              </div>
              <div>
                <span className="text-slate-400">Ringkasan Analisis Awal</span>
                <p className="mt-1 leading-relaxed text-slate-700">{activeItem.ai_summary || '-'}</p>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Status</span>
                <span className="font-bold text-slate-800">{statusLabels[activeItem.status]}</span>
              </div>
              <div className="rounded-2xl border border-blue-100 bg-blue-50/50 p-3.5 text-[11px] leading-relaxed text-slate-500">
                Hasil AI adalah analisis awal dan bukan diagnosis medis final.
              </div>
              <button type="button" onClick={() => openDetail(activeItem.id)} className="w-full rounded-2xl bg-blue-600 py-3 text-xs font-extrabold text-white hover:bg-blue-700">
                {activeItem.status === 'analyzed'
                  ? 'Ambil Konsultasi'
                  : activeItem.status === 'in_review'
                    ? 'Buka Form Review'
                    : 'Lihat Detail'}
              </button>
              {activeItem.status === 'reviewed' && (
                <button type="button" onClick={() => openCloseConfirmation(activeItem)} className="w-full rounded-2xl border border-rose-200 py-3 text-xs font-extrabold text-rose-700 hover:bg-rose-50">
                  Tutup Kasus
                </button>
              )}
            </div>
          ) : (
            <p className="py-10 text-center text-xs text-slate-400">Pilih konsultasi untuk melihat detail.</p>
          )}
        </aside>
      </div>

      <DoctorReviewSlideover
        isOpen={isSlideoverOpen}
        consultationId={selectedConsultationId}
        onClose={() => setIsSlideoverOpen(false)}
        onSuccessReview={refreshLists}
      />
      <ConfirmCloseModal
        isOpen={isConfirmModalOpen}
        isLoading={isStatusUpdating}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={handleConfirmClose}
      />
    </div>
  );
}
