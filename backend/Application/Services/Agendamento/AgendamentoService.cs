using Application.Mappers;
using Application.Utils;
using Domain.Dtos.Agendamento;
using Domain.Interfaces.Services;
using Infrastructure.Context;
using Microsoft.EntityFrameworkCore;

namespace Application.Services.Agendamento;

public class AgendamentoService : IAgendamentoService
{
    private readonly AgendamentoContext _context;
    private readonly ProfissionalContext _profissionalContext;

    public AgendamentoService(AgendamentoContext context, ProfissionalContext profissionalContext)
    {
        _context = context;
        _profissionalContext = profissionalContext;
    }

    public async Task<bool> Delete(Guid id)
    {
        var agendamento = await _context.Agendamentos.SingleOrDefaultAsync(a => a.Id == id);
        if (agendamento == null)
        {
            return false;
        }

        _context.Agendamentos.Remove(agendamento);
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<AgendamentoDto?> Get(Guid id)
    {
        var agendamento = await _context.Agendamentos.SingleOrDefaultAsync(a => a.Id == id);
        return agendamento?.ToDto();
    }

    public async Task<IEnumerable<AgendamentoDto?>> GetAll(string authorization)
    {
        var userId = GetTokenFromHeader.GetUserIdByAuthorizationToken(authorization);

        var profissional = await _profissionalContext.Profissionais
            .FirstOrDefaultAsync(p => p.UserId.ToString() == userId);

        if (profissional == null)
            return null;
        
        var agendamentos = await _context.Agendamentos.Where(x => x.ProfissionalId == profissional.Id).ToListAsync();

        return agendamentos.ToDto();
    }

    public async Task<IEnumerable<AgendamentoDto>> GetByPacienteId(Guid pacienteId)
    {
         var agendamentos = await _context.Agendamentos
                                        .Where(a => a.PacienteId == pacienteId)
                                        .ToListAsync();
        return agendamentos.Select(a => a.ToDto()!);
    }

    public async Task<IEnumerable<AgendamentoDto>> GetByProfissionalId(Guid profissionalId)
    {
         var agendamentos = await _context.Agendamentos
                                        .Where(a => a.ProfissionalId == profissionalId)
                                        .ToListAsync();
        return agendamentos.Select(a => a.ToDto()!);
    }

    public async Task<AgendamentoDto?> Post(AgendamentoDto agendamentoDto)
    {
        var agendamento = agendamentoDto.ToEntity();
        if (agendamento == null) return null;

        _context.Agendamentos.Add(agendamento);
        await _context.SaveChangesAsync();
        return agendamento.ToDto();
    }

    public async Task<AgendamentoDto?> Put(AgendamentoDto agendamentoDto)
    {
        var result = await _context.Agendamentos.SingleOrDefaultAsync(a => a.Id == agendamentoDto.Id);
        if (result == null)
        {
            return null;
        }

        result.DataHora = agendamentoDto.DataHora;
        result.Status = agendamentoDto.Status;
        result.TipoAtendimento = agendamentoDto.TipoAtendimento;
        result.Observacoes = agendamentoDto.Observacoes;
        result.AtualizarDataAlteracao();

        _context.Agendamentos.Update(result);
        await _context.SaveChangesAsync();
        return result.ToDto();
    }
}
