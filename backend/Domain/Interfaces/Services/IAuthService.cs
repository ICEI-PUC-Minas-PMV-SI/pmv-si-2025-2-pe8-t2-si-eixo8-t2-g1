using Domain.Dtos.Auth;

namespace Domain.Interfaces.Services
{
    public interface IAuthService
    {
        Task<bool> RegisterAsync(UserDto request);
        Task<TokenResponseDto?> LoginAsync(UserDto request);
        Task<string?> SendEmailResetPassword(string email);
        Task<bool?> ResetPasswordAsync(string token, string password);
        Task<bool> ChangePasswordAsync(Guid userId, string currentPassword, string newPassword);
    }
}
