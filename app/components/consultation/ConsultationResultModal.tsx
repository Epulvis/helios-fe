'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import useSWR from 'swr';

import {
  AiAnalysis,
  ConsultationStatus,
  GetConsultationDetailResponse,
} from '../../lib/types/consultation';

interface ConsultationResultModalProps {
  isOpen: boolean;
  consultationId: string | null;
  onClose: () => void;
  initialAiAnalysis?: AiAnalysis | null;
}

const fetcher = async (url: string): Promise<GetConsultationDetailResponse> => {
  const res = await fetch(url);
  const data = await res.json();
  if (res.status === 401) throw { status: 401, message: data.message || 'Unauthorized' };
  if (!res.ok) throw new Error(data.message || 'Gagal mengambil detail konsultasi');
  return data;
};

const statusLabels: Record<ConsultationStatus, string> = {
  submitted: 'Dikirim',
  processing: 'Sedang Diproses',
  analyzed: 'Menunggu Dokter',
  in_review: 'Sedang Ditinjau',
  reviewed: 'Sudah Ditinjau',
  closed: 'Selesai',
  failed: 'Gagal Diproses',
};

export function ConsultationResultModal({
  isOpen,
  consultationId,
  onClose,
  initialAiAnalysis = null,
}: ConsultationResultModalProps) {
  const router = useRouter();
  const { data, error, isLoading } = useSWR<GetConsultationDetailResponse>(
    isOpen && consultationId ? `/api/proxy/consultations/${consultationId}` : null,
    fetcher,
    {
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
  const doctorReview = data?.data?.doctor_review;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
      <div className="relative max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-3xl border border-slate-100 bg-white p-6 shadow-2xl md:p-8">
        <div className="mb-6 flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Detail Konsultasi</h3>
            <p className="mt-0.5 text-xs text-slate-400">ID: {consultationId || '-'}</p>
          </div>
          <button type="button" onClick={onClose} className="rounded-full p-2 text-slate-400 hover:bg-slate-100" aria-label="Tutup modal">
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {isLoading ? (
          <div className="py-12 text-center text-sm text-slate-500">Memuat detail konsultasi...</div>
        ) : error ? (
          <div className="py-8 text-center text-xs font-medium text-rose-600">{error.message}</div>
        ) : consultation ? (
          <div className="space-y-5 text-left">
            <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 p-4 text-xs">
              <span className="font-medium text-slate-500">Status Konsultasi</span>
              <span className="rounded-full bg-blue-50 px-3 py-1 font-bold text-blue-700">
                {statusLabels[consultation.status]}
              </span>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <span className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400">Keluhan</span>
              <p className="mt-1 text-xs font-medium leading-relaxed text-slate-700">{consultation.complaint_text}</p>
            </div>

            {initialAiAnalysis && (
              <section className="space-y-3">
                <h4 className="text-sm font-bold text-slate-900">Analisis Awal AI</h4>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="rounded-2xl border border-blue-100 bg-blue-50/50 p-3.5">
                    <span className="text-[10px] font-semibold uppercase text-blue-600">Kategori Kemungkinan</span>
                    <p className="mt-1 font-bold capitalize text-slate-800">{initialAiAnalysis.possible_category}</p>
                  </div>
                  <div className="rounded-2xl border border-indigo-100 bg-indigo-50/50 p-3.5">
                    <span className="text-[10px] font-semibold uppercase text-indigo-600">Urgensi Awal</span>
                    <p className="mt-1 font-bold capitalize text-slate-800">{initialAiAnalysis.urgency_level}</p>
                  </div>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-xs leading-relaxed text-slate-700">
                  {initialAiAnalysis.summary}
                </div>
              </section>
            )}

            {doctorReview ? (
              <section className="space-y-3 border-t border-slate-100 pt-5">
                <h4 className="text-sm font-bold text-slate-900">Hasil Review Dokter</h4>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="rounded-2xl border border-emerald-100 bg-emerald-50/50 p-3.5">
                    <span className="text-[10px] font-semibold uppercase text-emerald-700">Kategori Final</span>
                    <p className="mt-1 font-bold capitalize text-slate-800">{doctorReview.final_category || '-'}</p>
                  </div>
                  <div className="rounded-2xl border border-amber-100 bg-amber-50/50 p-3.5">
                    <span className="text-[10px] font-semibold uppercase text-amber-700">Urgensi Final</span>
                    <p className="mt-1 font-bold capitalize text-slate-800">{doctorReview.final_urgency_level || '-'}</p>
                  </div>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <span className="text-[10px] font-semibold uppercase text-slate-400">Rekomendasi Dokter</span>
                  <p className="mt-1 text-xs font-medium leading-relaxed text-slate-700">{doctorReview.recommendation || '-'}</p>
                </div>
              </section>
            ) : (
              <div className="rounded-2xl border border-amber-100 bg-amber-50 p-4 text-xs leading-relaxed text-amber-800">
                Review dokter belum tersedia. Status akan diperbarui setelah dokter menyelesaikan tinjauan.
              </div>
            )}

            <p className="text-[11px] leading-relaxed text-slate-500">
              Analisis AI merupakan dukungan penyaringan awal dan bukan diagnosis medis final. Hubungi tenaga medis untuk pemeriksaan lebih lanjut.
            </p>
          </div>
        ) : null}

        <div className="mt-8 flex items-center justify-end gap-3 border-t border-slate-100 pt-4">
          <button type="button" onClick={onClose} className="rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-50">
            Tutup
          </button>
          <button
            type="button"
            onClick={() => {
              onClose();
              router.push('/riwayat-prediksi');
            }}
            className="rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-semibold text-white hover:bg-blue-700"
          >
            Lihat Riwayat Prediksi
          </button>
        </div>
      </div>
    </div>
  );
}
