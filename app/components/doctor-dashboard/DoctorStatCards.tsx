'use client';

import React, { useMemo } from 'react';
import useSWR from 'swr';

import { DoctorConsultationItem, GetDoctorConsultationListResponse } from '../../lib/types/consultation';

const fetcher = async (url: string): Promise<GetDoctorConsultationListResponse> => {
  const res = await fetch(url);
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Gagal memuat statistik dokter');
  return data;
};

export function DoctorStatCards() {
  const available = useSWR<GetDoctorConsultationListResponse>(
    '/api/proxy/doctor/consultations?scope=available&page=1&limit=100',
    fetcher,
    { revalidateOnFocus: false }
  );
  const mine = useSWR<GetDoctorConsultationListResponse>(
    '/api/proxy/doctor/consultations?scope=mine&page=1&limit=100',
    fetcher,
    { revalidateOnFocus: false }
  );

  const items = useMemo(() => {
    const byId = new Map<string, DoctorConsultationItem>();
    for (const item of available.data?.data?.items || []) byId.set(item.id, item);
    for (const item of mine.data?.data?.items || []) byId.set(item.id, item);
    return [...byId.values()];
  }, [available.data, mine.data]);
  const isLoading = available.isLoading || mine.isLoading;

  const cards = [
    { label: 'Menunggu Dokter', value: items.filter((item) => item.status === 'analyzed').length, helper: 'Dapat diambil' },
    { label: 'Sedang Ditinjau', value: items.filter((item) => item.status === 'in_review').length, helper: 'Milik Anda' },
    { label: 'Sudah Ditinjau', value: items.filter((item) => item.status === 'reviewed').length, helper: 'Siap ditutup' },
    { label: 'Selesai', value: items.filter((item) => item.status === 'closed').length, helper: 'Kasus ditutup' },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <div key={card.label} className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-xs transition-shadow hover:shadow-md">
          <span className="block text-[11px] font-medium text-slate-500">{card.label}</span>
          <p className="mt-0.5 text-2xl font-black leading-tight text-slate-900">{isLoading ? '...' : card.value}</p>
          <span className="mt-0.5 block text-[10px] text-slate-400">{card.helper}</span>
        </div>
      ))}
    </div>
  );
}
