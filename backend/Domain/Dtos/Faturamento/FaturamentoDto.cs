using Domain.Utils.Enums;

namespace Domain.Dtos.Faturamento;

public class FaturamentoDto
{
    public Guid Id { get; set; }
    public DateTime DataFaturamento { get; set; }
    public DateTime DataInicio { get; set; }
    public DateTime DataFim { get; set; }
    public Guid? PerfilId { get; set; }
    public string? ProfissionalNome { get; set; }
    public decimal ValorTotal { get; set; }
    public int TotalAtendimentos { get; set; }
    public EnumStatusFaturamento Status { get; set; }
    public string? Observacoes { get; set; }
    public List<ItemFaturamentoDto> Itens { get; set; } = new();
}
