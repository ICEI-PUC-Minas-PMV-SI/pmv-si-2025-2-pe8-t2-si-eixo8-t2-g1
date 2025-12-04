
import type {
  UserDto,
  RegisterPerfilDto,
  TokenResponseDto,
  SendEmailResetPasswordDto,
  ResetPasswordDto,
  User,
} from '../types/api';
import client from './apiClient';

const API_PREFIX = 'Auth';



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

export const getAuth = (): Promise<User> => {
  return client<User>(API_PREFIX, {});
};

export const getAdminOnly = (): Promise<any> => {
  return client<any>(`${API_PREFIX}/admin-only`, {});
};
