using Domain.Dtos.Agendamento;

namespace Domain.Interfaces.Services;

public interface IAgendamentoService
{
    Task<AgendamentoDto?> Get(Guid id);
    Task<IEnumerable<AgendamentoDto?>> GetAll(string authorization);
    Task<IEnumerable<AgendamentoDto>> GetByPacienteId(Guid pacienteId);
    Task<IEnumerable<AgendamentoDto>> GetByProfissionalId(Guid profissionalId);
    Task<AgendamentoDto?> Post(AgendamentoDto agendamento);
    Task<AgendamentoDto?> Put(AgendamentoDto agendamento);
    Task<bool> Delete(Guid id);
}
