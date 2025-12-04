using Application.Mappers;
using Domain.Dtos.Agendamento;
using Domain.Dtos.Faturamento;
using Domain.Entity;
using Domain.Interfaces.Repositorys;
using Domain.Interfaces.Services;
using Domain.Utils.Enums;
using Infrastructure.Context;
using Microsoft.EntityFrameworkCore;

namespace Application.Services.Faturamento;

public class FaturamentoService : IFaturamentoService
{
    private readonly IFaturamentoRepository _faturamentoRepository;
    private readonly AgendamentoContext _agendamentoContext;

    public FaturamentoService(IFaturamentoRepository faturamentoRepository, AgendamentoContext agendamentoContext)
    {
        _faturamentoRepository = faturamentoRepository;
        _agendamentoContext = agendamentoContext;
    }

    public async Task<FaturamentoDto?> Get(Guid id)
    {
        var faturamento = await _faturamentoRepository.GetByIdAsync(id);
        return faturamento?.ToDto();
    }

    public async Task<IEnumerable<FaturamentoDto>> GetAll()
    {
        var faturamentos = await _faturamentoRepository.GetAllAsync();
        return faturamentos.Select(f => f.ToDto());
    }

    public async Task<IEnumerable<FaturamentoDto>> GetByPerfilId(Guid perfilId)
    {
        var faturamentos = await _faturamentoRepository.GetByPerfilIdAsync(perfilId);
        return faturamentos.Select(f => f.ToDto());
    }

    public async Task<IEnumerable<FaturamentoDto>> GetByPeriodo(DateTime dataInicio, DateTime dataFim)
    {
        var faturamentos = await _faturamentoRepository.GetByPeriodoAsync(dataInicio, dataFim);
        return faturamentos.Select(f => f.ToDto());
    }

    public async Task<FaturamentoDto?> Post(FaturamentoDto faturamentoDto)
    {
        var faturamento = faturamentoDto.ToEntity();
        var result = await _faturamentoRepository.AddAsync(faturamento);
        return result.ToDto();
    }

    public async Task<FaturamentoDto?> Put(FaturamentoDto faturamentoDto)
    {
        var faturamento = faturamentoDto.ToEntity();
        var result = await _faturamentoRepository.UpdateAsync(faturamento);
        return result.ToDto();
    }

    public async Task<bool> Delete(Guid id)
    {
        return await _faturamentoRepository.DeleteAsync(id);
    }

    public async Task<FaturamentoDto?> GerarFaturamentoPorPeriodo(CriarFaturamentoDto criarFaturamentoDto)
    {
        var query = _agendamentoContext.Agendamentos
            .Include(a => a.Paciente)
            .Include(a => a.Perfil)
            .Where(a => a.DataHora >= criarFaturamentoDto.DataInicio &&
                       a.DataHora <= criarFaturamentoDto.DataFim &&
                       a.Status == "Realizado");

        if (criarFaturamentoDto.PerfilId.HasValue)
        {
            query = query.Where(a => a.PerfilId == criarFaturamentoDto.PerfilId.Value);
        }

        var agendamentos = await query.ToListAsync();

        if (!agendamentos.Any())
            return null;

        var valorTotal = agendamentos.Count * criarFaturamentoDto.ValorPorAtendimento;

        var faturamento = new Domain.Entity.Faturamento(
            DateTime.UtcNow,
            criarFaturamentoDto.DataInicio,
            criarFaturamentoDto.DataFim,
            valorTotal,
            agendamentos.Count,
            EnumStatusFaturamento.Rascunho,
            criarFaturamentoDto.PerfilId,
            criarFaturamentoDto.Observacoes
        );

        var faturamentoSalvo = await _faturamentoRepository.AddAsync(faturamento);

        foreach (var agendamento in agendamentos)
        {
            var item = new ItemFaturamento(faturamentoSalvo.Id, agendamento.Id, criarFaturamentoDto.ValorPorAtendimento);
            faturamentoSalvo.Itens.Add(item);
        }

        await _faturamentoRepository.UpdateAsync(faturamentoSalvo);

        return faturamentoSalvo.ToDto();
    }

    public async Task<FaturamentoDto?> EmitirFaturamento(Guid faturamentoId)
    {
        var faturamento = await _faturamentoRepository.GetByIdAsync(faturamentoId);
        if (faturamento == null || faturamento.Status != EnumStatusFaturamento.Rascunho)
            return null;

        faturamento.Status = EnumStatusFaturamento.Emitido;
        var result = await _faturamentoRepository.UpdateAsync(faturamento);
        return result.ToDto();
    }

    public async Task<FaturamentoDto?> CancelarFaturamento(Guid faturamentoId)
    {
        var faturamento = await _faturamentoRepository.GetByIdAsync(faturamentoId);
        if (faturamento == null || faturamento.Status == EnumStatusFaturamento.Pago)
            return null;

        faturamento.Status = EnumStatusFaturamento.Cancelado;
        var result = await _faturamentoRepository.UpdateAsync(faturamento);
        return result.ToDto();
    }

    public async Task<FaturamentoDto> CriarFaturamentoAvulso(CriarFaturamentoAvulsoDto faturamentoAvulso)
    {
        if (faturamentoAvulso.PerfilId.HasValue)
        {
            var profissionalExiste = await _faturamentoRepository.PerfilExiste(faturamentoAvulso.PerfilId.Value);
            if (!profissionalExiste)
            {
                throw new ArgumentException($"Perfil com ID {faturamentoAvulso.PerfilId} não encontrado.");
            }
        }

        var faturamento = new Domain.Entity.Faturamento(
            faturamentoAvulso.Data,
            faturamentoAvulso.Data,
            faturamentoAvulso.Data,
            faturamentoAvulso.Valor,
            1,
            EnumStatusFaturamento.Rascunho,
            faturamentoAvulso.PerfilId,
            faturamentoAvulso.Observacoes
        );

        var faturamentoSalvo = await _faturamentoRepository.AddAsync(faturamento);

        if (faturamentoAvulso.AgendamentoId != Guid.Empty)
        {
            var agendamentoExiste = await _faturamentoRepository.AgendamentoExiste(faturamentoAvulso.AgendamentoId);
            if (!agendamentoExiste)
            {
                throw new ArgumentException($"Agendamento com ID {faturamentoAvulso.AgendamentoId} não encontrado.");
            }

        var itemFaturamento = new ItemFaturamento(
            faturamentoSalvo.Id,
            faturamentoAvulso.AgendamentoId,
            faturamentoAvulso.Valor
        );

        await _faturamentoRepository.AddItemAsync(itemFaturamento);
        }

        return faturamentoSalvo.ToDto();
    }
}
