using Domain.Interfaces.Services;
using MailKit.Net.Smtp;
using MailKit.Security;
using Microsoft.Extensions.Configuration;
using MimeKit;

namespace Application.Services.Email;

public class EmailService(IConfiguration config) : IEmailService
{
    private readonly IConfiguration _config = config;

    public async Task<bool> SendPasswordResetEmailAsync(string toEmail, string token)
    {
        // Construa o link de redefinição
        // ATENÇÃO: A URL base deve ser a do seu front-end
        var resetLink = $"https://sua-aplicacao.com/reset-password?token={Uri.EscapeDataString(token)}";

        var email = new MimeMessage();
        email.From.Add(MailboxAddress.Parse(_config.GetSection("SmtpSettings:Username").Value));
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
        if(!int.TryParse(_config.GetSection("SmtpSettings:Port").Value, out var port))
        {
            return false;
        };

        var server = _config.GetSection("SmtpSettings:Server").Value;
        using var smtp = new SmtpClient();
        await smtp.ConnectAsync(
            server,
            port,
            SecureSocketOptions.StartTls
        );

        await smtp.AuthenticateAsync(
            _config.GetSection("SmtpSettings:Username").Value,
            _config.GetSection("SmtpSettings:Password").Value
        );

        await smtp.SendAsync(email);
        await smtp.DisconnectAsync(true);

        return true;
    }
}
