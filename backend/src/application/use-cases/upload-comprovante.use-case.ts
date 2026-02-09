import { Injectable } from '@nestjs/common';
import { IProposalRepository } from '../../domain/repositories/proposta.repository.interface';
import { Proposal } from '../../domain/entities/proposta.entity';
import * as fs from 'fs/promises';
import * as path from 'path';

@Injectable()
export class UploadDocumentUseCase {
  constructor(private readonly proposalRepository: IProposalRepository) {}

  async execute(proposalId: string, file: Express.Multer.File): Promise<Proposal> {
    const proposal = await this.proposalRepository.findById(proposalId);

    if (!proposal) {
      throw new Error('Proposta não encontrada');
    }

    if (!proposal.canEdit()) {
      throw new Error('Não é possível anexar comprovante a uma proposta concluída');
    }

    try {
      await this.processDocumentInQueue(file, proposalId);

      const uploadsDir = path.join(process.cwd(), 'uploads');
      await fs.mkdir(uploadsDir, { recursive: true });

      const fileName = `${proposalId}-${Date.now()}-${file.originalname}`;
      const filePath = path.join(uploadsDir, fileName);
      
      await fs.writeFile(filePath, file.buffer);

      const documentUrl = `/uploads/${fileName}`;
      proposal.attachDocument(documentUrl);

      return await this.proposalRepository.update(proposal);
    } catch (error) {
      throw new Error(`Erro ao processar comprovante: ${error.message}`);
    }
  }

  private async processDocumentInQueue(file: Express.Multer.File, proposalId: string): Promise<void> {
    // Simular processamento assíncrono (em produção seria RabbitMQ)
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log(`[FILA] Comprovante processado para proposta ${proposalId}`);
        console.log(`[FILA] Arquivo: ${file.originalname}, Tamanho: ${file.size} bytes`);
        resolve();
      }, 1000);
    });
  }
}
