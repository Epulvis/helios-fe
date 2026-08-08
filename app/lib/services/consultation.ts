import {
  CreateConsultationResponse,
  GetConsultationDetailResponse,
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
