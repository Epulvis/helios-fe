'use client';

import React from 'react';

export function QuickInsightCard() {
  const insights = [
    {
      id: 1,
      title: 'Lonjakan Pernapasan',
      description: 'Kasus pernapasan naik 23% dibanding minggu lalu. Pertimbangkan tinjauan cepat.',
      iconBg: 'bg-blue-50 text-blue-500',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 10V3L4 14h7v7l9-11h-7z"
          />
        </svg>
      ),
    },
    {
      id: 2,
      title: 'Akurasi Model Stabil',
      description: 'Confidence rata-rata berada di 81%, konsisten dalam 7 hari terakhir.',
      iconBg: 'bg-teal-50 text-teal-600',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
    },
    {
      id: 3,
      title: 'Antrian Review',
      description: '6 prediksi menunggu tinjauan Anda, 2 di antaranya berstatus prioritas tinggi.',
      iconBg: 'bg-purple-50 text-purple-500',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
          />
        </svg>
      ),
    },
  ];

  return (
    <div className="bg-white rounded-3xl p-6 shadow-xs border border-slate-200/80 space-y-5">
      {/* Title */}
      <h3 className="text-sm font-extrabold text-slate-900 border-b border-slate-100 pb-3">
        Insight Cepat
      </h3>

      {/* List */}
      <div className="space-y-4">
        {insights.map((item) => (
          <div key={item.id} className="flex items-start gap-3">
            <div className={`w-9 h-9 rounded-xl ${item.iconBg} flex items-center justify-center shrink-0 mt-0.5`}>
              {item.icon}
            </div>
            <div className="space-y-0.5 min-w-0">
              <h4 className="text-xs font-bold text-slate-900">{item.title}</h4>
              <p className="text-[11px] text-slate-500 leading-relaxed font-medium">
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
