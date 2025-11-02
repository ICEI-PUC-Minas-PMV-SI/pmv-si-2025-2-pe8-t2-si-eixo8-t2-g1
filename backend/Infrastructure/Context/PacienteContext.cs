using Domain.Entity;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Context;

public class PacienteContext(DbContextOptions<PacienteContext> options) : DbContext(options)
{
    public DbSet<Paciente> Pacientes { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        // Map entity to the table name produced by your migrations
        modelBuilder.Entity<Paciente>().ToTable("Paciente");

        base.OnModelCreating(modelBuilder);
    }
}
