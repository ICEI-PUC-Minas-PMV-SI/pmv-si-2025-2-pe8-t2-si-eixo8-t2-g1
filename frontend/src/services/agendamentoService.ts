
import type { AgendamentoDto } from '../types/api';
import client from './apiClient';

const API_PREFIX = 'api/Agendamento';

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
  return client<AgendamentoDto[]>(`${API_PREFIX}/profissional/${profissionalId}`, {});
};
