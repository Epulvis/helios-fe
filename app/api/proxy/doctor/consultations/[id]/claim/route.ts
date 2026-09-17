import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3456/api';

export async function PATCH(
  _request: NextRequest,
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

    const backendRes = await fetch(`${API_BASE_URL}/doctor/consultations/${id}/claim`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    const rawText = await backendRes.text();
    let data;
    try {
      data = JSON.parse(rawText);
    } catch {
      return NextResponse.json(
        { success: false, message: 'Backend mengembalikan respon bukan JSON.' },
        { status: backendRes.status || 500 }
      );
    }

    if (backendRes.status === 401) {
      cookieStore.delete('access_token');
      return NextResponse.json(
        { success: false, message: 'Sesi telah berakhir. Silakan login kembali.' },
        { status: 401 }
      );
    }

    return NextResponse.json(data, { status: backendRes.status });
  } catch (error) {
    console.error('PATCH doctor claim error:', error);
    return NextResponse.json(
      { success: false, message: 'Gagal terhubung ke server backend.' },
      { status: 500 }
    );
  }
}
