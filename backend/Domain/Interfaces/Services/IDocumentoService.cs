using Domain.Dtos.Documento;

namespace Domain.Interfaces.Services;

public interface IDocumentoService
{
    Task<DocumentoDto?> Get(Guid id);
    Task<IEnumerable<DocumentoDto>> GetAll();
    Task<IEnumerable<DocumentoDto>> GetByPacienteId(Guid pacienteId);
    Task<DocumentoDto?> Post(DocumentoDto documento);
    Task<DocumentoDto?> Put(DocumentoDto documento);
    Task<bool> Delete(Guid id);
}
