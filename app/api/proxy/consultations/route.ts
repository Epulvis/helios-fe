import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3456/api';

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('access_token')?.value;

    if (!token) {
      return NextResponse.json(
        {
          success: false,
          message: 'Sesi telah berakhir atau tidak sah. Silakan login kembali.',
        },
        { status: 401 }
      );
    }

    const body = await request.json();

    const backendRes = await fetch(`${API_BASE_URL}/patient/consultations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });

    const data = await backendRes.json();

    if (backendRes.status === 401) {
      // Token invalid or expired, clear cookie
      cookieStore.delete('access_token');
      return NextResponse.json(
        {
          success: false,
          message: 'Sesi telah berakhir. Silakan login kembali.',
        },
        { status: 401 }
      );
    }

    return NextResponse.json(data, { status: backendRes.status });
  } catch (error) {
    console.error('POST consultation error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Gagal terhubung ke server backend.',
      },
      { status: 500 }
    );
  }
}
