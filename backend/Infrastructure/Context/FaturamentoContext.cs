using Domain.Entity;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Context;

public class FaturamentoContext : DbContext
{
    public FaturamentoContext(DbContextOptions<FaturamentoContext> options) : base(options) { }

    public DbSet<Faturamento> Faturamentos { get; set; }
    public DbSet<ItemFaturamento> ItensFaturamento { get; set; }
    
    public DbSet<Paciente> Paciente { get; set; }
    public DbSet<Perfil> Perfil { get; set; }
    public DbSet<Agendamento> Agendamento { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Faturamento>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.ValorTotal).HasPrecision(18, 2);
            entity.Property(e => e.DataFaturamento).IsRequired();
            entity.Property(e => e.DataInicio).IsRequired();
            entity.Property(e => e.DataFim).IsRequired();
            entity.Property(e => e.PerfilId).IsRequired(false);
            entity.Property(e => e.Status).IsRequired();

            entity.HasOne(e => e.Perfil)
                  .WithMany()
                  .HasForeignKey(e => e.PerfilId)
                  .OnDelete(DeleteBehavior.Restrict);

            entity.HasMany(e => e.Itens)
                  .WithOne(i => i.Faturamento)
                  .HasForeignKey(i => i.FaturamentoId)
                  .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<ItemFaturamento>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.ValorAtendimento).HasPrecision(18, 2);

            entity.HasOne(e => e.Agendamento)
                  .WithMany()
                  .HasForeignKey(e => e.AgendamentoId)
                  .OnDelete(DeleteBehavior.Restrict);
        });

        modelBuilder.Entity<Paciente>(entity =>
        {
            entity.ToTable("Paciente");
            entity.HasKey(e => e.Id);
            entity.Ignore(e => e.DataCriacao);
            entity.Ignore(e => e.DataAlteracao);
        });
        
        modelBuilder.Entity<Perfil>(entity =>
        {
            entity.ToTable("Perfil");
            entity.HasKey(e => e.Id);
            entity.Ignore(e => e.DataCriacao);
            entity.Ignore(e => e.DataAlteracao);
        });
        
        modelBuilder.Entity<Agendamento>(entity =>
        {
            entity.ToTable("Agendamento");
            entity.HasKey(e => e.Id);
            entity.Ignore(e => e.DataCriacao);
            entity.Ignore(e => e.DataAlteracao);
        });

        base.OnModelCreating(modelBuilder);
    }
}
