import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3456/api';

export async function GET(request: NextRequest) {
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

    const { searchParams } = new URL(request.url);
    const queryString = searchParams.toString();
    const backendUrl = `${API_BASE_URL}/doctor/consultations${queryString ? `?${queryString}` : ''}`;

    const backendRes = await fetch(backendUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      cache: 'no-store',
    });

    const rawText = await backendRes.text();
    let data;
    try {
      data = JSON.parse(rawText);
    } catch {
      return NextResponse.json(
        {
          success: false,
          message: 'Backend mengembalikan respon bukan JSON.',
        },
        { status: backendRes.status || 500 }
      );
    }

    if (backendRes.status === 401) {
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
    console.error('GET doctor consultations list error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Gagal terhubung ke server backend.',
      },
      { status: 500 }
    );
  }
}
