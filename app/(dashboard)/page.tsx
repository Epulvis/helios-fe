'use client';

import React, { useState } from 'react';
import useSWR from 'swr';
import { HeroBanner } from '../components/dashboard/HeroBanner';
import { DashboardStatCards } from '../components/dashboard/DashboardStatCards';
import { LatestPredictionCard } from '../components/dashboard/LatestPredictionCard';
import { RecentHistoryCard } from '../components/dashboard/RecentHistoryCard';
import { ConsultationResultModal } from '../components/consultation/ConsultationResultModal';
import { GetConsultationListResponse } from '../lib/types/consultation';

const fetcher = async (url: string): Promise<GetConsultationListResponse> => {
  const res = await fetch(url);
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Gagal mengambil statistik dashboard');
  }
  return data;
};

export default function DashboardPage() {
  const [selectedConsultationId, setSelectedConsultationId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch consultation list data for upper stats
  const { data, isLoading } = useSWR<GetConsultationListResponse>(
    '/api/proxy/consultations?limit=5',
    fetcher,
    { revalidateOnFocus: false }
  );

  const handleOpenDetail = (id: string) => {
    setSelectedConsultationId(id);
    setIsModalOpen(true);
  };

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
