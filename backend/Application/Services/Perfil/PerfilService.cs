using Application.Mappers;
using Domain.Dtos.Perfil;
using Domain.Interfaces.Services;
using Domain.Utils;
using Infrastructure.Context;
using Microsoft.EntityFrameworkCore;

namespace Application.Services.Perfil;

public class PerfilService : IPerfilService
{
    private readonly PerfilContext _context;
    private readonly UserContext _userContext;

    public PerfilService(PerfilContext context, UserContext userContext)
    {
        _context = context;
        _userContext = userContext;
    }

    public async Task<bool> Delete(Guid id)
    {
        var perfil = await _context.Perfil.SingleOrDefaultAsync(p => p.Id == id);
        if (perfil == null)
        {
            return false;
        }

        _context.Perfil.Remove(perfil);
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<PerfilDto?> Get(Guid id)
    {
        var perfil = await _context.Perfil.SingleOrDefaultAsync(p => p.Id == id);
        return perfil?.ToDto();
    }

    public async Task<PerfilDto?> GetByUserId(Guid userId)
    {
        var perfil = await _context.Perfil.SingleOrDefaultAsync(p => p.UserId == userId);
        return perfil?.ToDto();
    }

    public async Task<IEnumerable<PerfilDto>> GetAll()
    {
        var perfis = await _context.Perfil.ToListAsync();
        return perfis.Select(p => p.ToDto()!);
    }

    public async Task<PerfilDto?> Post(PerfilDto perfilDto)
    {
        var perfil = perfilDto.ToEntity();
        if (perfil == null) return null;

        _context.Perfil.Add(perfil);
        await _context.SaveChangesAsync();

        // After successfully creating the perfil, update the related user's Role based on perfilDto.Tipo
        try
        {
            var user = await _userContext.Users.SingleOrDefaultAsync(u => u.Id == perfil.UserId);
            if (user != null)
            {
                var mappedRole = EnumHelper.GetDescriptionFromString<Roles>(perfilDto.Tipo);
                user.Role = mappedRole ?? Roles.Default.ToString();
                _userContext.Users.Update(user);
                await _userContext.SaveChangesAsync();
            }
        }
        catch
        {
            // swallow exceptions from user update to avoid failing perfil creation
        }

        return perfil.ToDto();
    }

    public async Task<PerfilDto?> Put(PerfilDto perfilDto)
    {
        var result = await _context.Perfil.SingleOrDefaultAsync(p => p.Id == perfilDto.Id);
        if (result == null)
        {
            return null;
        }
        result.NomeCompleto = perfilDto.NomeCompleto;
        result.Tipo = perfilDto.Tipo;
        result.RegistroConselho = perfilDto.RegistroConselho;
        result.UserId = perfilDto.UserId;
        result.AtualizarDataAlteracao();

        _context.Perfil.Update(result);
        await _context.SaveChangesAsync();
        return result.ToDto();
    }
}
