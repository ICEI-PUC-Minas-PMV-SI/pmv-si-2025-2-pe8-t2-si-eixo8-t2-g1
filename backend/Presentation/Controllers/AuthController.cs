using Domain.Dtos.Auth;
using Domain.Interfaces.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Presentation.Controllers;

[Route("[controller]")]
[ApiController]
public class AuthController(IAuthService authService) : ControllerBase
{
    /// <summary>
    /// Register a new user and return JWT token (same as login) on success.
    /// </summary>
    /// <param name="request">User information to register.</param>
    [HttpPost("register")]
    [Produces("application/json")]
    [ProducesResponseType(typeof(TokenResponseDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<TokenResponseDto>> Register(UserDto request)
    {
        var result = await authService.RegisterAsync(request);
        if (!result)
            return BadRequest("Email already exists.");

        // After successful registration, immediately authenticate to return a token
        var tokenResponse = await authService.LoginAsync(request);
        if (tokenResponse is null)
            return StatusCode(StatusCodes.Status500InternalServerError, "Failed to generate token after registration.");

        return Ok(tokenResponse);
    }

    /// <summary>
    /// Authenticate user and return JWT token.
    /// </summary>
    /// <param name="request">User credentials.</param>
    [HttpPost("login")]
    [Produces("application/json")]
    [ProducesResponseType(typeof(TokenResponseDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<TokenResponseDto>> Login(UserDto request)
    {
        var result = await authService.LoginAsync(request);
        if (result is null)
            return BadRequest("Invalid username or password.");

        return Ok(result);
    }

    /// <summary>
    /// Send an email containing a password reset token.
    /// </summary>
    /// <param name="request">Object containing the email to send to.</param>
    [HttpPost("email-reset-password")]
    [Produces("application/json")]
    [ProducesResponseType(typeof(SendEmailResetPasswordResponseDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<SendEmailResetPasswordResponseDto>> SendEmailResetPassword(SendEmailResetPasswordDto request)
    {
        var result = await authService.SendEmailResetPassword(request.Email);
        if (result is null)
            return BadRequest("Invalid email.");

        var response = new SendEmailResetPasswordResponseDto
        {
            Token = result,
            Message = "Email sent. You have 15 minutes to reset your password."
        };

        return Ok(response);
    }

    /// <summary>
    /// Reset password using the token previously issued.
    /// </summary>
    /// <param name="request">New password.</param>
    /// <param name="authorization">Authorization header containing the reset-role token.</param>
    [Authorize(Policy = "ResetPasswordRole")]
    [HttpPatch("reset-password")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<ActionResult> ResetPassword([FromBody] ResetPasswordDto request, [FromHeader(Name = "Authorization")] string authorization)
    {
        var result = await authService.ResetPasswordAsync(authorization, request.Password);
        if (result is null)
            return BadRequest("Cant find user");

        return NoContent();
    }

    /// <summary>
    /// Endpoint for authenticated professionals.
    /// </summary>
    [Authorize(Policy = "LoggedUser")]
    [HttpGet]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    public IActionResult AuthenticatedOnlyEndpoint()
    {
        return Ok("You are authenticated!");
    }

    /// <summary>
    /// Endpoint for managerial users.
    /// </summary>
    [Authorize(Policy = "GerOnly")]
    [HttpGet("admin-only")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    public IActionResult AdminOnlyEndpoint()
    {
        return Ok("You are and admin!");
    }
}
