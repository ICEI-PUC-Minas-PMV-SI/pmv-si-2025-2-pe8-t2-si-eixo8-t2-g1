namespace Domain.Dtos.Faturamento;

public class CriarFaturamentoAvulsoDto
{
    public string Paciente { get; set; } = string.Empty;
    public string Servico { get; set; } = string.Empty;
    public DateTime Data { get; set; }
    public decimal Valor { get; set; }
    public string Status { get; set; } = string.Empty;
    public string FormaPagamento { get; set; } = string.Empty;
    public string? Observacoes { get; set; }
    public Guid PacienteId { get; set; }
    public Guid AgendamentoId { get; set; }
    public Guid? ProfissionalId { get; set; }
}
