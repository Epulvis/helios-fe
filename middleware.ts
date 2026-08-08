import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('access_token')?.value;
  const { pathname } = request.nextUrl;

  // Auth pages (login, register)
  const isAuthPage = pathname === '/login' || pathname === '/register';

  // Protected pages (dashboard, prediksi-baru, riwayat-prediksi, root /)
  const isProtectedPage =
    pathname === '/' ||
    pathname === '/dashboard' ||
    pathname.startsWith('/dashboard/') ||
    pathname.startsWith('/prediksi-baru') ||
    pathname.startsWith('/riwayat-prediksi');

  // 1. Unauthenticated user trying to access protected page -> Redirect to /login
  if (isProtectedPage && !token) {
    const loginUrl = new URL('/login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  // 2. Authenticated user trying to access auth pages (login/register) -> Redirect to /dashboard
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
    '/login',
    '/register',
  ],
};
