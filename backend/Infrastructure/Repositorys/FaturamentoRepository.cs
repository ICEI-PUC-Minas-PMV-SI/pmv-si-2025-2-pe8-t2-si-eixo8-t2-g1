using Domain.Entity;
using Domain.Interfaces.Repositorys;
using Infrastructure.Context;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositorys;

public class FaturamentoRepository : IFaturamentoRepository
{
    private readonly FaturamentoContext _context;

    public FaturamentoRepository(FaturamentoContext context)
    {
        _context = context;
    }

    public async Task<Faturamento?> GetByIdAsync(Guid id)
    {
        return await _context.Faturamentos
            .Include(f => f.Profissional)
            .Include(f => f.Itens)
                .ThenInclude(i => i.Agendamento)
                    .ThenInclude(a => a.Paciente)
            .FirstOrDefaultAsync(f => f.Id == id);
    }

    public async Task<IEnumerable<Faturamento>> GetAllAsync()
    {
        return await _context.Faturamentos
            .Include(f => f.Profissional)
            .Include(f => f.Itens)
                .ThenInclude(i => i.Agendamento)
                    .ThenInclude(a => a.Paciente)
            .OrderByDescending(f => f.DataFaturamento)
            .ToListAsync();
    }

    public async Task<IEnumerable<Faturamento>> GetByProfissionalIdAsync(Guid profissionalId)
    {
        return await _context.Faturamentos
            .Include(f => f.Profissional)
            .Include(f => f.Itens)
                .ThenInclude(i => i.Agendamento)
                    .ThenInclude(a => a.Paciente)
            .Where(f => f.ProfissionalId == profissionalId)
            .OrderByDescending(f => f.DataFaturamento)
            .ToListAsync();
    }

    public async Task<IEnumerable<Faturamento>> GetByPeriodoAsync(DateTime dataInicio, DateTime dataFim)
    {
        return await _context.Faturamentos
            .Include(f => f.Profissional)
            .Include(f => f.Itens)
                .ThenInclude(i => i.Agendamento)
                    .ThenInclude(a => a.Paciente)
            .Where(f => f.DataInicio >= dataInicio && f.DataFim <= dataFim)
            .OrderByDescending(f => f.DataFaturamento)
            .ToListAsync();
    }

    public async Task<Faturamento> AddAsync(Faturamento faturamento)
    {
        _context.Faturamentos.Add(faturamento);
        await _context.SaveChangesAsync();
        return faturamento;
    }

    public async Task<Faturamento> UpdateAsync(Faturamento faturamento)
    {
        _context.Faturamentos.Update(faturamento);
        await _context.SaveChangesAsync();
        return faturamento;
    }

    public async Task<bool> DeleteAsync(Guid id)
    {
        var faturamento = await _context.Faturamentos.FindAsync(id);
        if (faturamento == null)
            return false;

        _context.Faturamentos.Remove(faturamento);
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<ItemFaturamento> AddItemAsync(ItemFaturamento item)
    {
        _context.ItensFaturamento.Add(item);
        await _context.SaveChangesAsync();
        return item;
    }

    public async Task<bool> ProfissionalExiste(Guid profissionalId)
    {
        return await _context.Profissional.AnyAsync(p => p.Id == profissionalId);
    }

    public async Task<bool> AgendamentoExiste(Guid agendamentoId)
    {
        return await _context.Agendamento.AnyAsync(a => a.Id == agendamentoId);
    }

    public async Task<Guid?> GetProfissionalIdByUserId(Guid userId)
    {
        return await _context.Profissional
            .Where(p => p.UserId == userId)
            .Select(p => (Guid?)p.Id)
            .FirstOrDefaultAsync();
    }
}
