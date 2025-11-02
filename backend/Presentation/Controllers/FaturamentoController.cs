using Domain.Dtos.Faturamento;
using Domain.Interfaces.Services;
using Domain.Utils;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Net;
using Swashbuckle.AspNetCore.Annotations;
using System.Security.Claims;
using Domain.Interfaces.Repositorys;

namespace Presentation.Controllers;

[Authorize(Roles = $"{Roles.ROLE_PROFISSIONAL},{Roles.ROLE_GERENCIAL}")]
[Route("api/[controller]")]
[ApiController]
public class FaturamentoController : ControllerBase
{
    private readonly ILogger<FaturamentoController> _logger;
    private readonly IFaturamentoService _faturamentoService;
    private readonly IFaturamentoRepository _faturamentoRepository;

    public FaturamentoController(ILogger<FaturamentoController> logger, IFaturamentoService faturamentoService, IFaturamentoRepository faturamentoRepository)
    {
        _logger = logger;
        _faturamentoService = faturamentoService;
        _faturamentoRepository = faturamentoRepository;
    }

    [HttpGet]
    [SwaggerOperation(Summary = "Buscar todos os faturamentos", Description = "Retorna uma lista com todos os faturamentos cadastrados")]
    [SwaggerResponse(200, "Lista de faturamentos retornada com sucesso", typeof(IEnumerable<FaturamentoDto>))]
    [SwaggerResponse(500, "Erro interno do servidor")]
    public async Task<ActionResult> BuscarTodosFaturamentos()
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        try
        {
            return Ok(await _faturamentoService.GetAll());
        }
        catch (ArgumentException e)
        {
            return StatusCode((int)HttpStatusCode.InternalServerError, e.Message);
        }
    }

    [HttpGet]
    [Route("{id}", Name = "GetFaturamentoWithId")]
    [SwaggerOperation(Summary = "Buscar faturamento por ID", Description = "Retorna os dados de um faturamento específico")]
    [SwaggerResponse(200, "Faturamento encontrado com sucesso", typeof(FaturamentoDto))]
    [SwaggerResponse(404, "Faturamento não encontrado")]
    [SwaggerResponse(500, "Erro interno do servidor")]
    public async Task<ActionResult> BuscarByIdFaturamento(Guid id)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        try
        {
            var result = await _faturamentoService.Get(id);
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

    [HttpGet("profissional/{profissionalId}")]
    [SwaggerOperation(Summary = "Buscar faturamentos por profissional", Description = "Retorna todos os faturamentos de um profissional específico")]
    [SwaggerResponse(200, "Lista de faturamentos do profissional retornada com sucesso", typeof(IEnumerable<FaturamentoDto>))]
    [SwaggerResponse(500, "Erro interno do servidor")]
    public async Task<ActionResult> BuscarPorProfissionalId(Guid profissionalId)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        try
        {
            return Ok(await _faturamentoService.GetByProfissionalId(profissionalId));
        }
        catch (ArgumentException e)
        {
            return StatusCode((int)HttpStatusCode.InternalServerError, e.Message);
        }
    }

    [HttpGet("periodo")]
    [SwaggerOperation(Summary = "Buscar faturamentos por período", Description = "Retorna todos os faturamentos em um período específico")]
    [SwaggerResponse(200, "Lista de faturamentos do período retornada com sucesso", typeof(IEnumerable<FaturamentoDto>))]
    [SwaggerResponse(500, "Erro interno do servidor")]
    public async Task<ActionResult> BuscarPorPeriodo([FromQuery] DateTime dataInicio, [FromQuery] DateTime dataFim)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        try
        {
            return Ok(await _faturamentoService.GetByPeriodo(dataInicio, dataFim));
        }
        catch (ArgumentException e)
        {
            return StatusCode((int)HttpStatusCode.InternalServerError, e.Message);
        }
    }

    [HttpPost]
    [SwaggerOperation(Summary = "Criar novo faturamento", Description = "Cria um novo faturamento no sistema")]
    [SwaggerResponse(201, "Faturamento criado com sucesso", typeof(FaturamentoDto))]
    [SwaggerResponse(400, "Dados inválidos")]
    [SwaggerResponse(500, "Erro interno do servidor")]
    public async Task<ActionResult> CreateFaturamento([FromBody] FaturamentoDto faturamento)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        try
        {
            var result = await _faturamentoService.Post(faturamento);
            if (result != null)
            {
                return Created(new Uri(Url.Link("GetFaturamentoWithId", new { id = result.Id })!), result);
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

    [HttpPost("gerar")]
    [SwaggerOperation(Summary = "Gerar faturamentos por período", Description = "Gera faturamentos automaticamente para agendamentos realizados em um período")]
    [SwaggerResponse(201, "Faturamentos gerados com sucesso", typeof(FaturamentoDto))]
    [SwaggerResponse(400, "Dados inválidos ou nenhum agendamento encontrado")]
    [SwaggerResponse(500, "Erro interno do servidor")]
    public async Task<ActionResult> GerarFaturamento([FromBody] CriarFaturamentoDto criarFaturamento)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        try
        {
            var result = await _faturamentoService.GerarFaturamentoPorPeriodo(criarFaturamento);
            if (result != null)
            {
                return Created(new Uri(Url.Link("GetFaturamentoWithId", new { id = result.Id })!), result);
            }
            else
            {
                return BadRequest("Nenhum agendamento realizado encontrado para o período e profissional especificados.");
            }
        }
        catch (ArgumentException e)
        {
            return StatusCode((int)HttpStatusCode.InternalServerError, e.Message);
        }
    }

    [HttpPut]
    [SwaggerOperation(Summary = "Atualizar faturamento", Description = "Atualiza os dados de um faturamento existente")]
    [SwaggerResponse(200, "Faturamento atualizado com sucesso", typeof(FaturamentoDto))]
    [SwaggerResponse(400, "Dados inválidos")]
    [SwaggerResponse(500, "Erro interno do servidor")]
    public async Task<ActionResult> UpdateFaturamento([FromBody] FaturamentoDto faturamento)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        try
        {
            var result = await _faturamentoService.Put(faturamento);
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

    [HttpPut("{id}/emitir")]
    [SwaggerOperation(Summary = "Emitir faturamento", Description = "Altera o status do faturamento para 'Emitido'")]
    [SwaggerResponse(200, "Faturamento emitido com sucesso", typeof(FaturamentoDto))]
    [SwaggerResponse(400, "Faturamento não encontrado ou não pode ser emitido")]
    [SwaggerResponse(500, "Erro interno do servidor")]
    public async Task<ActionResult> EmitirFaturamento(Guid id)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        try
        {
            var result = await _faturamentoService.EmitirFaturamento(id);
            if (result != null)
            {
                return Ok(result);
            }
            else
            {
                return BadRequest("Faturamento não encontrado ou não pode ser emitido.");
            }
        }
        catch (ArgumentException e)
        {
            return StatusCode((int)HttpStatusCode.InternalServerError, e.Message);
        }
    }

    [HttpPut("{id}/cancelar")]
    [SwaggerOperation(Summary = "Cancelar faturamento", Description = "Altera o status do faturamento para 'Cancelado'")]
    [SwaggerResponse(200, "Faturamento cancelado com sucesso", typeof(FaturamentoDto))]
    [SwaggerResponse(400, "Faturamento não encontrado ou não pode ser cancelado")]
    [SwaggerResponse(500, "Erro interno do servidor")]
    public async Task<ActionResult> CancelarFaturamento(Guid id)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        try
        {
            var result = await _faturamentoService.CancelarFaturamento(id);
            if (result != null)
            {
                return Ok(result);
            }
            else
            {
                return BadRequest("Faturamento não encontrado ou não pode ser cancelado.");
            }
        }
        catch (ArgumentException e)
        {
            return StatusCode((int)HttpStatusCode.InternalServerError, e.Message);
        }
    }

    [HttpDelete("{id}")]
    [SwaggerOperation(Summary = "Deletar faturamento", Description = "Remove um faturamento do sistema")]
    [SwaggerResponse(200, "Faturamento deletado com sucesso", typeof(bool))]
    [SwaggerResponse(400, "Dados inválidos")]
    [SwaggerResponse(500, "Erro interno do servidor")]
    public async Task<ActionResult> DeleteFaturamento(Guid id)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        try
        {
            return Ok(await _faturamentoService.Delete(id));
        }
        catch (ArgumentException e)
        {
            return StatusCode((int)HttpStatusCode.InternalServerError, e.Message);
        }
    }

    [HttpPost("avulso")]
    [SwaggerOperation(Summary = "Criar faturamento avulso", Description = "Cria um faturamento individual para um paciente específico")]
    [SwaggerResponse(200, "Faturamento avulso criado com sucesso", typeof(FaturamentoDto))]
    [SwaggerResponse(400, "Dados inválidos")]
    [SwaggerResponse(500, "Erro interno do servidor")]
    public async Task<ActionResult<FaturamentoDto>> CriarFaturamentoAvulso([FromBody] CriarFaturamentoAvulsoDto faturamentoAvulso)
    {
        try
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim != null && Guid.TryParse(userIdClaim.Value, out var userId))
            {
                var profissionalId = await _faturamentoRepository.GetProfissionalIdByUserId(userId);
                if (!profissionalId.HasValue)
                {
                    return StatusCode((int)HttpStatusCode.BadRequest, "Profissional não encontrado para o usuário autenticado.");
                }
                faturamentoAvulso.ProfissionalId = profissionalId.Value;
            }
            var faturamentoDto = await _faturamentoService.CriarFaturamentoAvulso(faturamentoAvulso);
            return Ok(faturamentoDto);
        }
        catch (ArgumentException e)
        {
            return StatusCode((int)HttpStatusCode.BadRequest, e.Message);
        }
        catch (Exception e)
        {
            return StatusCode((int)HttpStatusCode.InternalServerError, e.Message);
        }
    }
}
