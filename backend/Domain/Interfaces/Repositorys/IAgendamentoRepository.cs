using Domain.Entity;

namespace Domain.Interfaces.Repositorys;

public interface IAgendamentoRepository
{
    Task<Agendamento?> GetByIdAsync(Guid id);
    Task<IEnumerable<Agendamento>> GetAllAsync();
    Task AddAsync(Agendamento Agendamento);
    Task UpdateAsync(Agendamento paciente);
    Task DeleteAsync(Guid id);
}
