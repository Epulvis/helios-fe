import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3456/api';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
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

    const backendRes = await fetch(`${API_BASE_URL}/patient/consultations/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      cache: 'no-store',
    });

    const data = await backendRes.json();

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
    console.error('GET consultation detail error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Gagal terhubung ke server backend.',
      },
      { status: 500 }
    );
  }
}
