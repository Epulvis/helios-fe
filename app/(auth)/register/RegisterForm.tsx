'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';

import { HeliosLogo } from '../../components/ui/HeliosLogo';
import { InputField } from '../../components/ui/InputField';
import { LoadingButton } from '../../components/ui/LoadingButton';
import { registerSchema, RegisterFormData } from '../../lib/validations/auth';
import { registerService } from '../../lib/services/auth';

export default function RegisterForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [generalError, setGeneralError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      gender: 'male',
      birth_date: '',
      password: '',
    },
  });

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);
    setGeneralError(null);

    try {
      const response = await registerService(data);

      if (response.success) {
        toast.success(response.message || 'Registrasi pasien berhasil! Silakan login.');
        router.push('/login');
      } else {
        setGeneralError(response.message || 'Validasi gagal.');

        // Highlight fields with errors returned from API
        if (response.errors && Array.isArray(response.errors)) {
          response.errors.forEach((err) => {
            if (err.field && err.message) {
              setError(err.field as keyof RegisterFormData, {
                type: 'server',
                message: err.message,
              });
            }
          });
        }

        toast.error(response.message || 'Registrasi gagal.');
      }
    } catch (error) {
      console.error('Submit register error:', error);
      setGeneralError('Terjadi kesalahan koneksi. Silakan coba lagi.');
      toast.error('Terjadi kesalahan koneksi.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[680px]">
      {/* Left Panel - Branding & Illustration (Register.svg inspired) */}
      <div className="lg:col-span-5 bg-gradient-to-br from-teal-700 via-teal-600 to-blue-700 p-8 lg:p-12 text-white flex flex-col justify-between relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-2xl pointer-events-none -mr-20 -mt-20" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-400/20 rounded-full blur-xl pointer-events-none -ml-16 -mb-16" />

        {/* Top Header */}
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/15 backdrop-blur-md text-xs font-semibold text-white mb-6 border border-white/20">
            <span className="w-2 h-2 rounded-full bg-blue-300 animate-ping" />
            Pendaftaran Pasien Baru
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white leading-tight">
            Bergabung dengan Layanan Kesehatan Helios
          </h2>
          <p className="mt-3 text-sm text-teal-100/90 leading-relaxed">
            Dapatkan kemudahan akses rekam medis digital, buat janji temu dengan dokter spesialis, dan pantau kesehatan keluarga dalam satu platform.
          </p>
        </div>

        {/* Middle Feature list */}
        <div className="relative z-10 my-6 p-5 bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 space-y-3">
          <div className="flex items-center gap-3 text-xs text-white">
            <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center shrink-0 text-teal-200">
              ✓
            </div>
            <span>Pendaftaran cepat & terverifikasi otomatis</span>
          </div>
          <div className="flex items-center gap-3 text-xs text-white">
            <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center shrink-0 text-teal-200">
              ✓
            </div>
            <span>Konsultasi dengan ribuan Dokter Spesialis</span>
          </div>
          <div className="flex items-center gap-3 text-xs text-white">
            <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center shrink-0 text-teal-200">
              ✓
            </div>
            <span>Akses rekam medis digital secara real-time</span>
          </div>
        </div>

        {/* Footer */}
        <div className="relative z-10 text-xs text-teal-200/80 border-t border-white/10 pt-4">
          &copy; {new Date().getFullYear()} Helios Healthcare. Privasi Anda Terjamin.
        </div>
      </div>

      {/* Right Panel - Form (Register.svg inspired) */}
      <div className="lg:col-span-7 p-8 lg:p-12 flex flex-col justify-between bg-white">
        <div className="max-w-lg mx-auto w-full">
          {/* Logo & Header */}
          <div className="mb-6">
            <HeliosLogo size="md" />
            <h3 className="mt-6 text-xl font-bold text-slate-900">
              Buat Akun Pasien Baru
            </h3>
            <p className="mt-1 text-xs text-slate-500">
              Lengkapi formulir di bawah ini untuk memulai.
            </p>
          </div>

          {/* General API Error Alert */}
          {generalError && (
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
                <span className="font-bold block">Registrasi Gagal</span>
                {generalError}
              </div>
            </div>
          )}

          {/* Register Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
            {/* Nama Lengkap */}
            <InputField
              label="Nama Lengkap"
              placeholder="contoh: Budi Santoso"
              registration={register('name')}
              error={errors.name?.message}
              icon={
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              }
            />

            {/* Email & No HP grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InputField
                label="Email"
                type="email"
                placeholder="budi@mail.com"
                registration={register('email')}
                error={errors.email?.message}
                icon={
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                }
              />

              <InputField
                label="Nomor Handphone"
                type="tel"
                placeholder="08123456789"
                registration={register('phone')}
                error={errors.phone?.message}
                icon={
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1.001 1.001 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                }
              />
            </div>

            {/* Jenis Kelamin & Tanggal Lahir grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InputField
                label="Jenis Kelamin"
                isSelect
                registration={register('gender')}
                error={errors.gender?.message}
                options={[
                  { value: 'male', label: 'Laki-laki' },
                  { value: 'female', label: 'Perempuan' },
                ]}
                icon={
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                }
              />

              <InputField
                label="Tanggal Lahir"
                type="date"
                registration={register('birth_date')}
                error={errors.birth_date?.message}
                icon={
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                }
              />
            </div>

            {/* Password */}
            <InputField
              label="Password"
              type="password"
              placeholder="Minimal 8 karakter"
              registration={register('password')}
              error={errors.password?.message}
              icon={
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              }
            />

            <div className="pt-2">
              <LoadingButton isLoading={isLoading}>
                Daftar Akun Pasien
              </LoadingButton>
            </div>
          </form>

          {/* Footer Login Link */}
          <div className="mt-6 text-center text-xs text-slate-500 border-t border-slate-100 pt-6">
            Sudah memiliki akun?{' '}
            <Link
              href="/login"
              className="font-bold text-blue-600 hover:text-blue-700 hover:underline transition-colors"
            >
              Masuk di sini
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
