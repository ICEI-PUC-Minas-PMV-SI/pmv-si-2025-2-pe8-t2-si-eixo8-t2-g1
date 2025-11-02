using Domain.Dtos.Auth;
using Domain.Entity;
using Domain.Interfaces.Services;
using Domain.Utils;
using Infrastructure.Context;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace Application.Services.Autenticacao;

public class AutenticacaoService(UserContext context, IConfiguration configuration, IEmailService emailService) : IAuthService
{
    public async Task<bool> ChangePasswordAsync(Guid userId, string currentPassword, string newPassword)
    {
        var user = await context.Users.SingleOrDefaultAsync(u => u.Id == userId);
        if (user is null)
            return false;

        var verify = new PasswordHasher<User>().VerifyHashedPassword(user, user.PasswordHash, currentPassword);
        if (verify == PasswordVerificationResult.Failed)
            return false;

        var hashed = new PasswordHasher<User>().HashPassword(user, newPassword);
        user.PasswordHash = hashed;
        context.Users.Update(user);
        await context.SaveChangesAsync();
        return true;
    }

    public async Task<TokenResponseDto?> LoginAsync(UserDto request)
    {
        var user = await context.Users.FirstOrDefaultAsync(u => u.Email == request.Email);
        if (user is null)
        {
            return null;
        }
        if (new PasswordHasher<User>().VerifyHashedPassword(user, user.PasswordHash, request.Password)
            == PasswordVerificationResult.Failed)
        {
            return null;
        }

        return CreateTokenResponse(user);
    }

    public async Task<bool?> ResetPasswordAsync(string token, string password)
    {
        var id = GetUserIdByAuthorizationToken(token);

        if (id == null)
            return null;

        var user = await context.Users.SingleOrDefaultAsync(u => u.Id == Guid.Parse(id));

        if (user is null)
            return null;

        var hashedPassword = new PasswordHasher<User>()
            .HashPassword(user, password);

        user.PasswordHash = hashedPassword;

        context.Users.Update(user);
        await context.SaveChangesAsync();

        return true;
    }

    public async Task<string?> SendEmailResetPassword(string email)
    {
        var user = await context.Users.FirstOrDefaultAsync(u => u.Email == email);

        if (user is null)
            return null;

        var token = CreateToken(user, Roles.ROLE_RST_PSWD, DateTime.UtcNow.AddMinutes(15));

        await emailService.SendPasswordResetEmailAsync(user.Email, token);

        return token;
    }

    private TokenResponseDto CreateTokenResponse(User user)
    {
        return new TokenResponseDto
        {
            AccessToken = CreateToken(user),
        };
    }

    public async Task<bool> RegisterAsync(UserDto request)
    {
        if (await context.Users.AnyAsync(u => u.Email == request.Email))
        {
            return false;
        }

        var user = new User(request.Email, Roles.ROLE_PROFISSIONAL);
        var hashedPassword = new PasswordHasher<User>()
            .HashPassword(user, request.Password);

        user.UpdateHashPassword(hashedPassword);

        context.Users.Add(user);
        await context.SaveChangesAsync();

        return true;
    }

    private string CreateToken(User user, string role = Roles.ROLE_PROFISSIONAL, DateTime? expire = null)
    {
        var claims = new List<Claim>
        {
            new(ClaimTypes.Name, user.Email),
            new(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new(ClaimTypes.Role, role)
        };

        var key = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(configuration.GetSection("TokenSettings")["Token"]!));

        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha512);

        var tokenDescriptor = new JwtSecurityToken(
            issuer: configuration.GetSection("TokenSettings")["Issuer"],
            audience: configuration.GetSection("TokenSettings")["Audience"],
            claims: claims,
            expires: expire ?? DateTime.UtcNow.AddMinutes(30),
            signingCredentials: creds
        );

        return new JwtSecurityTokenHandler().WriteToken(tokenDescriptor);
    }

    private static string? GetUserIdByAuthorizationToken(string token)
    {
        token = token.Substring(7);

        var jwtToken = new JwtSecurityTokenHandler().ReadJwtToken(token);

        var claim = jwtToken.Claims.FirstOrDefault(x => x.Type == ClaimTypes.NameIdentifier);
        return claim?.Value;
    }
}
