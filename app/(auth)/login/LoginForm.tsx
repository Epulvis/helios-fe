'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';

import { HeliosLogo } from '../../components/ui/HeliosLogo';
import { RoleToggle } from '../../components/ui/RoleToggle';
import { InputField } from '../../components/ui/InputField';
import { LoadingButton } from '../../components/ui/LoadingButton';
import { DemoAccountCard } from '../../components/dev/DemoAccountCard';
import { loginSchema, LoginFormData } from '../../lib/validations/auth';
import { loginService } from '../../lib/services/auth';
import { useAuthStore } from '../../lib/stores/useAuthStore';
import { Role } from '../../lib/types/auth';

export default function LoginForm() {
  const router = useRouter();
  const setUser = useAuthStore((state) => state.setUser);

  const [role, setRole] = useState<Role>('patient');
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    clearErrors,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      identifier: '',
      password: '',
    },
  });

  const handleRoleChange = (newRole: Role) => {
    setRole(newRole);
    setApiError(null);
    clearErrors();
  };

  const handleAutoFillDemo = (identifier: string, password: string) => {
    setValue('identifier', identifier, { shouldValidate: true });
    setValue('password', password, { shouldValidate: true });
    setApiError(null);
  };

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setApiError(null);

    try {
      const response = await loginService(data, role);

      if (response.success) {
        // Cache user profile in Zustand store
        setUser(response.data.user);

        toast.success(response.message || 'Login berhasil!');

        // Redirect to protected dashboard route
        router.push('/dashboard');
      } else {
        setApiError(response.message || 'Email/Nomor HP atau password salah.');
        toast.error(response.message || 'Login gagal.');
      }
    } catch (error) {
      console.error('Submit error:', error);
      setApiError('Terjadi kesalahan koneksi. Silakan coba lagi.');
      toast.error('Terjadi kesalahan koneksi.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[640px]">
      {/* Left Panel - Branding & Illustration (Login.svg inspired) */}
      <div className="lg:col-span-5 bg-gradient-to-br from-blue-700 via-blue-600 to-teal-600 p-8 lg:p-12 text-white flex flex-col justify-between relative overflow-hidden">
        {/* Subtle decorative circle patterns */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-2xl pointer-events-none -mr-20 -mt-20" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-teal-400/20 rounded-full blur-xl pointer-events-none -ml-16 -mb-16" />

        {/* Top Header */}
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/15 backdrop-blur-md text-xs font-semibold text-white mb-6 border border-white/20">
            <span className="w-2 h-2 rounded-full bg-teal-300 animate-ping" />
            Platform Layanan Kesehatan Terpadu
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white leading-tight">
            Selamat Datang Kembali di Helios
          </h2>
          <p className="mt-3 text-sm text-blue-100/90 leading-relaxed">
            Akses portal kesehatan digital Anda untuk konsultasi dokter, jadwal rekam medis, dan evaluasi kesehatan berbasis standar medis terbaik.
          </p>
        </div>

        {/* Middle Feature Card Illustration */}
        <div className="relative z-10 my-8 p-6 bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 shadow-xl">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center text-white shrink-0">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Keamanan Data Rekam Medis</h4>
              <p className="text-xs text-blue-100/80">Tergabung & Terenkripsi Endpoint Standar ISO</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 pt-3 border-t border-white/15 text-xs text-blue-100">
            <div>
              <span className="block font-extrabold text-white text-base">24/7</span>
              Layanan Pasien & Dokter
            </div>
            <div>
              <span className="block font-extrabold text-white text-base">100%</span>
              Respon Instan
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="relative z-10 text-xs text-blue-200/80 flex items-center justify-between border-t border-white/10 pt-4">
          <span>&copy; {new Date().getFullYear()} Helios Healthcare</span>
          <span className="flex items-center gap-1">
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            SSL Encrypted
          </span>
        </div>
      </div>

      {/* Right Panel - Form (Login.svg inspired) */}
      <div className="lg:col-span-7 p-8 lg:p-12 flex flex-col justify-between bg-white">
        <div className="max-w-md mx-auto w-full">
          {/* Logo & Header */}
          <div className="mb-6">
            <HeliosLogo size="md" />
            <h3 className="mt-6 text-xl font-bold text-slate-900">
              {role === 'patient' ? 'Masuk sebagai Pasien' : 'Masuk sebagai Dokter'}
            </h3>
            <p className="mt-1 text-xs text-slate-500">
              Silakan masukkan kredensial Anda untuk melanjutkan.
            </p>
          </div>

          {/* Role Toggle Switch */}
          <div className="mb-6">
            <RoleToggle role={role} onChange={handleRoleChange} />
          </div>

          {/* Error Banner / Alert if invalid credentials */}
          {apiError && (
            <div className="mb-5 p-3.5 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3 animate-shake">
              <svg
                className="w-5 h-5 text-red-500 shrink-0 mt-0.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <div className="flex-1 text-xs text-red-700">
                <span className="font-bold block">Gagal Masuk</span>
                {apiError}
              </div>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
            <InputField
              label={role === 'doctor' ? 'Email Dokter' : 'Email atau Nomor HP Pasien'}
              placeholder={
                role === 'doctor' ? 'contoh: doctor@mail.com' : 'contoh: 08123456789 atau email'
              }
              registration={register('identifier')}
              error={errors.identifier?.message}
              icon={
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              }
            />

            <InputField
              label="Password"
              type="password"
              placeholder="Masukkan password Anda"
              registration={register('password')}
              error={errors.password?.message}
              icon={
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              }
            />

            <div className="mt-2">
              <LoadingButton isLoading={isLoading}>
                Masuk ({role === 'doctor' ? 'Dokter' : 'Pasien'})
              </LoadingButton>
            </div>
          </form>

          {/* Dev-Only Demo Account Component */}
          <DemoAccountCard currentRole={role} onSelectAccount={handleAutoFillDemo} />

          {/* Footer Register Link */}
          <div className="mt-8 text-center text-xs text-slate-500 border-t border-slate-100 pt-6">
            Belum memiliki akun pasien?{' '}
            <Link
              href="/register"
              className="font-bold text-blue-600 hover:text-blue-700 hover:underline transition-colors"
            >
              Daftar Sekarang
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
