import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get('access_token');

  // Condition: If not logged in (no access_token cookie), redirect to login page
  if (!token?.value) {
    redirect('/login');
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-10">
      <div className="max-w-4xl mx-auto bg-white rounded-3xl p-8 shadow-sm border border-slate-200/80">
        <div className="flex items-center justify-between border-b border-slate-100 pb-6 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Dashboard Helios</h1>
            <p className="text-xs text-slate-500 mt-1">
              Selamat datang di portal kesehatan digital Helios.
            </p>
          </div>
          <form action="/api/session/logout" method="POST">
            <button
              type="submit"
              className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 font-semibold text-xs rounded-xl transition-colors cursor-pointer"
            >
              Keluar (Logout)
            </button>
          </form>
        </div>

        <div className="p-6 bg-blue-50/60 border border-blue-100 rounded-2xl">
          <div className="flex items-center gap-3 text-blue-900 font-semibold text-sm">
            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Status Autentikasi: Terverifikasi (Token HttpOnly Aktif)</span>
          </div>
          <p className="text-xs text-blue-700/80 mt-2">
            Anda berhasil masuk. Token akses Anda telah tersimpan dengan aman dalam HttpOnly Cookie.
          </p>
        </div>
      </div>
    </div>
  );
}
