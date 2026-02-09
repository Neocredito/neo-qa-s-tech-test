export class ProposalTranslationMapper {
  static requestToInternal(data: any): any {
    return {
      name: data.nome,
      cpf: data.cpf,
      birthDate: data.dataNascimento,
      observations: data.observacoes,
      status: this.statusToInternal(data.status),
    };
  }

  static internalToResponse(data: any): any {
    return {
      id: data.id,
      nome: data.name,
      cpf: data.cpf,
      dataNascimento: data.birthDate,
      status: this.statusToExternal(data.status),
      observacoes: data.observations,
      comprovanteUrl: data.documentUrl,
      criadoEm: data.createdAt,
      atualizadoEm: data.updatedAt,
    };
  }

  // Status PT -> EN
  private static statusToInternal(status?: string): string | undefined {
    if (!status) return undefined;
    
    const statusMap: Record<string, string> = {
      'AGUARDANDO_COMPROVANTE': 'PENDING_DOCUMENT',
      'CONCLUIDA': 'COMPLETED',
    };
    
    return statusMap[status] || status;
  }

  // Status EN -> PT
  private static statusToExternal(status: string): string {
    const statusMap: Record<string, string> = {
      'PENDING_DOCUMENT': 'AGUARDANDO_COMPROVANTE',
      'COMPLETED': 'CONCLUIDA',
    };
    
    return statusMap[status] || status;
  }
}
