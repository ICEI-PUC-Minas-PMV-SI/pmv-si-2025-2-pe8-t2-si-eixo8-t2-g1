using Domain.Entity;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Context;

public class ProfissionalContext(DbContextOptions<ProfissionalContext> options) : DbContext(options)
{
    public DbSet<Profissional> Profissionais { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Profissional>().ToTable("Profissional");

        base.OnModelCreating(modelBuilder);
    }
}