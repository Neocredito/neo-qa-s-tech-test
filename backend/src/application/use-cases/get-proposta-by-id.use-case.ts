import { Injectable } from '@nestjs/common';
import { IProposalRepository } from '../../domain/repositories/proposta.repository.interface';
import { Proposal } from '../../domain/entities/proposta.entity';

@Injectable()
export class GetProposalByIdUseCase {
  constructor(private readonly proposalRepository: IProposalRepository) {}

  async execute(id: string): Promise<Proposal> {
    const proposal = await this.proposalRepository.findById(id);

    if (!proposal) {
      throw new Error('Proposta não encontrada');
    }

    return proposal;
  }
}
