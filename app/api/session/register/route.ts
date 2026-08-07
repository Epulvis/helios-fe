import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3456/api';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const backendRes = await fetch(`${API_BASE_URL}/auth/patient/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const data = await backendRes.json();

    if (backendRes.ok && data.success) {
      return NextResponse.json(data, { status: 200 });
    }

    return NextResponse.json(
      {
        success: false,
        message: data.message || 'Registrasi gagal.',
        errors: data.errors || [],
      },
      { status: backendRes.status || 400 }
    );
  } catch (error) {
    console.error('Register error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Gagal terhubung ke server backend.',
      },
      { status: 500 }
    );
  }
}
