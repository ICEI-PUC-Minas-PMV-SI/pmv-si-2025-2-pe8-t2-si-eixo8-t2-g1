namespace Domain.Entity;

public class Perfil : BaseEntity
{
    // Id, DataCriacao, DataAlteracao herdados

    public string NomeCompleto { get; set; }
    public string Tipo { get; set; } = string.Empty;
    public string? RegistroConselho { get; set; }
    public string? Especialidade { get; set; }
    public Guid UserId { get; set; }
    public virtual User User { get; set; } = null!;

    public virtual ICollection<Agendamento> Agendamentos { get; set; } = [];

    // Construtor
    public Perfil(string nomeCompleto, string tipo, Guid userId, string? especialidade, string? registroConselho = null)
    {
        NomeCompleto = nomeCompleto;
        Tipo = tipo;
        UserId = userId;
        RegistroConselho = registroConselho;
        Especialidade = especialidade;
        AtualizarDataAlteracao();
    }
}
