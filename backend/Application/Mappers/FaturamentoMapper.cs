using Domain.Dtos.Faturamento;
using Domain.Entity;

namespace Application.Mappers;

public static class FaturamentoMapper
{
    public static FaturamentoDto ToDto(this Faturamento faturamento)
    {
        return new FaturamentoDto
        {
            Id = faturamento.Id,
            DataFaturamento = faturamento.DataFaturamento,
            DataInicio = faturamento.DataInicio,
            DataFim = faturamento.DataFim,
            PerfilId = faturamento.PerfilId,
            ProfissionalNome = faturamento.Perfil?.NomeCompleto,
            ValorTotal = faturamento.ValorTotal,
            TotalAtendimentos = faturamento.TotalAtendimentos,
            Status = faturamento.Status,
            Observacoes = faturamento.Observacoes,
            Itens = faturamento.Itens?.Select(i => i.ToDto()).ToList() ?? []
        };
    }

    public static ItemFaturamentoDto ToDto(this ItemFaturamento item)
    {
        return new ItemFaturamentoDto
        {
            Id = item.Id,
            AgendamentoId = item.AgendamentoId,
            DataHora = item.Agendamento?.DataHora ?? DateTime.MinValue,
            PacienteNome = item.Agendamento?.Paciente?.NomeCompleto ?? string.Empty,
            TipoAtendimento = item.Agendamento?.TipoAtendimento ?? Domain.Utils.Enums.EnumTipoAtendimento.SessaoTerapia,
            ValorAtendimento = item.ValorAtendimento,
            Status = item.Agendamento?.Status ?? string.Empty,
            Observacoes = item.Agendamento?.Observacoes
        };
    }

    public static Faturamento ToEntity(this FaturamentoDto dto)
    {
        return new Faturamento(
            dto.DataFaturamento,
            dto.DataInicio,
            dto.DataFim,
            dto.ValorTotal,
            dto.TotalAtendimentos,
            dto.Status,
            dto.PerfilId,
            dto.Observacoes
        );
    }
}
