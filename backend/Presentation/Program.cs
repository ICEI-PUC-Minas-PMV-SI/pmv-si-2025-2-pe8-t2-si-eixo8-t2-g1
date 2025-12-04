using Infrastructure.DI;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Domain.Utils;
using System.Reflection;
using Application.Services.Autenticacao;
using Application.Services.Email;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddAplicationServices(builder.Configuration);

builder.Services.AddRepositories(builder.Configuration);

// Bind settings sections to POCOs for injection via IOptions<T>
builder.Services.Configure<TokenSettings>(builder.Configuration.GetSection("TokenSettings"));
builder.Services.Configure<SmtpSettings>(builder.Configuration.GetSection("SmtpSettings"));

#if DEBUG
builder.Services.AddCors(options =>
{
    options.AddPolicy(name: "AllowedOrigins",
                      policy =>
                      {
                          policy.AllowAnyOrigin()
                                .AllowAnyHeader()
                                .AllowAnyMethod();
                      });
});
#else
builder.Services.AddCors(options =>
{
        options.AddPolicy(name: "AllowedOrigins",
                      policy =>
                      {
                          policy.WithOrigins("https://health-scheduler.com.br")
                                .AllowAnyHeader()
                                .AllowAnyMethod()
                                .AllowCredentials();
                      });
});
#endif

// Load TokenSettings from configuration to use for JWT setup
var tokenSettings = builder.Configuration.GetSection("TokenSettings").Get<TokenSettings>()
    ?? throw new InvalidOperationException("TokenSettings section is missing in configuration.");

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidIssuer = tokenSettings.Issuer,
            ValidateAudience = true,
            ValidAudience = tokenSettings.Audience,
            ValidateLifetime = true,
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(tokenSettings.Token)),
            ValidateIssuerSigningKey = true
        };
    });

// Register authorization policies using enum descriptions
var pro = EnumHelper.GetDescription(Roles.Profissional);
var ger = EnumHelper.GetDescription(Roles.Gerencial);
var rst = EnumHelper.GetDescription(Roles.RstPswd);
var def = EnumHelper.GetDescription(Roles.Default);

builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("LoggedUser", p => p.RequireRole(pro, ger, def));
    options.AddPolicy("ProOrGer", p => p.RequireRole(pro, ger));
    options.AddPolicy("Def", p => p.RequireRole(def));
    options.AddPolicy("ProOnly", p => p.RequireRole(pro));
    options.AddPolicy("GerOnly", p => p.RequireRole(ger));
    options.AddPolicy("ResetPasswordRole", p => p.RequireRole(rst));
    options.AddPolicy("CreateProfile", p => p.RequireRole(def, ger));
});

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    var xmlFile = $"{Assembly.GetExecutingAssembly().GetName().Name}.xml";
    var xmlPath = Path.Combine(AppContext.BaseDirectory, xmlFile);
    c.IncludeXmlComments(xmlPath);

    c.SwaggerDoc("v1", new Microsoft.OpenApi.Models.OpenApiInfo
    {
        Title = "API Clínica TO",
        Version = "v1",
        Description = "API para gerenciamento de clínica",

    });


    c.AddSecurityDefinition("Bearer", new Microsoft.OpenApi.Models.OpenApiSecurityScheme
    {
        Description = "JWT Authorization header usando o esquema Bearer. Exemplo: \"Authorization: Bearer {token}\"",
        Name = "Authorization",
        In = Microsoft.OpenApi.Models.ParameterLocation.Header,
        Type = Microsoft.OpenApi.Models.SecuritySchemeType.ApiKey,
        Scheme = "Bearer"
    });

    c.AddSecurityRequirement(new Microsoft.OpenApi.Models.OpenApiSecurityRequirement
    {
        {
            new Microsoft.OpenApi.Models.OpenApiSecurityScheme
            {
                Reference = new Microsoft.OpenApi.Models.OpenApiReference
                {
                    Type = Microsoft.OpenApi.Models.ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
});

builder.Services.AddControllers();

var app = builder.Build();

app.UseSwagger(c =>
{
    c.RouteTemplate = "swagger/{documentName}/swagger.json";
});

app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "Minha API V1");
    c.RoutePrefix = "swagger";
});

app.UseRouting();

app.UseCors("AllowedOrigins");

app.UseAuthentication();

app.UseAuthorization();

app.MapControllers();

app.Run();
