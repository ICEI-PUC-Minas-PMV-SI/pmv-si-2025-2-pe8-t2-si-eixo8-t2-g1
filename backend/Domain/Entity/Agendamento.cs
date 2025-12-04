using Domain.Utils.Enums;

namespace Domain.Entity;

public class Agendamento : BaseEntity
{
    public DateTime DataHora { get; set; }
    public EnumTipoAtendimento TipoAtendimento { get; set; }
    public string Status { get; set; }
    public string Observacoes { get; set; }

    // --- Chaves Estrangeiras ---
    public Guid PacienteId { get; set; }
    public virtual Paciente Paciente { get; set; } = null!;
    public Guid PerfilId { get; set; }
    public virtual Perfil Perfil { get; set; } = null!;

    // Construtor atualizado
    public Agendamento(DateTime dataHora,
                       EnumTipoAtendimento tipoAtendimento, string status,
                       Guid pacienteId, Guid perfilId, string observacoes)
    {
        DataHora = dataHora;
        TipoAtendimento = tipoAtendimento;
        Status = status;
        PacienteId = pacienteId;
        PerfilId = perfilId;
        Observacoes = observacoes;
        AtualizarDataAlteracao();
    }
}

