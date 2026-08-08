import { NextRequest, NextResponse } from 'next/server';

export default function proxy(request: NextRequest) {
  const token = request.cookies.get('access_token')?.value;
  const { pathname } = request.nextUrl;

  // Auth pages (login, register)
  const isAuthPage = pathname === '/login' || pathname === '/register';

  // Protected pages
  const isProtectedPage =
    pathname === '/' ||
    pathname === '/dashboard' ||
    pathname.startsWith('/dashboard/') ||
    pathname.startsWith('/prediksi-baru') ||
    pathname.startsWith('/riwayat-prediksi') ||
    pathname.startsWith('/data-prediksi');

  // Unauthenticated → login
  if (isProtectedPage && !token) {
    const loginUrl = new URL('/login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  // Authenticated → dashboard
  if (isAuthPage && token) {
    const dashboardUrl = new URL('/dashboard', request.url);
    return NextResponse.redirect(dashboardUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/',
    '/dashboard',
    '/dashboard/:path*',
    '/prediksi-baru',
    '/prediksi-baru/:path*',
    '/riwayat-prediksi',
    '/riwayat-prediksi/:path*',
    '/data-prediksi',
    '/data-prediksi/:path*',
    '/login',
    '/register',
  ],
};