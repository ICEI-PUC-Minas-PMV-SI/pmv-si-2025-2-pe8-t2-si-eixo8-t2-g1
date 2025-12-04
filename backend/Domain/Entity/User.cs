using Domain.Utils;

namespace Domain.Entity;

public class User : BaseEntity
{
    public string Email { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;
    public string Role { get; set; } = string.Empty;

    public virtual Perfil? Perfil { get; set; }

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