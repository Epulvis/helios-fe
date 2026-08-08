'use client';

import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { createConsultationService } from '../../lib/services/consultation';
import { ConsultationResultModal } from './ConsultationResultModal';

export function PrediksiBaruForm() {
  const router = useRouter();
  const [complaint, setComplaint] = useState('');
  const [category, setCategory] = useState('');
  const [severity, setSeverity] = useState<'' | 'Ringan' | 'Sedang' | 'Berat'>('');

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeConsultationId, setActiveConsultationId] = useState<string | null>(null);

  const maxChars = 500;

  const handleComplaintChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setComplaint(val);
    if (errorMessage && val.trim().length > 0 && val.length <= maxChars) {
      setErrorMessage('');
    }
  };

  const handleReset = () => {
    setComplaint('');
    setCategory('');
    setSeverity('');
    setErrorMessage('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const trimmed = complaint.trim();
    if (!trimmed) {
      setErrorMessage('Keluhan / Gejala tidak boleh kosong.');
      return;
    }

    if (trimmed.length > maxChars) {
      setErrorMessage(`Keluhan / Gejala tidak boleh melebihi ${maxChars} karakter.`);
      return;
    }

    setErrorMessage('');
    setIsLoading(true);

    // Data Merging
    let mergedText = trimmed;
    const metaParts: string[] = [];
    if (category) metaParts.push(`Kategori: ${category}`);
    if (severity) metaParts.push(`Keparahan: ${severity}`);

    if (metaParts.length > 0) {
      mergedText = `${trimmed}. [${metaParts.join(', ')}]`;
    }

    try {
      const response = await createConsultationService(mergedText);

      if (response.success && response.data?.consultation?.id) {
        toast.success(response.message || 'Konsultasi berhasil dibuat');
        setActiveConsultationId(response.data.consultation.id);
        setIsModalOpen(true);
      } else {
        toast.error(response.message || 'Gagal memproses prediksi');
      }
    } catch (err: unknown) {
      const errorObj = err as { status?: number; message?: string };
      if (errorObj?.status === 401) {
        toast.error('Sesi login telah berakhir. Silakan login kembali.');
        router.push('/login');
      } else {
        toast.error(errorObj?.message || 'Terjadi kesalahan sistem. Silakan coba lagi.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
      {/* Left Column: Form Section */}
      <div className="lg:col-span-2 bg-white rounded-3xl p-6 md:p-8 shadow-xs border border-slate-200/80 flex flex-col justify-between space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4 border-b border-slate-100 pb-5 shrink-0">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.8}
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 leading-tight">
              Input Prediksi Baru
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Tuliskan keluhan atau gejala yang Anda rasakan untuk dianalisis oleh sistem NLP.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 flex flex-col justify-between space-y-6">
          <div className="space-y-6 flex-1">
            {/* Main Textarea Input */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-800">
                Keluhan / Gejala <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <textarea
                  value={complaint}
                  onChange={handleComplaintChange}
                  disabled={isLoading}
                  rows={5}
                  placeholder="Contoh: Saya demam sejak 2 hari yang lalu, batuk kering, pilek, sakit kepala, nyeri tenggorokan dan badan terasa lemas. Nafsu makan berkurang"
                  className={`w-full p-4 bg-white border rounded-2xl text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none transition-all resize-none ${
                    errorMessage
                      ? 'border-rose-400 focus:border-rose-500 focus:ring-1 focus:ring-rose-500 animate-shake'
                      : 'border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
                  } ${isLoading ? 'bg-slate-50 cursor-not-allowed opacity-70' : ''}`}
                />
              </div>

              {/* Error Message if client validation fails */}
              {errorMessage && (
                <p className="text-xs text-rose-500 font-medium flex items-center gap-1.5 animate-fadeIn">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{errorMessage}</span>
                </p>
              )}

              {/* Footer Text & Character Counter */}
              <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                <span className="flex items-center gap-1">
                  <svg className="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Tuliskan keluhan Anda secara jelas dan lengkap untuk mendapatkan hasil yang lebih akurat.
                </span>
                <span className={`font-semibold ${complaint.length > maxChars ? 'text-rose-500' : 'text-slate-400'}`}>
                  {complaint.length}/{maxChars} karakter
                </span>
              </div>
            </div>

            {/* Info Banner */}
            <div className="p-4 bg-blue-50/70 border border-blue-100 rounded-2xl flex items-start gap-3">
              <svg className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-xs text-blue-900 font-medium leading-relaxed">
                Kategori Keluhan dan Tingkat Keparahan bersifat opsional sebagai informasi pendukung. Analisis utama dilakukan berdasarkan teks yang Anda tulis pada Keluhan / Gejala.
              </p>
            </div>

            {/* Optional Inputs: Category & Severity */}
            <div className="p-5 border border-slate-200/80 rounded-2xl grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50/30">
              {/* Category Dropdown */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <label className="text-xs font-bold text-slate-800">Kategori Keluhan</label>
                  <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-500 text-[10px] font-semibold">Opsional</span>
                </div>
                <div className="relative">
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    disabled={isLoading}
                    className={`w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-none focus:border-blue-500 transition-colors appearance-none cursor-pointer ${
                      isLoading ? 'opacity-60 cursor-not-allowed' : ''
                    }`}
                  >
                    <option value="">Pilih kategori jika mengetahui</option>
                    <option value="Saraf">Saraf</option>
                    <option value="Pernapasan">Pernapasan</option>
                    <option value="Pencernaan">Pencernaan</option>
                    <option value="Kardiologi / Jantung">Kardiologi / Jantung</option>
                    <option value="Kulit">Kulit</option>
                    <option value="THT">THT</option>
                    <option value="Umum">Umum</option>
                  </select>
                  <svg
                    className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>

              {/* Severity Radio Pills */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <label className="text-xs font-bold text-slate-800">Tingkat Keparahan</label>
                  <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-500 text-[10px] font-semibold">Opsional</span>
                </div>
                <div className="flex items-center gap-2">
                  {[
                    { value: 'Ringan', color: 'bg-emerald-500', activeBg: 'bg-emerald-50 border-emerald-300 text-emerald-700' },
                    { value: 'Sedang', color: 'bg-amber-500', activeBg: 'bg-amber-50 border-amber-300 text-amber-700' },
                    { value: 'Berat', color: 'bg-rose-500', activeBg: 'bg-rose-50 border-rose-300 text-rose-700' },
                  ].map((item) => {
                    const isSelected = severity === item.value;
                    return (
                      <button
                        type="button"
                        key={item.value}
                        disabled={isLoading}
                        onClick={() => setSeverity(isSelected ? '' : (item.value as 'Ringan' | 'Sedang' | 'Berat'))}
                        className={`flex-1 py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                          isSelected
                            ? item.activeBg
                            : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                        } ${isLoading ? 'opacity-60 cursor-not-allowed' : ''}`}
                      >
                        <span className={`w-2 h-2 rounded-full ${item.color}`}></span>
                        <span>{item.value}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Warning / Important Notice */}
            <div className="p-4 bg-blue-50/50 border border-blue-200/60 rounded-2xl flex items-start gap-3">
              <div className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0 mt-0.5">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h4 className="text-xs font-bold text-blue-900">Catatan Penting</h4>
                <p className="text-[11px] text-slate-600 leading-relaxed mt-0.5">
                  Hasil prediksi ini merupakan analisis awal berbasis Artificial Intelligence (NLP) dan bukan diagnosis medis akhir. Selalu konsultasikan dengan tenaga medis profesional untuk pemeriksaan dan penanganan lebih lanjut.
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-100 shrink-0">
            <button
              type="button"
              onClick={handleReset}
              disabled={isLoading}
              className={`px-8 py-3 rounded-2xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer ${
                isLoading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              Reset
            </button>

            <button
              type="submit"
              disabled={isLoading}
              className={`px-8 py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-700 hover:to-teal-600 text-white text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer ${
                isLoading ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {isLoading ? (
                <>
                  <svg className="w-4 h-4 animate-spin text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Memproses...</span>
                </>
              ) : (
                <span>Proses Prediksi</span>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Right Column: Info & Tips Cards (Bento style height match) */}
      <div className="flex flex-col justify-between gap-6 h-full">
        {/* Card 1: Analisis NLP Cerdas */}
        <div className="bg-white rounded-3xl p-6 shadow-xs border border-slate-200/80 flex-1 flex flex-col justify-between space-y-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Analisis NLP Cerdas</h3>
            <p className="text-xs text-slate-500 leading-relaxed mt-1">
              Sistem kami menggunakan teknologi Natural Language Processing untuk menganalisis keluhan Anda dari teks yang ditulis dan memberikan prediksi kesehatan yang akurat.
            </p>
          </div>

          {/* Graphic Banner Illustration */}
          <div className="bg-gradient-to-br from-blue-50 via-teal-50/40 to-blue-50 rounded-2xl p-6 flex items-center justify-center relative overflow-hidden my-2">
            <div className="relative z-10 flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-teal-500 text-white flex items-center justify-center shadow-md">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <div className="p-3 bg-white rounded-2xl shadow-sm border border-slate-100 space-y-1.5 w-32">
                <div className="h-2 bg-blue-100 rounded-full w-full"></div>
                <div className="h-2 bg-blue-100 rounded-full w-3/4"></div>
                <div className="h-2 bg-blue-100 rounded-full w-1/2"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Card 2: Tips Menulis Keluhan */}
        <div className="bg-white rounded-3xl p-6 shadow-xs border border-slate-200/80 flex-1 flex flex-col justify-between space-y-4">
          <h3 className="text-sm font-bold text-slate-900">Tips Menulis Keluhan</h3>

          <div className="space-y-3.5 flex-1 flex flex-col justify-around">
            {[
              {
                title: 'Cukup jelaskan melalui teks',
                desc: 'Tuliskan gejala utama, durasi, dan hal penting lainnya yang Anda rasakan.',
                icon: (
                  <svg className="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                ),
                bg: 'bg-teal-50',
              },
              {
                title: 'Sertakan durasi keluhan',
                desc: 'Jelaskan sejak kapan keluhan muncul dan apakah berlangsung terus-menerus.',
                icon: (
                  <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                ),
                bg: 'bg-purple-50',
              },
              {
                title: 'Sebutkan bagian tubuh',
                desc: 'Jelaskan bagian tubuh yang terasa nyeri atau tidak nyaman.',
                icon: (
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                ),
                bg: 'bg-blue-50',
              },
              {
                title: 'Cantumkan kondisi pendukung',
                desc: 'Sertakan faktor lain seperti riwayat penyakit, obat yang dikonsumsi, atau kondisi khusus.',
                icon: (
                  <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ),
                bg: 'bg-emerald-50',
              },
            ].map((tip, idx) => (
              <div key={idx} className="flex items-start gap-3.5">
                <div className={`w-9 h-9 rounded-2xl ${tip.bg} flex items-center justify-center shrink-0`}>
                  {tip.icon}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-800">{tip.title}</h4>
                  <p className="text-[11px] text-slate-500 leading-relaxed mt-0.5">
                    {tip.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Result Modal with Polling SWR */}
      <ConsultationResultModal
        isOpen={isModalOpen}
        consultationId={activeConsultationId}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
