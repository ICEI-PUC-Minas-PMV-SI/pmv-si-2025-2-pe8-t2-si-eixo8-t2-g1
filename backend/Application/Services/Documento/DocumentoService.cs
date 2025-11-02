using Application.Mappers;
using Domain.Dtos.Documento;
using Domain.Interfaces.Services;
using Infrastructure.Context;
using Microsoft.EntityFrameworkCore;

namespace Application.Services.Documento;

public class DocumentoService : IDocumentoService
{
    private readonly DocumentoContext _context;

    public DocumentoService(DocumentoContext context)
    {
        _context = context;
    }

    public async Task<bool> Delete(Guid id)
    {
        var documento = await _context.Documentos.SingleOrDefaultAsync(d => d.Id == id);
        if (documento == null)
        {
            return false;
        }

        _context.Documentos.Remove(documento);
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<DocumentoDto?> Get(Guid id)
    {
        var documento = await _context.Documentos.SingleOrDefaultAsync(d => d.Id == id);
        return documento?.ToDto();
    }

    public async Task<IEnumerable<DocumentoDto>> GetAll()
    {
        var documentos = await _context.Documentos.ToListAsync();
        return documentos.Select(d => d.ToDto()!);
    }

    public async Task<IEnumerable<DocumentoDto>> GetByPacienteId(Guid pacienteId)
    {
        var documentos = await _context.Documentos
                                        .Where(d => d.PacienteId == pacienteId)
                                        .ToListAsync();
        return documentos.Select(d => d.ToDto()!);
    }

    public async Task<DocumentoDto?> Post(DocumentoDto documentoDto)
    {
        var documento = documentoDto.ToEntity();
        if (documento == null) return null;

        _context.Documentos.Add(documento);
        await _context.SaveChangesAsync();
        return documento.ToDto();
    }

    public async Task<DocumentoDto?> Put(DocumentoDto documentoDto)
    {
        var result = await _context.Documentos.SingleOrDefaultAsync(d => d.Id == documentoDto.Id);
        if (result == null)
        {
            return null;
        }

        result.Tipo = documentoDto.Tipo;
        result.Titulo = documentoDto.Titulo;
        result.Conteudo = documentoDto.Conteudo;
        result.AtualizarDataAlteracao();

        _context.Documentos.Update(result);
        await _context.SaveChangesAsync();
        return result.ToDto();
    }
}
