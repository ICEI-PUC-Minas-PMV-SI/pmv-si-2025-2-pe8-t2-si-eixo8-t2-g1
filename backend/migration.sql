CREATE TABLE IF NOT EXISTS "__EFMigrationsHistory" (
    "MigrationId" character varying(150) NOT NULL,
    "ProductVersion" character varying(32) NOT NULL,
    CONSTRAINT "PK___EFMigrationsHistory" PRIMARY KEY ("MigrationId")
);

START TRANSACTION;

CREATE TABLE "Faturamentos" (
    "Id" uuid NOT NULL,
    "DataFaturamento" timestamp with time zone NOT NULL,
    "DataInicio" timestamp with time zone NOT NULL,
    "DataFim" timestamp with time zone NOT NULL,
    "ProfissionalId" uuid,
    "ValorTotal" numeric(18,2) NOT NULL,
    "TotalAtendimentos" integer NOT NULL,
    "Status" integer NOT NULL,
    "Observacoes" text,
    "DataCriacao" timestamp with time zone NOT NULL,
    "DataAlteracao" timestamp with time zone,
    CONSTRAINT "PK_Faturamentos" PRIMARY KEY ("Id"),
    CONSTRAINT "FK_Faturamentos_Profissional_ProfissionalId" FOREIGN KEY ("ProfissionalId") REFERENCES "Profissional" ("Id") ON DELETE RESTRICT
);

CREATE TABLE "ItensFaturamento" (
    "Id" uuid NOT NULL,
    "FaturamentoId" uuid NOT NULL,
    "AgendamentoId" uuid NOT NULL,
    "ValorAtendimento" numeric(18,2) NOT NULL,
    "DataCriacao" timestamp with time zone NOT NULL,
    "DataAlteracao" timestamp with time zone,
    CONSTRAINT "PK_ItensFaturamento" PRIMARY KEY ("Id"),
    CONSTRAINT "FK_ItensFaturamento_Agendamento_AgendamentoId" FOREIGN KEY ("AgendamentoId") REFERENCES "Agendamento" ("Id") ON DELETE RESTRICT,
    CONSTRAINT "FK_ItensFaturamento_Faturamentos_FaturamentoId" FOREIGN KEY ("FaturamentoId") REFERENCES "Faturamentos" ("Id") ON DELETE CASCADE
);

CREATE INDEX "IX_Faturamentos_ProfissionalId" ON "Faturamentos" ("ProfissionalId");

CREATE INDEX "IX_ItensFaturamento_AgendamentoId" ON "ItensFaturamento" ("AgendamentoId");

CREATE INDEX "IX_ItensFaturamento_FaturamentoId" ON "ItensFaturamento" ("FaturamentoId");

INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion")
VALUES ('20251029161000_InitialFaturamento', '8.0.10');

COMMIT;

