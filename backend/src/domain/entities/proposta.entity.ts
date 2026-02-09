import { CPF } from '../value-objects/cpf.vo';
import { ProposalStatusVO, ProposalStatus } from '../value-objects/proposta-status.vo';

export class Proposal {
  private id: string;
  private name: string;
  private cpf: CPF;
  private birthDate: Date;
  private status: ProposalStatusVO;
  private observations: string;
  private documentUrl?: string;
  private createdAt: Date;
  private updatedAt: Date;

  constructor(props: {
    id?: string;
    name: string;
    cpf: CPF;
    birthDate: Date;
    status?: ProposalStatusVO;
    observations: string;
    documentUrl?: string;
    createdAt?: Date;
    updatedAt?: Date;
  }) {
    this.id = props.id || this.generateId();
    this.name = props.name;
    this.cpf = props.cpf;
    this.birthDate = props.birthDate;
    this.status = props.status || new ProposalStatusVO(ProposalStatus.PENDING_DOCUMENT);
    this.observations = props.observations;
    this.documentUrl = props.documentUrl;
    this.createdAt = props.createdAt || new Date();
    this.updatedAt = props.updatedAt || new Date();

    this.validate();
  }

  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private validate(): void {
    if (!this.name || this.name.trim().length < 3) {
      throw new Error('Nome deve ter pelo menos 3 caracteres');
    }

    if (!this.birthDate) {
      throw new Error('Data de nascimento é obrigatória');
    }

    const age = this.calculateAge();
    if (age < 18) {
      throw new Error('Deve ser maior de 18 anos');
    }

    if (!this.observations || this.observations.trim().length === 0) {
      throw new Error('Observações são obrigatórias');
    }
  }

  private calculateAge(): number {
    const today = new Date();
    const birth = new Date(this.birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const month = today.getMonth() - birth.getMonth();
    
    if (month < 0 || (month === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    
    return age;
  }

  // Getters
  getId(): string {
    return this.id;
  }

  getName(): string {
    return this.name;
  }

  getCpf(): CPF {
    return this.cpf;
  }

  getBirthDate(): Date {
    return this.birthDate;
  }

  getStatus(): ProposalStatusVO {
    return this.status;
  }

  getObservations(): string {
    return this.observations;
  }

  getDocumentUrl(): string | undefined {
    return this.documentUrl;
  }

  getCreatedAt(): Date {
    return this.createdAt;
  }

  getUpdatedAt(): Date {
    return this.updatedAt;
  }

  // Business methods
  canEdit(): boolean {
    return !this.status.isCompleted();
  }

  update(props: {
    name?: string;
    birthDate?: Date;
    status?: ProposalStatusVO;
    observations?: string;
  }): void {
    if (!this.canEdit()) {
      throw new Error('Não é possível editar uma proposta concluída');
    }

    if (props.name) this.name = props.name;
    if (props.birthDate) this.birthDate = props.birthDate;
    if (props.status) this.status = props.status;
    if (props.observations) this.observations = props.observations;

    this.updatedAt = new Date();
    this.validate();
  }

  attachDocument(documentUrl: string): void {
    if (!this.canEdit()) {
      throw new Error('Não é possível anexar comprovante a uma proposta concluída');
    }

    this.documentUrl = documentUrl;
    this.status = new ProposalStatusVO(ProposalStatus.COMPLETED);
    this.updatedAt = new Date();
  }

  // Conversion methods
  toJSON() {
    return {
      id: this.id,
      name: this.name,
      cpf: this.cpf.getValue(),
      birthDate: this.birthDate,
      status: this.status.getValue(),
      observations: this.observations,
      documentUrl: this.documentUrl,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
