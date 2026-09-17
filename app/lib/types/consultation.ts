export type ConsultationStatus =
  | 'submitted'
  | 'processing'
  | 'analyzed'
  | 'in_review'
  | 'reviewed'
  | 'closed'
  | 'failed';

export type SeverityLevel = 'low' | 'medium' | 'high';
export type UrgencyLevel = 'normal' | 'priority' | 'urgent';
export type DoctorConsultationScope = 'available' | 'mine';

export interface ConsultationData {
  id: string;
  complaint_text: string;
  status: ConsultationStatus;
  created_at: string;
}

export interface AiAnalysis {
  summary: string;
  detected_symptoms: string[];
  duration: string | null;
  severity_level: SeverityLevel;
  possible_category: string;
  urgency_level: UrgencyLevel;
  doctor_note_suggestion: string | null;
  confidence_score: number;
  model_version: string;
}

export interface PatientSafeDoctorReview {
  final_category: string | null;
  final_urgency_level: UrgencyLevel | null;
  recommendation: string | null;
  reviewed_at: string | null;
}

export interface CreateConsultationRequest {
  complaint_text: string;
}

export interface CreateConsultationResponse {
  success: boolean;
  message: string;
  data?: {
    consultation: ConsultationData;
    ai_analysis: AiAnalysis;
  };
}

export interface GetConsultationDetailResponse {
  success: boolean;
  message: string;
  data?: {
    consultation: ConsultationData & { updated_at: string };
    doctor_review: PatientSafeDoctorReview | null;
  };
}

export interface ConsultationListItem {
  id: string;
  complaint_text: string;
  status: ConsultationStatus;
  created_at: string;
  category: string | null;
  confidence_score: number | null;
}

export interface PaginationData {
  page: number;
  limit: number;
  total: number;
  total_pages: number;
}

export interface ConsultationStatistics {
  this_month: number;
  best_confidence: number | null;
  top_diagnosis: string | null;
  distribution: Record<string, number>;
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
  gender: string | null;
  birth_date: string | null;
}

export interface DoctorConsultationItem {
  id: string;
  complaint_text: string;
  status: ConsultationStatus;
  created_at: string;
  assigned_at: string | null;
  ai_summary: string | null;
  possible_category: string | null;
  urgency_level: UrgencyLevel | null;
  confidence_score: number | null;
}

export interface GetDoctorConsultationListResponse {
  success: boolean;
  message: string;
  data?: {
    items: DoctorConsultationItem[];
    pagination: PaginationData;
  };
}

export interface DoctorReview {
  id: string;
  review_note: string;
  final_category: string | null;
  final_urgency_level: UrgencyLevel | null;
  recommendation: string | null;
  created_at: string;
}

export interface GetDoctorConsultationDetailResponse {
  success: boolean;
  message: string;
  data?: {
    consultation: ConsultationData & {
      assigned_at: string | null;
      reviewed_at: string | null;
      closed_at: string | null;
      updated_at: string;
    };
    patient: DoctorPatientInfo;
    ai_analysis: AiAnalysis | null;
    doctor_review: DoctorReview | null;
  };
}

export interface ClaimDoctorConsultationResponse {
  success: boolean;
  message: string;
  data?: {
    consultation: {
      id: string;
      doctor_id: string;
      status: 'in_review';
      assigned_at: string;
    };
  };
}

export interface SubmitDoctorReviewRequest {
  review_note: string;
  final_category?: string | null;
  final_urgency_level?: UrgencyLevel | null;
  recommendation?: string | null;
}

export interface SubmitDoctorReviewResponse {
  success: boolean;
  message: string;
  data?: {
    review: DoctorReview;
    consultation_status: 'reviewed';
  };
}

export interface UpdateConsultationStatusResponse {
  success: boolean;
  message: string;
  data?: {
    consultation: {
      id: string;
      status: 'closed';
      closed_at: string;
    };
  };
  errors?: Array<{ field: string; message: string }>;
}
