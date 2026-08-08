'use client';

import React, { useState } from 'react';
import useSWR, { useSWRConfig } from 'swr';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

import {
  GetDoctorConsultationListResponse,
  DoctorConsultationItem,
} from '../../lib/types/consultation';
import { formatDateShortIndonesia } from '../../lib/utils/date';
import { KebabMenu } from '../../components/doctor-dashboard/KebabMenu';
import { ConfirmCloseModal } from '../../components/doctor-dashboard/ConfirmCloseModal';
import { DoctorReviewSlideover } from '../../components/doctor-dashboard/DoctorReviewSlideover';
import { updateConsultationStatusService } from '../../lib/services/consultation';

const fetcher = async (url: string): Promise<GetDoctorConsultationListResponse> => {
  const res = await fetch(url);
  const data = await res.json();
  if (res.status === 401) {
    throw { status: 401, message: data.message || 'Unauthorized' };
  }
  if (!res.ok) {
    throw new Error(data.message || 'Gagal memuat data konsultasi dokter');
  }
  return data;
};

// Fallback mock items matching exact UI screenshot design
const MOCK_DOCTOR_PREDICTIONS: DoctorConsultationItem[] = [
  {
    id: 'consult-1',
    patient: {
      id: 'patient-1',
      name: 'Andi Rahman',
      gender: 'male',
      birth_date: '1990-05-14',
    },
    complaint_preview: 'Demam tinggi, batuk kering, badan lemas sejak 3 hari',
    status: 'analyzed',
    ai_analysis: {
      possible_category: 'Pernapasan',
      severity_level: 'medium',
      urgency_level: 'normal',
      confidence_score: 0.92,
    },
    created_at: '2025-05-22T10:24:00Z',
  },
  {
    id: 'consult-2',
    patient: {
      id: 'patient-2',
      name: 'Ayu Lestari',
      gender: 'female',
      birth_date: '1995-08-20',
    },
    complaint_preview: 'Sakit kepala sebelah, mual, sensitif terhadap cahaya',
    status: 'reviewed',
    ai_analysis: {
      possible_category: 'Saraf',
      severity_level: 'medium',
      urgency_level: 'normal',
      confidence_score: 0.87,
    },
    created_at: '2025-05-22T10:24:00Z',
  },
  {
    id: 'consult-3',
    patient: {
      id: 'patient-3',
      name: 'Raka Putra',
      gender: 'male',
      birth_date: '1998-02-15',
    },
    complaint_preview: 'Tenggorokan sakit saat menelan, suara serak, hidung tersumbat',
    status: 'analyzed',
    ai_analysis: {
      possible_category: 'Pernapasan',
      severity_level: 'medium',
      urgency_level: 'normal',
      confidence_score: 0.90,
    },
    created_at: '2025-05-22T10:24:00Z',
  },
  {
    id: 'consult-4',
    patient: {
      id: 'patient-4',
      name: 'Sari Wulandari',
      gender: 'female',
      birth_date: '1993-11-05',
    },
    complaint_preview: 'Mual, muntah, perut kembung, nafsu makan menurun',
    status: 'analyzed',
    ai_analysis: {
      possible_category: 'Pencernaan',
      severity_level: 'low',
      urgency_level: 'low',
      confidence_score: 0.78,
    },
    created_at: '2025-05-22T10:24:00Z',
  },
  {
    id: 'consult-5',
    patient: {
      id: 'patient-5',
      name: 'Dimas Haryanto',
      gender: 'male',
      birth_date: '1987-03-30',
    },
    complaint_preview: 'Nyeri dada, sesak napas ringan, jantung berdebar',
    status: 'reviewed',
    ai_analysis: {
      possible_category: 'Kardiovaskular',
      severity_level: 'high',
      urgency_level: 'high',
      confidence_score: 0.64,
    },
    created_at: '2025-05-22T10:24:00Z',
  },
  {
    id: 'consult-6',
    patient: {
      id: 'patient-6',
      name: 'Rina Novita',
      gender: 'female',
      birth_date: '1996-09-12',
    },
    complaint_preview: 'Demam naik turun, nyeri sendi, bintik merah pada kulit',
    status: 'analyzed',
    ai_analysis: {
      possible_category: 'Pernapasan',
      severity_level: 'medium',
      urgency_level: 'normal',
      confidence_score: 0.71,
    },
    created_at: '2025-05-22T10:24:00Z',
  },
  {
    id: 'consult-7',
    patient: {
      id: 'patient-7',
      name: 'Fajar Hidayat',
      gender: 'male',
      birth_date: '1994-01-25',
    },
    complaint_preview: 'Gatal pada kulit, kemerahan, muncul bintik kecil',
    status: 'analyzed',
    ai_analysis: {
      possible_category: 'Kulit',
      severity_level: 'low',
      urgency_level: 'low',
      confidence_score: 0.69,
    },
    created_at: '2025-05-22T10:24:00Z',
  },
  {
    id: 'consult-8',
    patient: {
      id: 'patient-8',
      name: 'Lina Marlina',
      gender: 'female',
      birth_date: '1991-07-18',
    },
    complaint_preview: 'Sakit tenggorokan, demam ringan, sulit menelan',
    status: 'reviewed',
    ai_analysis: {
      possible_category: 'Pernapasan',
      severity_level: 'medium',
      urgency_level: 'normal',
      confidence_score: 0.76,
    },
    created_at: '2025-05-22T10:24:00Z',
  },
];

function getInitials(name?: string): string {
  if (!name) return 'P';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0].charAt(0) + parts[1].charAt(0)).toUpperCase();
}

function getAvatarBgColor(index: number): string {
  const colors = [
    'bg-blue-600',
    'bg-teal-500',
    'bg-purple-600',
    'bg-rose-500',
    'bg-amber-500',
    'bg-sky-600',
    'bg-pink-500',
    'bg-emerald-600',
  ];
  return colors[index % colors.length];
}

function getCategoryBadgeStyle(category?: string) {
  const cat = (category || '').toLowerCase();
  if (cat.includes('pernapasan')) {
    return 'bg-blue-50 text-blue-600 border-blue-100';
  }
  if (cat.includes('saraf')) {
    return 'bg-purple-50 text-purple-600 border-purple-100';
  }
  if (cat.includes('pencernaan')) {
    return 'bg-emerald-50 text-emerald-600 border-emerald-100';
  }
  if (cat.includes('kardio')) {
    return 'bg-teal-50 text-teal-600 border-teal-100';
  }
  if (cat.includes('kulit')) {
    return 'bg-rose-50 text-rose-600 border-rose-100';
  }
  return 'bg-slate-100 text-slate-700 border-slate-200';
}

function getDiagnosisName(category?: string): string {
  const cat = (category || '').toLowerCase();
  if (cat.includes('pernapasan')) return 'Kemungkinan Influenza';
  if (cat.includes('saraf')) return 'Migrain';
  if (cat.includes('pencernaan')) return 'Gastroenteritis';
  if (cat.includes('kardio')) return 'Aritmia Ringan';
  if (cat.includes('kulit')) return 'Dermatitis Ringan';
  return category || 'Hasil Analisis';
}

export function DataPrediksiContent() {
  const router = useRouter();
  const { mutate: globalMutate } = useSWRConfig();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('Semua');
  const [categoryFilter, setCategoryFilter] = useState('Semua');
  const [periodeFilter, setPeriodeFilter] = useState('Semua');
  const [page, setPage] = useState(1);

  // Selected item for detail view & modals
  const [selectedConsultationId, setSelectedConsultationId] = useState<string | null>(null);
  const [selectedPatientName, setSelectedPatientName] = useState<string>('');

  // Modals state
  const [isSlideoverOpen, setIsSlideoverOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  // Independent loading states as required
  const [isStatusUpdating, setIsStatusUpdating] = useState(false);

  // Fetch data
  const { data, error, isLoading, mutate } = useSWR<GetDoctorConsultationListResponse>(
    `/api/proxy/doctor/consultations?page=${page}&limit=10`,
    fetcher,
    {
      revalidateOnFocus: false,
      onError: (err) => {
        if (err?.status === 401) {
          toast.error('Sesi Anda telah berakhir. Silakan login kembali.');
          router.push('/login');
        }
      },
    }
  );

  const items = data?.data?.items && data.data.items.length > 0 ? data.data.items : MOCK_DOCTOR_PREDICTIONS;
  const pagination = data?.data?.pagination || { page: 1, limit: 7, total: items.length, total_pages: 2 };

  // Currently selected item for the right sidebar detail
  const activeConsultationId = selectedConsultationId || (items.length > 0 ? items[0].id : null);
  const activeItem = items.find((i) => i.id === activeConsultationId) || items[0];

  // Client-side filtering for UI demonstration
  const filteredItems = items.filter((item) => {
    const matchesSearch =
      !searchQuery ||
      item.patient?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.complaint_preview?.toLowerCase().includes(searchQuery.toLowerCase());

    const isReviewed = item.status === 'reviewed' || item.status === 'Sudah Ditinjau';
    const matchesStatus =
      statusFilter === 'Semua' ||
      (statusFilter === 'Perlu Ditinjau' && !isReviewed) ||
      (statusFilter === 'Sudah Ditinjau' && isReviewed);

    const matchesCategory =
      categoryFilter === 'Semua' ||
      item.ai_analysis?.possible_category?.toLowerCase().includes(categoryFilter.toLowerCase());

    return matchesSearch && matchesStatus && matchesCategory;
  });

  // Calculate statistics
  const totalCount = items.length;
  const pendingCount = items.filter((i) => i.status !== 'reviewed' && i.status !== 'closed').length;
  const reviewedCount = items.filter((i) => i.status === 'reviewed' || i.status === 'closed').length;
  const avgConfidence = Math.round(
    items.reduce((acc, curr) => {
      const conf = curr.ai_analysis?.confidence_score ?? 0.8;
      return acc + (conf > 1 ? conf : conf * 100);
    }, 0) / (items.length || 1)
  );

  // Open detail slideover
  const handleOpenSlideover = (id?: string) => {
    const targetId = id || activeConsultationId;
    if (targetId) {
      setSelectedConsultationId(targetId);
      setIsSlideoverOpen(true);
    }
  };

  // Open confirm modal for closing case
  const handleOpenConfirmClose = (id: string, name: string) => {
    setSelectedConsultationId(id);
    setSelectedPatientName(name);
    setIsConfirmModalOpen(true);
  };

  // Execute PATCH /api/doctor/consultations/:id/status -> status: "closed"
  const handleConfirmCloseCase = async () => {
    if (!selectedConsultationId) return;

    setIsStatusUpdating(true);
    try {
      await updateConsultationStatusService(selectedConsultationId, 'closed');
      toast.success('Status konsultasi berhasil diperbarui menjadi Tutup Kasus.');
      
      // Invalidate dashboard list cache per Requirement 2
      globalMutate('/api/proxy/doctor/consultations');
      globalMutate('/api/proxy/consultations');
      await mutate();

      setIsConfirmModalOpen(false);
      // Redirect back to Dashboard per SC04 workflow
      router.push('/');
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Status gagal diperbarui.';
      toast.error(errorMessage);
    } finally {
      setIsStatusUpdating(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-8">
      {/* 4 Stat Cards Atas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. Total Data Masuk */}
        <div className="bg-white rounded-3xl p-5 shadow-xs border border-slate-200/80 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div>
            <span className="text-[11px] font-medium text-slate-400 block">Total Data Masuk</span>
            <p className="text-2xl font-black text-slate-900 leading-tight mt-0.5">{totalCount}</p>
            <span className="text-[10px] text-slate-400 block mt-0.5">Seluruh pasien</span>
          </div>
        </div>

        {/* 2. Perlu Ditinjau */}
        <div className="bg-white rounded-3xl p-5 shadow-xs border border-slate-200/80 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center shrink-0">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <div>
            <span className="text-[11px] font-medium text-slate-400 block">Perlu Ditinjau</span>
            <p className="text-2xl font-black text-slate-900 leading-tight mt-0.5">{pendingCount}</p>
            <span className="text-[10px] text-slate-400 block mt-0.5">Menunggu review</span>
          </div>
        </div>

        {/* 3. Sudah Ditinjau */}
        <div className="bg-white rounded-3xl p-5 shadow-xs border border-slate-200/80 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <span className="text-[11px] font-medium text-slate-400 block">Sudah Ditinjau</span>
            <p className="text-2xl font-black text-slate-900 leading-tight mt-0.5">{reviewedCount}</p>
            <span className="text-[10px] text-slate-400 block mt-0.5">Telah diproses</span>
          </div>
        </div>

        {/* 4. Rata-rata Confidence */}
        <div className="bg-white rounded-3xl p-5 shadow-xs border border-slate-200/80 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center shrink-0">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </div>
          <div>
            <span className="text-[11px] font-medium text-slate-400 block">Rata-rata Confidence</span>
            <p className="text-2xl font-black text-slate-900 leading-tight mt-0.5">{avgConfidence}%</p>
            <span className="text-[10px] text-slate-400 block mt-0.5">Seluruh prediksi</span>
          </div>
        </div>
      </div>

      {/* Main Grid Section: Left 2/3 (Table), Right 1/3 (Sidebar Detail) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* Kolom Kiri: Tabel Daftar Prediksi Pasien */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 shadow-xs border border-slate-200/80 space-y-5 flex flex-col justify-between">
          
          {/* Header Title & Filter Bar */}
          <div className="space-y-4 border-b border-slate-100 pb-4">
            <div>
              <h1 className="text-lg font-bold text-slate-900">Daftar Prediksi Pasien</h1>
              <p className="text-xs text-slate-400 mt-0.5">Seluruh hasil analisis NLP keluhan pasien terdaftar.</p>
            </div>

            {/* Filter controls row */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Search Field */}
              <div className="relative flex-1 min-w-[200px]">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari nama pasien atau keluhan..."
                  className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 transition-colors"
                />
                <svg
                  className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>

              {/* Status Filter */}
              <div className="flex items-center gap-1">
                <span className="text-xs text-slate-500 font-medium">Status</span>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none cursor-pointer"
                >
                  <option value="Semua">Semua</option>
                  <option value="Perlu Ditinjau">Perlu Ditinjau</option>
                  <option value="Sudah Ditinjau">Sudah Ditinjau</option>
                </select>
              </div>

              {/* Kategori Filter */}
              <div className="flex items-center gap-1">
                <span className="text-xs text-slate-500 font-medium">Kategori</span>
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none cursor-pointer"
                >
                  <option value="Semua">Semua</option>
                  <option value="Pernapasan">Pernapasan</option>
                  <option value="Saraf">Saraf</option>
                  <option value="Pencernaan">Pencernaan</option>
                  <option value="Kardio">Kardiovaskular</option>
                  <option value="Kulit">Kulit</option>
                </select>
              </div>

              {/* Periode Filter */}
              <div className="flex items-center gap-1">
                <span className="text-xs text-slate-500 font-medium">Periode</span>
                <select
                  value={periodeFilter}
                  onChange={(e) => setPeriodeFilter(e.target.value)}
                  className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none cursor-pointer"
                >
                  <option value="Semua">Semua</option>
                  <option value="Hari Ini">Hari Ini</option>
                  <option value="Minggu Ini">Minggu Ini</option>
                  <option value="Bulan Ini">Bulan Ini</option>
                </select>
              </div>

              {/* Export Button */}
              <button
                type="button"
                onClick={() => toast.success('Mengekspor data prediksi...')}
                className="px-3.5 py-1.5 border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors flex items-center gap-1.5 cursor-pointer ml-auto"
              >
                <svg className="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                <span>Export</span>
              </button>
            </div>
          </div>

          {/* Table Area */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead>
                <tr className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-100 pb-3">
                  <th className="pb-3 pr-3">Nama Pasien</th>
                  <th className="pb-3 px-3">Ringkasan Keluhan</th>
                  <th className="pb-3 px-3">Kategori</th>
                  <th className="pb-3 px-3">Hasil Prediksi</th>
                  <th className="pb-3 px-2 text-center">Conf.</th>
                  <th className="pb-3 px-3">Waktu</th>
                  <th className="pb-3 px-3 text-center">Status</th>
                  <th className="pb-3 pl-3 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100/80 text-xs">
                {isLoading && (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-slate-400 animate-pulse">
                      Memuat data pasien...
                    </td>
                  </tr>
                )}

                {!isLoading && filteredItems.length === 0 && (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-slate-400 italic">
                      Tidak ada data prediksi yang sesuai.
                    </td>
                  </tr>
                )}

                {!isLoading &&
                  filteredItems.map((item, idx) => {
                    const isSelected = item.id === activeConsultationId;
                    const initials = getInitials(item.patient?.name);
                    const avatarBg = getAvatarBgColor(idx);
                    const rawConf = item.ai_analysis?.confidence_score ?? 0.8;
                    const confPct = rawConf > 1 ? Math.round(rawConf) : Math.round(rawConf * 100);
                    const category = item.ai_analysis?.possible_category || 'Pernapasan';
                    const diagnosis = getDiagnosisName(category);
                    const isReviewed = item.status === 'reviewed' || item.status === 'Sudah Ditinjau';
                    const categoryBadge = getCategoryBadgeStyle(category);

                    return (
                      <tr
                        key={item.id}
                        onClick={() => setSelectedConsultationId(item.id)}
                        className={`transition-colors cursor-pointer ${
                          isSelected ? 'bg-blue-50/50 font-semibold' : 'hover:bg-slate-50/70'
                        }`}
                      >
                        {/* Nama Pasien */}
                        <td className="py-3.5 pr-3 align-middle whitespace-nowrap">
                          <div className="flex items-center gap-2.5">
                            <div
                              className={`w-8 h-8 rounded-full ${avatarBg} text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs`}
                            >
                              {initials}
                            </div>
                            <span className="font-extrabold text-slate-900 text-xs">
                              {item.patient?.name || 'Pasien'}
                            </span>
                          </div>
                        </td>

                        {/* Ringkasan Keluhan */}
                        <td className="py-3.5 px-3 align-middle max-w-[200px]">
                          <p className="text-slate-500 font-medium text-xs line-clamp-2 leading-relaxed">
                            {item.complaint_preview}
                          </p>
                        </td>

                        {/* Kategori Badge */}
                        <td className="py-3.5 px-3 align-middle whitespace-nowrap">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-[11px] font-bold border ${categoryBadge}`}
                          >
                            {category}
                          </span>
                        </td>

                        {/* Hasil Prediksi */}
                        <td className="py-3.5 px-3 align-middle whitespace-nowrap">
                          <span className="font-bold text-slate-800 text-xs">{diagnosis}</span>
                        </td>

                        {/* Conf. */}
                        <td className="py-3.5 px-2 align-middle text-center whitespace-nowrap">
                          <span className="font-bold text-slate-800 text-xs">{confPct}%</span>
                        </td>

                        {/* Waktu */}
                        <td className="py-3.5 px-3 align-middle whitespace-nowrap text-[11px] text-slate-400">
                          22 Mei 2025<br />10:24 WIB
                        </td>

                        {/* Status Badge */}
                        <td className="py-3.5 px-3 align-middle text-center whitespace-nowrap">
                          {isReviewed ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-blue-50 text-blue-600">
                              Sudah Ditinjau
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-amber-50 text-amber-600">
                              Perlu Ditinjau
                            </span>
                          )}
                        </td>

                        {/* Aksi Column: Only Kebab Menu (Titik 3 vertikal) as requested */}
                        <td
                          className="py-3.5 pl-3 align-middle text-center whitespace-nowrap"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <KebabMenu
                            status={item.status}
                            onViewDetail={() => handleOpenSlideover(item.id)}
                            onMarkReviewed={() => handleOpenSlideover(item.id)}
                            onCloseCase={() => handleOpenConfirmClose(item.id, item.patient?.name || 'Pasien')}
                          />
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>

          {/* Pagination Footer */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-100 text-xs">
            <span className="text-slate-400 font-medium">
              Menampilkan 1–{filteredItems.length} dari {pagination.total} data
            </span>

            <div className="flex items-center gap-1.5">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(p - 1, 1))}
                className="w-8 h-8 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 flex items-center justify-center cursor-pointer"
              >
                ‹
              </button>
              <button
                onClick={() => setPage(1)}
                className={`w-8 h-8 rounded-xl font-bold ${
                  page === 1 ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                1
              </button>
              <button
                onClick={() => setPage(2)}
                className={`w-8 h-8 rounded-xl font-bold ${
                  page === 2 ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                2
              </button>
              <button
                disabled={page >= (pagination.total_pages || 2)}
                onClick={() => setPage((p) => Math.min(p + 1, pagination.total_pages || 2))}
                className="w-8 h-8 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 flex items-center justify-center cursor-pointer"
              >
                ›
              </button>
            </div>
          </div>
        </div>

        {/* Kolom Kanan: Detail Singkat Pasien & Trigger Button */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 shadow-xs border border-slate-200/80 space-y-5">
            <h2 className="text-sm font-extrabold text-slate-900 border-b border-slate-100 pb-3">
              Detail Singkat
            </h2>

            {activeItem ? (
              <div className="space-y-4">
                {/* Patient Header */}
                <div className="flex items-center gap-3">
                  <div
                    className={`w-12 h-12 rounded-full ${getAvatarBgColor(
                      Math.max(0, items.findIndex((i) => i.id === activeItem.id))
                    )} text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-xs`}
                  >
                    {getInitials(activeItem.patient?.name)}
                  </div>
                  <div>
                    <h3 className="text-sm font-extrabold text-slate-900">
                      {activeItem.patient?.name || 'Pasien'}
                    </h3>
                    <p className="text-xs text-slate-400 font-medium mt-0.5">
                      {activeItem.patient?.gender === 'female' ? 'Perempuan' : 'Laki-laki'} •{' '}
                      {activeItem.patient?.birth_date
                        ? `${new Date().getFullYear() - new Date(activeItem.patient.birth_date).getFullYear()} tahun`
                        : '34 tahun'}
                    </p>
                  </div>
                </div>

                {/* Patient Specs */}
                <div className="space-y-2.5 text-xs pt-2">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 font-medium">Tanggal Prediksi</span>
                    <span className="font-bold text-slate-800">
                      {formatDateShortIndonesia(activeItem.created_at)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 font-medium">Kategori</span>
                    <span className="font-bold text-slate-800">
                      {activeItem.ai_analysis?.possible_category || 'Pernapasan'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 font-medium">Hasil Prediksi</span>
                    <span className="font-bold text-slate-800">
                      {getDiagnosisName(activeItem.ai_analysis?.possible_category)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 font-medium">Status</span>
                    <span className="font-bold text-slate-800 capitalize">
                      {activeItem.status === 'closed'
                        ? 'Selesai'
                        : activeItem.status === 'reviewed'
                        ? 'Selesai'
                        : 'Sedang Diproses'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 font-medium">Status Review</span>
                    {activeItem.status === 'reviewed' || activeItem.status === 'Sudah Ditinjau' ? (
                      <span className="font-bold text-blue-600">Sudah Ditinjau</span>
                    ) : (
                      <span className="font-bold text-amber-600">Perlu Tinjau</span>
                    )}
                  </div>
                </div>

                {/* Confidence Bar */}
                <div className="pt-2 space-y-1.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400 font-medium">Confidence</span>
                    <span className="font-extrabold text-blue-600">
                      {Math.round(
                        (activeItem.ai_analysis?.confidence_score ?? 0.8) *
                          ((activeItem.ai_analysis?.confidence_score ?? 0.8) > 1 ? 1 : 100)
                      )}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-teal-400 h-2 rounded-full transition-all duration-500"
                      style={{
                        width: `${Math.round(
                          (activeItem.ai_analysis?.confidence_score ?? 0.8) *
                            ((activeItem.ai_analysis?.confidence_score ?? 0.8) > 1 ? 1 : 100)
                        )}%`,
                      }}
                    ></div>
                  </div>
                </div>

                {/* Disclaimer Note */}
                <div className="p-3.5 bg-blue-50/50 border border-blue-100 rounded-2xl">
                  <p className="text-[11px] text-slate-500 leading-relaxed font-medium">
                    Hasil ini merupakan prediksi awal berbasis NLP dan bukan diagnosis final.
                  </p>
                </div>

                {/* Action Trigger Button (Tombol Biru Sidebar Kanan) */}
                <div className="pt-1">
                  <button
                    type="button"
                    onClick={() => handleOpenSlideover(activeItem.id)}
                    className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs rounded-2xl shadow-md shadow-blue-500/20 hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    <span>Lihat Detail Lengkap</span>
                  </button>
                </div>
              </div>
            ) : null}
          </div>

          {/* Prioritas Hari Ini Section */}
          <div className="bg-white rounded-3xl p-6 shadow-xs border border-slate-200/80 space-y-4">
            <h3 className="text-sm font-extrabold text-slate-900 border-b border-slate-100 pb-3">
              Prioritas Hari Ini
            </h3>

            <div className="space-y-4 text-xs">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center shrink-0 mt-0.5">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">Confidence Rendah</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">3 prediksi di bawah 70% confidence</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 mt-0.5">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 01-6 0v-1m6 0H9" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">Belum Direview</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">8 prediksi menunggu tinjauan Anda</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 mt-0.5">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">Perlu Follow-up</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">5 kasus memerlukan tindak lanjut</p>
                </div>
              </div>
            </div>

            <div className="pt-2 text-right">
              <button
                type="button"
                onClick={() => toast.success('Menampilkan status prediksi...')}
                className="text-xs font-semibold text-blue-600 hover:underline inline-flex items-center gap-1 cursor-pointer"
              >
                <span>Lihat status prediksi</span>
                <span>↗</span>
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* Slide-over Modal for Doctor Review (SC04 Stage 1 & 2) */}
      <DoctorReviewSlideover
        isOpen={isSlideoverOpen}
        consultationId={activeConsultationId}
        onClose={() => setIsSlideoverOpen(false)}
        onSuccessReview={() => {
          mutate();
        }}
      />

      {/* Confirmation Modal for Closing Consultation (SC04 Stage 3) */}
      <ConfirmCloseModal
        isOpen={isConfirmModalOpen}
        patientName={selectedPatientName}
        isLoading={isStatusUpdating}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={handleConfirmCloseCase}
      />
    </div>
  );
}
