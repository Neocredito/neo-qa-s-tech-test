import { Proposal } from '../entities/proposta.entity';
import { ProposalStatus } from '../value-objects/proposta-status.vo';

export interface IProposalRepository {
  save(proposal: Proposal): Promise<Proposal>;
  findById(id: string): Promise<Proposal | null>;
  findAll(): Promise<Proposal[]>;
  findByStatus(status: ProposalStatus): Promise<Proposal[]>;
  findByCpf(cpf: string): Promise<Proposal[]>;
  update(proposal: Proposal): Promise<Proposal>;
  searchByFilters(filters: {
    name?: string;
    cpf?: string;
    status?: ProposalStatus;
  }): Promise<Proposal[]>;
}
