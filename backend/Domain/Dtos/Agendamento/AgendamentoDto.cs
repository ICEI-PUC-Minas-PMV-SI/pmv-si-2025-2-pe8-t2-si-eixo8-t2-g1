using Domain.Utils.Enums;

namespace Domain.Dtos.Agendamento;

public class AgendamentoDto
{
    public Guid Id { get; set; }
    public DateTime DataHora { get; set; }
    public EnumTipoAtendimento TipoAtendimento { get; set; }
    public string Status { get; set; } = string.Empty;
    public string? Observacoes { get; set; }
    public Guid PacienteId { get; set; }
    public Guid PerfilId { get; set; }
}
