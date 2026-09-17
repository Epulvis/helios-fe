'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import useSWR, { useSWRConfig } from 'swr';

import {
  claimDoctorConsultationService,
  ConsultationRequestError,
  submitDoctorReviewService,
} from '../../lib/services/consultation';
import { GetDoctorConsultationDetailResponse } from '../../lib/types/consultation';
import { formatDateShortIndonesia } from '../../lib/utils/date';
import { DoctorReviewFormData, doctorReviewSchema } from '../../lib/validations/doctorReview';
import { LoadingButton } from '../ui/LoadingButton';

interface DoctorReviewSlideoverProps {
  isOpen: boolean;
  consultationId: string | null;
  onClose: () => void;
  onSuccessReview?: () => void;
}

const fetcher = async (url: string): Promise<GetDoctorConsultationDetailResponse> => {
  const res = await fetch(url);
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Gagal memuat detail konsultasi');
  return data;
};

const statusLabel = {
  analyzed: 'Menunggu Dokter / Belum Diambil',
  in_review: 'Sedang Ditinjau',
  reviewed: 'Sudah Ditinjau',
  closed: 'Selesai',
} as const;

export function DoctorReviewSlideover({
  isOpen,
  consultationId,
  onClose,
  onSuccessReview,
}: DoctorReviewSlideoverProps) {
  const { mutate: globalMutate } = useSWRConfig();
  const [isClaiming, setIsClaiming] = useState(false);
  const [isReviewSubmitting, setIsReviewSubmitting] = useState(false);
  const detailKey =
    isOpen && consultationId ? `/api/proxy/doctor/consultations/${consultationId}` : null;
  const { data, error, isLoading, mutate } = useSWR<GetDoctorConsultationDetailResponse>(
    detailKey,
    fetcher,
    { revalidateOnFocus: false }
  );

  const consultation = data?.data?.consultation;
  const patient = data?.data?.patient;
  const aiAnalysis = data?.data?.ai_analysis;
  const existingReview = data?.data?.doctor_review;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<DoctorReviewFormData>({
    resolver: zodResolver(doctorReviewSchema),
    defaultValues: {
      review_note: '',
      final_category: '',
      final_urgency_level: 'normal',
      recommendation: '',
    },
  });

  useEffect(() => {
    reset({
      review_note: aiAnalysis?.doctor_note_suggestion || '',
      final_category: aiAnalysis?.possible_category || '',
      final_urgency_level: aiAnalysis?.urgency_level || 'normal',
      recommendation: '',
    });
  }, [aiAnalysis, consultationId, reset]);

  const refreshConsultationCaches = async () => {
    await Promise.all([
      mutate(),
      globalMutate(
        (key) =>
          typeof key === 'string' &&
          (key.startsWith('/api/proxy/doctor/consultations') ||
            key.startsWith('/api/proxy/consultations'))
      ),
    ]);
  };

  const handleClaim = async () => {
    if (!consultationId || consultation?.status !== 'analyzed') return;

    setIsClaiming(true);
    try {
      const response = await claimDoctorConsultationService(consultationId);
      toast.success(response.message || 'Konsultasi berhasil diambil.');
      await refreshConsultationCaches();
    } catch (err) {
      if (err instanceof ConsultationRequestError && err.status === 409) {
        toast.error('Konsultasi ini sudah diambil dokter lain atau tidak lagi tersedia.');
        await refreshConsultationCaches();
      } else {
        toast.error(err instanceof Error ? err.message : 'Konsultasi gagal diambil.');
      }
    } finally {
      setIsClaiming(false);
    }
  };

  const onSubmitReview = async (formData: DoctorReviewFormData) => {
    if (!consultationId || consultation?.status !== 'in_review' || existingReview) return;

    setIsReviewSubmitting(true);
    try {
      const response = await submitDoctorReviewService(consultationId, {
        review_note: formData.review_note,
        final_category: formData.final_category || null,
        final_urgency_level: formData.final_urgency_level || null,
        recommendation: formData.recommendation || null,
      });
      toast.success(response.message || 'Review dokter berhasil disimpan.');
      await refreshConsultationCaches();
      onSuccessReview?.();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Gagal menyimpan review.');
      if (err instanceof ConsultationRequestError && err.status === 409) {
        await refreshConsultationCaches();
      }
    } finally {
      setIsReviewSubmitting(false);
    }
  };

  if (!isOpen) return null;

  const readableStatus = consultation
    ? statusLabel[consultation.status as keyof typeof statusLabel] || consultation.status
    : '-';

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-xs" onClick={onClose} />
      <div className="fixed inset-y-0 right-0 flex max-w-full pl-10">
        <div className="relative flex w-screen max-w-2xl flex-col overflow-y-auto border-l border-slate-100 bg-white shadow-2xl">
          <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200/80 bg-white px-6 py-5">
            <div>
              <h2 className="text-lg font-extrabold text-slate-900">Detail & Tinjauan Dokter</h2>
              <p className="mt-0.5 text-xs text-slate-400">ID Konsultasi: {consultationId}</p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="rounded-full p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
              aria-label="Tutup panel"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="flex-1 space-y-6 p-6">
            {isLoading ? (
              <div className="py-20 text-center text-sm text-slate-500">Memuat detail konsultasi...</div>
            ) : error ? (
              <div className="rounded-2xl border border-rose-100 bg-rose-50 p-6 text-center">
                <p className="text-sm font-bold text-rose-700">Gagal memuat data konsultasi</p>
                <p className="mt-1 text-xs text-rose-500">{error.message}</p>
              </div>
            ) : consultation ? (
              <>
                <section className="space-y-4 rounded-2xl border border-slate-200/80 bg-slate-50 p-5">
                  <div className="flex items-center justify-between border-b border-slate-200/60 pb-3">
                    <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
                      Informasi Pasien
                    </span>
                    <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-[11px] font-semibold text-blue-700">
                      {readableStatus}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div>
                      <span className="block text-slate-400">Nama Pasien</span>
                      <span className="mt-0.5 block font-bold text-slate-900">{patient?.name || '-'}</span>
                    </div>
                    <div>
                      <span className="block text-slate-400">Jenis Kelamin</span>
                      <span className="mt-0.5 block font-bold text-slate-900">
                        {patient?.gender === 'male'
                          ? 'Laki-laki'
                          : patient?.gender === 'female'
                            ? 'Perempuan'
                            : '-'}
                      </span>
                    </div>
                    <div>
                      <span className="block text-slate-400">Tanggal Lahir</span>
                      <span className="mt-0.5 block font-bold text-slate-900">
                        {patient?.birth_date ? formatDateShortIndonesia(patient.birth_date) : '-'}
                      </span>
                    </div>
                    <div>
                      <span className="block text-slate-400">Tanggal Konsultasi</span>
                      <span className="mt-0.5 block font-bold text-slate-900">
                        {formatDateShortIndonesia(consultation.created_at)}
                      </span>
                    </div>
                  </div>
                  <div className="border-t border-slate-200/60 pt-3">
                    <span className="block text-xs text-slate-400">Keluhan Utama Pasien</span>
                    <p className="mt-1 rounded-xl border border-slate-200/60 bg-white p-3 text-xs font-semibold leading-relaxed text-slate-800">
                      {consultation.complaint_text}
                    </p>
                  </div>
                </section>

                {aiAnalysis && (
                  <section className="space-y-3">
                    <h3 className="text-sm font-extrabold text-slate-900">Analisis Awal AI</h3>
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div className="rounded-2xl border border-blue-100 bg-blue-50/50 p-3">
                        <span className="text-[10px] font-bold uppercase text-blue-600">Kategori Kemungkinan</span>
                        <p className="mt-1 font-bold capitalize text-slate-900">{aiAnalysis.possible_category}</p>
                      </div>
                      <div className="rounded-2xl border border-purple-100 bg-purple-50/50 p-3">
                        <span className="text-[10px] font-bold uppercase text-purple-600">Urgensi Awal</span>
                        <p className="mt-1 font-bold capitalize text-slate-900">{aiAnalysis.urgency_level}</p>
                      </div>
                    </div>
                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-xs leading-relaxed text-slate-700">
                      {aiAnalysis.summary}
                    </div>
                    <p className="text-[11px] leading-relaxed text-slate-500">
                      Analisis AI merupakan dukungan penyaringan awal dan bukan diagnosis medis final.
                    </p>
                  </section>
                )}

                {consultation.status === 'analyzed' && !existingReview && (
                  <section className="space-y-3 border-t border-slate-200 pt-5">
                    <h3 className="text-sm font-extrabold text-slate-900">Ambil Konsultasi</h3>
                    <p className="text-xs leading-relaxed text-slate-500">
                      Ambil konsultasi ini terlebih dahulu untuk membuka formulir review.
                    </p>
                    <LoadingButton
                      type="button"
                      onClick={handleClaim}
                      isLoading={isClaiming}
                      className="w-full rounded-2xl bg-blue-600 py-3 text-xs font-extrabold text-white transition-colors hover:bg-blue-700"
                    >
                      Ambil Konsultasi
                    </LoadingButton>
                  </section>
                )}

                {consultation.status === 'in_review' && !existingReview && (
                  <section className="space-y-4 border-t border-slate-200 pt-5">
                    <h3 className="text-sm font-extrabold text-slate-900">Form Review Dokter</h3>
                    <form onSubmit={handleSubmit(onSubmitReview)} className="space-y-4">
                      <div>
                        <label className="mb-1 block text-xs font-bold text-slate-700">Catatan Review Dokter</label>
                        <textarea
                          rows={4}
                          {...register('review_note')}
                          disabled={isReviewSubmitting}
                          className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-3 text-xs text-slate-800 focus:border-blue-500 focus:outline-none"
                        />
                        {errors.review_note && <p className="mt-1 text-[11px] text-rose-500">{errors.review_note.message}</p>}
                      </div>
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                          <label className="mb-1 block text-xs font-bold text-slate-700">Kategori Final</label>
                          <input
                            {...register('final_category')}
                            disabled={isReviewSubmitting}
                            className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-3 text-xs text-slate-800 focus:border-blue-500 focus:outline-none"
                          />
                          {errors.final_category && <p className="mt-1 text-[11px] text-rose-500">{errors.final_category.message}</p>}
                        </div>
                        <div>
                          <label className="mb-1 block text-xs font-bold text-slate-700">Tingkat Urgensi Final</label>
                          <select
                            {...register('final_urgency_level')}
                            disabled={isReviewSubmitting}
                            className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-3 text-xs text-slate-800 focus:border-blue-500 focus:outline-none"
                          >
                            <option value="">Tidak ditentukan</option>
                            <option value="normal">Normal</option>
                            <option value="priority">Prioritas</option>
                            <option value="urgent">Mendesak</option>
                          </select>
                          {errors.final_urgency_level && <p className="mt-1 text-[11px] text-rose-500">{errors.final_urgency_level.message}</p>}
                        </div>
                      </div>
                      <div>
                        <label className="mb-1 block text-xs font-bold text-slate-700">Rekomendasi Penanganan</label>
                        <textarea
                          rows={4}
                          {...register('recommendation')}
                          disabled={isReviewSubmitting}
                          className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-3 text-xs text-slate-800 focus:border-blue-500 focus:outline-none"
                        />
                        {errors.recommendation && <p className="mt-1 text-[11px] text-rose-500">{errors.recommendation.message}</p>}
                      </div>
                      <LoadingButton
                        type="submit"
                        isLoading={isReviewSubmitting}
                        className="w-full rounded-2xl bg-blue-600 py-3 text-xs font-extrabold text-white transition-colors hover:bg-blue-700"
                      >
                        Simpan Review Dokter
                      </LoadingButton>
                    </form>
                  </section>
                )}

                {(consultation.status === 'reviewed' || consultation.status === 'closed') && existingReview && (
                  <section className="space-y-4 border-t border-slate-200 pt-5">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-extrabold text-slate-900">Review Dokter</h3>
                      <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[10px] font-bold text-emerald-700">
                        Tersimpan
                      </span>
                    </div>
                    <div className="space-y-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-xs">
                      <div><span className="block text-slate-400">Catatan Review</span><p className="mt-1 font-medium text-slate-800">{existingReview.review_note}</p></div>
                      <div className="grid grid-cols-2 gap-4">
                        <div><span className="block text-slate-400">Kategori Final</span><p className="mt-1 font-bold text-slate-800">{existingReview.final_category || '-'}</p></div>
                        <div><span className="block text-slate-400">Urgensi Final</span><p className="mt-1 font-bold capitalize text-slate-800">{existingReview.final_urgency_level || '-'}</p></div>
                      </div>
                      <div><span className="block text-slate-400">Rekomendasi</span><p className="mt-1 font-medium text-slate-800">{existingReview.recommendation || '-'}</p></div>
                    </div>
                  </section>
                )}
              </>
            ) : null}
          </div>

          <div className="sticky bottom-0 flex justify-end border-t border-slate-200/80 bg-slate-50 p-4">
            <button type="button" onClick={onClose} className="rounded-xl border border-slate-200 px-5 py-2.5 text-xs font-semibold text-slate-600 hover:bg-white">
              Tutup Panel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
