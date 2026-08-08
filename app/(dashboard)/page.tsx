'use client';

import React, { useState } from 'react';
import useSWR from 'swr';

import { useAuthStore } from '../lib/stores/useAuthStore';
import { HeroBanner } from '../components/dashboard/HeroBanner';
import { DashboardStatCards } from '../components/dashboard/DashboardStatCards';
import { LatestPredictionCard } from '../components/dashboard/LatestPredictionCard';
import { RecentHistoryCard } from '../components/dashboard/RecentHistoryCard';
import { ConsultationResultModal } from '../components/consultation/ConsultationResultModal';
import { GetConsultationListResponse } from '../lib/types/consultation';

// Doctor components
import { DoctorHeroBanner } from '../components/doctor-dashboard/DoctorHeroBanner';
import { DoctorStatCards } from '../components/doctor-dashboard/DoctorStatCards';
import { DoctorPredictionTable } from '../components/doctor-dashboard/DoctorPredictionTable';
import { PrioritySummaryCard } from '../components/doctor-dashboard/PrioritySummaryCard';
import { QuickInsightCard } from '../components/doctor-dashboard/QuickInsightCard';

const fetcher = async (url: string): Promise<GetConsultationListResponse> => {
  const res = await fetch(url);
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Gagal mengambil statistik dashboard');
  }
  return data;
};

export default function DashboardPage() {
  const { user } = useAuthStore();
  const [selectedConsultationId, setSelectedConsultationId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const isDoctor = user?.role === 'doctor';

  // Fetch consultation list data for patient upper stats
  const { data, isLoading } = useSWR<GetConsultationListResponse>(
    !isDoctor ? '/api/proxy/consultations?limit=5' : null,
    fetcher,
    { revalidateOnFocus: false }
  );

  const handleOpenDetail = (id: string) => {
    setSelectedConsultationId(id);
    setIsModalOpen(true);
  };

  if (isDoctor) {
    return (
      <div className="max-w-7xl mx-auto space-y-6 pb-8">
        {/* 1. Header Hero Banner Dokter */}
        <DoctorHeroBanner />

        {/* 2. 4 Kartu Statistik Atas Dokter */}
        <DoctorStatCards />

        {/* 3. Main Content: Left = Tabel Prediksi Terbaru Pasien, Right = Sidebar Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* Kolom Kiri: Tabel Prediksi Terbaru Pasien */}
          <div className="lg:col-span-2">
            <DoctorPredictionTable />
          </div>

          {/* Kolom Kanan: Ringkasan Prioritas & Insight Cepat */}
          <div className="space-y-6">
            <PrioritySummaryCard />
            <QuickInsightCard />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-8">
      {/* 1. Welcome Hero Banner */}
      <HeroBanner />

      {/* 2. Top 4 Statistics Bento Cards */}
      <DashboardStatCards data={data} isLoading={isLoading} />

      {/* 3. Main Bento Layout: Left = Latest Prediction Result, Right = Recent History */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
        {/* Kartu Sebelah Kiri: Hasil Prediksi Terakhir */}
        <LatestPredictionCard onOpenDetail={handleOpenDetail} />

        {/* Kartu Sebelah Kanan: Riwayat Prediksi Terbaru */}
        <RecentHistoryCard />
      </div>

      {/* Shared Consultation Detail Modal */}
      <ConsultationResultModal
        isOpen={isModalOpen}
        consultationId={selectedConsultationId}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}

