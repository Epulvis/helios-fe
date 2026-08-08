import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get('access_token');

  if (!token?.value) {
    redirect('/login');
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Welcome Card */}
      <div className="bg-gradient-to-r from-blue-600 to-teal-500 rounded-3xl p-8 text-white shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
            Selamat Datang di Helios
          </h1>
          <p className="text-sm text-blue-100 mt-2 max-w-xl">
            Layanan kesehatan digital berbasis AI NLP untuk analisis keluhan dan rekomendasi penanganan awal yang presisi.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/prediksi-baru"
              className="px-5 py-2.5 bg-white text-blue-600 font-semibold text-xs rounded-xl shadow-xs hover:bg-blue-50 transition-colors inline-flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Input Prediksi Baru
            </Link>
          </div>
        </div>
      </div>

      {/* Info Status Card */}
      <div className="bg-white rounded-3xl p-6 shadow-xs border border-slate-200/80">
        <div className="flex items-center gap-3 text-blue-900 font-semibold text-sm">
          <svg className="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>Status Sesi: Terverifikasi (Token HttpOnly Aktif)</span>
        </div>
        <p className="text-xs text-slate-500 mt-2">
          Anda dapat langsung mengakses menu <strong>Prediksi Baru</strong> di sidebar untuk memulai analisis keluhan kesehatan Anda.
        </p>
      </div>
    </div>
  );
}
