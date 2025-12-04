using Application.Services.Agendamento;
using Application.Services.Autenticacao;
using Application.Services.Documento;
using Application.Services.Email;
using Application.Services.Faturamento;
using Application.Services.Paciente;
using Application.Services.Perfil;
using Domain.Interfaces.Repositorys;
using Domain.Interfaces.Services;
using Infrastructure.Context;
using Infrastructure.Repositorys;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace Infrastructure.DI;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddAplicationServices(this IServiceCollection services, IConfiguration configuration)
    {
        var connectionString = configuration.GetConnectionString("AgendamentoTODatabase");
        var smtpSettings = configuration.GetSection("SmtpSettings");

        services.AddScoped<IAuthService, AutenticacaoService>();
        services.AddTransient<IEmailService, EmailService>();
        services.AddScoped<IPacienteService, PacienteService>();
        // register Perfil service (aliasing to existing IPerfilService for compatibility)
        // register PerfilService as the implementation for IPerfilService and IPerfilService
        // services.AddScoped<IPerfilService, PerfilService>();
        services.AddScoped<IPerfilService, PerfilService>();
        services.AddScoped<IDocumentoService, DocumentoService>();
        services.AddScoped<IAgendamentoService, AgendamentoService>();
        services.AddScoped<IFaturamentoService, FaturamentoService>();

        return services;
    }
}
