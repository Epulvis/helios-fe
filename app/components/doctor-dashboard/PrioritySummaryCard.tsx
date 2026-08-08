'use client';

import React from 'react';

export function PrioritySummaryCard() {
  const priorities = [
    {
      label: 'Urgensi Tinggi',
      count: '3',
      pct: '16.7%',
      widthPct: 16.7,
      textColor: 'text-red-600',
      barColor: 'bg-red-500',
    },
    {
      label: 'Urgensi Sedang',
      count: '7',
      pct: '38.9%',
      widthPct: 38.9,
      textColor: 'text-amber-600',
      barColor: 'bg-amber-500',
    },
    {
      label: 'Urgensi Rendah',
      count: '7',
      pct: '38.9%',
      widthPct: 38.9,
      textColor: 'text-emerald-600',
      barColor: 'bg-emerald-500',
    },
    {
      label: 'Perlu Follow Up',
      count: '1',
      pct: '5.6%',
      widthPct: 10,
      textColor: 'text-blue-600',
      barColor: 'bg-blue-500',
    },
  ];

  return (
    <div className="bg-white rounded-3xl p-6 shadow-xs border border-slate-200/80 space-y-5">
      {/* Header */}
      <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
        <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
          />
        </svg>
        <h3 className="text-sm font-extrabold text-slate-900">Ringkasan Prioritas</h3>
      </div>

      {/* Priority Progress Items */}
      <div className="space-y-4">
        {priorities.map((item) => (
          <div key={item.label} className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="text-slate-600">{item.label}</span>
              <span className={item.textColor}>
                {item.count} ({item.pct})
              </span>
            </div>
            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full ${item.barColor} transition-all duration-500`}
                style={{ width: `${item.widthPct}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer Total */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
        <span className="text-slate-400 font-medium">Total</span>
        <span className="font-extrabold text-slate-900">18 Prediksi</span>
      </div>
    </div>
  );
}
