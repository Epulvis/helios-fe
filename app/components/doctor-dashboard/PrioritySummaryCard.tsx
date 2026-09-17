'use client';

import React, { useMemo } from 'react';
import useSWR from 'swr';

import { DoctorConsultationItem, GetDoctorConsultationListResponse } from '../../lib/types/consultation';

const fetcher = async (url: string): Promise<GetDoctorConsultationListResponse> => {
  const res = await fetch(url);
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Gagal memuat ringkasan prioritas');
  return data;
};

export function PrioritySummaryCard() {
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
  const total = items.length;
  const priorities = [
    { label: 'Mendesak', value: 'urgent', color: 'bg-rose-500' },
    { label: 'Prioritas', value: 'priority', color: 'bg-amber-500' },
    { label: 'Normal', value: 'normal', color: 'bg-emerald-500' },
  ].map((priority) => {
    const count = items.filter((item) => item.urgency_level === priority.value).length;
    return { ...priority, count, percentage: total === 0 ? 0 : Math.round((count / total) * 100) };
  });

  return (
    <div className="space-y-5 rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xs">
      <h3 className="border-b border-slate-100 pb-3 text-sm font-extrabold text-slate-900">Ringkasan Prioritas</h3>
      <div className="space-y-4">
        {priorities.map((item) => (
          <div key={item.value} className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="text-slate-600">{item.label}</span>
              <span className="text-slate-800">{item.count} ({item.percentage}%)</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
              <div className={`h-full rounded-full ${item.color}`} style={{ width: `${item.percentage}%` }} />
            </div>
          </div>
        ))}
      </div>
      <div className="flex items-center justify-between border-t border-slate-100 pt-3 text-xs">
        <span className="font-medium text-slate-400">Total</span>
        <span className="font-extrabold text-slate-900">{total} Konsultasi</span>
      </div>
    </div>
  );
}
