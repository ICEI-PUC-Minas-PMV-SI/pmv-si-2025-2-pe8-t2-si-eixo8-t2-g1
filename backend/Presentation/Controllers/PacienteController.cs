using Domain.Dtos.Paciente;
using Domain.Entity;
using Domain.Interfaces.Services;
using Domain.Utils;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Net;

namespace Presentation.Controllers
{
    [Authorize(Roles = $"{Roles.ROLE_PROFISSIONAL},{Roles.ROLE_GERENCIAL}")]
    [Route("api/[controller]")]
    [ApiController]
    public class PacienteController : ControllerBase
    {
        private readonly ILogger<PacienteController> _logger;
        private readonly IPacienteService _pacienteService;

        public PacienteController(ILogger<PacienteController> logger, IPacienteService pacienteService)
        {
            _logger = logger;
            _pacienteService = pacienteService;
        }

        [HttpGet]
        public async Task<ActionResult> BuscarTodosPacientes()
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                return Ok(await _pacienteService.GetAll());
            }
            catch (ArgumentException e)
            {
                return StatusCode((int)HttpStatusCode.InternalServerError, e.Message);
            }
        }

        [HttpGet]
        [Route("{id}", Name = "GetPacienteWithId")]
        public async Task<ActionResult> BuscarByIdPacientes(Guid id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                var result = await _pacienteService.Get(id);
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
        public async Task<ActionResult> CreatePaciente([FromBody] PacienteDto paciente)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                var result = await _pacienteService.Post(paciente);
                if (result != null)
                {
                    return Created(new Uri(Url.Link("GetPacienteWithId", new { id = result.Id })!), result);
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
        public async Task<ActionResult> UpdatePaciente([FromBody] PacienteDto paciente)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                var result = await _pacienteService.Put(paciente);
                if (result != null)
                {
                    return Ok(result);
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

        [HttpDelete("{id}")]
        public async Task<ActionResult> DeletePaciente(Guid id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            try
            {
                return Ok(await _pacienteService.Delete(id));
            }
            catch (ArgumentException e)
            {
                return StatusCode((int)HttpStatusCode.InternalServerError, e.Message);
            }
        }
    }
}
