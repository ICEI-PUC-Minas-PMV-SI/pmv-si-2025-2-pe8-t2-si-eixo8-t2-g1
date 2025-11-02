using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Migrations.Faturamento
{
    /// <inheritdoc />
    public partial class InitialFaturamento : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Faturamentos",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    DataFaturamento = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    DataInicio = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    DataFim = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    ProfissionalId = table.Column<Guid>(type: "uuid", nullable: true),
                    ValorTotal = table.Column<decimal>(type: "numeric(18,2)", precision: 18, scale: 2, nullable: false),
                    TotalAtendimentos = table.Column<int>(type: "integer", nullable: false),
                    Status = table.Column<int>(type: "integer", nullable: false),
                    Observacoes = table.Column<string>(type: "text", nullable: true),
                    DataCriacao = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    DataAlteracao = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Faturamentos", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Faturamentos_Profissional_ProfissionalId",
                        column: x => x.ProfissionalId,
                        principalTable: "Profissional",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "ItensFaturamento",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    FaturamentoId = table.Column<Guid>(type: "uuid", nullable: false),
                    AgendamentoId = table.Column<Guid>(type: "uuid", nullable: false),
                    ValorAtendimento = table.Column<decimal>(type: "numeric(18,2)", precision: 18, scale: 2, nullable: false),
                    DataCriacao = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    DataAlteracao = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ItensFaturamento", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ItensFaturamento_Agendamento_AgendamentoId",
                        column: x => x.AgendamentoId,
                        principalTable: "Agendamento",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_ItensFaturamento_Faturamentos_FaturamentoId",
                        column: x => x.FaturamentoId,
                        principalTable: "Faturamentos",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Faturamentos_ProfissionalId",
                table: "Faturamentos",
                column: "ProfissionalId");

            migrationBuilder.CreateIndex(
                name: "IX_ItensFaturamento_AgendamentoId",
                table: "ItensFaturamento",
                column: "AgendamentoId");

            migrationBuilder.CreateIndex(
                name: "IX_ItensFaturamento_FaturamentoId",
                table: "ItensFaturamento",
                column: "FaturamentoId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ItensFaturamento");

            migrationBuilder.DropTable(
                name: "Faturamentos");
        }
    }
}
