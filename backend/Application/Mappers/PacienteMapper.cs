using Domain.Dtos.Paciente;
using Domain.Entity;

namespace Application.Mappers
{
    public static class PacienteMapper
    {
        public static PacienteDto? ToDto(this Paciente paciente)
        {
            if (paciente is null)
                return null;

            return new PacienteDto
            {
                Id = paciente.Id,
                NomeCompleto = paciente.NomeCompleto,
                DataNascimento = paciente.DataNascimento,
                Email = paciente.Email,
                Telefone = paciente.Telefone,
            };
        }

        public static Paciente ToEntity(this PacienteDto pacienteDto)
        {
            var entity = new Paciente(
                pacienteDto.NomeCompleto,
                pacienteDto.DataNascimento,
                pacienteDto.Telefone,
                pacienteDto.Email);

            if (pacienteDto.Id != System.Guid.Empty)
            {
                entity.Id = pacienteDto.Id;
            }

            return entity;
        }
    }
}
