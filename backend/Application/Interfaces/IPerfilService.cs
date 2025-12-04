using Domain.Dtos.Perfil;

namespace Application.Interfaces;

public interface IPerfilService
{
    Task<PerfilDto?> Get(Guid id);
    Task<PerfilDto?> GetByUserId(Guid userId);
    Task<IEnumerable<PerfilDto>> GetAll();
    Task<PerfilDto?> Post(PerfilDto perfil);
    Task<PerfilDto?> Put(PerfilDto perfil);
    Task<bool> Delete(Guid id);
}
