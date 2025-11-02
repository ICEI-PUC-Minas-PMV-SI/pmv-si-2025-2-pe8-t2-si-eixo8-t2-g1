using Domain.Dtos.Paciente;
using Domain.Entity;

namespace Domain.Interfaces.Services
{
    public interface IPacienteService
    {
        Task<PacienteDto?> Get(Guid id);
        Task<IEnumerable<PacienteDto?>> GetAll();
        Task<PacienteDto?> Post(PacienteDto paciente);
        Task<PacienteDto?> Put(PacienteDto paciente);
        Task<bool> Delete(Guid id);
    }
}