import { Injectable } from '@nestjs/common';
import { IProposalRepository } from '../../domain/repositories/proposta.repository.interface';
import { Proposal } from '../../domain/entities/proposta.entity';
import { CPF } from '../../domain/value-objects/cpf.vo';
import { CreateProposalDto } from '../dtos/create-proposta.dto';

@Injectable()
export class CreateProposalUseCase {
  constructor(private readonly proposalRepository: IProposalRepository) {}

  async execute(dto: CreateProposalDto): Promise<Proposal> {
    try {
      const cpf = new CPF(dto.cpf);
      const birthDate = new Date(dto.birthDate);

      const proposal = new Proposal({
        name: dto.name,
        cpf,
        birthDate,
        observations: dto.observations,
      });

      return await this.proposalRepository.save(proposal);
    } catch (error) {
      throw new Error(`Erro ao criar proposta: ${error.message}`);
    }
  }
}
