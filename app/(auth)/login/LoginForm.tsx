'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';

import { HeliosLogo } from '../../components/ui/HeliosLogo';
import { AnimatedMedicalSvg } from '../../components/ui/AnimatedMedicalSvg';
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
  const [showPassword, setShowPassword] = useState(false);

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

  const handleAutoFillDemo = (targetRole: Role, identifier: string, password: string) => {
    handleRoleChange(targetRole);
    setValue('identifier', identifier, { shouldValidate: true });
    setValue('password', password, { shouldValidate: true });
  };

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setApiError(null);

    try {
      const response = await loginService(data, role);

      if (response.success) {
        setUser(response.data.user);
        toast.success(response.message || 'Login berhasil!');
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
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center w-full lg:h-full lg:max-h-[85vh] py-2 sm:py-3">
      {/* Left Column: Branding, Heading, Vector Illustration & Features */}
      <div className="lg:col-span-7 flex flex-col justify-between h-full space-y-4 xl:space-y-5">
        {/* Top Header Logo & Tagline */}
        <div>
          <HeliosLogo size="lg" />
          <p className="mt-2.5 text-xs sm:text-sm font-medium text-[#486581] max-w-xl leading-relaxed">
            Health Evaluation through Language Intelligence for Outcome Screening
          </p>
        </div>

        {/* Main Heading */}
        <div>
          <h1 className="text-3xl sm:text-4xl xl:text-5xl font-[850] text-[#0d2946] tracking-tight">
            Selamat Datang
          </h1>
        </div>

        {/* Animated Vector Asset with Interactive Card Hover Glow */}
        <div className="relative w-full max-w-2xl py-1 flex items-center justify-center animate-float">
          <div className="relative w-full h-[220px] sm:h-[280px] lg:h-[300px] xl:h-[340px] animate-pulseGlow transition-all">
            <AnimatedMedicalSvg />
          </div>
        </div>

        {/* 4 Feature Items at Bottom */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-slate-200/60">
          {/* Feature 1: Aman & Terpercaya */}
          <div className="flex flex-col items-center sm:items-start text-center sm:text-left gap-2">
            <div className="w-10 h-10 rounded-xl bg-[#e6f7f9] border border-teal-100 flex items-center justify-center text-[#00b4a2] shrink-0 shadow-xs">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-[#0d2946]">Aman & Terpercaya</h4>
              <p className="text-[11px] text-[#627d98] leading-tight mt-0.5">
                Keamanan data prioritas kami
              </p>
            </div>
          </div>

          {/* Feature 2: AI Berbasis NLP */}
          <div className="flex flex-col items-center sm:items-start text-center sm:text-left gap-2">
            <div className="w-10 h-10 rounded-xl bg-[#edf5ff] border border-blue-100 flex items-center justify-center text-[#0088ff] shrink-0 shadow-xs">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-[#0d2946]">AI Berbasis NLP</h4>
              <p className="text-[11px] text-[#627d98] leading-tight mt-0.5">
                Analisis teks medis yang akurat
              </p>
            </div>
          </div>

          {/* Feature 3: Human Centric */}
          <div className="flex flex-col items-center sm:items-start text-center sm:text-left gap-2">
            <div className="w-10 h-10 rounded-xl bg-[#e6f7f9] border border-teal-100 flex items-center justify-center text-[#00b4a2] shrink-0 shadow-xs">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-[#0d2946]">Human Centric</h4>
              <p className="text-[11px] text-[#627d98] leading-tight mt-0.5">
                Berfokus pada kebutuhan manusia
              </p>
            </div>
          </div>

          {/* Feature 4: Prediksi Cerdas */}
          <div className="flex flex-col items-center sm:items-start text-center sm:text-left gap-2">
            <div className="w-10 h-10 rounded-xl bg-[#edf5ff] border border-blue-100 flex items-center justify-center text-[#0088ff] shrink-0 shadow-xs">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
              </svg>
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-[#0d2946]">Prediksi Cerdas</h4>
              <p className="text-[11px] text-[#627d98] leading-tight mt-0.5">
                Mendukung keputusan kesehatan lebih baik
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column: Floating Login Card */}
      <div className="lg:col-span-5 w-full flex justify-center lg:justify-end">
        <div className="w-full max-w-[450px] bg-white rounded-[32px] p-7 sm:p-9 shadow-[0_25px_60px_-15px_rgba(13,41,70,0.09)] border border-slate-100/90 relative z-10">
          
          {/* Akun Demo Section */}
          <div className="mb-5">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 mb-3">
              <span>Akun Demo</span>
              <span className="w-4 h-4 rounded-full bg-amber-100 flex items-center justify-center text-[10px]">✨</span>
            </div>

            <div className="flex flex-col gap-2.5">
              {/* Pasien Demo Card */}
              <button
                type="button"
                onClick={() => handleAutoFillDemo('patient', 'pasien@humic.id', 'hunic2026')}
                className={`w-full p-3 rounded-2xl border transition-all text-left flex items-center justify-between group cursor-pointer ${
                  role === 'patient'
                    ? 'bg-teal-50/40 border-teal-300 ring-2 ring-teal-100'
                    : 'bg-white border-slate-200/80 hover:border-teal-200 hover:bg-slate-50/50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#00c9a7] flex items-center justify-center text-white shrink-0 shadow-xs">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <div>
                    <span className="block text-sm font-bold text-slate-900 leading-snug">Pasien</span>
                    <span className="block text-xs font-mono text-slate-400">pasien@humic.id</span>
                  </div>
                </div>
                <div className="bg-[#e6f9f6] border border-teal-100/90 rounded-xl px-2.5 py-1 text-right shrink-0">
                  <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider">Password</span>
                  <span className="block text-xs font-extrabold text-[#00a88f] font-mono">hunic2026</span>
                </div>
              </button>

              {/* Dokter Demo Card */}
              <button
                type="button"
                onClick={() => handleAutoFillDemo('doctor', 'dokter@humic.id', 'hunic2026')}
                className={`w-full p-3 rounded-2xl border transition-all text-left flex items-center justify-between group cursor-pointer ${
                  role === 'doctor'
                    ? 'bg-sky-50/40 border-sky-300 ring-2 ring-sky-100'
                    : 'bg-white border-slate-200/80 hover:border-sky-200 hover:bg-slate-50/50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#0088ff] flex items-center justify-center text-white shrink-0 shadow-xs">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <span className="block text-sm font-bold text-slate-900 leading-snug">Dokter</span>
                    <span className="block text-xs font-mono text-slate-400">dokter@humic.id</span>
                  </div>
                </div>
                <div className="bg-[#edf5ff] border border-sky-100/90 rounded-xl px-2.5 py-1 text-right shrink-0">
                  <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider">Password</span>
                  <span className="block text-xs font-extrabold text-[#0088ff] font-mono">hunic2026</span>
                </div>
              </button>
            </div>
          </div>

          {/* Separator */}
          <div className="relative flex items-center justify-center my-5">
            <div className="w-full border-t border-slate-200/80" />
            <span className="absolute bg-white px-3 text-[11px] text-slate-400 font-medium">
              atau login manual
            </span>
          </div>

          {/* Api Error Alert */}
          {apiError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2.5 animate-shake">
              <svg className="w-4 h-4 text-red-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-xs text-red-700 font-medium">{apiError}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
            {/* Email Field */}
            <div>
              <label htmlFor="identifier" className="block text-xs font-bold text-slate-700 mb-1.5">
                Email
              </label>
              <input
                id="identifier"
                type="text"
                placeholder={role === 'doctor' ? 'dokter@humic.id' : 'pasien@humic.id'}
                className={`w-full px-4 py-3 rounded-xl bg-[#f8fafc] border ${
                  errors.identifier ? 'border-red-500 focus:ring-red-100' : 'border-slate-200 focus:border-[#0091ff] focus:ring-sky-100'
                } text-sm font-medium text-slate-800 placeholder-slate-400 outline-none focus:bg-white focus:ring-4 transition-all`}
                {...register('identifier')}
              />
              {errors.identifier && (
                <span className="text-[11px] font-medium text-red-500 mt-1 block">
                  {errors.identifier.message}
                </span>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-xs font-bold text-slate-700 mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="hunic2026"
                  className={`w-full px-4 py-3 pr-10 rounded-xl bg-[#f8fafc] border ${
                    errors.password ? 'border-red-500 focus:ring-red-100' : 'border-slate-200 focus:border-[#0091ff] focus:ring-sky-100'
                  } text-sm font-medium text-slate-800 placeholder-slate-400 outline-none focus:bg-white focus:ring-4 transition-all`}
                  {...register('password')}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors p-1 cursor-pointer"
                >
                  {showPassword ? (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858-5.908a10.04 10.04 0 013.682-.863c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21M3 3l18 18" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
              {errors.password && (
                <span className="text-[11px] font-medium text-red-500 mt-1 block">
                  {errors.password.message}
                </span>
              )}
            </div>

            {/* Role Selection: Login sebagai */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">
                Login sebagai
              </label>
              <div className="grid grid-cols-2 gap-3">
                {/* Pasien Option */}
                <button
                  type="button"
                  onClick={() => handleRoleChange('patient')}
                  className={`py-2.5 px-4 rounded-xl border flex items-center justify-center gap-2.5 transition-all text-xs font-bold cursor-pointer ${
                    role === 'patient'
                      ? 'bg-[#eaf6ff] border-[#0091ff] text-[#0091ff] shadow-xs'
                      : 'bg-[#f8fafc] border-slate-200 text-slate-600 hover:bg-slate-100/60'
                  }`}
                >
                  <span className={`w-4 h-4 rounded-full border flex items-center justify-center transition-all ${
                    role === 'patient' ? 'border-[#0091ff] bg-[#0091ff]' : 'border-slate-300 bg-white'
                  }`}>
                    {role === 'patient' && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                  </span>
                  <span>Pasien</span>
                </button>

                {/* Dokter Option */}
                <button
                  type="button"
                  onClick={() => handleRoleChange('doctor')}
                  className={`py-2.5 px-4 rounded-xl border flex items-center justify-center gap-2.5 transition-all text-xs font-bold cursor-pointer ${
                    role === 'doctor'
                      ? 'bg-[#eaf6ff] border-[#0091ff] text-[#0091ff] shadow-xs'
                      : 'bg-[#f8fafc] border-slate-200 text-slate-600 hover:bg-slate-100/60'
                  }`}
                >
                  <span className={`w-4 h-4 rounded-full border flex items-center justify-center transition-all ${
                    role === 'doctor' ? 'border-[#0091ff] bg-[#0091ff]' : 'border-slate-300 bg-white'
                  }`}>
                    {role === 'doctor' && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                  </span>
                  <span>Dokter</span>
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 bg-[#0091ff] hover:bg-[#0081e3] active:scale-[0.99] text-white text-sm font-bold rounded-2xl shadow-md shadow-sky-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed mt-2"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin w-4 h-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>Memproses...</span>
                </>
              ) : (
                <span>Login</span>
              )}
            </button>
          </form>

          {/* Footer Text */}
          <div className="mt-5 text-center text-xs text-slate-500">
            Belum punya akun?{' '}
            <Link
              href="/register"
              className="font-bold text-[#0091ff] hover:underline transition-colors"
            >
              Daftar sekarang
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}

