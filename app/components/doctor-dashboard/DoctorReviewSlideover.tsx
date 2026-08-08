'use client';

import React, { useState, useEffect } from 'react';
import useSWR from 'swr';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';

import {
  GetDoctorConsultationDetailResponse,
} from '../../lib/types/consultation';
import { doctorReviewSchema, DoctorReviewFormData } from '../../lib/validations/doctorReview';
import { submitDoctorReviewService } from '../../lib/services/consultation';
import { LoadingButton } from '../ui/LoadingButton';
import { formatDateShortIndonesia } from '../../lib/utils/date';

interface DoctorReviewSlideoverProps {
  isOpen: boolean;
  consultationId: string | null;
  onClose: () => void;
  onSuccessReview?: () => void;
}

const fetcher = async (url: string): Promise<GetDoctorConsultationDetailResponse> => {
  const res = await fetch(url);
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Gagal memuat detail konsultasi');
  }
  return data;
};

export function DoctorReviewSlideover({
  isOpen,
  consultationId,
  onClose,
  onSuccessReview,
}: DoctorReviewSlideoverProps) {
  const [isReviewSubmitting, setIsReviewSubmitting] = useState(false);

  const {
    data,
    error,
    isLoading,
    mutate,
  } = useSWR<GetDoctorConsultationDetailResponse>(
    isOpen && consultationId ? `/api/proxy/doctor/consultations/${consultationId}` : null,
    fetcher,
    { revalidateOnFocus: false }
  );

  const consultation = data?.data?.consultation;
  const patient = data?.data?.patient;
  const aiAnalysis = data?.data?.ai_analysis;
  const existingReview = data?.data?.review;

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<DoctorReviewFormData>({
    resolver: zodResolver(doctorReviewSchema),
    defaultValues: {
      review_note: '',
      final_category: '',
      final_urgency_level: '',
      recommendation: '',
    },
  });

  // Populate form defaults if existing review or AI suggestions available
  useEffect(() => {
    if (existingReview) {
      setValue('review_note', existingReview.review_note);
      setValue('final_category', existingReview.final_category);
      setValue('final_urgency_level', existingReview.final_urgency_level);
      setValue('recommendation', existingReview.recommendation);
    } else if (aiAnalysis) {
      setValue('final_category', aiAnalysis.possible_category || '');
      setValue('final_urgency_level', aiAnalysis.urgency_level || 'normal');
      if (aiAnalysis.doctor_note_suggestion) {
        setValue('review_note', aiAnalysis.doctor_note_suggestion);
      }
    }
  }, [existingReview, aiAnalysis, setValue]);

  // Reset form when modal closes or opens for another ID
  useEffect(() => {
    if (!isOpen) {
      reset();
    }
  }, [isOpen, reset]);

  if (!isOpen) return null;

  const onSubmitReview = async (formData: DoctorReviewFormData) => {
    if (!consultationId) return;

    setIsReviewSubmitting(true);
    try {
      const response = await submitDoctorReviewService(consultationId, formData);
      toast.success(response.message || 'Review dokter berhasil disimpan.');
      await mutate();
      if (onSuccessReview) {
        onSuccessReview();
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Gagal menyimpan review.';
      toast.error(errorMessage);
    } finally {
      setIsReviewSubmitting(false);
    }
  };

  const getSeverityBadge = (severity?: string) => {
    switch (severity?.toLowerCase()) {
      case 'low':
      case 'ringan':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-600 border border-emerald-200">Ringan</span>;
      case 'medium':
      case 'sedang':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-600 border border-amber-200">Sedang</span>;
      case 'high':
      case 'berat':
      case 'critical':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-600 border border-rose-200">Tinggi / Berat</span>;
      default:
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-600">{severity || '-'}</span>;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity animate-fadeIn"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-2xl bg-white shadow-2xl flex flex-col justify-between overflow-y-auto animate-slideOverEnter relative border-l border-slate-100">
          
          {/* Header Slide-over */}
          <div className="px-6 py-5 bg-white border-b border-slate-200/80 sticky top-0 z-10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <h2 className="text-lg font-extrabold text-slate-900 leading-tight">
                  Detail & Tinjauan Dokter
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  ID Konsultasi: {consultationId}
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

          {/* Content Body */}
          <div className="p-6 space-y-8 flex-1">
            {isLoading ? (
              <div className="py-20 flex flex-col items-center justify-center text-center space-y-4">
                <div className="w-12 h-12 rounded-full border-4 border-blue-100 border-t-blue-600 animate-spin"></div>
                <p className="text-xs text-slate-500 font-medium">Memuat data konsultasi & AI...</p>
              </div>
            ) : error ? (
              <div className="p-6 bg-rose-50 border border-rose-100 rounded-2xl text-center space-y-2">
                <p className="text-xs font-bold text-rose-700">Gagal memuat data konsultasi</p>
                <p className="text-xs text-rose-500">{error.message}</p>
              </div>
            ) : (
              <>
                {/* 1. Informasi Pasien */}
                <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-5 space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-200/60 pb-3">
                    <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
                      Informasi Pasien
                    </span>
                    <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-700">
                      {consultation?.status === 'reviewed' ? 'Sudah Ditinjau' : 'Perlu Ditinjau'}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div>
                      <span className="text-slate-400 block font-medium">Nama Pasien</span>
                      <span className="font-bold text-slate-900 block mt-0.5">{patient?.name || '-'}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block font-medium">Jenis Kelamin</span>
                      <span className="font-bold text-slate-900 block mt-0.5 capitalize">
                        {patient?.gender === 'male' || patient?.gender === 'Laki-laki' ? 'Laki-laki' : 'Perempuan'}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block font-medium">Tanggal Lahir</span>
                      <span className="font-bold text-slate-900 block mt-0.5">
                        {formatDateShortIndonesia(patient?.birth_date)}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block font-medium">Status Konsultasi</span>
                      <span className="font-bold text-slate-900 block mt-0.5 capitalize">
                        {consultation?.status || '-'}
                      </span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-200/60">
                    <span className="text-slate-400 block font-medium text-xs">Keluhan Utama Pasien</span>
                    <p className="text-xs font-semibold text-slate-800 leading-relaxed mt-1 bg-white p-3 rounded-xl border border-slate-200/60">
                      "{consultation?.complaint_text || '-'}"
                    </p>
                  </div>
                </div>

                {/* 2. Hasil Analisis AI */}
                {aiAnalysis && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
                      <div className="w-7 h-7 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                      </div>
                      <h3 className="text-sm font-extrabold text-slate-900">Hasil Analisis AI NLP</h3>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 bg-blue-50/50 border border-blue-100 rounded-2xl">
                        <span className="text-[10px] font-bold uppercase text-blue-600">Kategori AI</span>
                        <p className="text-xs font-extrabold text-slate-900 mt-0.5 capitalize">
                          {aiAnalysis.possible_category || '-'}
                        </p>
                      </div>

                      <div className="p-3 bg-teal-50/50 border border-teal-100 rounded-2xl">
                        <span className="text-[10px] font-bold uppercase text-teal-600">Tingkat Keparahan</span>
                        <div className="mt-1">{getSeverityBadge(aiAnalysis.severity_level)}</div>
                      </div>

                      <div className="p-3 bg-amber-50/50 border border-amber-100 rounded-2xl">
                        <span className="text-[10px] font-bold uppercase text-amber-600">Durasi Keluhan</span>
                        <p className="text-xs font-extrabold text-slate-900 mt-0.5">
                          {aiAnalysis.duration || '-'}
                        </p>
                      </div>

                      <div className="p-3 bg-purple-50/50 border border-purple-100 rounded-2xl">
                        <span className="text-[10px] font-bold uppercase text-purple-600">Confidence Score</span>
                        <p className="text-xs font-extrabold text-purple-700 mt-0.5">
                          {Math.round((aiAnalysis.confidence_score || 0.8) * 100)}%
                        </p>
                      </div>
                    </div>

                    {/* Gejala Terdeteksi */}
                    {aiAnalysis.detected_symptoms && aiAnalysis.detected_symptoms.length > 0 && (
                      <div>
                        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-2">
                          Gejala Terdeteksi
                        </span>
                        <div className="flex flex-wrap gap-2">
                          {aiAnalysis.detected_symptoms.map((symptom, idx) => (
                            <span
                              key={idx}
                              className="px-3 py-1 bg-blue-50 text-blue-700 font-semibold text-xs rounded-full border border-blue-200/60"
                            >
                              {symptom}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Summary */}
                    <div className="p-4 bg-slate-50 border border-slate-200/70 rounded-2xl">
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                        Ringkasan AI
                      </span>
                      <p className="text-xs text-slate-700 font-medium leading-relaxed">
                        {aiAnalysis.summary}
                      </p>
                    </div>
                  </div>
                )}

                {/* 3. Form Review Dokter */}
                <div className="pt-4 border-t border-slate-200/80 space-y-5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </div>
                      <h3 className="text-sm font-extrabold text-slate-900">
                        {existingReview ? 'Review Dokter (Tersimpan)' : 'Form Review Dokter'}
                      </h3>
                    </div>

                    {existingReview && (
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-200">
                        Sudah Diulas
                      </span>
                    )}
                  </div>

                  <form onSubmit={handleSubmit(onSubmitReview)} className="space-y-4">
                    {/* Catatan Review */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Catatan Review Dokter <span className="text-rose-500">*</span>
                      </label>
                      <textarea
                        rows={3}
                        {...register('review_note')}
                        disabled={isReviewSubmitting}
                        placeholder="Masukkan catatan tinjauan klinis dokter..."
                        className={`w-full p-3 bg-slate-50 border rounded-2xl text-xs text-slate-800 focus:outline-none focus:bg-white focus:border-blue-500 transition-all ${
                          errors.review_note ? 'border-rose-400 animate-shake' : 'border-slate-200'
                        }`}
                      />
                      {errors.review_note && (
                        <p className="text-[11px] text-rose-500 font-semibold mt-1">
                          {errors.review_note.message}
                        </p>
                      )}
                    </div>

                    {/* Kategori Final & Urgensi */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Kategori Final */}
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Kategori Final <span className="text-rose-500">*</span>
                        </label>
                        <select
                          {...register('final_category')}
                          disabled={isReviewSubmitting}
                          className={`w-full p-3 bg-slate-50 border rounded-2xl text-xs text-slate-800 focus:outline-none focus:bg-white focus:border-blue-500 transition-all ${
                            errors.final_category ? 'border-rose-400 animate-shake' : 'border-slate-200'
                          }`}
                        >
                          <option value="">Pilih Kategori Final...</option>
                          <option value="keluhan pernapasan">Keluhan Pernapasan</option>
                          <option value="keluhan pencernaan">Keluhan Pencernaan</option>
                          <option value="keluhan saraf">Keluhan Saraf</option>
                          <option value="keluhan kardiovaskular">Keluhan Kardiovaskular</option>
                          <option value="keluhan kulit">Keluhan Kulit</option>
                          <option value="lainnya">Lainnya</option>
                        </select>
                        {errors.final_category && (
                          <p className="text-[11px] text-rose-500 font-semibold mt-1">
                            {errors.final_category.message}
                          </p>
                        )}
                      </div>

                      {/* Tingkat Urgensi */}
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Tingkat Urgensi Final <span className="text-rose-500">*</span>
                        </label>
                        <select
                          {...register('final_urgency_level')}
                          disabled={isReviewSubmitting}
                          className={`w-full p-3 bg-slate-50 border rounded-2xl text-xs text-slate-800 focus:outline-none focus:bg-white focus:border-blue-500 transition-all ${
                            errors.final_urgency_level ? 'border-rose-400 animate-shake' : 'border-slate-200'
                          }`}
                        >
                          <option value="">Pilih Urgensi...</option>
                          <option value="low">Rendah (Low)</option>
                          <option value="normal">Normal</option>
                          <option value="high">Tinggi (High)</option>
                          <option value="critical">Kritis (Critical)</option>
                        </select>
                        {errors.final_urgency_level && (
                          <p className="text-[11px] text-rose-500 font-semibold mt-1">
                            {errors.final_urgency_level.message}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Rekomendasi Penanganan */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Rekomendasi Penanganan <span className="text-rose-500">*</span>
                      </label>
                      <textarea
                        rows={3}
                        {...register('recommendation')}
                        disabled={isReviewSubmitting}
                        placeholder="Masukkan saran tindak lanjut atau penanganan untuk pasien..."
                        className={`w-full p-3 bg-slate-50 border rounded-2xl text-xs text-slate-800 focus:outline-none focus:bg-white focus:border-blue-500 transition-all ${
                          errors.recommendation ? 'border-rose-400 animate-shake' : 'border-slate-200'
                        }`}
                      />
                      {errors.recommendation && (
                        <p className="text-[11px] text-rose-500 font-semibold mt-1">
                          {errors.recommendation.message}
                        </p>
                      )}
                    </div>

                    {/* Submit Button */}
                    <div className="pt-2">
                      <LoadingButton
                        type="submit"
                        isLoading={isReviewSubmitting}
                        className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs rounded-2xl shadow-md shadow-blue-500/20 transition-all cursor-pointer"
                      >
                        {existingReview ? 'Perbarui Review Dokter' : 'Simpan Review Dokter'}
                      </LoadingButton>
                    </div>
                  </form>
                </div>
              </>
            )}
          </div>

          {/* Footer Slide-over */}
          <div className="p-4 bg-slate-50 border-t border-slate-200/80 sticky bottom-0 z-10 flex items-center justify-end">
            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-white transition-colors cursor-pointer"
            >
              Tutup Panel
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
