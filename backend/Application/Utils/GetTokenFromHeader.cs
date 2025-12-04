using System.IdentityModel.Tokens.Jwt;
using System.Net;
using System.Security.Claims;

namespace Application.Utils;
public static class GetTokenFromHeader
{
    public static string? GetUserIdByAuthorizationToken(string token)
    {
        if (string.IsNullOrWhiteSpace(token))
            return null;

        token = token.Replace("Bearer ", "").Trim();

        var jwtToken = new JwtSecurityTokenHandler().ReadJwtToken(token);

        var claim = jwtToken.Claims.FirstOrDefault(x => x.Type == ClaimTypes.NameIdentifier);
        return claim?.Value;
    }

    public static IEnumerable<string> GetRolesFromAuthorizationToken(string token)
    {
        if (string.IsNullOrWhiteSpace(token))
            return Array.Empty<string>();

        token = token.Replace("Bearer ", "").Trim();

        var jwtToken = new JwtSecurityTokenHandler().ReadJwtToken(token);

        var roles = jwtToken.Claims
            .Where(c => c.Type == ClaimTypes.Role || c.Type == "role")
            .Select(c => c.Value)
            .Where(v => !string.IsNullOrWhiteSpace(v))
            .ToArray();

        return roles;
    }
}
