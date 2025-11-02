
import type {
  UserDto,
  RegisterProfissionalDto,
  TokenResponseDto,
  SendEmailResetPasswordDto,
  ResetPasswordDto,
} from '../types/api';
import client from './apiClient';

const API_PREFIX = 'api/Auth';

export const register = (data: UserDto): Promise<boolean> => {
  return client<boolean>(`${API_PREFIX}/register`, { data });
};

export const registerProfissional = (data: RegisterProfissionalDto): Promise<boolean> => {
  return client<boolean>(`${API_PREFIX}/register-profissional`, { data });
};

export const registerUser = (data: UserDto): Promise<TokenResponseDto> => {
  return client<TokenResponseDto>(`${API_PREFIX}/register`, { data });
};

export const login = (data: UserDto): Promise<TokenResponseDto> => {
  return client<TokenResponseDto>(`${API_PREFIX}/login`, { data });
};

export const sendEmailResetPassword = (
  data: SendEmailResetPasswordDto
): Promise<string> => {
  return client<string>(`${API_PREFIX}/email-reset-password`, { data });
};

export const resetPassword = (
  data: ResetPasswordDto,
  token: string
): Promise<void> => {
  return client<void>(`${API_PREFIX}/reset-password`, {
    data,
    method: 'PATCH',
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const getAuth = (): Promise<any> => {
  return client<any>(API_PREFIX, {});
};

export const getAdminOnly = (): Promise<any> => {
  return client<any>(`${API_PREFIX}/admin-only`, {});
};
