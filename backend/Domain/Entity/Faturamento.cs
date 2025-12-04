using Domain.Utils.Enums;

namespace Domain.Entity;

public class Faturamento : BaseEntity
{
    public DateTime DataFaturamento { get; set; }
    public DateTime DataInicio { get; set; }
    public DateTime DataFim { get; set; }
    public Guid? PerfilId { get; set; }
    public virtual Perfil? Perfil { get; set; }
    public decimal ValorTotal { get; set; }
    public int TotalAtendimentos { get; set; }
    public EnumStatusFaturamento Status { get; set; }
    public string? Observacoes { get; set; }
    public virtual ICollection<ItemFaturamento> Itens { get; set; } = new List<ItemFaturamento>();

    public Faturamento(DateTime dataFaturamento, DateTime dataInicio, DateTime dataFim, 
                      decimal valorTotal, int totalAtendimentos, 
                      EnumStatusFaturamento status, Guid? perfilId = null, string? observacoes = null)
    {
        DataFaturamento = dataFaturamento;
        DataInicio = dataInicio;
        DataFim = dataFim;
        PerfilId = perfilId;
        ValorTotal = valorTotal;
        TotalAtendimentos = totalAtendimentos;
        Status = status;
        Observacoes = observacoes;
        AtualizarDataAlteracao();
    }
}
