namespace Domain.Entity;
public class Paciente : BaseEntity
{
    public string NomeCompleto { get; set; }
    public DateTime DataNascimento { get; set; }
    public string? Telefone { get; set; }
    public string? Email { get; set; }

    // Propriedades de navegação para o EF Core
    public virtual ICollection<Agendamento> Agendamentos { get; set; }
    public virtual ICollection<Documento> Documentos { get; set; }

    public Paciente(string nomeCompleto, DateTime dataNascimento, string? telefone, string? email) : base()
    {
        NomeCompleto = nomeCompleto;
        DataNascimento = dataNascimento;
        Telefone = telefone;
        Email = email;
        Agendamentos = [];
        Documentos = [];
        AtualizarDataAlteracao();
    }
}
