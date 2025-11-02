namespace Domain.Entity;

public class Documento : BaseEntity
{
    public string Tipo { get; set; }
    public string Titulo { get; set; }
    public string Conteudo { get; set; } 
    public Guid PacienteId { get; set; }
    public virtual Paciente? Paciente { get; set; }

    public Documento(string tipo, string titulo, string conteudo, Guid pacienteId)
    {
        Tipo = tipo;
        Titulo = titulo;
        Conteudo = conteudo;
        PacienteId = pacienteId;
        AtualizarDataAlteracao();
    }
}
