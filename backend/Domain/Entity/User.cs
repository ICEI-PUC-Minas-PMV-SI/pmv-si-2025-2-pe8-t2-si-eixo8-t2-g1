namespace Domain.Entity;

public class User : BaseEntity
{
    public string Email { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;

    // Papel do funcion�rio: "Terapeuta", "Recepcao", "Admin"
    public string Role { get; set; } = string.Empty;

    public virtual Profissional? Profissional { get; set; }

    public User(string email, string role)
        : base()
    {
        Email = email;
        Role = role;
    }

    public void UpdateHashPassword(string hashedPassword)
    {
        PasswordHash = hashedPassword;
    }
}