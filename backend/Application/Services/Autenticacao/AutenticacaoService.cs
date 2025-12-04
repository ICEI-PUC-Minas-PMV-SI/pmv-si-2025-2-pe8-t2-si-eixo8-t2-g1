using Domain.Dtos.Auth;
using Domain.Entity;
using Domain.Interfaces.Services;
using Domain.Utils;
using Infrastructure.Context;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace Application.Services.Autenticacao;

public class AutenticacaoService : IAuthService
{
    private readonly UserContext _context;
    private readonly PerfilContext _perfilContext;
    private readonly TokenSettings _tokenSettings;
    private readonly IEmailService _emailService;

    public AutenticacaoService(UserContext context, PerfilContext perfilContext, IOptions<TokenSettings> tokenOptions, IEmailService emailService)
    {
        _context = context;
        _perfilContext = perfilContext;
        _tokenSettings = tokenOptions.Value;
        _emailService = emailService;
    }

    public async Task<TokenResponseDto?> LoginAsync(UserDto request)
    {
        var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == request.Email);
        if (user is null)
        {
            return null;
        }
        if (new PasswordHasher<User>().VerifyHashedPassword(user, user.PasswordHash, request.Password)
            == PasswordVerificationResult.Failed)
        {
            return null;
        }

        return await CreateTokenResponseAsync(user);
    }

    public async Task<bool?> ResetPasswordAsync(string token, string password)
    {
        var id = GetUserIdByAuthorizationToken(token);

        if (id == null)
            return null;

        var user = await _context.Users.SingleOrDefaultAsync(u => u.Id == Guid.Parse(id));

        if (user is null)
            return null;

        var hashedPassword = new PasswordHasher<User>()
            .HashPassword(user, password);

        user.PasswordHash = hashedPassword;

        _context.Users.Update(user);
        await _context.SaveChangesAsync();

        return true;
    }

    public async Task<string?> SendEmailResetPassword(string email)
    {
        var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == email);

        if (user is null)
            return null;

        var roleDesc = Roles.RstPswd.GetDescription() ?? "rst-pswd";
        var token = CreateToken(user, roleDesc, DateTime.UtcNow.AddMinutes(15));

        await _emailService.SendPasswordResetEmailAsync(user.Email, token);

        return token;
    }

    private async Task<TokenResponseDto> CreateTokenResponseAsync(User user)
    {
        // Determine issued role based on user's perfil (if exists)
        var issuedRoleDesc = string.Empty;

        var perfil = await _perfilContext.Perfil
            .AsNoTracking()
            .FirstOrDefaultAsync(p => p.UserId == user.Id);

        if (perfil == null || string.IsNullOrWhiteSpace(perfil.Tipo))
        {
            issuedRoleDesc = Roles.Default.GetDescription() ?? "default";
        }
        else
        {
            var tipo = perfil.Tipo == Roles.Gerencial.GetDescription() ? "ger" : "pro";
            issuedRoleDesc = EnumHelper.GetDescriptionFromString<Roles>(tipo);
        }

        return new TokenResponseDto
        {
            AccessToken = CreateToken(user, issuedRoleDesc),
        };
    }

    public async Task<bool> RegisterAsync(UserDto request)
    {
        return await RegisterAsync(request, Roles.Default);
    }

    public async Task<bool> RegisterAsync(UserDto request, Roles role)
    {
        if (await _context.Users.AnyAsync(u => u.Email == request.Email))
        {
            return false;
        }

        var user = new User(request.Email, role.ToString());
        var hashedPassword = new PasswordHasher<User>()
            .HashPassword(user, request.Password);

        user.UpdateHashPassword(hashedPassword);

        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        return true;
    }

    private string CreateToken(User user, string role, DateTime? expire = null)
    {
        var claims = new List<Claim>
        {
            new(ClaimTypes.Name, user.Email),
            new(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new(ClaimTypes.Role, role)
        };

        var keyString = _tokenSettings.Token;
        if (string.IsNullOrEmpty(keyString))
        {
            throw new InvalidOperationException("TokenSettings:Token configuration is missing.");
        }
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(keyString));

        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha512);

        var tokenDescriptor = new JwtSecurityToken(
            issuer: _tokenSettings.Issuer,
            audience: _tokenSettings.Audience,
            claims: claims,
            expires: expire ?? DateTime.UtcNow.AddMinutes(_tokenSettings.ExpirationMinutes),
            signingCredentials: creds
        );

        return new JwtSecurityTokenHandler().WriteToken(tokenDescriptor);
    }

    private static string? GetUserIdByAuthorizationToken(string token)
    {
        if (string.IsNullOrEmpty(token) || token.Length <= 7)
            return null;

        token = token.Substring(7);

        var jwtToken = new JwtSecurityTokenHandler().ReadJwtToken(token);

        var claim = jwtToken.Claims.FirstOrDefault(x => x.Type == ClaimTypes.NameIdentifier);
        return claim?.Value;
    }
}
