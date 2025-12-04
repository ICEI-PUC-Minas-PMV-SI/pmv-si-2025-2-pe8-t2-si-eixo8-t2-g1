using Domain.Interfaces.Services;
using MailKit.Net.Smtp;
using MailKit.Security;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Options;
using MimeKit;

namespace Application.Services.Email;

public class EmailService : IEmailService
{
    private readonly SmtpSettings _settings;

    public EmailService(IOptions<SmtpSettings> options)
    {
        _settings = options.Value;
    }

    public async Task<bool> SendPasswordResetEmailAsync(string toEmail, string token)
    {
        // Construa o link de redefinição
        // ATENÇÃO: A URL base deve ser a do seu front-end
        var resetLink = $"https://health-scheduler.com.br/reset-password?token={Uri.EscapeDataString(token)}";

        var email = new MimeMessage();
        email.From.Add(MailboxAddress.Parse(_settings.Username));
        email.To.Add(MailboxAddress.Parse(toEmail));
        email.Subject = "Redefinição de Senha";

        // Corpo do e-mail em HTML para um link clicável
        email.Body = new TextPart("html")
        {
            Text = $@"<p>Olá,</p>
               <p>Recebemos uma solicitação para redefinir sua senha. Por favor, clique no link abaixo para criar uma nova senha:</p>
               <a href='{resetLink}'>Redefinir Minha Senha</a>
               <p>Se você não solicitou essa alteração, por favor, ignore este e-mail.</p>
               <p>O link expirará em 15 minutos.</p>"
        };
        if(!int.TryParse(_settings.Port, out var port))
        {
            return false;
        };

        var server = _settings.Server;
        using var smtp = new SmtpClient();
        await smtp.ConnectAsync(
            server,
            port,
            SecureSocketOptions.StartTls
        );

        await smtp.AuthenticateAsync(
            _settings.Username,
            _settings.Password
        );

        await smtp.SendAsync(email);
        await smtp.DisconnectAsync(true);

        return true;
    }
}
