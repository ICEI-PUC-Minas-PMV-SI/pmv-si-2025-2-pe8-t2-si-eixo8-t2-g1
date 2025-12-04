using Domain.Dtos.Agendamento;
using Domain.Interfaces.Services;
using Domain.Utils;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Net;

namespace Presentation.Controllers;

[Authorize(Policy = "ProOrGer")]
[Route("[controller]")]
[ApiController]
public class AgendamentoController : ControllerBase
{
    private readonly IAgendamentoService _agendamentoService;

    public AgendamentoController(IAgendamentoService agendamentoService)
    {
        _agendamentoService = agendamentoService;
    }

    [HttpGet]
    public async Task<ActionResult> BuscarTodosAgendamentos([FromHeader(Name = "Authorization")] string authorization)
    {
        try
        {

            return Ok(await _agendamentoService.GetAll(authorization));
        }
        catch (ArgumentException e)
        {
            return StatusCode((int)HttpStatusCode.InternalServerError, e.Message);
        }
    }

    [HttpGet]
    [Route("{id}", Name = "GetAgendamentoWithId")]
    public async Task<ActionResult> BuscarByIdAgendamento(Guid id)
    {
        try
        {
            var result = await _agendamentoService.Get(id);
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

    [HttpGet("paciente/{pacienteId}")]
    public async Task<ActionResult> BuscarPorPacienteId(Guid pacienteId)
    {
        try
        {
            return Ok(await _agendamentoService.GetByPacienteId(pacienteId));
        }
        catch (ArgumentException e)
        {
            return StatusCode((int)HttpStatusCode.InternalServerError, e.Message);
        }
    }

    [HttpGet("perfil/{perfilId}")]
    public async Task<ActionResult> BuscarPorPerfilId(Guid perfilId)
    {
        try
        {
            return Ok(await _agendamentoService.GetByPerfilId(perfilId));
        }
        catch (ArgumentException e)
        {
            return StatusCode((int)HttpStatusCode.InternalServerError, e.Message);
        }
    }

    [HttpPost]
    [Authorize(Policy = "GerOnly")]
    public async Task<ActionResult> CreateAgendamento([FromBody] AgendamentoDto agendamento)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        try
        {
            var result = await _agendamentoService.Post(agendamento);
            if (result != null)
            {
                return Created(new Uri(Url.Link("GetAgendamentoWithId", new { id = result.Id })!), result);
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
    public async Task<ActionResult> UpdateAgendamento([FromBody] AgendamentoDto agendamento)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }
        
        try
        {
            var result = await _agendamentoService.Put(agendamento);
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
    public async Task<ActionResult> DeleteAgendamento(Guid id)
    {
        try
        {
            if(await _agendamentoService.Delete(id))
                return Ok();
            
            return NotFound();
        }
        catch (ArgumentException e)
        {
            return StatusCode((int)HttpStatusCode.InternalServerError, e.Message);
        }
    }
}
