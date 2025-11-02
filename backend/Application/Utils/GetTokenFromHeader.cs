using System.IdentityModel.Tokens.Jwt;
using System.Net;
using System.Security.Claims;

namespace Application.Utils;
public static class GetTokenFromHeader
{
    public static string? GetUserIdByAuthorizationToken(string token)
    {
        token = token.Replace("Bearer ", "");

        var jwtToken = new JwtSecurityTokenHandler().ReadJwtToken(token);

        var claim = jwtToken.Claims.FirstOrDefault(x => x.Type == ClaimTypes.NameIdentifier);
        return claim?.Value;
    }
}
