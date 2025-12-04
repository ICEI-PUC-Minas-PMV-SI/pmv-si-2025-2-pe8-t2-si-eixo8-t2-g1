using Domain.Entity;

namespace Domain.Interfaces.Repositorys;

public interface IFaturamentoRepository
{
    Task<Faturamento?> GetByIdAsync(Guid id);
    Task<IEnumerable<Faturamento>> GetAllAsync();
    Task<IEnumerable<Faturamento>> GetByPerfilIdAsync(Guid perfilId);
    Task<IEnumerable<Faturamento>> GetByPeriodoAsync(DateTime dataInicio, DateTime dataFim);
    Task<Faturamento> AddAsync(Faturamento faturamento);
    Task<Faturamento> UpdateAsync(Faturamento faturamento);
    Task<bool> DeleteAsync(Guid id);
    Task<ItemFaturamento> AddItemAsync(ItemFaturamento item);
    Task<bool> PerfilExiste(Guid perfilId);
    Task<bool> AgendamentoExiste(Guid agendamentoId);
    Task<Guid?> GetPerfilIdByUserId(Guid userId);
}
