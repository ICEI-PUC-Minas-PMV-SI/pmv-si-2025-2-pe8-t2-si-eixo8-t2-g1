using Domain.Utils.Enums;

namespace Domain.Dtos.Faturamento;

public class ItemFaturamentoDto
{
    public Guid Id { get; set; }
    public Guid AgendamentoId { get; set; }
    public DateTime DataHora { get; set; }
    public string PacienteNome { get; set; } = string.Empty;
    public EnumTipoAtendimento TipoAtendimento { get; set; }
    public decimal ValorAtendimento { get; set; }
    public string Status { get; set; } = string.Empty;
    public string? Observacoes { get; set; }
}
