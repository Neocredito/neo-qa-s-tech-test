import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { IProposalRepository } from '../../../domain/repositories/proposta.repository.interface';
import { Proposal } from '../../../domain/entities/proposta.entity';
import { ProposalStatus } from '../../../domain/value-objects/proposta-status.vo';
import { ProposalModel } from '../models/proposta.model';
import { ProposalMapper } from '../mappers/proposta.mapper';

@Injectable()
export class TypeOrmProposalRepository implements IProposalRepository {
  constructor(
    @InjectRepository(ProposalModel)
    private readonly repository: Repository<ProposalModel>,
  ) {}

  async save(proposal: Proposal): Promise<Proposal> {
    const model = ProposalMapper.toPersistence(proposal);
    const saved = await this.repository.save(model);
    return ProposalMapper.toDomain(saved);
  }

  async findById(id: string): Promise<Proposal | null> {
    const model = await this.repository.findOne({ where: { id } });
    return model ? ProposalMapper.toDomain(model) : null;
  }

  async findAll(): Promise<Proposal[]> {
    const models = await this.repository.find({
      order: { createdAt: 'DESC' },
    });
    return models.map(ProposalMapper.toDomain);
  }

  async findByStatus(status: ProposalStatus): Promise<Proposal[]> {
    const models = await this.repository.find({
      where: { status },
      order: { createdAt: 'DESC' },
    });
    return models.map(ProposalMapper.toDomain);
  }

  async findByCpf(cpf: string): Promise<Proposal[]> {
    const cleanCpf = cpf.replace(/\D/g, '');
    const models = await this.repository.find({
      where: { cpf: cleanCpf },
      order: { createdAt: 'DESC' },
    });
    return models.map(ProposalMapper.toDomain);
  }

  async update(proposal: Proposal): Promise<Proposal> {
    const model = ProposalMapper.toPersistence(proposal);
    await this.repository.save(model);
    const updated = await this.repository.findOne({ where: { id: proposal.getId() } });
    return ProposalMapper.toDomain(updated!);
  }

  async searchByFilters(filters: {
    name?: string;
    cpf?: string;
    status?: ProposalStatus;
  }): Promise<Proposal[]> {
    const where: any = {};

    if (filters.name) {
      where.name = Like(`%${filters.name}%`);
    }

    if (filters.cpf) {
      const cleanCpf = filters.cpf.replace(/\D/g, '');
      where.cpf = Like(`%${cleanCpf}%`);
    }

    if (filters.status) {
      where.status = filters.status;
    }

    const models = await this.repository.find({
      where,
      order: { createdAt: 'DESC' },
    });

    return models.map(ProposalMapper.toDomain);
  }
}
