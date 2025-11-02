using Application.Mappers;
using Domain.Dtos.Paciente;
using Domain.Interfaces.Services;
using Infrastructure.Context;
using Microsoft.EntityFrameworkCore;

namespace Application.Services.Paciente
{
    public class PacienteService : IPacienteService
    {
        private readonly PacienteContext _context;

        public PacienteService(PacienteContext context)
        {
            _context = context;
        }

        public async Task<bool> Delete(Guid id)
        {
            var paciente = await _context.Pacientes.SingleOrDefaultAsync(p => p.Id == id);
            if (paciente == null)
            {
                return false;
            }

            _context.Pacientes.Remove(paciente);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<PacienteDto?> Get(Guid id)
        {
            var paciente = await _context.Pacientes.SingleOrDefaultAsync(p => p.Id == id);
            return paciente == null ? null : paciente.ToDto();
        }

        public async Task<IEnumerable<PacienteDto?>> GetAll()
        {
            var pacientes = await _context.Pacientes.ToListAsync();
            return pacientes.Select(p => p.ToDto());
        }

        public async Task<PacienteDto?> Post(PacienteDto pacienteDto)
        {
            var paciente = pacienteDto.ToEntity();

            _context.Pacientes.Add(paciente);
            await _context.SaveChangesAsync();

            return paciente.ToDto();
        }

        public async Task<PacienteDto?> Put(PacienteDto pacienteDto)
        {
            var result = await _context.Pacientes.SingleOrDefaultAsync(p => p.Id == pacienteDto.Id);
            if (result == null)
            {
                return null;
            }

            result.NomeCompleto = pacienteDto.NomeCompleto;
            result.DataNascimento = pacienteDto.DataNascimento;
            result.Telefone = pacienteDto.Telefone;
            result.Email = pacienteDto.Email;
            result.AtualizarDataAlteracao();

            _context.Pacientes.Update(result);
            await _context.SaveChangesAsync();

            return result.ToDto();
        }
    }
}
