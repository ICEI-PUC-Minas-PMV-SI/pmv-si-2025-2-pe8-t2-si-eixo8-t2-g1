namespace Domain.Dtos.Auth;

public class SendEmailResetPasswordResponseDto
{
    public string Token { get; set; } = string.Empty;
    public string Message { get; set; } = string.Empty;
}