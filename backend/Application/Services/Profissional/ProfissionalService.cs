using Application.Mappers;
using Domain.Dtos.Profissional;
using Domain.Interfaces.Services;
using Infrastructure.Context;
using Microsoft.EntityFrameworkCore;

namespace Application.Services.Profissional;

public class ProfissionalService : IProfissionalService
{
    private readonly ProfissionalContext _context;

    public ProfissionalService(ProfissionalContext context)
    {
        _context = context;
    }

    public async Task<bool> Delete(Guid id)
    {
        var profissional = await _context.Profissionais.SingleOrDefaultAsync(p => p.Id == id);
        if (profissional == null)
        {
            return false;
        }

        _context.Profissionais.Remove(profissional);
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<ProfissionalDto?> Get(Guid id)
    {
        var profissional = await _context.Profissionais.SingleOrDefaultAsync(p => p.Id == id);
        return profissional?.ToDto();
    }

    public async Task<ProfissionalDto?> GetByUserId(Guid userId)
    {
        var profissional = await _context.Profissionais.SingleOrDefaultAsync(p => p.UserId == userId);
        return profissional?.ToDto();
    }

    public async Task<IEnumerable<ProfissionalDto>> GetAll()
    {
        var profissionais = await _context.Profissionais.ToListAsync();
        return profissionais.Select(p => p.ToDto()!);
    }

    public async Task<ProfissionalDto?> Post(ProfissionalDto profissionalDto)
    {
        var profissional = profissionalDto.ToEntity();
        if (profissional == null) return null;

        _context.Profissionais.Add(profissional);
        await _context.SaveChangesAsync();
        return profissional.ToDto();
    }

    public async Task<ProfissionalDto?> Put(ProfissionalDto profissionalDto)
    {
        var result = await _context.Profissionais.SingleOrDefaultAsync(p => p.Id == profissionalDto.Id);
        if (result == null)
        {
            return null;
        }

        result.NomeCompleto = profissionalDto.NomeCompleto;
        result.Especialidade = profissionalDto.Especialidade;
        result.RegistroConselho = profissionalDto.RegistroConselho;
        result.UserId = profissionalDto.UserId;
        result.AtualizarDataAlteracao();

        _context.Profissionais.Update(result);
        await _context.SaveChangesAsync();
        return result.ToDto();
    }
}
