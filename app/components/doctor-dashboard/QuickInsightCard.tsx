'use client';

import React from 'react';

export function QuickInsightCard() {
  const guidance = [
    ['Menunggu Dokter', 'Buka detail lalu ambil konsultasi sebelum melakukan review.'],
    ['Sedang Ditinjau', 'Lengkapi satu review dokter untuk menyelesaikan tinjauan.'],
    ['Sudah Ditinjau', 'Periksa hasil tersimpan lalu tutup kasus bila sudah selesai.'],
  ];

  return (
    <div className="space-y-5 rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xs">
      <h3 className="border-b border-slate-100 pb-3 text-sm font-extrabold text-slate-900">Alur Konsultasi</h3>
      <div className="space-y-4">
        {guidance.map(([title, description], index) => (
          <div key={title} className="flex items-start gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-xs font-black text-blue-600">
              {index + 1}
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900">{title}</h4>
              <p className="mt-0.5 text-[11px] font-medium leading-relaxed text-slate-500">{description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
