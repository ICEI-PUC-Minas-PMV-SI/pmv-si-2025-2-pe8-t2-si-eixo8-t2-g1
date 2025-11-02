using Domain.Dtos.Profissional;

namespace Domain.Interfaces.Services
{
    public interface IProfissionalService
    {
        Task<ProfissionalDto?> Get(Guid id);
        Task<ProfissionalDto?> GetByUserId(Guid userId);
        Task<IEnumerable<ProfissionalDto>> GetAll();
        Task<ProfissionalDto?> Post(ProfissionalDto profissional);
        Task<ProfissionalDto?> Put(ProfissionalDto profissional);
        Task<bool> Delete(Guid id);
    }
}
