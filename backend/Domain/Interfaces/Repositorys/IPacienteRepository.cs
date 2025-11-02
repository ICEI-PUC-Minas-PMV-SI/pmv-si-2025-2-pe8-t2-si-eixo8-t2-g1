using Domain.Entity;

namespace Domain.Interfaces.Repositorys;

public interface IPacienteRepository
{
    Task<Paciente?> GetByIdAsync(Guid id);
    Task<IEnumerable<Paciente>> GetAllAsync();
    Task AddAsync(Paciente paciente);
    Task UpdateAsync(Paciente paciente);
    Task DeleteAsync(Guid id);
}
