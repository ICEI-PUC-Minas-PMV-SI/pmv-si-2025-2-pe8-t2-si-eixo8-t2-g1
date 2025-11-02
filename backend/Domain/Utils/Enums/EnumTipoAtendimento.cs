using System.ComponentModel;

namespace Domain.Utils.Enums;

public enum EnumTipoAtendimento
{
    [Description("Visita Tecnica em escolas e residências.")]
    Visita,
    [Description("Primeira sessão para avaliar o tratamento.")]
    Anamnese,
    [Description("Atendimento fora da clinica")]
    AtendimentoExterno,
    [Description("Sessão de Terapia realizada na clinica.")]
    SessaoTerapia,
    [Description("'Reunião realizada com os responsaveis.")]
    Reuniao,
}
