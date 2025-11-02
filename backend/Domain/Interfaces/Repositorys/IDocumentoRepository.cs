using Domain.Entity;

namespace Domain.Interfaces.Repositorys;

public interface IDocumentoRepository
{
    Task<Documento?> GetByIdAsync(Guid id);
    Task<IEnumerable<Documento>> GetAllAsync();
    Task AddAsync(Documento Documento);
    Task UpdateAsync(Documento Documento);
    Task DeleteAsync(Guid id);
}
