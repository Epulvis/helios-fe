'use client';

import React, { useState } from 'react';
import useSWR from 'swr';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { GetConsultationListResponse, ConsultationListItem } from '../../lib/types/consultation';
import { formatDateIndonesia } from '../../lib/utils/date';
import { ConsultationResultModal } from '../../components/consultation/ConsultationResultModal';

const fetcher = async (url: string): Promise<GetConsultationListResponse> => {
  const res = await fetch(url);
  const data = await res.json();
  if (res.status === 401) {
    throw { status: 401, message: data.message || 'Unauthorized' };
  }
  if (!res.ok) {
    throw new Error(data.message || 'Gagal memuat riwayat konsultasi');
  }
  return data;
};

export function RiwayatPrediksiContent() {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedConsultationId, setSelectedConsultationId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const limit = 5;

  // Build query string
  const queryParams = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });
  if (statusFilter !== 'all') {
    queryParams.set('status', statusFilter);
  }

  const { data, error, isLoading, mutate } = useSWR<GetConsultationListResponse>(
    `/api/proxy/consultations?${queryParams.toString()}`,
    fetcher,
    {
      revalidateOnFocus: false,
      keepPreviousData: true,
      onError: (err) => {
        if (err?.status === 401) {
          toast.error('Sesi Anda telah habis. Silakan login kembali.');
          router.push('/login');
        }
      },
    }
  );

  const items = data?.data?.items || [];
  const pagination = data?.data?.pagination || { page: 1, limit: 7, total: 0, total_pages: 1 };
  const statistics = data?.data?.statistics || {
    this_month: 0,
    best_confidence: 0,
    top_diagnosis: '-',
    distribution: {},
  };

  const handleOpenDetail = (id: string) => {
    setSelectedConsultationId(id);
    setIsModalOpen(true);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'processing':
        return (
          <span className="inline-flex items-center justify-center w-32 py-1 px-2.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200/80 text-center">
            Sedang Diproses
          </span>
        );
      case 'analyzed':
        return (
          <span className="inline-flex items-center justify-center w-32 py-1 px-2.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200/80 text-center">
            Dianalisis
          </span>
        );
      case 'reviewed':
        return (
          <span className="inline-flex items-center justify-center w-32 py-1 px-2.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/80 text-center">
            Selesai / Diulas
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center justify-center w-32 py-1 px-2.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 border border-slate-200/80 text-center capitalize">
            {status}
          </span>
        );
    }
  };

  const getCategoryBadge = (category?: string) => {
    const name = category || 'Umum';
    const catLower = name.toLowerCase();

    let colorStyle = 'bg-blue-50 text-blue-700 border-blue-200/80';
    if (catLower.includes('influenza') || catLower.includes('pernapasan')) {
      colorStyle = 'bg-emerald-50 text-emerald-700 border-emerald-200/80';
    } else if (catLower.includes('faringitis') || catLower.includes('tht')) {
      colorStyle = 'bg-amber-50 text-amber-700 border-amber-200/80';
    } else if (catLower.includes('gastritis') || catLower.includes('pencernaan')) {
      colorStyle = 'bg-orange-50 text-orange-700 border-orange-200/80';
    } else if (catLower.includes('migrain') || catLower.includes('saraf')) {
      colorStyle = 'bg-purple-50 text-purple-700 border-purple-200/80';
    }

    return (
      <div className="flex flex-col items-start">
        <span className={`inline-flex items-center text-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${colorStyle} capitalize`}>
          {name}
        </span>
      </div>
    );
  };


  const formatConfidence = (score?: number) => {
    if (score === undefined || score === null) return null;
    const pct = score > 1 ? score : Math.round(score * 100);
    return pct;
  };

  // Convert distribution dict or items frequency to normalized array summing to 100%
  const getNormalizedDistribution = () => {
    let rawDist: Record<string, number> = {};

    if (statistics.distribution && Object.keys(statistics.distribution).length > 0) {
      rawDist = statistics.distribution;
    } else if (items.length > 0) {
      items.forEach((item) => {
        const cat = item.category || 'Umum';
        rawDist[cat] = (rawDist[cat] || 0) + 1;
      });
    }

    const totalSum = Object.values(rawDist).reduce((sum, val) => sum + (typeof val === 'number' ? val : 0), 0);
    if (totalSum === 0) return [];

    return Object.entries(rawDist)
      .map(([name, val]) => {
        const num = typeof val === 'number' ? val : 0;
        const pct = (num / totalSum) * 100;
        return {
          name,
          pct: Math.round(pct * 10) / 10, // formatted to 1 decimal place e.g. 41.7%
        };
      })
      .sort((a, b) => b.pct - a.pct);
  };

  const distributionArray = getNormalizedDistribution();


  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Title */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Riwayat Prediksi</h1>
      </div>

      {/* Header Bento Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Prediksi */}
        <div className="bg-white rounded-3xl p-5 shadow-xs border border-slate-200/80 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div>
            <span className="text-[11px] font-medium text-slate-400 block">Total Prediksi</span>
            <p className="text-2xl font-black text-slate-900 leading-tight">
              {isLoading ? '...' : pagination.total}
            </p>
            <span className="text-[10px] text-slate-400 block mt-0.5">Semua waktu</span>
          </div>
        </div>

        {/* Prediksi Bulan Ini */}
        <div className="bg-white rounded-3xl p-5 shadow-xs border border-slate-200/80 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <span className="text-[11px] font-medium text-slate-400 block">Prediksi Bulan Ini</span>
            <p className="text-2xl font-black text-slate-900 leading-tight">
              {isLoading ? '...' : statistics.this_month}
            </p>
            <span className="text-[10px] text-slate-400 block mt-0.5">Aktivitas terkini</span>
          </div>
        </div>

        {/* Confidence Terbaik */}
        <div className="bg-white rounded-3xl p-5 shadow-xs border border-slate-200/80 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </div>
          <div>
            <span className="text-[11px] font-medium text-slate-400 block">Confidence Terbaik</span>
            <p className="text-2xl font-black text-emerald-600 leading-tight">
              {isLoading ? '...' : `${formatConfidence(statistics.best_confidence) ?? 0}%`}
            </p>
            <span className="text-[10px] text-slate-400 block mt-0.5">Tingkat keyakanan AI</span>
          </div>
        </div>

        {/* Top Diagnosis */}
        <div className="bg-white rounded-3xl p-5 shadow-xs border border-slate-200/80 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center shrink-0">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </div>
          <div className="min-w-0 flex-1">
            <span className="text-[11px] font-medium text-slate-400 block">Diagnosis Terbanyak</span>
            <p className="text-base font-bold text-slate-900 leading-tight truncate capitalize">
              {isLoading ? '...' : statistics.top_diagnosis || '-'}
            </p>
            <span className="text-[10px] text-slate-400 block mt-0.5">Kategori utama</span>
          </div>
        </div>
      </div>

      {/* Main Content Area: Bento Layout (Left Table, Right Sidebar matched height) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
        {/* Table Container (2 cols wide) */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 shadow-xs border border-slate-200/80 space-y-5 flex flex-col justify-between">
          <div>
            {/* Header Controls */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h2 className="text-base font-bold text-slate-900">
                  Daftar Riwayat Prediksi
                </h2>
                <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-600 text-xs font-semibold">
                  {pagination.total} data
                </span>
              </div>

              {/* Filter Dropdown & Export */}
              <div className="flex items-center gap-2.5 w-full sm:w-auto">
                <div className="relative flex-1 sm:flex-initial">
                  <select
                    value={statusFilter}
                    onChange={(e) => {
                      setStatusFilter(e.target.value);
                      setPage(1);
                    }}
                    className="w-full sm:w-auto pl-3.5 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:outline-none focus:border-blue-500 cursor-pointer appearance-none"
                  >
                    <option value="all">Semua Status</option>
                    <option value="processing">Sedang Diproses</option>
                    <option value="analyzed">Dianalisis</option>
                    <option value="reviewed">Selesai / Diulas</option>
                  </select>
                  <svg className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>

                <button
                  onClick={() => toast.success('Fitur ekspor laporan sedang disiapkan')}
                  className="px-3.5 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors flex items-center gap-1.5 cursor-pointer shrink-0"
                >
                  <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  <span>Export</span>
                </button>
              </div>
            </div>

            {/* Error State */}
            {error && (
              <div className="py-12 text-center space-y-4">
                <div className="w-14 h-14 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center mx-auto">
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-800">Gagal Memuat Riwayat</h3>
                  <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                    {error?.message || 'Terjadi kesalahan koneksi saat mengambil data riwayat.'}
                  </p>
                </div>
                <button
                  onClick={() => mutate()}
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
                >
                  Coba Lagi
                </button>
              </div>
            )}

            {/* Loading Skeleton */}
            {isLoading && !error && (
              <div className="space-y-4 py-2 animate-pulse">
                <div className="h-10 bg-slate-100 rounded-xl w-full"></div>
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-14 bg-slate-50 rounded-xl w-full flex items-center px-4 justify-between gap-4">
                    <div className="h-4 bg-slate-200 rounded w-1/4"></div>
                    <div className="h-4 bg-slate-200 rounded w-1/3"></div>
                    <div className="h-4 bg-slate-200 rounded w-1/6"></div>
                    <div className="h-4 bg-slate-200 rounded w-1/12"></div>
                  </div>
                ))}
              </div>
            )}

            {/* Empty State */}
            {!isLoading && !error && items.length === 0 && (
              <div className="py-12 flex flex-col items-center justify-center text-center space-y-4">
                <div className="w-20 h-20 rounded-3xl bg-blue-50/70 border border-blue-100 flex items-center justify-center text-blue-500">
                  <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div className="max-w-xs space-y-1">
                  <h3 className="text-sm font-bold text-slate-800">Data Riwayat Kosong</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Belum ada riwayat prediksi yang sesuai dengan kriteria filter saat ini.
                  </p>
                </div>
                <Link
                  href="/prediksi-baru"
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer inline-flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  <span>Buat Prediksi Baru</span>
                </Link>
              </div>
            )}

            {/* Data Table */}
            {!isLoading && !error && items.length > 0 && (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 text-[11px] font-semibold tracking-wider text-slate-400 uppercase text-center">
                      <th className="py-3.5 pr-4">Tanggal</th>
                      <th className="py-3.5 px-4">Gejala / Keluhan</th>
                      <th className="py-3.5 px-4">Diagnosa</th>
                      <th className="py-3.5 px-4">Confidence</th>
                      <th className="py-3.5 px-4">Status</th>
                      <th className="py-3.5 pl-4 text-center">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs">
                    {items.map((item: ConsultationListItem) => {
                      const confidencePct = formatConfidence(item.confidence_score);
                      return (
                        <tr key={item.id} className="hover:bg-slate-50/60 transition-colors group">
                          {/* Tanggal */}
                          <td className="py-4 pr-4 align-top whitespace-nowrap">
                            <span className="font-semibold text-slate-800 block">
                              {formatDateIndonesia(item.created_at)}
                            </span>
                          </td>

                          {/* Gejala / Keluhan */}
                          <td className="py-4 px-4 align-top">
                            <p className="text-slate-700 font-medium line-clamp-2 max-w-xs leading-relaxed">
                              {item.complaint_text}
                            </p>
                          </td>

                          {/* Diagnosa */}
                          <td className="py-4 px-4 align-top">
                            {getCategoryBadge(item.category)}
                          </td>

                          {/* Confidence */}
                          <td className="py-4 px-4 align-top">
                            {confidencePct !== null ? (
                              <div className="flex items-center gap-2.5 pt-0.5">
                                <span className="font-bold text-slate-800 text-xs shrink-0 w-8">{confidencePct}%</span>
                                <div className="w-16 bg-slate-100 rounded-full h-2 overflow-hidden shrink-0">
                                  <div
                                    className="bg-emerald-500 h-2 rounded-full transition-all duration-300"
                                    style={{ width: `${confidencePct}%` }}
                                  ></div>
                                </div>
                              </div>
                            ) : (
                              <span className="text-slate-400 font-medium">-</span>
                            )}
                          </td>

                          {/* Status */}
                          <td className="py-4 px-4 align-top whitespace-nowrap">
                            {getStatusBadge(item.status)}
                          </td>

                          {/* Aksi (Eye View Icon) */}
                          <td className="py-4 pl-4 align-top text-center">
                            <button
                              onClick={() => handleOpenDetail(item.id)}
                              title="Lihat Detail"
                              className="p-2 rounded-xl text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-all cursor-pointer inline-flex items-center justify-center"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              </svg>
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Pagination Controls Footer */}
          {!isLoading && !error && items.length > 0 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-100 text-xs shrink-0">
              <span className="text-slate-500 font-medium">
                Menampilkan {items.length > 0 ? (pagination.page - 1) * pagination.limit + 1 : 0}–
                {Math.min(pagination.page * pagination.limit, pagination.total)} dari {pagination.total} data
              </span>

              <div className="flex items-center gap-1.5">
                <button
                  disabled={pagination.page <= 1}
                  onClick={() => setPage((p) => Math.max(p - 1, 1))}
                  className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>

                {[...Array(pagination.total_pages || 1)].map((_, idx) => {
                  const pageNum = idx + 1;
                  const isActive = pageNum === pagination.page;
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setPage(pageNum)}
                      className={`w-8 h-8 rounded-xl font-bold transition-all cursor-pointer ${isActive
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'text-slate-600 hover:bg-slate-100'
                        }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}

                <button
                  disabled={pagination.page >= (pagination.total_pages || 1)}
                  onClick={() => setPage((p) => Math.min(p + 1, pagination.total_pages || 1))}
                  className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Sidebar (Statistik & Tips) - height matches left table */}
        <div className="flex flex-col justify-between gap-6 h-full">
          {/* Card Statistik Riwayat */}
          <div className="bg-white rounded-3xl p-6 shadow-xs border border-slate-200/80 flex-1 flex flex-col justify-between space-y-5">
            <div className="space-y-4">
              <div className="flex items-center gap-2.5">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <h3 className="text-sm font-bold text-slate-900">Statistik Riwayat</h3>
              </div>

              <div className="space-y-3">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                  Distribusi Diagnosis
                </span>

                {distributionArray.length > 0 ? (
                  <div className="space-y-3">
                    {distributionArray.map((item, idx) => {
                      const colors = [
                        'bg-blue-500',
                        'bg-emerald-500',
                        'bg-purple-500',
                        'bg-amber-500',
                        'bg-rose-500',
                      ];
                      const barColor = colors[idx % colors.length];
                      return (
                        <div key={item.name} className="space-y-1">
                          <div className="flex justify-between text-xs font-semibold">
                            <span className="text-slate-700 capitalize">{item.name}</span>
                            <span className="text-slate-900">{item.pct}%</span>
                          </div>
                          <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                            <div
                              className={`${barColor} h-2 rounded-full transition-all duration-500`}
                              style={{ width: `${item.pct}%` }}
                            ></div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-xs text-slate-400 italic">Belum ada data distribusi</p>
                )}
              </div>
            </div>

            {/* Highlight Box Penyakit Sering */}
            {statistics.top_diagnosis && statistics.top_diagnosis !== '-' && (
              <div className="p-4 bg-blue-50/60 border border-blue-100 rounded-2xl flex items-center justify-between mt-auto">
                <div>
                  <span className="text-[10px] font-semibold text-blue-600 uppercase tracking-wider block">
                    Penyakit paling sering
                  </span>
                  <p className="text-xs font-bold text-slate-900 capitalize mt-0.5">
                    {statistics.top_diagnosis}
                  </p>
                </div>
                <span className="px-2.5 py-1 bg-blue-100 text-blue-800 text-xs font-bold rounded-xl">
                  Dominan
                </span>
              </div>
            )}
          </div>

          {/* Card Tips */}
          <div className="bg-white rounded-3xl p-6 shadow-xs border border-slate-200/80 flex-1 flex flex-col justify-between space-y-4">
            <div className="flex items-center gap-2.5">
              <svg className="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              <h3 className="text-sm font-bold text-slate-900">Tips</h3>
            </div>

            <div className="space-y-4 flex-1 flex flex-col justify-around">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 mt-0.5">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-800">Tinjau Hasil Sebelumnya</h4>
                  <p className="text-[11px] text-slate-500 leading-relaxed mt-0.5">
                    Periksa prediksi lama untuk melihat pola gejala berulang.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center shrink-0 mt-0.5">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-800">Bandingkan Gejala</h4>
                  <p className="text-[11px] text-slate-500 leading-relaxed mt-0.5">
                    Bandingkan keluhan antar prediksi untuk evaluasi kondisi.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 mt-0.5">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-800">Catat Perkembangan</h4>
                  <p className="text-[11px] text-slate-500 leading-relaxed mt-0.5">
                    Dokumentasikan perubahan kondisi dari waktu ke waktu.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Shared Detail Modal */}
      <ConsultationResultModal
        isOpen={isModalOpen}
        consultationId={selectedConsultationId}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
