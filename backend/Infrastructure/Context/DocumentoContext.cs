using Domain.Entity;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Context;

public class DocumentoContext(DbContextOptions<DocumentoContext> options) : DbContext(options)
{
    public DbSet<Documento> Documentos { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        // Map entity to the table name produced by your migrations
        modelBuilder.Entity<Documento>().ToTable("Documento");

        base.OnModelCreating(modelBuilder);
    }
}
