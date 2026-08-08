'use client';

import React from 'react';
import useSWR from 'swr';
import Link from 'next/link';
import { GetDoctorConsultationListResponse, DoctorConsultationItem } from '../../lib/types/consultation';

const fetcher = async (url: string): Promise<GetDoctorConsultationListResponse> => {
  const res = await fetch(url);
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Gagal memuat data konsultasi');
  }
  return data;
};

// Fallback mock items matching the user design specification
const MOCK_DOCTOR_ITEMS: DoctorConsultationItem[] = [
  {
    id: 'consult-1',
    patient: {
      id: 'patient-1',
      name: 'Budi Santoso',
      gender: 'male',
      birth_date: '1995-04-12',
    },
    complaint_preview: 'Demam tinggi, batuk kering, badan lemas sejak 3 hari',
    status: 'reviewed',
    ai_analysis: {
      possible_category: 'Pernapasan',
      severity_level: 'medium',
      urgency_level: 'normal',
      confidence_score: 0.92,
    },
    created_at: '2026-06-29T10:00:00Z',
  },
  {
    id: 'consult-2',
    patient: {
      id: 'patient-2',
      name: 'Ayu Lestari',
      gender: 'female',
      birth_date: '1998-08-20',
    },
    complaint_preview: 'Sakit kepala sebelah, mual, sensitif terhadap cahaya',
    status: 'reviewed',
    ai_analysis: {
      possible_category: 'Saraf',
      severity_level: 'medium',
      urgency_level: 'normal',
      confidence_score: 0.87,
    },
    created_at: '2026-06-29T09:30:00Z',
  },
  {
    id: 'consult-3',
    patient: {
      id: 'patient-3',
      name: 'Raka Putra',
      gender: 'male',
      birth_date: '2001-02-15',
    },
    complaint_preview: 'Tenggorokan sakit saat menelan, suara serak, hidung tersumbat',
    status: 'reviewed',
    ai_analysis: {
      possible_category: 'Pernapasan',
      severity_level: 'medium',
      urgency_level: 'normal',
      confidence_score: 0.90,
    },
    created_at: '2026-06-29T09:00:00Z',
  },
  {
    id: 'consult-4',
    patient: {
      id: 'patient-4',
      name: 'Sari Wulandari',
      gender: 'female',
      birth_date: '1992-11-05',
    },
    complaint_preview: 'Mual, muntah, perut kembung, nafsu makan menurun',
    status: 'reviewed',
    ai_analysis: {
      possible_category: 'Pencernaan',
      severity_level: 'low',
      urgency_level: 'low',
      confidence_score: 0.78,
    },
    created_at: '2026-06-29T08:15:00Z',
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
    status: 'analyzed',
    ai_analysis: {
      possible_category: 'Kardiovaskular',
      severity_level: 'high',
      urgency_level: 'high',
      confidence_score: 0.64,
    },
    created_at: '2026-06-29T07:45:00Z',
  },
  {
    id: 'consult-6',
    patient: {
      id: 'patient-6',
      name: 'Dimas Haryanto',
      gender: 'male',
      birth_date: '1987-03-30',
    },
    complaint_preview: 'Nyeri dada, sesak napas ringan, jantung berdebar',
    status: 'analyzed',
    ai_analysis: {
      possible_category: 'Kardiovaskular',
      severity_level: 'high',
      urgency_level: 'high',
      confidence_score: 0.64,
    },
    created_at: '2026-06-29T07:30:00Z',
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
    'bg-purple-500',
    'bg-rose-500',
    'bg-amber-500',
    'bg-amber-600',
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
    return 'bg-cyan-50 text-cyan-600 border-cyan-100';
  }
  return 'bg-slate-100 text-slate-700 border-slate-200';
}

function getDiagnosisName(category?: string): string {
  const cat = (category || '').toLowerCase();
  if (cat.includes('pernapasan')) return 'Kemungkinan Influenza';
  if (cat.includes('saraf')) return 'Migrain';
  if (cat.includes('pencernaan')) return 'Gastroenteritis';
  if (cat.includes('kardio')) return 'Aritmia Ringan';
  return category || 'Analisis NLP';
}

export function DoctorPredictionTable() {
  const { data, isLoading } = useSWR<GetDoctorConsultationListResponse>(
    '/api/proxy/consultations?role=doctor&page=1&limit=6',
    fetcher,
    { revalidateOnFocus: false }
  );

  const items = data?.data?.items && data.data.items.length > 0 ? data.data.items : MOCK_DOCTOR_ITEMS;

  return (
    <div className="bg-white rounded-3xl p-6 shadow-xs border border-slate-200/80 flex flex-col justify-between space-y-5">
      {/* Table Header Title */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div>
          <h2 className="text-base font-bold text-slate-900">Prediksi Terbaru Pasien</h2>
          <p className="text-xs text-slate-400 mt-0.5">Hasil analisis NLP keluhan pasien terbaru.</p>
        </div>

        <Link
          href="/data-prediksi"
          className="text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline flex items-center gap-1 cursor-pointer"
        >
          <span>Lihat semua</span>
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </Link>
      </div>

      {/* Table Section */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[650px]">
          <thead>
            <tr className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-100 pb-3">
              <th className="pb-3 pr-4">Pasien</th>
              <th className="pb-3 px-4">Keluhan</th>
              <th className="pb-3 px-4">Hasil Prediksi</th>
              <th className="pb-3 px-4">Kategori</th>
              <th className="pb-3 px-3 text-center">Conf.</th>
              <th className="pb-3 pl-4 text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100/80 text-xs">
            {isLoading && (
              <tr>
                <td colSpan={6} className="py-8 text-center text-slate-400 animate-pulse">
                  Memuat data pasien...
                </td>
              </tr>
            )}

            {!isLoading && items.map((item, idx) => {
              const initials = getInitials(item.patient?.name);
              const avatarBg = getAvatarBgColor(idx);
              const rawConf = item.ai_analysis?.confidence_score ?? 0.8;
              const confPct = rawConf > 1 ? Math.round(rawConf) : Math.round(rawConf * 100);
              const category = item.ai_analysis?.possible_category || 'Umum';
              const diagnosis = getDiagnosisName(category);
              const isReviewed = item.status === 'reviewed' || item.status === 'Sudah Ditinjau';
              const categoryBadge = getCategoryBadgeStyle(category);

              return (
                <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                  {/* Pasien */}
                  <td className="py-3.5 pr-4 align-middle whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-9 h-9 rounded-full ${avatarBg} text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs`}
                      >
                        {initials}
                      </div>
                      <span className="font-extrabold text-slate-900 text-xs">
                        {item.patient?.name || 'Pasien'}
                      </span>
                    </div>
                  </td>

                  {/* Keluhan */}
                  <td className="py-3.5 px-4 align-middle max-w-[220px]">
                    <p className="text-slate-500 font-medium text-xs line-clamp-2 leading-relaxed">
                      {item.complaint_preview}
                    </p>
                  </td>

                  {/* Hasil Prediksi */}
                  <td className="py-3.5 px-4 align-middle whitespace-nowrap">
                    <span className="font-bold text-slate-800 text-xs">{diagnosis}</span>
                  </td>

                  {/* Kategori Badge */}
                  <td className="py-3.5 px-4 align-middle whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-md text-[11px] font-bold border ${categoryBadge}`}
                    >
                      {category}
                    </span>
                  </td>

                  {/* Conf. */}
                  <td className="py-3.5 px-3 align-middle text-center whitespace-nowrap">
                    <span className="font-bold text-slate-800 text-xs">{confPct}%</span>
                  </td>

                  {/* Status Badge */}
                  <td className="py-3.5 pl-4 align-middle text-center whitespace-nowrap">
                    {isReviewed ? (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-semibold bg-blue-50 text-blue-600">
                        Sudah Ditinjau
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-semibold bg-amber-50 text-amber-600">
                        Perlu Ditinjau
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
