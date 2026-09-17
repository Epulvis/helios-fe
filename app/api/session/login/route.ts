import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const API_BASE_URL =
	process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3456/api";

export async function POST(request: NextRequest) {
	try {
		const body = await request.json();
		const { identifier, password, role } = body;

		const endpoint =
			role === "doctor"
				? `${API_BASE_URL}/auth/doctor/login`
				: `${API_BASE_URL}/auth/patient/login`;

		const payload =
			role === "doctor"
				? { email: identifier, password }
				: { identifier, password };

		const backendRes = await fetch(endpoint, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(payload),
		});

		const data = await backendRes.json();

		if (backendRes.ok && data.success) {
			const cookieStore = await cookies();
			const token = data.data?.access_token;
			const expiresIn = data.data?.expires_in || 86400;

			if (token) {
				cookieStore.set("access_token", token, {
					httpOnly: true,
					secure: process.env.NODE_ENV === "production",
					sameSite: "lax",
					path: "/",
					maxAge: expiresIn,
				});
			}

			return NextResponse.json(data, { status: 200 });
		}

		return NextResponse.json(
			{
				success: false,
				message: data.message || "Kredensial salah.",
			},
			{ status: backendRes.status || 401 },
		);
	} catch (error) {
		console.error("Login error:", error);
		return NextResponse.json(
			{
				success: false,
				message: "Gagal terhubung ke server backend.",
			},
			{ status: 500 },
		);
	}
}
