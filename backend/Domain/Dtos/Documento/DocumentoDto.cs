namespace Domain.Dtos.Documento;

public class DocumentoDto
{
    public Guid Id { get; set; }
    public string Tipo { get; set; } = string.Empty;
    public string Titulo { get; set; } = string.Empty;
    public string Conteudo { get; set; } = string.Empty;
    public Guid PacienteId { get; set; }
}
