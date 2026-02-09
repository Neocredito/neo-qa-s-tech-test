export enum ProposalStatus {
  PENDING_DOCUMENT = 'PENDING_DOCUMENT',
  COMPLETED = 'COMPLETED',
}

export class ProposalStatusVO {
  private readonly value: ProposalStatus;

  constructor(status: string) {
    if (!Object.values(ProposalStatus).includes(status as ProposalStatus)) {
      throw new Error('Status inválido');
    }
    this.value = status as ProposalStatus;
  }

  getValue(): ProposalStatus {
    return this.value;
  }

  isCompleted(): boolean {
    return this.value === ProposalStatus.COMPLETED;
  }

  isPendingDocument(): boolean {
    return this.value === ProposalStatus.PENDING_DOCUMENT;
  }

  equals(other: ProposalStatusVO): boolean {
    return this.value === other.value;
  }
}
