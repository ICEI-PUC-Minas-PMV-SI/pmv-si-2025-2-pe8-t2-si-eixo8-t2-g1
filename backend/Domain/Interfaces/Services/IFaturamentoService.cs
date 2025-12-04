using Domain.Dtos.Faturamento;

namespace Domain.Interfaces.Services;

public interface IFaturamentoService
{
    Task<FaturamentoDto?> Get(Guid id);
    Task<IEnumerable<FaturamentoDto>> GetAll();
    Task<IEnumerable<FaturamentoDto>> GetByPerfilId(Guid perfilId);
    Task<IEnumerable<FaturamentoDto>> GetByPeriodo(DateTime dataInicio, DateTime dataFim);
    Task<FaturamentoDto?> Post(FaturamentoDto faturamentoDto);
    Task<FaturamentoDto?> Put(FaturamentoDto faturamentoDto);
    Task<bool> Delete(Guid id);
    Task<FaturamentoDto?> GerarFaturamentoPorPeriodo(CriarFaturamentoDto criarFaturamentoDto);
    Task<FaturamentoDto?> EmitirFaturamento(Guid faturamentoId);
    Task<FaturamentoDto?> CancelarFaturamento(Guid faturamentoId);
    Task<FaturamentoDto> CriarFaturamentoAvulso(CriarFaturamentoAvulsoDto faturamentoAvulso);
}
