import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3456/api';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('access_token')?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Tidak ada sesi aktif.' },
        { status: 401 }
      );
    }

    // Verify token validity against backend API
    const backendRes = await fetch(`${API_BASE_URL}/patient/consultations?limit=1`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      cache: 'no-store',
    });

    if (backendRes.status === 401) {
      cookieStore.delete('access_token');
      return NextResponse.json(
        { success: false, message: 'Sesi telah berakhir.' },
        { status: 401 }
      );
    }

    return NextResponse.json({ success: true, message: 'Sesi valid.' }, { status: 200 });
  } catch (error) {
    console.error('Session verify error:', error);
    return NextResponse.json(
      { success: false, message: 'Gagal memverifikasi sesi.' },
      { status: 500 }
    );
  }
}
