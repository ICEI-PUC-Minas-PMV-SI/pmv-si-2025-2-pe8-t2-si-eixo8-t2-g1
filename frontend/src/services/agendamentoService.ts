
import type { AgendamentoDto } from '../types/api';
import client from './apiClient';

const API_PREFIX = 'Agendamento';

export const getAgendamentos = (): Promise<AgendamentoDto[]> => {
  return client<AgendamentoDto[]>(API_PREFIX, {});
};

export const createAgendamento = (data: AgendamentoDto): Promise<AgendamentoDto> => {
  return client<AgendamentoDto>(API_PREFIX, { data });
};

export const updateAgendamento = (data: AgendamentoDto): Promise<AgendamentoDto> => {
  return client<AgendamentoDto>(API_PREFIX, { data, method: 'PUT' });
};

export const getAgendamentoById = (id: string): Promise<AgendamentoDto> => {
  return client<AgendamentoDto>(`${API_PREFIX}/${id}`, {});
};

export const deleteAgendamento = (id: string): Promise<void> => {
  return client<void>(`${API_PREFIX}/${id}`, { method: 'DELETE' });
};

export const getAgendamentosByPaciente = (
  pacienteId: string
): Promise<AgendamentoDto[]> => {
  return client<AgendamentoDto[]>(`${API_PREFIX}/paciente/${pacienteId}`, {});
};

export const getAgendamentosByProfissional = (
  profissionalId: string
): Promise<AgendamentoDto[]> => {
  // Assuming the backend endpoint still uses 'profissional' in the URL, 
  // but if the property changed, maybe the URL param name is just a value.
  // The function argument name 'profissionalId' is fine, but let's check if the URL needs changing.
  // The user only asked to change the property name in the DTO (for POST/PUT).
  // I will keep the URL as is unless I see errors.
  return client<AgendamentoDto[]>(`${API_PREFIX}/perfil/${profissionalId}`, {});
};
