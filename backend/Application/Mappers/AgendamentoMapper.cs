using Domain.Dtos.Agendamento;
using Domain.Entity;

namespace Application.Mappers;

public static class AgendamentoMapper
{
    public static AgendamentoDto? ToDto(this Agendamento agendamento)
    {
        if (agendamento is null)
            return null;

        return new AgendamentoDto
        {
            Id = agendamento.Id,
            DataHora = agendamento.DataHora,
            TipoAtendimento = agendamento.TipoAtendimento,
            Status = agendamento.Status,
            Observacoes = agendamento.Observacoes,
            PacienteId = agendamento.PacienteId,
            ProfissionalId = agendamento.ProfissionalId
        };
    }
    public static IEnumerable<AgendamentoDto?> ToDto(this IEnumerable<Agendamento> agendamentos)
    {
        foreach(var agendamento in agendamentos)
        {
            yield return new AgendamentoDto
            {
                Id = agendamento.Id,
                DataHora = agendamento.DataHora,
                TipoAtendimento = agendamento.TipoAtendimento,
                Status = agendamento.Status,
                Observacoes = agendamento.Observacoes,
                PacienteId = agendamento.PacienteId,
                ProfissionalId = agendamento.ProfissionalId
            };
        }
    }

    public static Agendamento? ToEntity(this AgendamentoDto agendamentoDto)
    {
        if (agendamentoDto is null)
            return null;

        var entity = new Agendamento(
            agendamentoDto.DataHora,
            agendamentoDto.TipoAtendimento,
            agendamentoDto.Status,
            agendamentoDto.PacienteId,
            agendamentoDto.ProfissionalId,
            agendamentoDto.Observacoes);

        if (agendamentoDto.Id != System.Guid.Empty)
        {
            entity.Id = agendamentoDto.Id;
        }

        return entity;
    }
}
