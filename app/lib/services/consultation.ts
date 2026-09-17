import {
  ClaimDoctorConsultationResponse,
  ConsultationStatus,
  CreateConsultationResponse,
  GetConsultationDetailResponse,
  GetConsultationListResponse,
  GetDoctorConsultationDetailResponse,
  SubmitDoctorReviewRequest,
  SubmitDoctorReviewResponse,
  UpdateConsultationStatusResponse,
} from '../types/consultation';

export class ConsultationRequestError extends Error {
  constructor(
    message: string,
    public readonly status: number
  ) {
    super(message);
    this.name = 'ConsultationRequestError';
  }
}

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

export async function getDoctorConsultationDetailService(
  id: string
): Promise<GetDoctorConsultationDetailResponse> {
  const res = await fetch(`/api/proxy/doctor/consultations/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const data = await res.json();
  if (!res.ok && !data.message) {
    throw new Error('Gagal mengambil detail konsultasi dokter');
  }
  return data;
}

export async function submitDoctorReviewService(
  id: string,
  reviewData: SubmitDoctorReviewRequest
): Promise<SubmitDoctorReviewResponse> {
  const res = await fetch(`/api/proxy/doctor/consultations/${id}/review`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(reviewData),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new ConsultationRequestError(data.message || 'Gagal menyimpan review', res.status);
  }
  return data;
}

export async function claimDoctorConsultationService(
  id: string
): Promise<ClaimDoctorConsultationResponse> {
  const res = await fetch(`/api/proxy/doctor/consultations/${id}/claim`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const data = await res.json();
  if (!res.ok) {
    throw new ConsultationRequestError(
      data.message || 'Konsultasi gagal diambil',
      res.status
    );
  }
  return data;
}

export async function updateConsultationStatusService(
  id: string,
  status: Extract<ConsultationStatus, 'closed'> = 'closed'
): Promise<UpdateConsultationStatusResponse> {
  const res = await fetch(`/api/proxy/doctor/consultations/${id}/status`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ status }),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new ConsultationRequestError(data.message || 'Status gagal diperbarui', res.status);
  }
  return data;
}


