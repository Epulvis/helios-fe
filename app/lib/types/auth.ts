export type Role = 'patient' | 'doctor';

export interface PatientUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'patient';
  status?: string;
}

export interface DoctorUser {
  id: string;
  name: string;
  email: string;
  specialization?: string;
  license_number?: string;
  role: 'doctor';
}

export type AuthUser = PatientUser | DoctorUser;

export interface LoginResponseData {
  access_token: string;
  token_type: string;
  expires_in: number;
  user: AuthUser;
}

export interface LoginSuccessResponse {
  success: true;
  message: string;
  data: LoginResponseData;
}

export interface LoginErrorResponse {
  success: false;
  message: string;
}

export interface ApiFieldError {
  field: string;
  message: string;
}

export interface RegisterSuccessResponse {
  success: true;
  message: string;
  data: {
    patient: PatientUser;
  };
}

export interface RegisterErrorResponse {
  success: false;
  message: string;
  errors?: ApiFieldError[];
}

export interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  setUser: (user: AuthUser | null) => void;
  clearAuth: () => void;
}
