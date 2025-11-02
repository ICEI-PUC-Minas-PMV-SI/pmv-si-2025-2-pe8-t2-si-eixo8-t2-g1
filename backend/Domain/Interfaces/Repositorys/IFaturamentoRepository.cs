using Domain.Entity;

namespace Domain.Interfaces.Repositorys;

public interface IFaturamentoRepository
{
    Task<Faturamento?> GetByIdAsync(Guid id);
    Task<IEnumerable<Faturamento>> GetAllAsync();
    Task<IEnumerable<Faturamento>> GetByProfissionalIdAsync(Guid profissionalId);
    Task<IEnumerable<Faturamento>> GetByPeriodoAsync(DateTime dataInicio, DateTime dataFim);
    Task<Faturamento> AddAsync(Faturamento faturamento);
    Task<Faturamento> UpdateAsync(Faturamento faturamento);
    Task<bool> DeleteAsync(Guid id);
    Task<ItemFaturamento> AddItemAsync(ItemFaturamento item);
    Task<bool> ProfissionalExiste(Guid profissionalId);
    Task<bool> AgendamentoExiste(Guid agendamentoId);
    Task<Guid?> GetProfissionalIdByUserId(Guid userId);
}
