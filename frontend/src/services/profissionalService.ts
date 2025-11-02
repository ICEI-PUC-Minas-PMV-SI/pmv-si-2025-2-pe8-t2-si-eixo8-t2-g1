import client from './apiClient';
import { ProfissionalDto } from '@/types/api';

const API_PREFIX = 'api/Profissional';

export const createProfissional = (data: Omit<ProfissionalDto, 'id' | 'userId'>): Promise<ProfissionalDto> => {
    return client<ProfissionalDto>(API_PREFIX, { 
        data,
        method: 'POST'
    });
};

export const getProfissionais = (): Promise<ProfissionalDto[]> => {
    return client<ProfissionalDto[]>(API_PREFIX, {});
};

export const getProfissionalById = (id: string): Promise<ProfissionalDto> => {
    return client<ProfissionalDto>(`${API_PREFIX}/${id}`, {});
};

export const updateProfissional = (data: ProfissionalDto): Promise<ProfissionalDto> => {
    return client<ProfissionalDto>(API_PREFIX, { 
        data,
        method: 'PUT'
    });
};

export const deleteProfissional = (id: string): Promise<void> => {
    return client<void>(`${API_PREFIX}/${id}`, { 
        method: 'DELETE'
    });
};