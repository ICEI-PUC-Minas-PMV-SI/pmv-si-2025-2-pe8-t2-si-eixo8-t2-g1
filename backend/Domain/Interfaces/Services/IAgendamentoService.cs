using Domain.Dtos.Agendamento;

namespace Domain.Interfaces.Services;

public interface IAgendamentoService
{
    Task<AgendamentoDto?> Get(Guid id);
    Task<IEnumerable<AgendamentoDto?>> GetAll(string authorization);
    Task<IEnumerable<AgendamentoDto>> GetByPacienteId(Guid pacienteId);
    Task<IEnumerable<AgendamentoDto>> GetByPerfilId(Guid perfilId);
    Task<AgendamentoDto?> Post(AgendamentoDto agendamento);
    Task<AgendamentoDto?> Post(AgendamentoDto agendamento, string authorization);
    Task<AgendamentoDto?> Put(AgendamentoDto agendamento);
    Task<bool> Delete(Guid id);
}
