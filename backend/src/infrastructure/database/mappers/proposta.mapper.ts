import { Proposal } from '../../../domain/entities/proposta.entity';
import { ProposalModel } from '../models/proposta.model';
import { CPF } from '../../../domain/value-objects/cpf.vo';
import { ProposalStatusVO } from '../../../domain/value-objects/proposta-status.vo';

export class ProposalMapper {
  static toDomain(model: ProposalModel): Proposal {
    return new Proposal({
      id: model.id,
      name: model.name,
      cpf: new CPF(model.cpf),
      birthDate: new Date(model.birthDate),
      status: new ProposalStatusVO(model.status),
      observations: model.observations,
      documentUrl: model.documentUrl,
      createdAt: model.createdAt,
      updatedAt: model.updatedAt,
    });
  }

  static toPersistence(entity: Proposal): ProposalModel {
    const model = new ProposalModel();
    model.id = entity.getId();
    model.name = entity.getName();
    model.cpf = entity.getCpf().getValue();
    model.birthDate = entity.getBirthDate();
    model.status = entity.getStatus().getValue();
    model.observations = entity.getObservations();
    model.documentUrl = entity.getDocumentUrl();
    model.createdAt = entity.getCreatedAt();
    model.updatedAt = entity.getUpdatedAt();
    return model;
  }
}
