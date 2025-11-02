
import type { PacienteDto } from '../types/api';
import client from './apiClient';

const API_PREFIX = 'api/Paciente';

export const getPacientes = (): Promise<PacienteDto[]> => {
  return client<PacienteDto[]>(API_PREFIX, {});
};

export const createPaciente = (data: PacienteDto): Promise<PacienteDto> => {
  return client<PacienteDto>(API_PREFIX, { data });
};

export const updatePaciente = (data: PacienteDto): Promise<PacienteDto> => {
  return client<PacienteDto>(API_PREFIX, { data, method: 'PUT' });
};

export const getPacienteById = (id: string): Promise<PacienteDto> => {
  return client<PacienteDto>(`${API_PREFIX}/${id}`, {});
};

export const deletePaciente = (id: string): Promise<void> => {
  return client<void>(`${API_PREFIX}/${id}`, { method: 'DELETE' });
};
