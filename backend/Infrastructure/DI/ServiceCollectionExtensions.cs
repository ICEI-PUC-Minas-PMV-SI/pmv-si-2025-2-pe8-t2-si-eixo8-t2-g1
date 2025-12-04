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
    public static IServiceCollection AddRepositories(this IServiceCollection services, IConfiguration configuration)
    {
        var connectionString = configuration.GetConnectionString("AgendamentoTODatabase");

        services.AddDbContext<AgendamentoContext>(options =>
            options.UseNpgsql(connectionString));
        services.AddDbContext<DocumentoContext>(options =>
            options.UseNpgsql(connectionString));
        services.AddDbContext<PacienteContext>(options =>
            options.UseNpgsql(connectionString));
        services.AddDbContext<UserContext>(options =>
            options.UseNpgsql(connectionString));
        services.AddDbContext<PerfilContext>(options =>
            options.UseNpgsql(connectionString));
        services.AddDbContext<FaturamentoContext>(options =>
            options.UseNpgsql(connectionString));

        services.AddScoped<IFaturamentoRepository, FaturamentoRepository>();

        return services;
    }
}
