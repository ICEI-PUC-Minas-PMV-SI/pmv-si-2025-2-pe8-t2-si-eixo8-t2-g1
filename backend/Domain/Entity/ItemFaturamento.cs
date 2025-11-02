using Domain.Utils.Enums;

namespace Domain.Entity;

public class ItemFaturamento : BaseEntity
{
    public Guid FaturamentoId { get; set; }
    public virtual Faturamento Faturamento { get; set; } = null!;
    public Guid AgendamentoId { get; set; }
    public virtual Agendamento Agendamento { get; set; } = null!;
    public decimal ValorAtendimento { get; set; }

    public ItemFaturamento(Guid faturamentoId, Guid agendamentoId, decimal valorAtendimento)
    {
        FaturamentoId = faturamentoId;
        AgendamentoId = agendamentoId;
        ValorAtendimento = valorAtendimento;
        AtualizarDataAlteracao();
    }
}
