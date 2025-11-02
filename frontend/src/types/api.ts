
export enum EnumTipoAtendimento {
  Visita,
  Anamnese,
  AtendimentoExterno,
  SessaoTerapia,
  Reuniao,
}

export interface AgendamentoDto {
  id?: string;
  dataHora: string;
  tipoAtendimento: EnumTipoAtendimento;
  status?: string;
  observacoes?: string;
  pacienteId: string;
  profissionalId: string;
}

export interface PacienteDto {
  id?: string;
  nomeCompleto?: string;
  dataNascimento?: string;
  telefone?: string;
  email?: string;
}

export interface ProfissionalDto {
  id?: string;
  nomeCompleto?: string;
  especialidade?: string;
  registroConselho?: string;
  userId?: string;
}

export interface UserDto {
  email?: string;
  password?: string;
}

export interface RegisterProfissionalDto {
  email: string;
  password: string;
  nomeCompleto: string;
  especialidade: string;
}

export interface TokenResponseDto {
  accessToken?: string;
}

export interface SendEmailResetPasswordDto {
  email?: string;
}

export interface ResetPasswordDto {
  password?: string;
}

export enum EnumStatusFaturamento {
  Rascunho = 0,
  Emitido = 1,
  Pago = 2,
  Cancelado = 3
}

export interface FaturamentoDto {
  id: string;
  dataFaturamento: string;
  dataInicio: string;
  dataFim: string;
  profissionalId?: string;
  profissionalNome?: string;
  valorTotal: number;
  totalAtendimentos: number;
  status: EnumStatusFaturamento;
  observacoes?: string;
  itens: ItemFaturamentoDto[];
}

export interface ItemFaturamentoDto {
  id: string;
  agendamentoId: string;
  dataHora: string;
  pacienteNome: string;
  tipoAtendimento: EnumTipoAtendimento;
  valorAtendimento: number;
  status: string;
  observacoes?: string;
}

export interface CriarFaturamentoAvulsoDto {
  paciente: string;
  servico: string;
  data: string;
  valor: number;
  status: string;
  formaPagamento: string;
  observacoes?: string;
  pacienteId: string;
  agendamentoId: string;
  profissionalId?: string;
}

export interface CriarFaturamentoDto {
  dataInicio: string;
  dataFim: string;
  profissionalId?: string;
  valorPorAtendimento: number;
  observacoes?: string;
}