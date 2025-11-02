using Domain.Dtos.Auth;
using Domain.Interfaces.Services;
using Domain.Utils;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Presentation.Controllers;

[Route("api/[controller]")]
[ApiController]
public class AuthController(IAuthService authService) : ControllerBase
{
    [HttpPost("register")]
    public async Task<ActionResult<bool>> Register(UserDto request)
    {
        var result = await authService.RegisterAsync(request);
        if (!result)
            return BadRequest("Email already exists.");

        return Created();
    }

    [HttpPost("login")]
    public async Task<ActionResult<TokenResponseDto>> Login(UserDto request)
    {
        var result = await authService.LoginAsync(request);
        if (result is null)
            return BadRequest("Invalid username or password.");

        return Ok(result);
    }

    [HttpPost("email-reset-password")]
    public async Task<ActionResult<string>> SendEmailResetPassword(SendEmailResetPasswordDto request)
    {

        var result = await authService.SendEmailResetPassword(request.Email);
        if (result is null)
            return BadRequest("Invalid email.");

        return Ok(new { Token = result, Mensagem = "Email sent. You have 15 minutes to reset your password." });
    }

    [Authorize(Roles = Roles.ROLE_RST_PSWD)]
    [HttpPatch("reset-password")]
    public async Task<ActionResult> ResetPassword([FromBody] ResetPasswordDto request, [FromHeader(Name = "Authorization")] string authorization)
    {

        var result = await authService.ResetPasswordAsync(authorization, request.Password);
        if (result is null)
            return BadRequest("Cant find user");

        return NoContent();
    }

    [Authorize(Roles = Roles.ROLE_PROFISSIONAL)]
    [HttpPost("change-password")]
    public async Task<ActionResult> ChangePassword([FromBody] ChangePasswordDto request)
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
        if (userIdClaim == null || !Guid.TryParse(userIdClaim.Value, out var userId))
        {
            return Unauthorized("User ID not found in token");
        }

        var ok = await authService.ChangePasswordAsync(userId, request.CurrentPassword, request.NewPassword);
        if (!ok) return BadRequest("Senha atual inválida");
        return NoContent();
    }

[Authorize(Roles = Roles.ROLE_PROFISSIONAL)]
    [HttpGet]
    public IActionResult AuthenticatedOnlyEndpoint()
    {
        return Ok("You are authenticated!");
    }

    [Authorize(Roles = Roles.ROLE_GERENCIAL)]
    [HttpGet("admin-only")]
    public IActionResult AdminOnlyEndpoint()
    {
        return Ok("You are and admin!");
    }
}
