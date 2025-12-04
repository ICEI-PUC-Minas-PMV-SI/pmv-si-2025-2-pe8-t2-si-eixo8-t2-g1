namespace Application.Services.Email;
public class SmtpSettings
{
    public string Username { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
    public string Server { get; set; } = string.Empty;
    public string Port { get; set; } = string.Empty;
}