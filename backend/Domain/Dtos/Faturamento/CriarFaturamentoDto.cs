namespace Domain.Dtos.Faturamento;

public class CriarFaturamentoDto
{
    public DateTime DataInicio { get; set; }
    public DateTime DataFim { get; set; }
    public Guid? ProfissionalId { get; set; }
    public decimal ValorPorAtendimento { get; set; }
    public string? Observacoes { get; set; }
}
