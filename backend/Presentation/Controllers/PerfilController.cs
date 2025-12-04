using Domain.Dtos.Perfil;
using Domain.Interfaces.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Net;
using System.Security.Claims;

namespace Presentation.Controllers;


[Route("[controller]")]
[ApiController]
public class PerfilController : ControllerBase
{
    private readonly IPerfilService _perfilService;

    public PerfilController(IPerfilService perfilService)
    {
        _perfilService = perfilService;
    }

    [Authorize(Policy = "ProOrGer")]
    [HttpGet]
    public async Task<ActionResult> BuscarTodosPerfis()
    {
        try
        {
            return Ok(await _perfilService.GetAll());
        }
        catch (ArgumentException e)
        {
            return StatusCode((int)HttpStatusCode.InternalServerError, e.Message);
        }
    }
    [Authorize(Policy = "LoggedUser")]
    [HttpGet("me")]
    public async Task<ActionResult> BuscarMeuPerfil()
    {
        try
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null || !Guid.TryParse(userIdClaim.Value, out var userId))
            {
                return Unauthorized("User ID not found in token");
            }

            var perfil = await _perfilService.GetByUserId(userId);
            if (perfil == null)
            {
                return NotFound("Perfil não encontrado para este usuário");
            }

            return Ok(perfil);
        }
        catch (ArgumentException e)
        {
            return StatusCode((int)HttpStatusCode.InternalServerError, e.Message);
        }
    }

    [Authorize(Policy = "ProOrGer")]
    [HttpGet]
    [Route("{id}", Name = "GetPerfilWithId")]
    public async Task<ActionResult> BuscarByIdPerfil(Guid id)
    {
        try
        {
            var result = await _perfilService.Get(id);
            if (result == null)
            {
                return NotFound();
            }
            return Ok(result);
        }
        catch (ArgumentException e)
        {
            return StatusCode((int)HttpStatusCode.InternalServerError, e.Message);
        }
    }

    [Authorize(Policy = "CreateProfile")]
    [HttpPost]
    public async Task<ActionResult> CreatePerfil([FromBody] PerfilDto perfil)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        try
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null || !Guid.TryParse(userIdClaim.Value, out var userId))
            {
                return Unauthorized("User ID not found in token");
            }

            perfil.UserId = userId;

            // Prevent multiple profiles per user
            var existing = await _perfilService.GetByUserId(userId);
            if (existing != null)
            {
                return BadRequest("User already has a profile.");
            }

            var result = await _perfilService.Post(perfil);
            if (result != null)
            {
                return Created(new Uri(Url.Link("GetPerfilWithId", new { id = result.Id })!), result);
            }
            else
            {
                return BadRequest();
            }
        }
        catch (ArgumentException e)
        {
            return StatusCode((int)HttpStatusCode.InternalServerError, e.Message);
        }
    }

    [Authorize(Policy = "ProOrGer")]
    [HttpPut]
    public async Task<ActionResult> UpdatePerfil([FromBody] PerfilDto perfil)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }
        
        try
        {
            var result = await _perfilService.Put(perfil);
            if (result != null)
            {
                return Ok(result);
            }
            else
            {
                return NotFound();
            }
        }
        catch (ArgumentException e)
        {
            return StatusCode((int)HttpStatusCode.InternalServerError, e.Message);
        }
    }

    [Authorize(Policy = "ProOrGer")]
    [HttpDelete("{id}")]
    public async Task<ActionResult> DeletePerfil(Guid id)
    {
        try
        {
            if(await _perfilService.Delete(id))
                return Ok();
            
            return NotFound();
        }
        catch (ArgumentException e)
        {
            return StatusCode((int)HttpStatusCode.InternalServerError, e.Message);
        }
    }
}
