using Domain.Entity;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Context;

public class AgendamentoContext(DbContextOptions<AgendamentoContext> options) : DbContext(options)
{
    public DbSet<Agendamento> Agendamentos { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        // Map entity to the table name produced by your migrations
        modelBuilder.Entity<Agendamento>().ToTable("Agendamento");

        base.OnModelCreating(modelBuilder);
    }
}
