import client from './apiClient';
import { PerfilDto, TokenResponseDto } from '@/types/api';

const API_PREFIX = 'Perfil';

export const createPerfil = (data: Omit<PerfilDto, 'id' | 'userId'>): Promise<TokenResponseDto> => {
    return client<TokenResponseDto>(API_PREFIX, {
        data,
        method: 'POST'
    });
};

export const getPerfis = (): Promise<PerfilDto[]> => {
    return client<PerfilDto[]>(API_PREFIX, {});
};

export const getPerfilById = (id: string): Promise<PerfilDto> => {
    return client<PerfilDto>(`${API_PREFIX}/${id}`, {});
};

export const updatePerfil = (data: PerfilDto): Promise<PerfilDto> => {
    return client<PerfilDto>(API_PREFIX, {
        data,
        method: 'PUT'
    });
};

export const getPerfilByUserId = (userId: string): Promise<PerfilDto> => {
    return client<PerfilDto>(`${API_PREFIX}/user/${userId}`, {});
};

export const getMeuPerfil = (): Promise<PerfilDto> => {
    return client<PerfilDto>(`${API_PREFIX}/me`, {});
};

export const deletePerfil = (id: string): Promise<void> => {
    return client<void>(`${API_PREFIX}/${id}`, {
        method: 'DELETE'
    });
};