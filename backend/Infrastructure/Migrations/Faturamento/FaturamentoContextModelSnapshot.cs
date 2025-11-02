using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;
using Infrastructure.Context;

#nullable disable

namespace Infrastructure.Migrations.Faturamento
{
    [DbContext(typeof(FaturamentoContext))]
    [Migration("20251029161000_InitialFaturamento")]
    partial class InitialFaturamento
    {
        /// <inheritdoc />
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "8.0.0")
                .HasAnnotation("Relational:MaxIdentifierLength", 63);

            NpgsqlModelBuilderExtensions.UseIdentityByDefaultColumns(modelBuilder);

            modelBuilder.Entity("Domain.Entity.Agendamento", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uuid");

                    b.Property<DateTime>("DataHora")
                        .HasColumnType("timestamp with time zone");

                    b.Property<Guid>("PacienteId")
                        .HasColumnType("uuid");

                    b.Property<Guid>("ProfissionalId")
                        .HasColumnType("uuid");

                    b.Property<string>("Status")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<int>("TipoAtendimento")
                        .HasColumnType("integer");

                    b.Property<string>("Observacoes")
                        .IsRequired()
                        .HasColumnType("text");

                    b.HasKey("Id");

                    b.HasIndex("PacienteId");

                    b.HasIndex("ProfissionalId");

                    b.ToTable("Agendamento");
                });

            modelBuilder.Entity("Domain.Entity.Faturamento", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uuid");

                    b.Property<DateTime>("DataAlteracao")
                        .HasColumnType("timestamp with time zone");

                    b.Property<DateTime>("DataCriacao")
                        .HasColumnType("timestamp with time zone");

                    b.Property<DateTime>("DataFaturamento")
                        .HasColumnType("timestamp with time zone");

                    b.Property<DateTime>("DataFim")
                        .HasColumnType("timestamp with time zone");

                    b.Property<DateTime>("DataInicio")
                        .HasColumnType("timestamp with time zone");

                    b.Property<string>("Observacoes")
                        .HasColumnType("text");

                    b.Property<Guid?>("ProfissionalId")
                        .HasColumnType("uuid");

                    b.Property<int>("Status")
                        .HasColumnType("integer");

                    b.Property<int>("TotalAtendimentos")
                        .HasColumnType("integer");

                    b.Property<decimal>("ValorTotal")
                        .HasPrecision(18, 2)
                        .HasColumnType("numeric(18,2)");

                    b.HasKey("Id");

                    b.HasIndex("ProfissionalId");

                    b.ToTable("Faturamentos");
                });

            modelBuilder.Entity("Domain.Entity.ItemFaturamento", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uuid");

                    b.Property<Guid>("AgendamentoId")
                        .HasColumnType("uuid");

                    b.Property<DateTime>("DataAlteracao")
                        .HasColumnType("timestamp with time zone");

                    b.Property<DateTime>("DataCriacao")
                        .HasColumnType("timestamp with time zone");

                    b.Property<Guid>("FaturamentoId")
                        .HasColumnType("uuid");

                    b.Property<decimal>("ValorAtendimento")
                        .HasPrecision(18, 2)
                        .HasColumnType("numeric(18,2)");

                    b.HasKey("Id");

                    b.HasIndex("AgendamentoId");

                    b.HasIndex("FaturamentoId");

                    b.ToTable("ItensFaturamento");
                });

            modelBuilder.Entity("Domain.Entity.Paciente", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uuid");

                    b.Property<DateTime>("DataNascimento")
                        .HasColumnType("timestamp with time zone");

                    b.Property<string>("Email")
                        .HasColumnType("text");

                    b.Property<string>("NomeCompleto")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("Telefone")
                        .HasColumnType("text");

                    b.HasKey("Id");

                    b.ToTable("Paciente");
                });

            modelBuilder.Entity("Domain.Entity.Profissional", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uuid");

                    b.Property<string>("Especialidade")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("NomeCompleto")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("RegistroConselho")
                        .HasColumnType("text");

                    b.Property<Guid>("UserId")
                        .HasColumnType("uuid");

                    b.HasKey("Id");

                    b.HasIndex("UserId")
                        .IsUnique();

                    b.ToTable("Profissional");
                });

            modelBuilder.Entity("Domain.Entity.Faturamento", b =>
                {
                    b.HasOne("Domain.Entity.Profissional", "Profissional")
                        .WithMany()
                        .HasForeignKey("ProfissionalId")
                        .OnDelete(DeleteBehavior.Restrict);

                    b.Navigation("Profissional");
                });

            modelBuilder.Entity("Domain.Entity.ItemFaturamento", b =>
                {
                    b.HasOne("Domain.Entity.Agendamento", "Agendamento")
                        .WithMany()
                        .HasForeignKey("AgendamentoId")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();

                    b.HasOne("Domain.Entity.Faturamento", "Faturamento")
                        .WithMany("Itens")
                        .HasForeignKey("FaturamentoId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Agendamento");

                    b.Navigation("Faturamento");
                });

            modelBuilder.Entity("Domain.Entity.Faturamento", b =>
                {
                    b.Navigation("Itens");
                });
#pragma warning restore 612, 618
        }
    }
}
