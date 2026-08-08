import type { Metadata } from 'next';
import { PrediksiBaruForm } from './PrediksiBaruForm';

export const metadata: Metadata = {
  title: 'Prediksi Baru - Helios',
  description: 'Input keluhan dan gejala kesehatan untuk dianalisis oleh AI NLP Helios.',
};

export default function PrediksiBaruPage() {
  return <PrediksiBaruForm />;
}
