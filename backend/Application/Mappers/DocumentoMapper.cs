using Domain.Dtos.Documento;
using Domain.Entity;

namespace Application.Mappers;

public static class DocumentoMapper
{
    public static DocumentoDto? ToDto(this Documento documento)
    {
        if (documento is null)
            return null;

        return new DocumentoDto
        {
            Id = documento.Id,
            Tipo = documento.Tipo,
            Titulo = documento.Titulo,
            Conteudo = documento.Conteudo,
            PacienteId = documento.PacienteId,
        };
    }

    public static Documento? ToEntity(this DocumentoDto documentoDto)
    {
        if (documentoDto is null)
            return null;

        var entity = new Documento(
            documentoDto.Tipo,
            documentoDto.Titulo,
            documentoDto.Conteudo,
            documentoDto.PacienteId);

        if (documentoDto.Id != System.Guid.Empty)
            entity.Id = documentoDto.Id;
        
        return entity;
    }
}
