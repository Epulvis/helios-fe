import { Metadata } from 'next';
import LoginForm from './LoginForm';

export const metadata: Metadata = {
  title: 'Masuk - Helios Healthcare Platform',
  description: 'Halaman masuk pasien dan dokter platform kesehatan Helios.',
};

export default function LoginPage() {
  return <LoginForm />;
}
