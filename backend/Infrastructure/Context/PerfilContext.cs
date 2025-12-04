using Domain.Entity;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Context;

public class PerfilContext(DbContextOptions<PerfilContext> options) : DbContext(options)
{
    public DbSet<Perfil> Perfil { get; set; }
}
