'use client';

import React from 'react';
import useSWR from 'swr';
import Link from 'next/link';
import { GetConsultationListResponse, GetConsultationDetailResponse } from '../../lib/types/consultation';
import { formatDateShortIndonesia } from '../../lib/utils/date';

interface LatestPredictionCardProps {
  onOpenDetail: (id: string) => void;
}

const listFetcher = async (url: string): Promise<GetConsultationListResponse> => {
  const res = await fetch(url);
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Gagal memuat konsultasi');
  }
  return data;
};

const detailFetcher = async (url: string): Promise<GetConsultationDetailResponse> => {
  const res = await fetch(url);
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Gagal memuat detail konsultasi');
  }
  return data;
};

export function LatestPredictionCard({ onOpenDetail }: LatestPredictionCardProps) {
  // Step 1: Hit API list GET /api/patient/consultations?limit=1
  const {
    data: listData,
    isLoading: isListLoading,
    error: listError,
  } = useSWR<GetConsultationListResponse>(
    '/api/proxy/consultations?limit=1',
    listFetcher,
    { revalidateOnFocus: false }
  );

  // Step 2 & 3: Ambil id dari item pertama dan hit detail API GET /api/patient/consultations/:id
  const latestItem = listData?.data?.items?.[0];
  const latestId = latestItem?.id;

  const {
    data: detailData,
    isLoading: isDetailLoading,
    error: detailError,
  } = useSWR<GetConsultationDetailResponse>(
    latestId ? `/api/proxy/consultations/${latestId}` : null,
    detailFetcher,
    { revalidateOnFocus: false }
  );

  const isLoading = isListLoading || (latestId && isDetailLoading);
  const error = listError || detailError;

  const consultation = detailData?.data?.consultation || latestItem;
  const aiAnalysis = detailData?.data?.ai_analysis;

  // Extract confidence percentage
  const rawConf = aiAnalysis?.confidence_score ?? latestItem?.confidence_score;
  const confidencePct =
    rawConf !== undefined && rawConf !== null
      ? rawConf > 1
        ? Math.round(rawConf)
        : Math.round(rawConf * 100)
      : null;

  // Gauge calculations
  const radius = 24;
  const circumference = 2 * Math.PI * radius; // ~150.8
  const strokeOffset = confidencePct !== null
    ? circumference - (confidencePct / 100) * circumference
    : circumference;

  // Fallback category & symptoms
  const categoryName = aiAnalysis?.possible_category || latestItem?.category || 'Influenza';
  const symptomsList = aiAnalysis?.detected_symptoms && aiAnalysis.detected_symptoms.length > 0
    ? aiAnalysis.detected_symptoms
    : latestItem?.complaint_text
      ? latestItem.complaint_text.split(',').map((s) => s.trim())
      : ['Demam tinggi (38.5°C)', 'Batuk kering', 'Nyeri otot', 'Sakit kepala'];

  return (
    <div className="bg-white rounded-3xl p-6 shadow-xs border border-slate-200/80 flex flex-col justify-between h-full space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
          </div>
          <h2 className="text-sm sm:text-base font-bold text-slate-900">
            Hasil Prediksi Terakhir
          </h2>
        </div>
        <span className="text-xs font-semibold text-slate-400">
          {isLoading ? '...' : formatDateShortIndonesia(consultation?.created_at)}
        </span>
      </div>

      {/* Loading Skeleton */}
      {isLoading && (
        <div className="animate-pulse space-y-4 py-4 flex-1">
          <div className="h-6 bg-slate-100 rounded-full w-24"></div>
          <div className="h-6 bg-slate-100 rounded w-1/2"></div>
          <div className="h-12 bg-slate-50 rounded w-full"></div>
          <div className="h-20 bg-slate-50 rounded w-full"></div>
        </div>
      )}

      {/* Error / Empty state */}
      {!isLoading && (error || !latestItem) && (
        <div className="py-12 flex flex-col items-center justify-center text-center space-y-3 flex-1">
          <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-500 flex items-center justify-center">
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <p className="text-xs text-slate-500 max-w-xs">
            {error ? 'Gagal memuat hasil prediksi terakhir.' : 'Belum ada riwayat hasil prediksi.'}
          </p>
          <Link
            href="/prediksi-baru"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold transition-colors"
          >
            Buat Prediksi Baru
          </Link>
        </div>
      )}

      {/* Content */}
      {!isLoading && !error && latestItem && (
        <div className="space-y-6 flex-1 flex flex-col justify-between">
          {/* Upper Info Section with Circular Confidence Gauge */}
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-2 flex-1 min-w-0">
              {/* Category Pill Badge */}
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100/70 text-emerald-800 border border-emerald-200/60 capitalize">
                {categoryName}
              </span>

              {/* Main Heading */}
              <h3 className="text-base sm:text-lg font-extrabold text-slate-900 leading-snug">
                Kemungkinan {categoryName}
              </h3>

              {/* Summary Paragraph */}
              <p className="text-xs text-slate-500 leading-relaxed max-w-md">
                {aiAnalysis?.summary ||
                  consultation?.complaint_text ||
                  'Gejala demam tinggi, batuk kering, dan nyeri otot yang dilaporkan pasien.'}
              </p>
            </div>

            {/* Circular Gauge */}
            {confidencePct !== null && (
              <div className="flex flex-col items-center shrink-0 pt-1">
                <div className="relative w-16 h-16 flex items-center justify-center">
                  <svg className="w-16 h-16 transform -rotate-90">
                    {/* Background track circle */}
                    <circle
                      cx="32"
                      cy="32"
                      r={radius}
                      stroke="#E2E8F0"
                      strokeWidth="5"
                      fill="transparent"
                    />
                    {/* Active teal progress ring */}
                    <circle
                      cx="32"
                      cy="32"
                      r={radius}
                      stroke="#14B8A6"
                      strokeWidth="5"
                      strokeDasharray={circumference}
                      strokeDashoffset={strokeOffset}
                      strokeLinecap="round"
                      fill="transparent"
                      className="transition-all duration-700 ease-out"
                    />
                  </svg>
                  <span className="absolute text-xs font-extrabold text-slate-800">
                    {confidencePct}%
                  </span>
                </div>
                <span className="text-[10px] font-medium text-slate-400 mt-1">Confidence</span>
              </div>
            )}
          </div>

          {/* Border Divider */}
          <div className="border-t border-slate-100 pt-4 space-y-3">
            {/* Symptoms Section Title */}
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 10h16M4 14h16M4 18h16"
                />
              </svg>
              <h4 className="text-xs font-bold text-slate-800">
                Keluhan yang Dilaporkan
              </h4>
            </div>

            {/* Bullet Points */}
            <ul className="space-y-2 pl-1">
              {symptomsList.map((symptom, idx) => (
                <li key={idx} className="flex items-center gap-2.5 text-xs text-slate-600 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0"></span>
                  <span className="capitalize">{symptom}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Tanggal Prediksi & Footer Actions */}
          <div className="pt-4 border-t border-slate-100 space-y-4">
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.8}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <span>
                <strong>Tanggal Prediksi:</strong> {formatDateShortIndonesia(consultation?.created_at)}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => latestId && onOpenDetail(latestId)}
                className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <span>Lihat Detail</span>
              </button>

              <Link
                href="/riwayat-prediksi"
                className="flex-1 px-4 py-2.5 border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs rounded-xl transition-colors flex items-center justify-center gap-2 text-center"
              >
                <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span>Lihat Riwayat</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
