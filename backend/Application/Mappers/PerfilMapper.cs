using Domain.Dtos.Perfil;
using Domain.Entity;

namespace Application.Mappers;

public static class PerfilMapper
{
    public static PerfilDto? ToDto(this Perfil perfil)
    {
        if (perfil is null)
            return null;

        return new PerfilDto
        {
            Id = perfil.Id,
            NomeCompleto = perfil.NomeCompleto,
            Tipo = perfil.Tipo,
            RegistroConselho = perfil.RegistroConselho,
            UserId = perfil.UserId
        };
    }

    public static Perfil? ToEntity(this PerfilDto perfilDto)
    {
        if (perfilDto is null)
            return null;

        var entity = new Perfil(
            perfilDto.NomeCompleto,
            perfilDto.Tipo,
            perfilDto.UserId,
            perfilDto.Especialidade,
            perfilDto.RegistroConselho);

        if (perfilDto.Id != System.Guid.Empty)
        {
            entity.Id = perfilDto.Id;
        }

        return entity;
    }
}
