namespace Application.Services.Autenticacao;

public class TokenSettings
{
    public string Issuer { get; set; } = string.Empty;
    public string Audience { get; set; } = string.Empty;
    public string Token { get; set; } = string.Empty;
    public int ExpirationMinutes { get; set; } = 30;
}
