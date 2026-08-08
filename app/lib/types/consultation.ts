export type ConsultationStatus = 'processing' | 'analyzed' | 'reviewed';

export interface ConsultationData {
  id: string;
  patient_id?: string;
  doctor_id?: string | null;
  complaint_text: string;
  status: ConsultationStatus;
  created_at: string;
}

export interface AiAnalysis {
  summary: string;
  detected_symptoms: string[];
  duration: string;
  severity_level: 'low' | 'medium' | 'high' | string;
  possible_category: string;
  urgency_level: string;
  confidence_score: number;
}

export interface CreateConsultationRequest {
  complaint_text: string;
}

export interface CreateConsultationResponse {
  success: boolean;
  message: string;
  data?: {
    consultation: ConsultationData;
  };
}

export interface GetConsultationDetailResponse {
  success: boolean;
  message: string;
  data?: {
    consultation: ConsultationData;
    ai_analysis?: AiAnalysis;
  };
}

export interface ConsultationListItem {
  id: string;
  complaint_text: string;
  status: ConsultationStatus;
  created_at: string;
  category?: string;
  confidence_score?: number;
}

export interface PaginationData {
  page: number;
  limit: number;
  total: number;
  total_pages: number;
}

export interface ConsultationStatistics {
  this_month: number;
  best_confidence: number;
  top_diagnosis: string;
  distribution?: Record<string, number>;
}

export interface GetConsultationListResponse {
  success: boolean;
  message: string;
  data?: {
    items: ConsultationListItem[];
    pagination: PaginationData;
    statistics: ConsultationStatistics;
  };
}

