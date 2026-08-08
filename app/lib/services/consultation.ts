import {
  CreateConsultationResponse,
  GetConsultationDetailResponse,
  GetConsultationListResponse,
} from '../types/consultation';

export async function createConsultationService(
  complaintText: string
): Promise<CreateConsultationResponse> {
  const res = await fetch('/api/proxy/consultations', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      complaint_text: complaintText,
    }),
  });

  const data = await res.json();
  if (!res.ok && !data.message) {
    throw new Error('Gagal mengirim konsultasi');
  }
  return data;
}

export async function getConsultationDetailService(
  id: string
): Promise<GetConsultationDetailResponse> {
  const res = await fetch(`/api/proxy/consultations/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const data = await res.json();
  if (!res.ok && !data.message) {
    throw new Error('Gagal mengambil detail konsultasi');
  }
  return data;
}

export async function getConsultationListService(params?: {
  page?: number;
  limit?: number;
  status?: string;
}): Promise<GetConsultationListResponse> {
  const searchParams = new URLSearchParams();
  if (params?.page) searchParams.set('page', String(params.page));
  if (params?.limit) searchParams.set('limit', String(params.limit));
  if (params?.status && params.status !== 'all') searchParams.set('status', params.status);

  const queryString = searchParams.toString();
  const url = `/api/proxy/consultations${queryString ? `?${queryString}` : ''}`;

  const res = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const data = await res.json();
  if (!res.ok && !data.message) {
    throw new Error('Gagal mengambil riwayat konsultasi');
  }
  return data;
}

