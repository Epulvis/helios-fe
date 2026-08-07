import { Metadata } from 'next';
import RegisterForm from './RegisterForm';

export const metadata: Metadata = {
  title: 'Registrasi Pasien - Helios Healthcare Platform',
  description: 'Pendaftaran akun pasien baru di platform kesehatan digital Helios.',
};

export default function RegisterPage() {
  return <RegisterForm />;
}
