namespace Domain.Dtos.Perfil;

public class PerfilDto
{
    public Guid Id { get; set; }
    public string NomeCompleto { get; set; } = string.Empty;
    public string Tipo { get; set; } = string.Empty;
    public string? RegistroConselho { get; set; }
    public string? Especialidade { get; set; }
    public Guid UserId { get; set; }
}
