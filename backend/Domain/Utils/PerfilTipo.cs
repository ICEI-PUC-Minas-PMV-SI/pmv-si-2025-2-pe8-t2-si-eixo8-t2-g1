using System.ComponentModel;

namespace Domain.Utils;

public enum PerfilTipo
{
    [Description("rst-pswd")]
    RstPswd,

    [Description("default")]
    Default,

    [Description("pro")]
    Profissional,

    [Description("ger")]
    Gerencial
}
