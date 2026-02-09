import { Injectable } from '@nestjs/common';
import { IProposalRepository } from '../../domain/repositories/proposta.repository.interface';
import { Proposal } from '../../domain/entities/proposta.entity';
import { ProposalStatus } from '../../domain/value-objects/proposta-status.vo';

@Injectable()
export class ListProposalsUseCase {
  constructor(private readonly proposalRepository: IProposalRepository) {}

  async execute(filters?: {
    status?: ProposalStatus;
    name?: string;
    cpf?: string;
  }): Promise<Proposal[]> {
    if (filters && (filters.name || filters.cpf || filters.status)) {
      return await this.proposalRepository.searchByFilters(filters);
    }

    return await this.proposalRepository.findAll();
  }
}
