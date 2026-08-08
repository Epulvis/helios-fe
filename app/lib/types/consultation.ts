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

export interface DoctorPatientInfo {
  id: string;
  name: string;
  gender: string;
  birth_date: string;
}

export interface DoctorAiAnalysis {
  possible_category: string;
  severity_level: string;
  urgency_level: string;
  confidence_score: number;
}

export interface DoctorConsultationItem {
  id: string;
  patient: DoctorPatientInfo;
  complaint_preview: string;
  status: string;
  ai_analysis: DoctorAiAnalysis;
  created_at: string;
}

export interface GetDoctorConsultationListResponse {
  success: boolean;
  message: string;
  data?: {
    items: DoctorConsultationItem[];
    pagination: PaginationData;
  };
}

export interface DoctorConsultationDetailAiAnalysis {
  summary: string;
  detected_symptoms: string[];
  duration: string;
  severity_level: string;
  possible_category: string;
  urgency_level: string;
  doctor_note_suggestion?: string;
  confidence_score: number;
}

export interface DoctorReview {
  id: string;
  consultation_id: string;
  doctor_id: string;
  review_note: string;
  final_category: string;
  final_urgency_level: string;
  recommendation: string;
  created_at: string;
}

export interface GetDoctorConsultationDetailResponse {
  success: boolean;
  message: string;
  data?: {
    consultation: {
      id: string;
      complaint_text: string;
      status: string;
      created_at: string;
    };
    patient: DoctorPatientInfo;
    ai_analysis?: DoctorConsultationDetailAiAnalysis;
    review?: DoctorReview;
  };
}

export interface SubmitDoctorReviewRequest {
  review_note: string;
  final_category: string;
  final_urgency_level: string;
  recommendation: string;
}

export interface SubmitDoctorReviewResponse {
  success: boolean;
  message: string;
  data?: {
    review: DoctorReview;
  };
}

export interface UpdateConsultationStatusRequest {
  status: 'closed' | string;
}

export interface UpdateConsultationStatusResponse {
  success: boolean;
  message: string;
  data?: {
    consultation: {
      id: string;
      status: string;
      updated_at: string;
    };
  };
  errors?: Array<{ field: string; message: string }>;
}



