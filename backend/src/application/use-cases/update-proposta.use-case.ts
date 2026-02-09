import { Injectable } from '@nestjs/common';
import { IProposalRepository } from '../../domain/repositories/proposta.repository.interface';
import { Proposal } from '../../domain/entities/proposta.entity';
import { ProposalStatusVO } from '../../domain/value-objects/proposta-status.vo';
import { UpdateProposalDto } from '../dtos/update-proposta.dto';

@Injectable()
export class UpdateProposalUseCase {
  constructor(private readonly proposalRepository: IProposalRepository) {}

  async execute(id: string, dto: UpdateProposalDto): Promise<Proposal> {
    const proposal = await this.proposalRepository.findById(id);

    if (!proposal) {
      throw new Error('Proposta não encontrada');
    }

    if (!proposal.canEdit()) {
      throw new Error('Não é possível editar uma proposta concluída');
    }

    try {
      const updateData: {
        name?: string;
        birthDate?: Date;
        status?: ProposalStatusVO;
        observations?: string;
      } = {};

      if (dto.name) updateData.name = dto.name;
      if (dto.birthDate) updateData.birthDate = new Date(dto.birthDate);
      if (dto.status) updateData.status = new ProposalStatusVO(dto.status);
      if (dto.observations) updateData.observations = dto.observations;

      proposal.update(updateData);

      return await this.proposalRepository.update(proposal);
    } catch (error) {
      throw new Error(`Erro ao atualizar proposta: ${error.message}`);
    }
  }
}
