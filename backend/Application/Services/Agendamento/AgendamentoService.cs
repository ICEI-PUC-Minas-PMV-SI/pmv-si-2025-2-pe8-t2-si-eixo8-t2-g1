using Application.Mappers;
using Application.Utils;
using Domain.Dtos.Agendamento;
using Domain.Interfaces.Services;
using Infrastructure.Context;
using Microsoft.EntityFrameworkCore;
using Domain.Utils;
using System;
using System.Linq;

namespace Application.Services.Agendamento;

public class AgendamentoService : IAgendamentoService
{
    private readonly AgendamentoContext _context;
    private readonly PerfilContext _perfilContext;

    public AgendamentoService(AgendamentoContext context, PerfilContext perfilContext)
    {
        _context = context;
        _perfilContext = perfilContext;
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

        if (string.IsNullOrWhiteSpace(userId))
            return [];

        var roles = GetTokenFromHeader.GetRolesFromAuthorizationToken(authorization);
        var isGerencial = roles.Any(r => string.Equals(r, Roles.Gerencial.GetDescription(), StringComparison.OrdinalIgnoreCase));

        if (isGerencial)
        {
            var all = await _context.Agendamentos.ToListAsync();
            return all.ToDto();
        }

        var perfil = await _perfilContext.Perfil
            .FirstOrDefaultAsync(p => p.UserId.ToString() == userId);

        if (perfil == null)
            return [];
        
        var agendamentos = await _context.Agendamentos.Where(x => x.PerfilId == perfil.Id).ToListAsync();

        return agendamentos.ToDto();
    }

    public async Task<IEnumerable<AgendamentoDto>> GetByPacienteId(Guid pacienteId)
    {
         var agendamentos = await _context.Agendamentos
                                        .Where(a => a.PacienteId == pacienteId)
                                        .ToListAsync();
        return agendamentos.Select(a => a.ToDto()!);
    }

    public async Task<IEnumerable<AgendamentoDto>> GetByPerfilId(Guid perfilId)
    {
         var agendamentos = await _context.Agendamentos
                                        .Where(a => a.PerfilId == perfilId)
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

    public async Task<AgendamentoDto?> Post(AgendamentoDto agendamentoDto, string authorization)
    {
        // Resolve perfil from authorization token
        var userId = GetTokenFromHeader.GetUserIdByAuthorizationToken(authorization);
        if (string.IsNullOrWhiteSpace(userId))
            return null;

        var perfil = await _perfilContext.Perfil
            .FirstOrDefaultAsync(p => p.UserId.ToString() == userId);

        if (perfil == null)
            return null;

        // Force perfil association to the authenticated perfil
        agendamentoDto.PerfilId = perfil.Id;

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
        result.Observacoes = agendamentoDto.Observacoes ?? string.Empty;
        result.AtualizarDataAlteracao();

        _context.Agendamentos.Update(result);
        await _context.SaveChangesAsync();
        return result.ToDto();
    }
}
