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
