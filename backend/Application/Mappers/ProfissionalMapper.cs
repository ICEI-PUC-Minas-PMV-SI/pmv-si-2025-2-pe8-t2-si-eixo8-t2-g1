using Domain.Dtos.Profissional;
using Domain.Entity;

namespace Application.Mappers;

public static class ProfissionalMapper
{
    public static ProfissionalDto? ToDto(this Profissional profissional)
    {
        if (profissional is null)
            return null;

        return new ProfissionalDto
        {
            Id = profissional.Id,
            NomeCompleto = profissional.NomeCompleto,
            Especialidade = profissional.Especialidade,
            RegistroConselho = profissional.RegistroConselho,
            UserId = profissional.UserId
        };
    }

    public static Profissional? ToEntity(this ProfissionalDto profissionalDto)
    {
        if (profissionalDto is null)
            return null;

        var entity = new Profissional(
            profissionalDto.NomeCompleto,
            profissionalDto.Especialidade,
            profissionalDto.UserId,
            profissionalDto.RegistroConselho);

        if (profissionalDto.Id != System.Guid.Empty)
        {
            entity.Id = profissionalDto.Id;
        }

        return entity;
    }
}
