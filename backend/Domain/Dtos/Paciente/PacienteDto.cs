namespace Domain.Dtos.Paciente;

public class PacienteDto
{
    public Guid Id { get; set; }
    public required string NomeCompleto { get; set; }
    public DateTime DataNascimento { get; set; }
    public string? Telefone { get; set; }
    public string? Email { get; set; }

}
