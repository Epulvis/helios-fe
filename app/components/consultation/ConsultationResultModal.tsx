'use client';

import React from 'react';
import useSWR from 'swr';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { GetConsultationDetailResponse } from '../../lib/types/consultation';

interface ConsultationResultModalProps {
  isOpen: boolean;
  consultationId: string | null;
  onClose: () => void;
}

const fetcher = async (url: string): Promise<GetConsultationDetailResponse> => {
  const res = await fetch(url);
  const data = await res.json();
  if (res.status === 401) {
    throw { status: 401, message: data.message || 'Unauthorized' };
  }
  if (!res.ok) {
    throw new Error(data.message || 'Gagal mengambil detail konsultasi');
  }
  return data;
};

export function ConsultationResultModal({
  isOpen,
  consultationId,
  onClose,
}: ConsultationResultModalProps) {
  const router = useRouter();

  const { data, error, isLoading } = useSWR<GetConsultationDetailResponse>(
    isOpen && consultationId ? `/api/proxy/consultations/${consultationId}` : null,
    fetcher,
    {
      refreshInterval: (swrData) => {
        // Stop polling if ai_analysis exists or status is no longer processing
        if (
          swrData?.data?.ai_analysis ||
          (swrData?.data?.consultation?.status &&
            swrData.data.consultation.status !== 'processing')
        ) {
          return 0;
        }
        return 2500; // Poll every 2.5s
      },
      revalidateOnFocus: false,
      onError: (err) => {
        if (err?.status === 401) {
          toast.error('Sesi telah berakhir. Silakan login kembali.');
          router.push('/login');
        }
      },
    }
  );

  if (!isOpen) return null;

  const consultation = data?.data?.consultation;
  const aiAnalysis = data?.data?.ai_analysis;
  const isAiProcessing = !aiAnalysis && consultation?.status === 'processing';

  const getSeverityBadge = (severity?: string) => {
    switch (severity?.toLowerCase()) {
      case 'low':
      case 'ringan':
        return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-600 border border-emerald-200">Ringan</span>;
      case 'medium':
      case 'sedang':
        return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-600 border border-amber-200">Sedang</span>;
      case 'high':
      case 'berat':
        return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-600 border border-rose-200">Berat</span>;
      default:
        return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-600">{severity || '-'}</span>;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 md:p-8 shadow-2xl border border-slate-100 relative overflow-hidden animate-modalEnter">
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 leading-tight">
                Hasil Analisis Prediksi AI
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                ID: {consultationId || '-'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Modal Body */}
        {isLoading || isAiProcessing ? (
          <div className="py-12 flex flex-col items-center justify-center text-center space-y-4">
            <div className="relative w-16 h-16 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-4 border-blue-100 border-t-blue-600 animate-spin"></div>
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-slate-800">
                Memproses Prediksi Kesehatan...
              </h4>
              <p className="text-xs text-slate-400 mt-1 max-w-xs">
                Sistem NLP sedang menganalisis gejala Anda. Hasil akan muncul secara otomatis.
              </p>
            </div>
          </div>
        ) : error ? (
          <div className="py-8 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center mx-auto">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-xs text-slate-600 font-medium">
              {error.message || 'Terjadi kesalahan saat memuat data.'}
            </p>
          </div>
        ) : aiAnalysis ? (
          <div className="space-y-5 text-left">
            {/* Summary Box */}
            <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-2xl">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block mb-1">
                Ringkasan Keluhan
              </span>
              <p className="text-xs text-slate-700 leading-relaxed font-medium">
                {aiAnalysis.summary}
              </p>
            </div>

            {/* Grid Metrics */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3.5 bg-blue-50/50 border border-blue-100 rounded-2xl">
                <span className="text-[10px] font-semibold text-blue-600 uppercase">Kategori Terdeteksi</span>
                <p className="text-xs font-bold text-slate-800 mt-0.5 capitalize">
                  {aiAnalysis.possible_category || '-'}
                </p>
              </div>
              <div className="p-3.5 bg-teal-50/50 border border-teal-100 rounded-2xl">
                <span className="text-[10px] font-semibold text-teal-600 uppercase">Keparahan</span>
                <div className="mt-1">{getSeverityBadge(aiAnalysis.severity_level)}</div>
              </div>
              <div className="p-3.5 bg-purple-50/50 border border-purple-100 rounded-2xl">
                <span className="text-[10px] font-semibold text-purple-600 uppercase">Durasi Keluhan</span>
                <p className="text-xs font-bold text-slate-800 mt-0.5">
                  {aiAnalysis.duration || '-'}
                </p>
              </div>
              <div className="p-3.5 bg-indigo-50/50 border border-indigo-100 rounded-2xl">
                <span className="text-[10px] font-semibold text-indigo-600 uppercase">Tingkat Urgensi</span>
                <p className="text-xs font-bold text-slate-800 mt-0.5 capitalize">
                  {aiAnalysis.urgency_level || '-'}
                </p>
              </div>
            </div>

            {/* Detected Symptoms */}
            {aiAnalysis.detected_symptoms && aiAnalysis.detected_symptoms.length > 0 && (
              <div>
                <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block mb-2">
                  Gejala Terdeteksi
                </span>
                <div className="flex flex-wrap gap-2">
                  {aiAnalysis.detected_symptoms.map((symptom, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-blue-50 text-blue-700 font-medium text-xs rounded-full border border-blue-200/60"
                    >
                      {symptom}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Confidence Score Bar */}
            {aiAnalysis.confidence_score !== undefined && (
              <div className="pt-2">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-semibold text-slate-600">Skor Kepercayaan AI</span>
                  <span className="font-bold text-blue-600">
                    {Math.round(aiAnalysis.confidence_score * 100)}%
                  </span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-teal-400 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${Math.round(aiAnalysis.confidence_score * 100)}%` }}
                  ></div>
                </div>
              </div>
            )}
          </div>
        ) : null}

        {/* Modal Actions */}
        <div className="mt-8 pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
          >
            Tutup
          </button>
          <button
            onClick={() => {
              onClose();
              router.push('/riwayat-prediksi');
            }}
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-sm transition-colors cursor-pointer"
          >
            Lihat Riwayat Prediksi
          </button>
        </div>
      </div>
    </div>
  );
}
