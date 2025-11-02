using Domain.Dtos.Profissional;
using Domain.Interfaces.Services;
using Domain.Utils;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Net;
using System.Security.Claims;

namespace Presentation.Controllers;

[Authorize(Roles = Roles.ROLE_PROFISSIONAL)]
[Route("api/[controller]")]
[ApiController]
public class ProfissionalController : ControllerBase
{
    private readonly IProfissionalService _profissionalService;

    public ProfissionalController(IProfissionalService profissionalService)
    {
        _profissionalService = profissionalService;
    }

    [HttpGet]
    public async Task<ActionResult> BuscarTodosProfissionais()
    {
        try
        {
            return Ok(await _profissionalService.GetAll());
        }
        catch (ArgumentException e)
        {
            return StatusCode((int)HttpStatusCode.InternalServerError, e.Message);
        }
    }

    [HttpGet("me")]
    public async Task<ActionResult> BuscarMeuProfissional()
    {
        try
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null || !Guid.TryParse(userIdClaim.Value, out var userId))
            {
                return Unauthorized("User ID not found in token");
            }

            var profissional = await _profissionalService.GetByUserId(userId);
            if (profissional == null)
            {
                return NotFound("Profissional não encontrado para este usuário");
            }

            return Ok(profissional);
        }
        catch (ArgumentException e)
        {
            return StatusCode((int)HttpStatusCode.InternalServerError, e.Message);
        }
    }

    [HttpGet]
    [Route("{id}", Name = "GetProfissionalWithId")]
    public async Task<ActionResult> BuscarByIdProfissional(Guid id)
    {
        try
        {
            var result = await _profissionalService.Get(id);
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

    [HttpPost]
    public async Task<ActionResult> CreateProfissional([FromBody] ProfissionalDto profissional)
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

            profissional.UserId = userId;

            var result = await _profissionalService.Post(profissional);
            if (result != null)
            {
                return Created(new Uri(Url.Link("GetProfissionalWithId", new { id = result.Id })!), result);
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

    [HttpPut]
    public async Task<ActionResult> UpdateProfissional([FromBody] ProfissionalDto profissional)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }
        
        try
        {
            var result = await _profissionalService.Put(profissional);
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

    [HttpDelete("{id}")]
    public async Task<ActionResult> DeleteProfissional(Guid id)
    {
        try
        {
            if(await _profissionalService.Delete(id))
                return Ok();
            
            return NotFound();
        }
        catch (ArgumentException e)
        {
            return StatusCode((int)HttpStatusCode.InternalServerError, e.Message);
        }
    }
}
