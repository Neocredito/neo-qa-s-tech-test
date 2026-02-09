export interface Proposta {
  id: string;
  nome: string;
  cpf: string;
  dataNascimento: string;
  status: 'AGUARDANDO_COMPROVANTE' | 'CONCLUIDA';
  observacoes: string;
  comprovanteUrl?: string;
  criadoEm: string;
  atualizadoEm: string;
}

export interface CreatePropostaDto {
  nome: string;
  cpf: string;
  dataNascimento: string;
  observacoes: string;
}

export interface UpdatePropostaDto {
  nome?: string;
  dataNascimento?: string;
  status?: string;
  observacoes?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  count?: number;
}
