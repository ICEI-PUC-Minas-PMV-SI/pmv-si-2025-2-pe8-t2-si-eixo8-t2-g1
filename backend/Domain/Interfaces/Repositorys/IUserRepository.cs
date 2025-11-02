using Domain.Entity;

namespace Domain.Interfaces.Repositorys;

public interface IUserRepository
{
    Task<User?> GetByIdAsync(Guid id);
    Task<IEnumerable<User>> GetAllAsync();
    Task AddAsync(User User);
    Task UpdateAsync(User User);
    Task DeleteAsync(Guid id);
}
