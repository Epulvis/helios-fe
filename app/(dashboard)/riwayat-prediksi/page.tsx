import { Metadata } from 'next';
import { RiwayatPrediksiContent } from './RiwayatPrediksiContent';

export const metadata: Metadata = {
  title: 'Riwayat Prediksi — Helios',
  description: 'Daftar riwayat konsultasi dan prediksi kesehatan berbasis Artificial Intelligence',
};

export default function RiwayatPrediksiPage() {
  return <RiwayatPrediksiContent />;
}
