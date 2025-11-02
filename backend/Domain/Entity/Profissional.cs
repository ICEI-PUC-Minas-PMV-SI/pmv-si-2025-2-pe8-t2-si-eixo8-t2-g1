namespace Domain.Entity;

public class Profissional : BaseEntity
{
    // Id, DataCriacao, DataAlteracao herdados

    public string NomeCompleto { get; set; }
    public string Especialidade { get; set; } // Ex: "Terapeuta Ocupacional"
    public string? RegistroConselho { get; set; } 

    // Um Profissional DEVE estar ligado a UMA conta User.
    public Guid UserId { get; set; }
    public virtual User User { get; set; } = null!;

    // Um profissional pode ter vários agendamentos
    public virtual ICollection<Agendamento> Agendamentos { get; set; } = [];

    // Construtor
    public Profissional(string nomeCompleto, string especialidade, Guid userId, string? registroConselho = null)
    {
        NomeCompleto = nomeCompleto;
        Especialidade = especialidade;
        UserId = userId;
        RegistroConselho = registroConselho;
        AtualizarDataAlteracao();
    }
}