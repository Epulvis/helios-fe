import {
  LoginSuccessResponse,
  LoginErrorResponse,
  RegisterSuccessResponse,
  RegisterErrorResponse,
  Role,
} from '../types/auth';
import { LoginFormData, RegisterFormData } from '../validations/auth';

export async function loginService(
  data: LoginFormData,
  role: Role
): Promise<LoginSuccessResponse | LoginErrorResponse> {
  const res = await fetch('/api/session/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      ...data,
      role,
    }),
  });

  const result = await res.json();
  return result;
}

export async function registerService(
  data: RegisterFormData
): Promise<RegisterSuccessResponse | RegisterErrorResponse> {
  const res = await fetch('/api/session/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  const result = await res.json();
  return result;
}

export async function logoutService(): Promise<{ success: boolean }> {
  const res = await fetch('/api/session/logout', {
    method: 'POST',
  });
  return await res.json();
}
