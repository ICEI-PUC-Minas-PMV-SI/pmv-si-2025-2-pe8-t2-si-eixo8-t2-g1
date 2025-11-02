namespace Domain.Dtos.Profissional;

public class ProfissionalDto
{
    public Guid Id { get; set; }
    public string NomeCompleto { get; set; } = string.Empty;
    public string Especialidade { get; set; } = string.Empty;
    public string? RegistroConselho { get; set; }
    public Guid UserId { get; set; }
}
