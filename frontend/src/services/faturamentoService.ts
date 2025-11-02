import client from './apiClient';
import { FaturamentoDto, CriarFaturamentoDto, CriarFaturamentoAvulsoDto, EnumStatusFaturamento } from '@/types/api';

const API_PREFIX = 'api/Faturamento';

export const getFaturamentos = (): Promise<FaturamentoDto[]> => {
    return client<FaturamentoDto[]>(API_PREFIX, {});
};

export const getFaturamentoById = (id: string): Promise<FaturamentoDto> => {
    return client<FaturamentoDto>(`${API_PREFIX}/${id}`, {});
};

export const getFaturamentoPorProfissional = (profissionalId: string): Promise<FaturamentoDto[]> => {
    return client<FaturamentoDto[]>(`${API_PREFIX}/profissional/${profissionalId}`, {});
};

export const getFaturamentoPorPeriodo = (dataInicio: string, dataFim: string): Promise<FaturamentoDto[]> => {
    return client<FaturamentoDto[]>(`${API_PREFIX}/periodo?dataInicio=${dataInicio}&dataFim=${dataFim}`, {});
};

export const createFaturamento = (data: CriarFaturamentoAvulsoDto): Promise<FaturamentoDto> => {
    return client<FaturamentoDto>(`${API_PREFIX}/avulso`, {
        data: data,
        method: 'POST'
    });
};

export const gerarFaturamento = (data: CriarFaturamentoDto): Promise<FaturamentoDto> => {
    return client<FaturamentoDto>(`${API_PREFIX}/gerar`, {
        data,
        method: 'POST'
    });
};

export const updateFaturamento = (data: FaturamentoDto): Promise<FaturamentoDto> => {
    return client<FaturamentoDto>(API_PREFIX, {
        data: data,
        method: 'PUT'
    });
};

export const emitirFaturamento = (id: string): Promise<FaturamentoDto> => {
    return client<FaturamentoDto>(`${API_PREFIX}/${id}/emitir`, {
        method: 'PUT'
    });
};

export const cancelarFaturamento = (id: string): Promise<FaturamentoDto> => {
    return client<FaturamentoDto>(`${API_PREFIX}/${id}/cancelar`, {
        method: 'PUT'
    });
};

export const deleteFaturamento = (id: string): Promise<boolean> => {
    return client<boolean>(`${API_PREFIX}/${id}`, { method: 'DELETE' });
};

export const calcularEstatisticas = (faturamentos: FaturamentoDto[]) => {
    const totalFaturado = faturamentos.reduce((acc, item) => acc + item.valorTotal, 0);
    const totalPago = faturamentos
        .filter(item => item.status === EnumStatusFaturamento.Pago)
        .reduce((acc, item) => acc + item.valorTotal, 0);
    const totalPendente = faturamentos
        .filter(item => item.status === EnumStatusFaturamento.Rascunho)
        .reduce((acc, item) => acc + item.valorTotal, 0);

    return {
        totalFaturado,
        totalPago,
        totalPendente
    };
};